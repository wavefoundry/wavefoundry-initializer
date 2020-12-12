import React from 'react';
import NumberFormat from 'react-number-format';
import { Field, FieldProps } from 'formik';
import InputAdornment from '@material-ui/core/InputAdornment';
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
            decimalScale={0}
            min={0}
            max={99}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
        />
    );
}

const FormPercentField: React.FC<{ name: string; label: string; placeholder?: string }> = ({ name, label, placeholder }) => {
    return (
        <Field name={name}>
            {({ field, meta}: FieldProps) => {
                const hasError = Boolean(meta.touched && meta.error);
                return (
                    <TextField
                        {...field}
                        variant="outlined"
                        margin="normal"
                        label={label}
                        placeholder={placeholder}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            inputComponent: NumberFormatCustom as any,
                        }}
                        fullWidth
                        error={hasError}
                        helperText={hasError ? meta.error : ''}
                    />
                )
            }}
        </Field>
    )
}

export default FormPercentField;