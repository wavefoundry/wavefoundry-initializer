import React from "react";
import Button from "./Button";

const FormSubmitButton: React.FC<{
  isSubmitting: boolean;
  defaultText?: string;
  submittingText?: string;
  additionalClasses?: string;
  size?: 'normal' | 'small';
}> = ({
  isSubmitting,
  defaultText = "SUBMIT",
  submittingText = "SUBMITTING",
  additionalClasses = "",
  size
}) => {
  return (
    <Button
      variant="primaryContained"
      disabled={isSubmitting}
      type="submit"
      additionalClasses={`${additionalClasses} focus:outline-black`}
      size={size}
    >
      {isSubmitting ? (
        <div className="submitting">
          {submittingText}
          <span className="ellipsis">.</span>
          <span className="ellipsis">.</span>
          <span className="ellipsis">.</span>
        </div>
      ) : (
        <span>{defaultText}</span>
      )}
    </Button>
  );
};

export default FormSubmitButton;
