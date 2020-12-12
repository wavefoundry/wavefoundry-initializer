import React from "react";
import Icon from "./Icon";
import { CheckoutFormData } from "../types";
import { PAYMENT_METHOD_BRANDS } from "../constants";

const CompletedFormPaymentMethod: React.FC<CheckoutFormData> = ({
  paymentMethod,
}) => {
  if (!paymentMethod) {
    return null;
  }
  const iconName = PAYMENT_METHOD_BRANDS.includes(paymentMethod.brand)
    ? paymentMethod.brand
    : "creditCard";
  return (
    <div>
      <div className="mb-0.5">
        <Icon name={iconName} width={48} />
      </div>
      <div className="text-sm">
        <p>
          {paymentMethod.brand.toUpperCase()} ...{paymentMethod.last4}
        </p>
        <p>
          Exp: {paymentMethod.expMonth}/{paymentMethod.expYear}
        </p>
      </div>
    </div>
  );
};

export default CompletedFormPaymentMethod;
