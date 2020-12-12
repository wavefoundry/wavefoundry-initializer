import React from "react";
import { CheckoutFormItemProps, CheckoutFormItemWrapperProps } from "../types";
import Icon from "./Icon";

const iconStyles =
  "w-8 h-8 rounded-full text-xl flex items-center justify-center mr-2";

const CheckoutFormItem: React.FC<
  CheckoutFormItemWrapperProps &
    CheckoutFormItemProps & {
      index: number;
      formItemRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
    }
> = ({
  index,
  label,
  FormComponent,
  CompletedSectionComponent,
  formItemRefs,
  ...otherProps
}) => {
  const { currentStep, completed, setCurrentStep } = otherProps;
  const active = currentStep === index;
  function renderIcon() {
    if (active) {
      return (
        <div className={`${iconStyles} bg-primary-700 text-white`}>
          {index + 1}
        </div>
      );
    } else if (completed) {
      return (
        <div className={`${iconStyles} bg-green-600 text-white opacity-50`}>
          <Icon name="check" width={20} />
        </div>
      );
    }
    return (
      <div className={`${iconStyles} bg-gray-300 opacity-50`}>{index + 1}</div>
    );
  }
  function renderContent() {
    if (active) {
      return (
        <div className="mt-1">
          <FormComponent {...otherProps} />
        </div>
      );
    } else if (completed && CompletedSectionComponent) {
      return (
        <div className="pl-10 pt-1 opacity-50">
          <CompletedSectionComponent {...otherProps.checkoutFormData} />
        </div>
      );
    }
    return null;
  }
  function handleEditClick() {
    setCurrentStep(index);
  }
  return (
    <div
      className={`pb-6${index === 0 ? "" : " pt-6 border-t border-gray-200"}`}
      ref={el => (formItemRefs.current[index] = el)}
    >
      <div className={`flex items-center`}>
        <div>{renderIcon()}</div>
        <div className="flex-grow">
          <h5 className={`font-bold text-lg${!active ? " opacity-50" : ""}`}>
            {label}
          </h5>
        </div>
        <div className="flex-grow-0">
          {completed && !active && (
            <button
              onClick={handleEditClick}
              className="text-sm opacity-75 text-gray-800 hover:opacity-100 focus:outline-black"
            >
              EDIT
            </button>
          )}
        </div>
      </div>
      <div>{renderContent()}</div>
    </div>
  );
};

export default CheckoutFormItem;
