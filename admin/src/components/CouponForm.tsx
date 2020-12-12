import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form } from 'formik';
import FormTextField from './FormTextField';
import FormSubmitButton from './FormSubmitButton';
import { useFormDialog } from './FormDialog';
import { handleError, generateInitialValues, convertPriceToCents, convertCentsToCurrency } from '../utils';
import { useSnackbar } from './Snackbar';
import FormPriceField from './FormPriceField';
import firebase from '../firebase';
import { COUPONS, InputField, PRICE_REG_EX } from '../constants';
import FormSelectField from './FormSelectField';
import FormPercentField from './FormPercentField';

const yesNoOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

const fields: InputField[] = [
    { name: 'code' }, 
    { name: 'type', initialValue: 'Dollar Amount' },
    { name: 'amount' },
    { name: 'enabled', initialValue: true }
];

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
        paddingTop: 0,
    }
}))

const CouponForm: React.FC<{ handleSubmit: () => void }> = ({ handleSubmit }) => {
    const classes = useStyles();
    const { editValues, openDialog } = useFormDialog();
    const { setSnackbarMessage } = useSnackbar();
    const initialValues = generateInitialValues(fields, editValues);
    if (editValues) {
        if (editValues.type === 'Percentage') {
            initialValues.amount = `${initialValues.amount}`
        } else if (editValues.type === 'Dollar Amount') {
            initialValues.amount = convertCentsToCurrency(initialValues.amount)
        }
    }
    return (
        <div>
            <Formik
                initialValues={initialValues}
                validate={(values) => {
                    const errors: { [key: string]: string } = {};
                    if (!values.code) {
                        errors.code = 'Please enter a coupon code';
                    }
                    if (values.type === 'Dollar Amount') {
                        if (PRICE_REG_EX.test(values.amount) === false) {
                            errors.amount = 'Please enter a valid dollar amount';
                        }
                    } else if (values.type === 'Percentage') {
                        if (values.amount > 100 || values.amount < 1) {
                            errors.amount = 'Please enter a valid percentage'
                        }
                    }
                    return errors;
                }}
                onSubmit={async (values) => {
                    try {
                        const submitValues: { [key: string]: any } = {};
                        submitValues.type = values.type;
                        submitValues.code = values.code.toUpperCase();
                        submitValues.enabled = values.enabled;
                        if (values.type === 'Dollar Amount') {
                            submitValues.amount = convertPriceToCents(values.amount);
                        } else if (values.type === 'Percentage') {
                            submitValues.amount = parseInt(values.amount);
                        }
                        submitValues.createdAt = editValues ? editValues.createdAt : Date.now();
                        submitValues.redemptions = editValues ? editValues.redemptions : 0;
                        await firebase.firestore().collection(COUPONS).doc(submitValues.code).set(submitValues)
                        openDialog(false);
                        handleSubmit();
                        setSnackbarMessage(`Coupon ${editValues ? 'updated' : 'created'} successfully`);
                    }
                    catch (err) {
                        handleError(err);
                    }
                }}
            >
                {({ isSubmitting, values }) => {
                    return (
                        <div className={classes.root}>
                            <div>
                                <Form>
                                    <FormTextField name="code" label="Coupon Code" disabled={Boolean(editValues)} />
                                    <FormSelectField name="enabled" label="Coupon Enabled?" options={yesNoOptions}/>
                                    <FormSelectField name="type" label="Coupon Type" options={[{ label: "Dollar Amount", value: "Dollar Amount" }, { label: "Percentage", value: "Percentage"}]}/>
                                    {values.type === "Percentage" ? <FormPercentField name="amount" label="Percent Off" placeholder="10" /> : <FormPriceField name="amount" label="Dollar Amount" placeholder="50.00" />}
                                    <FormSubmitButton isSubmitting={isSubmitting} />
                                </Form>
                            </div>
                        </div>
                    )
                }}
            </Formik>
        </div>
    )
}

export default CouponForm;
