import React from "react";
import TextField from "@material-ui/core/TextField";
import { Field, FieldProps } from "formik";

interface FormTextFieldProps {
  name: string;
  label: string;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  helperText?: string;
  type?: string;
  handleFocus?: () => void;
}

const FormTextField: React.FC<FormTextFieldProps> = ({
  name,
  label,
  placeholder,
  type = "text",
  multiline,
  helperText = "",
  rows,
  handleFocus,
}) => {
  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => {
        const hasError = Boolean(meta.touched && meta.error);
        return (
          <TextField
            {...field}
            label={label}
            helperText={hasError ? meta.error : helperText}
            variant="outlined"
            fullWidth
            error={hasError}
            placeholder={placeholder}
            margin="normal"
            type={type}
            multiline={Boolean(multiline)}
            rows={rows}
            onFocus={handleFocus}
          />
        );
      }}
    </Field>
  );
};

export default FormTextField;
