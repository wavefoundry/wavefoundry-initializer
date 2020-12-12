import React from "react";
import TextField from "@material-ui/core/TextField";
import { useFirebase } from "./Firebase";
import Button from "./Button";
import Icon from "./Icon";
import RemoveCouponDialog from "./RemoveCouponDialog";
import { CartItem, CheckoutFormData } from "../types";
import { convertCentsToCurrency, getOrderSubtotal } from "../utils";

const INVALID_CODE = "This coupon code is not valid";
interface Coupon {
  enabled: boolean;
  redemptions: number;
  type: "Dollar Amount" | "Percentage";
  amount: number;
  code: string;
}
const getCouponDiscount = (cartItems: CartItem[], coupon: Coupon) => {
  const subtotal = getOrderSubtotal(cartItems);
  if (coupon.type === "Dollar Amount") {
    return coupon.amount;
  } else {
    return Math.ceil((subtotal * coupon.amount) / 100);
  }
};
const CheckoutCouponForm: React.FC<{
  checkoutFormData: CheckoutFormData;
  setCheckoutFormData: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
}> = ({ checkoutFormData, setCheckoutFormData }) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const firebase = useFirebase();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value) {
      try {
        const formattedValue = value.trim().toUpperCase();
        setSubmitting(true);
        const couponDoc = await firebase
          .firestore()
          .collection("coupons")
          .doc(formattedValue)
          .get();
        if (couponDoc.exists) {
          const coupon = couponDoc.data() as Coupon;
          if (coupon.enabled) {
            const discount = getCouponDiscount(
              checkoutFormData.cartItems,
              coupon
            );
            setCheckoutFormData(currentData => {
              return {
                ...currentData,
                couponData: {
                  code: coupon.code,
                  discount,
                },
              };
            });
          } else {
            setError(INVALID_CODE);
          }
        } else {
          setError(INVALID_CODE);
        }
        setSubmitting(false);
      } catch (err) {
        setError(`An error occurred - ${err.message}`);
        setSubmitting(false);
      }
    } else {
      setError(INVALID_CODE);
    }
  };
  const toggleOpen = () => {
    setError("");
    setValue("");
    setOpen(val => !val);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setValue(e.target.value);
  };
  return (
    <div className="px-4 mb-4">
      {checkoutFormData.couponData ? (
        <div className="rounded border border-green-100 flex items-center justify-between bg-green-50 p-1">
          <div>
            <span className="text-green-700 text-sm">
              Coupon <strong>{checkoutFormData.couponData.code}</strong> applied for $
              {convertCentsToCurrency(checkoutFormData.couponData.discount)} off
            </span>
          </div>
          <div>
            <RemoveCouponDialog setCheckoutFormData={setCheckoutFormData} />
          </div>
        </div>
      ) : (
        <div className="rounded border border-gray-200">
          <button
            className="flex justify-between items-center w-full bg-gray-200 p-1 focus:outline-black rounded-t"
            onClick={toggleOpen}
          >
            <div>
              <span className="text-gray-700">Add a Coupon</span>
            </div>
            <div
              className={`flex items-center text-gray-500${open ? " transform rotate-180" : ""}`}
            >
              <Icon name="chevronDown" width={18} />
            </div>
          </button>
          {open && (
            <form action="#" onSubmit={handleSubmit}>
              <div className="flex items-center">
                <div className="flex-grow py-3 px-1">
                  <TextField
                    name="code"
                    value={value}
                    fullWidth
                    variant="outlined"
                    label="Coupon Code"
                    onChange={handleChange}
                  />
                </div>
                <div className="py-3 px-1">
                  <Button
                    variant="primaryContained"
                    additionalClasses="block h-full"
                    type="submit"
                    size="small"
                    disabled={submitting}
                  >
                    APPLY
                  </Button>
                </div>
              </div>
              {error && (
                <div className="text-red-500 text-xs pl-4 -mt-1 pb-1">
                  {error}
                </div>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutCouponForm;
