import React from "react";
import { navigate } from "gatsby";
import { useStripe } from "@stripe/react-stripe-js";
import FormSubmitButton from "./FormSubmitButton";
import { CART, ORDER_SUCCESS_ROUTE } from "../constants";
import { setLocalStorage, removeLocalStorage } from "../utils";
import { CheckoutFormItemProps, CartItem } from "../types";
import CartItemContainer from "./CartItemContainer";
import CheckoutFormLoadingContainer from "./CheckoutFormLoadingContainer";
import { useFirebase } from "./Firebase";
import OrderTotalsContainer from "./OrderTotalsContainer";

const CheckoutFormReviewOrder: React.FC<CheckoutFormItemProps> = ({
  checkoutFormData,
  setCheckoutFormData,
  orderTotals,
}) => {
  const firebase = useFirebase();
  const stripe = useStripe();
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState("");
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      if (
        !stripe ||
        !checkoutFormData.stagedOrder ||
        !checkoutFormData.paymentMethod
      ) {
        return;
      }
      setSubmitting(true);
      const result = await stripe.confirmCardPayment(
        checkoutFormData.stagedOrder.clientSecret,
        {
          payment_method: checkoutFormData.paymentMethod.id,
        }
      );
      if (!result) {
        throw new Error("Payment could not be completed");
      }
      if (result.error) {
        setFormError(result.error.message || "Unknown error");
        setSubmitting(false);
      } else {
        if (
          result.paymentIntent &&
          result.paymentIntent.status === "succeeded"
        ) {
          window.onbeforeunload = () => null;
          removeLocalStorage(CART);
          navigate(ORDER_SUCCESS_ROUTE);
        } else {
          setFormError(`An error occurred - please contact us for support`);
        }
      }
    } catch (err) {
      setFormError(`An error occurred - ${err.message}`);
    }
  };
  const updateCart = (updatedCartItems: CartItem[]) => {
    setLocalStorage(CART, updatedCartItems);
    setCheckoutFormData(currentData => {
      return {
        ...currentData,
        cartItems: updatedCartItems,
        clientUpdatedFormData: true,
      };
    });
  };
  const updateCartItem = (cartItem: CartItem, index: number) => {
    const updatedCartItems = [...checkoutFormData.cartItems];
    updatedCartItems[index] = cartItem;
    updateCart(updatedCartItems);
  };
  const removeCartItem = (index: number) => {
    const updatedCartItems = [...checkoutFormData.cartItems];
    updatedCartItems.splice(index, 1);
    updateCart(updatedCartItems);
  };
  const processServerCheckoutItems = (serverCheckoutItems: {
    [key: string]: { price: number };
  }) => {
    const newItems = [];
    for (const item of checkoutFormData.cartItems) {
      if (serverCheckoutItems[item.productId]) {
        newItems.push({
          ...item,
          price: serverCheckoutItems[item.productId].price,
        });
      }
    }
    return newItems;
  };
  React.useEffect(() => {
    if (checkoutFormData.clientUpdatedFormData) {
      setLoading(true);
      const createStagedOrder = firebase
        .functions()
        .httpsCallable("createStagedOrder");
      const cartItems = checkoutFormData.cartItems.map(item => {
        return {
          productId: item.productId,
          priceOption: item.priceOption,
          price: item.price,
          name: item.name,
          quantity: item.quantity,
        };
      });
      createStagedOrder({
        cartItems,
        customerData: checkoutFormData.customerData,
        couponData: checkoutFormData.couponData
      })
        .then(({ data }: any) => {
          setCheckoutFormData(currentData => {
            return {
              ...currentData,
              cartItems: processServerCheckoutItems(data.serverCheckoutItems),
              stagedOrder: {
                itemExceptions: data.itemExceptions,
                clientSecret: data.clientSecret,
              },
              couponData: data.couponData,
              clientUpdatedFormData: false,
            };
          });
          setLoading(false);
        })
        .catch(() => {
          window.alert("An unknown error occurred. Please try again later.");
          setLoading(false);
        });
    }
  }, [checkoutFormData.cartItems, checkoutFormData.couponData]);
  return (
    <form onSubmit={handleSubmit} action="#">
      <div className="mt-4">
        {checkoutFormData.stagedOrder &&
          checkoutFormData.stagedOrder.itemExceptions.length > 0 && (
            <div className="mb-2">
              <p className="text-sm text-red-500 font-bold">
                The following updates have been made to your order:
              </p>
              <ul className="text-sm text-red-500 list-disc list-inside">
                {checkoutFormData.stagedOrder.itemExceptions.map(
                  (item, index) => {
                    return <li key={`list-item-${index}`}>{item}</li>;
                  }
                )}
              </ul>
            </div>
          )}
        <div>
          {checkoutFormData.cartItems.map((cartItem, index) => {
            const setCartItem = (cartItemData: CartItem) => {
              updateCartItem(cartItemData, index);
            };
            const handleRemove =
              checkoutFormData.cartItems.length === 1
                ? null
                : () => removeCartItem(index);
            return (
              <CartItemContainer
                key={`cart-item-${index}`}
                cartItem={cartItem}
                setCartItem={setCartItem}
                handleRemove={handleRemove}
              />
            );
          })}
        </div>
        <OrderTotalsContainer
          orderTotals={orderTotals}
          couponData={checkoutFormData.couponData}
        />
        {formError && (
          <div>
            <p className="text-sm text-red-500 mt-1">{formError}</p>
          </div>
        )}
        <div className="mt-3">
          <FormSubmitButton
            isSubmitting={submitting}
            defaultText="PLACE ORDER"
            additionalClasses="focus:outline-black w-full sm:w-48"
          />
        </div>
      </div>
      {loading && <CheckoutFormLoadingContainer />}
    </form>
  );
};

export default CheckoutFormReviewOrder;
