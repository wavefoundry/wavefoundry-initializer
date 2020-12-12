import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { Field, FieldProps } from 'formik';

interface FormSelectFieldProps {
    name: string; 
    label: string;
    options: { value: any; label: string }[];
    helperText?: string;
    native?: boolean;
}

const FormSelectField: React.FC<FormSelectFieldProps> = ({ name, label, options, helperText="", native=false }) => {
    return (
        <Field name={name}>
            {({ field, meta }: FieldProps) => {
                const hasError = Boolean(meta.touched && meta.error);
                return (
                    <TextField
                        {...field}
                        label={label}
                        helperText={hasError ? meta.error : helperText}
                        variant='outlined'
                        fullWidth
                        error={hasError}
                        margin='normal'
                        select
                        SelectProps={{ native }}
                    >
                        {options.map(({ value, label}) => {
                            return (
                                <MenuItem key={value} value={value}>
                                    {label}
                                </MenuItem>
                            )
                        })}
                    </TextField>
                )
            }}
        </Field>
    )
}

export default FormSelectField;