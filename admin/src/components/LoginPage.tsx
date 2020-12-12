import React from "react";
import { Formik, Form, Field, FieldProps } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import firebase from "../firebase";
import PasswordResetDialog from "./PasswordResetDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    height: "100vh",
    background: theme.palette.background.default,
  },
  inputContainer: {
    marginTop: theme.spacing(3),
  },
  divider: {
    height: 3,
    borderRadius: 3,
    width: 100,
    margin: `${theme.spacing(2)}px auto ${theme.spacing(3)}px auto`,
    display: "block",
    background: theme.palette.primary.light,
  },
  paper: {
    width: "100%",
    maxWidth: 450,
    margin: "auto",
    padding: theme.spacing(2),
  },
  errorContainer: {
    padding: theme.spacing(1),
    background: theme.palette.error.dark,
    color: theme.palette.common.white,
    textAlign: "center",
    borderRadius: theme.shape.borderRadius,
  },
}));

const LoginPage: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Paper elevation={3} className={classes.paper}>
        <Typography align="center" variant="h6" color="primary">
          Log in to Admin Page
        </Typography>
        <span className={classes.divider} />
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={(values, { setSubmitting, setStatus }) => {
            firebase
              .auth()
              .signInWithEmailAndPassword(values.email, values.password)
              .then(() => {})
              .catch(() => {
                setStatus("Invalid login - try again");
                setSubmitting(false);
              });
          }}
        >
          {({ isSubmitting, status }) => {
            return (
              <Form>
                {status && (
                  <div className={classes.errorContainer}>
                    <Typography color="inherit">{status}</Typography>
                  </div>
                )}
                <Field name="email">
                  {({ field }: FieldProps) => {
                    return (
                      <div className={classes.inputContainer}>
                        <TextField
                          {...field}
                          label="Email"
                          variant="outlined"
                          type="email"
                          fullWidth
                        />
                      </div>
                    );
                  }}
                </Field>
                <Field name="password">
                  {({ field }: FieldProps) => {
                    return (
                      <div className={classes.inputContainer}>
                        <TextField
                          {...field}
                          label="Password"
                          variant="outlined"
                          fullWidth
                          type="password"
                        />
                      </div>
                    );
                  }}
                </Field>
                <div className={classes.inputContainer}>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                  >
                    {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
        <PasswordResetDialog />
      </Paper>
    </div>
  );
};

export default LoginPage;
