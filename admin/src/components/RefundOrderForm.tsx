import React from "react";
import { Formik, Form } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import FormTextField from "./FormTextField";
import FormSubmitButton from "./FormSubmitButton";
import { useFormDialog } from "./FormDialog";
import {
  handleError,
  generateInitialValues,
  convertPriceToCents,
} from "../utils";
import { InputField } from "../constants";
import { useSnackbar } from "./Snackbar";
import firebase from "../firebase";
import FormPriceInput from "./FormPriceField";
import { PRICE_REG_EX } from "../constants";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    paddingTop: 0,
  },
}));

const fields: InputField[] = [
  { name: "refundAmount" },
  { name: "refundReason" },
];

const RefundOrderForm: React.FC<{ handleSubmit: () => void }> = ({
  handleSubmit,
}) => {
  const { editValues, openDialog } = useFormDialog();
  const classes = useStyles();
  const { setSnackbarMessage } = useSnackbar();
  const initialValues = generateInitialValues(fields, editValues);

  return (
    <div>
      <div className={classes.root}>
        <Formik
          initialValues={initialValues}
          validate={(values) => {
            const errors: { [key: string]: string } = {};
            if (PRICE_REG_EX.test(values.refundAmount) === false) {
              errors.refundAmount = "Please enter a valid refund amount";
            }
            if (!values.refundReason) {
              errors.refundReason = "Please enter a refund reason";
            }
            return errors;
          }}
          onSubmit={async (values, actions) => {
            const submitValues = {
              refundAmount: convertPriceToCents(values.refundAmount),
              refundReason: values.refundReason,
              orderId: editValues.id,
            };
            try {
              const refundOrder = firebase
                .functions()
                .httpsCallable("refundOrder");
              await refundOrder(submitValues);
              handleSubmit();
              openDialog(false);
              setSnackbarMessage(`Order refunded successfully`);
            } catch (err) {
              actions.setSubmitting(false);
              handleError(err);
            }
          }}
        >
          {({ isSubmitting }) => {
            return (
              <Form>
                <Grid container>
                  <Grid item xs={12}>
                    <FormPriceInput
                      name="refundAmount"
                      label="Refund Amount"
                      placeholder="50.00"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormTextField
                      name="refundReason"
                      label="Refund Reason"
                      multiline
                    />
                  </Grid>
                </Grid>
                <FormSubmitButton isSubmitting={isSubmitting} />
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default RefundOrderForm;
