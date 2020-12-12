import React from 'react';
import NumberFormat from 'react-number-format';
import { Field, FieldProps } from 'formik';
import TextField from '@material-ui/core/TextField';

interface NumberFormatCustomProps {
    inputRef: (instance: NumberFormat | null) => void;
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}
function NumberFormatCustom(props: NumberFormatCustomProps) {
    const { inputRef, onChange, ...other } = props;
    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            format="(###) ###-####" 
            mask="_"
            type="tel"
        />
    );
}

const FormPhoneField: React.FC<{ name: string; label: string; helperText?: string}> = ({ name, label, helperText=''}) => {
    return (
        <Field name={name}>
            {({ field, meta}: FieldProps) => {
                const hasError = Boolean(meta.touched && meta.error);
                return (
                    <TextField
                        {...field}
                        variant="outlined"
                        label={label}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            inputComponent: NumberFormatCustom as any,
                        }}
                        error={hasError}
                        helperText={hasError ? meta.error : helperText}
                    />
                )
            }}
        </Field>
    )
}

export default FormPhoneField;
