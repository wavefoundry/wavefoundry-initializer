import React from "react";
import { Formik, Form } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import { useFormDialog } from "./FormDialog";
import { handleError, generateInitialValues } from "../utils";
import { InputField } from "../constants";
import { useSnackbar } from "./Snackbar";
import firebase from "../firebase";
import { PAID_ORDERS } from "../constants";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const fields: InputField[] = [{ name: "status" }];

const OrderForm: React.FC<{ handleSubmit: () => void }> = ({
  handleSubmit,
}) => {
  const { editValues, openDialog } = useFormDialog();
  const classes = useStyles();
  const { setSnackbarMessage } = useSnackbar();
  const initialValues = generateInitialValues(fields, editValues);
  return (
    <div className={classes.root}>
      <div>
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            try {
              const submitValues = { ...editValues, ...values };
              if (values.status === "Fulfilled" && !editValues.fulfilledAt) {
                submitValues.fulfilledAt = Date.now();
              }
              await firebase
                .firestore()
                .collection(PAID_ORDERS)
                .doc(editValues.id)
                .set(submitValues);
              actions.setSubmitting(false);
              openDialog(false);
              handleSubmit();
              setSnackbarMessage(`Order updated successfully`);
            } catch (err) {
              handleError(err);
            }
          }}
        >
          {() => {
            return <Form></Form>;
          }}
        </Formik>
      </div>
    </div>
  );
};

export default OrderForm;
