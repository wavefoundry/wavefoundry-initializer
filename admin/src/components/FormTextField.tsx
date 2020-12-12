import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Field, FieldProps } from 'formik';

interface FormTextFieldProps {
    disabled?: boolean
    name: string; 
    label: string;
    multiline?: boolean;
    rows?: number;
    placeholder?: string;
    helperText?: string;
    type?: string;
}

const FormTextField: React.FC<FormTextFieldProps> = ({ name, label, placeholder, type='text', multiline, helperText='', rows, disabled=false }) => {
    return (
        <Field name={name}>
            {({ field, meta }: FieldProps) => {
                const hasError = Boolean(meta.touched && meta.error);
                return (
                    <TextField
                        {...field}
                        disabled={disabled}
                        label={label}
                        helperText={hasError ? meta.error : helperText}
                        variant='outlined'
                        fullWidth
                        error={hasError}
                        placeholder={placeholder}
                        margin='normal'
                        type={type}
                        multiline={Boolean(multiline)}
                        rows={rows}
                    />
                )
            }}
        </Field>
    )
}

export default FormTextField;