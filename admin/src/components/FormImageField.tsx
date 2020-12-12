import React from "react";
import { Field, FieldProps } from "formik";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import { makeStyles } from "@material-ui/core/styles";
import { ImageInputValues } from "../constants";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  input: {
    display: "none",
  },
  image: {
    width: 160,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
  },
  errorMsg: {
    margin: "8px 0 0 14px",
  },
  label: {
    margin: `${theme.spacing(2)}px auto ${theme.spacing(1)}px`,
  },
  root: {
    marginBottom: theme.spacing(1),
  },
}));

const FormImageField: React.FC<{ name: string; label: string; hideError?: boolean }> = ({
  name,
  label,
  hideError
}) => {
  const classes = useStyles();
  return (
    <Field name={name}>
      {({ field, form, meta }: FieldProps) => {
        const imageSrc = field.value.blob || field.value.imageURL;
        const hasError = !hideError && meta.touched && meta.error;
        function handleRemove() {
          const imageValues: ImageInputValues = {
            blob: "",
            file: null,
            imageURL: "",
          };
          form.setFieldValue(name, imageValues);
        }
        return (
          <div className={classes.root}>
            <Typography
              className={classes.label}
              color={hasError ? "error" : "textSecondary"}
            >
              {label}
            </Typography>
            {imageSrc ? (
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <img
                    src={imageSrc}
                    alt="Placeholder"
                    className={classes.image}
                  />
                </Grid>
                <Grid item>
                  <Button size="small" onClick={handleRemove}>
                    REMOVE
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <>
                <input
                  name={name}
                  accept="image/*"
                  className={classes.input}
                  id={name}
                  multiple
                  type="file"
                  onChange={(event) => {
                    const file = event.currentTarget.files
                      ? event.currentTarget.files[0]
                      : null;
                    if (file) {
                      const fileSize = file.size / 1024 / 1024;
                      if (fileSize > 3) {
                        window.alert(
                          "This file is too large. Please use a smaller file"
                        );
                      } else {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          form.setFieldValue(field.name, {
                            blob: reader.result,
                            file,
                            imageURL: "",
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }
                  }}
                />
                <label htmlFor={name}>
                  <Button
                    variant="contained"
                    color="primary"
                    component="span"
                    startIcon={<PhotoCameraIcon />}
                  >
                    Upload Image
                  </Button>
                </label>
              </>
            )}
            {hasError && (
              <Typography
                color="error"
                variant="body2"
                className={classes.errorMsg}
              >
                {meta.error}
              </Typography>
            )}
          </div>
        );
      }}
    </Field>
  );
};

export default FormImageField;
