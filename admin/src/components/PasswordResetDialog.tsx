import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form } from "formik";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import firebase from "../firebase";
import FormTextField from "./FormTextField";
import SubmitButton from "./FormSubmitButton";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 4,
  },
  grid: {
    marginTop: theme.spacing(4),
  },
  closeDialogContainer: {
    marginTop: theme.spacing(2),
  },
}));
const PasswordResetDialog: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);
  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }
  function handleExited() {
    setEmailSent(false);
  }
  const classes = useStyles();
  return (
    <>
      <Grid container justify="center" className={classes.grid}>
        <Grid item>
          <Button onClick={handleOpen} size="small">
            Forgot Password?
          </Button>
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        onExited={handleExited}
      >
        <div className={classes.root}>
          <IconButton onClick={handleClose} className={classes.closeButton}>
            <CloseIcon />
          </IconButton>
          {emailSent ? (
            <>
              <Typography color="secondary" variant="h5" gutterBottom>
                Email sent
              </Typography>
              <Typography gutterBottom>
                Done! If an account is associated with the email address you
                provided, you'll receive an email with instructions to reset
                your password.
              </Typography>
              <div className={classes.closeDialogContainer}>
                <Button onClick={handleClose} variant="outlined">
                  CLOSE
                </Button>
              </div>
            </>
          ) : (
            <>
              <Typography variant="h5" gutterBottom>
                Reset password
              </Typography>
              <Typography>
                Please enter the email address associated with your account and
                we'll send you an email with a link to update your password.
              </Typography>
              <Formik
                initialValues={{
                  email: "",
                }}
                validate={({ email }) => {
                  if (
                    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
                      email
                    ) === false
                  ) {
                    return { email: "Please enter a valid email" };
                  }
                  return {};
                }}
                onSubmit={(values, actions) => {
                  firebase
                    .auth()
                    .sendPasswordResetEmail(values.email)
                    .then(() => {
                      actions.setSubmitting(false);
                      setEmailSent(true);
                    })
                    .catch((err: Error) => {
                      actions.setStatus(err.message || "An error occurred.");
                      actions.setSubmitting(false);
                    });
                }}
              >
                {({ isSubmitting, status }) => {
                  function renderStatus() {
                    if (status) {
                      return <Typography color="error">{status}</Typography>;
                    }
                    return undefined;
                  }
                  return (
                    <Form>
                      <FormTextField name="email" type="email" label="Email" />
                      {renderStatus()}
                      <SubmitButton isSubmitting={isSubmitting} />
                    </Form>
                  );
                }}
              </Formik>
            </>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default PasswordResetDialog;
