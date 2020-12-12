import React from "react";
import GatsbyImage from "gatsby-image";
import Icon from "./Icon";
import { CartItem } from "../types";
import { convertCentsToCurrency } from "../utils";
import { PRODUCT_IMAGE_ASPECT_RATIO } from "../constants";

const quantityButtonStyles = 'flex items-center justify-center border border-gray-700 rounded-full w-7 h-7 focus:outline-black';

interface CartItemContainerProps {
  cartItem: CartItem;
  setCartItem: (cartItem: CartItem) => void;
  handleRemove: null | (() => void);
}
const QUANTITY_MAX = 50;
const CartItemContainer: React.FC<CartItemContainerProps> = ({
  cartItem,
  setCartItem,
  handleRemove,
}) => {
  function increment() {
    if (cartItem.quantity <= QUANTITY_MAX) {
      setCartItem({ ...cartItem, quantity: cartItem.quantity + 1 });
    }
  }
  function decrement() {
    if (cartItem.quantity > 1) {
      setCartItem({ ...cartItem, quantity: cartItem.quantity - 1 });
    }
  }
  return (
    <div className="relative p-2 border border-gray-200 rounded mb-3">
      {handleRemove && (
        <button
          className={`flex items-center justify-center absolute top-1 right-1 opacity-50 hover:opacity-75 text-gray-600`}
          onClick={handleRemove}
          title="Remove this item"
          type="button"
        >
          <Icon name="delete" width={14} />
        </button>
      )}
      <div className="flex">
        <div className="w-20">
          <div className="w-full rounded overflow-hidden">
            <GatsbyImage fluid={{ ...cartItem.productImage.childImageSharp.fluid, aspectRatio: PRODUCT_IMAGE_ASPECT_RATIO }} />
          </div>
        </div>
        <div className="px-2">
          <h6 className="text-base font-bold">{cartItem.name}</h6>
          {cartItem.multiplePriceOptions && <p className="text-gray-800">{cartItem.priceOption}</p>}
        </div>
      </div>
      <span className="block w-full h-px bg-gray-200 mt-2 mb-2" />
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div>
            <button
              className={`${quantityButtonStyles} ${
                cartItem.quantity === 1 ? " opacity-50 pointer-events-none" : ""
              }`}
              onClick={decrement}
              type="button"
              disabled={cartItem.quantity === 1}
            >
              <Icon name="minus" width={16} />
            </button>
          </div>
          <div className="font-bold w-10 text-center text-lg">
            <span>{cartItem.quantity}</span>
          </div>
          <div>
            <button
              className={`${quantityButtonStyles} ${
                cartItem.quantity === QUANTITY_MAX ? " disabled" : ""
              }`}
              onClick={increment}
              type="button"
              disabled={cartItem.quantity === QUANTITY_MAX}
            >
              <Icon name="plus" width={16} />
            </button>
          </div>
        </div>
        <div>
          <p>
            <span className="font-bold">
              ${convertCentsToCurrency(cartItem.price * cartItem.quantity)}
            </span>
            {cartItem.quantity > 1 && (
              <span className="text-xs pl-1">
                (${convertCentsToCurrency(cartItem.price)} ea.)
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItemContainer;
