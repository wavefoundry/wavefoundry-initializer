import React from "react";
import GatsbyImage from "gatsby-image";
import { CartItem, CheckoutFormData, OrderTotals } from "../types";
import { PRODUCT_IMAGE_ASPECT_RATIO } from "../constants";
import { convertCentsToCurrency } from "../utils";
import OrderTotalsContainer from "./OrderTotalsContainer";

const CheckoutOrderSummary: React.FC<{ cartItems: CartItem[]; orderTotals: OrderTotals; couponData: CheckoutFormData["couponData"] }> = ({
  cartItems,
  orderTotals,
  couponData
}) => {
  return (
    <div className="w-full rounded shadow-md p-2">
      <h6 className="font-bold mb-2 opacity-50">Order Summary</h6>
      <div>
        {cartItems.map((item, index) => {
          return (
            <div key={`item-${index}`} className="flex mb-2">
              <div className="w-16">
                <div className="w-full rounded overflow-hidden">
                  <GatsbyImage
                    fluid={{
                      ...item.productImage.childImageSharp.fluid,
                      aspectRatio: PRODUCT_IMAGE_ASPECT_RATIO,
                    }}
                  />
                </div>
              </div>
              <div className="px-2 flex justify-between leading-none w-full">
                <div>
                  <h6 className="font-bold mb-0.5">{item.name}</h6>
                  {item.multiplePriceOptions && <p className="text-xs text-gray-800 mb-0.5">{item.priceOption}</p>}
                  <p className="text-xs text-gray-800">Quantity: {item.quantity}</p>
                </div>
                <div><span className="text-sm">${convertCentsToCurrency(item.price)}</span></div>
              </div>
            </div>
          );
        })}
      </div>
        <OrderTotalsContainer orderTotals={orderTotals} couponData={couponData} />
    </div>
  );
};

export default CheckoutOrderSummary;
