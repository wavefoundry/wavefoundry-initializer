import React from "react";
import { Formik, Form } from "formik";
import FormTextField from "./FormTextField";
import FormPhoneField from "./FormPhoneField";
import FormSubmitButton from "./FormSubmitButton";
import { CheckoutFormItemProps } from "../types";
import { EMAIL_REGEX } from "../constants";
import { convertCentsToCurrency } from "../utils";

const CheckoutFormCustomerData: React.FC<CheckoutFormItemProps> = ({
  checkoutFormData,
  setCheckoutFormData,
  setCurrentStep,
  orderTotals
}) => {
  const initialValues = checkoutFormData.customerData || {
    name: "",
    email: "",
    phone: "",
  };
  return (
    <div>
      <Formik
        initialValues={initialValues}
        validate={values => {
          const errors: { [key: string]: string } = {};
          if (!values.name) {
            errors.name = "Please enter your full name";
          }
          if (EMAIL_REGEX.test(values.email) === false) {
            errors.email = "Please enter a valid email";
          }
          if (values.phone.length !== 10) {
            errors.phone = "Please enter a valid phone number";
          }
          return errors;
        }}
        onSubmit={values => {
          setCheckoutFormData(currentData => {
            return {
              ...currentData,
              customerData: values,
            };
          });
          setCurrentStep(checkoutFormData.paymentMethod ? 2 : 1);
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <FormTextField name="name" label="Full Name" />
              <FormTextField name="email" label="Email" type="email" />
              <FormPhoneField name="phone" label="Phone Number" />
              <div className="flex justify-between mt-3">
                <div>
                  <FormSubmitButton
                    isSubmitting={isSubmitting}
                    defaultText="CONTINUE"
                  />
                </div>
                <div className="leading-none text-right block lg:hidden">
                    <p>Order Total</p>
                    <p className="text-lg font-bold">${convertCentsToCurrency(orderTotals.orderTotal)}</p>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default CheckoutFormCustomerData;
