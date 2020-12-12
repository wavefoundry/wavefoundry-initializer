import React from "react";
import { CheckoutFormData, OrderTotals } from "../types";
import { convertCentsToCurrency } from "../utils";

const OrderTotalsContainer: React.FC<{
  orderTotals: OrderTotals;
  couponData: CheckoutFormData["couponData"];
}> = ({ orderTotals, couponData }) => {
  return (
    <>
      <span className="block h-px f-full bg-gray-200 mb-2 mt-2" />
      <div className="flex items-center justify-between">
        <div>
          <h6>Order Subtotal</h6>
        </div>
        <div>
          <span>${convertCentsToCurrency(orderTotals.orderSubtotal)}</span>
        </div>
      </div>
      {couponData && (
        <div className="flex items-center justify-between text-green-700">
          <div>
            <h6>Coupon <strong>{couponData.code}</strong></h6>
          </div>
          <div>
            <span>(${convertCentsToCurrency(couponData.discount)})</span>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between font-bold">
        <div>
          <h6>Order Total</h6>
        </div>
        <div>
          <span>${convertCentsToCurrency(orderTotals.orderTotal)}</span>
        </div>
      </div>
    </>
  );
};

export default OrderTotalsContainer;
