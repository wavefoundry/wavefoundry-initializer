import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

const CheckoutFormLoadingContainer: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 z-50 h-full w-full bg-white bg-opacity-75 flex flex-col items-center justify-center">
      <div>
        <CircularProgress />
      </div>
      <div>
        <p>Please wait while we process your order...</p>
      </div>
    </div>
  );
};

export default CheckoutFormLoadingContainer;
