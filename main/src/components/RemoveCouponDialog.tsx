import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Button from "./Button";
import Icon from "./Icon";
import { CheckoutFormData } from "../types";

const RemoveCouponDialog: React.FC<{
  setCheckoutFormData: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
}> = ({ setCheckoutFormData }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleRemove = () => {
    setCheckoutFormData(currentData => {
      return {
        ...currentData,
        couponData: null,
        clientUpdatedFormData: true,
      };
    });
    handleClose();
  };
  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center justify-center text-gray-700 focus:outline-black"
      >
        <Icon name="close" width={20} />
      </button>
      <Dialog open={open} disableBackdropClick>
        <div className="px-4 py-3">
          <h5 className="font-bold text-xl mb-2">Remove Coupon</h5>
          <p className="mb-4">
            Are you sure you want to remove this coupon from your order?
          </p>
          <div className="flex justify-end">
            <div className="pr-3">
              <Button
                variant="whiteOutlined"
                onClick={handleClose}
                size="small"
              >
                CANCEL
              </Button>
            </div>
            <div>
              <Button
                variant="primaryContained"
                onClick={handleRemove}
                size="small"
              >
                REMOVE
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default RemoveCouponDialog;
