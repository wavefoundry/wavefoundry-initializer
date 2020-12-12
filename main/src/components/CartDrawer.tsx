import React from "react";
import Drawer from "@material-ui/core/Drawer";
import Icon from "./Icon";
import { getOrderTotals, isBrowser } from "../utils";
import { CartItem } from "../types";
import CartItemContainer from "./CartItemContainer";
import CartPlaceholderSvg from "./CartPlaceholderSvg";
import Button from './Button';
import OrderTotalsContainer from "./OrderTotalsContainer";

interface CartDrawerProps {
  cartItems: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  updateCartItem: (cartItem: CartItem, index: number) => void;
  removeCartItem: (index: number) => void;
}
const CartDrawer: React.FC<CartDrawerProps> = ({
  cartItems,
  cartOpen,
  setCartOpen,
  updateCartItem,
  removeCartItem,
}) => {
  const isClient = isBrowser();
  const count = cartItems.length;
  function handleClose() {
    setCartOpen(false);
  }
  function handleOpen() {
    setCartOpen(true);
  }
  function renderCartItems() {
    if (cartItems.length > 0) {
      return (
        <>
          <div>
            {cartItems.map((cartItem, index) => {
              function setCartItem(cartItemData: CartItem) {
                updateCartItem(cartItemData, index);
              }
              function handleRemove() {
                removeCartItem(index);
              }
              return (
                <CartItemContainer
                  cartItem={cartItem}
                  key={`cart-item-${index}`}
                  setCartItem={setCartItem}
                  handleRemove={handleRemove}
                />
              );
            })}
          </div>
          <OrderTotalsContainer orderTotals={getOrderTotals(cartItems, null)} couponData={null} />
          <div className="py-4">
              <Button variant='primaryContained' linkTo="/checkout/" additionalClasses="w-full">CHECKOUT</Button>
          </div>
        </>
      );
    }
    return (
      <div className="w-full px-2 py-4">
        <div className="w-6/12 m-auto"><CartPlaceholderSvg /></div>
        <p className="text-center mt-2">No items in your cart yet!</p>
      </div>
    );
  }
  if (isClient) {
    return (
      <>
        <button
          className={`focus:outline-black flex items-center px-2 py-0.5 rounded border ${count > 0 ? "text-white border-red-600 bg-red-600 shadow-xs" : "text-primary-700 border-primary-500"}`}
          onClick={handleOpen}
        >
          <div>
            <Icon name="cart" width={22} />
          </div>
          <div><span className="text-lg pl-2">{count > 9 ? "9+" : count}</span></div>
        </button>
        <Drawer open={cartOpen} anchor="right" onClose={handleClose}>
          <div className="w-80 lg:w-96">
            <header className="h-12 sm:h-16 flex items-center shadow-sm relative top-0 left-0 w-full z-10">
              <div className="w-full text-center">
                <h5 className="text-2xl text-primary-700 font-bold">Your Cart</h5>
              </div>
            </header>
            <div className="py-4 px-2">{renderCartItems()}</div>
          </div>
        </Drawer>
      </>
    );
  }
  return null;
};

export default CartDrawer;
