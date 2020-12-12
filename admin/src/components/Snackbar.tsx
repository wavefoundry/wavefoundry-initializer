import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

const SnackbarContext = React.createContext<
  [string, React.Dispatch<React.SetStateAction<string>>]
>(["", () => null]);

const SnackbarProvider: React.FC = (props) => {
  const [snackbarMessage, setSnackbarMessage] = React.useState<string>("");

  return (
    <SnackbarContext.Provider value={[snackbarMessage, setSnackbarMessage]}>
      {props.children}
    </SnackbarContext.Provider>
  );
};

const useSnackbar = () => {
  const [snackbarMessage, setSnackbarMessage] = React.useContext(
    SnackbarContext
  );
  return { snackbarMessage, setSnackbarMessage };
};

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SnackbarElement: React.FC = () => {
  const { snackbarMessage, setSnackbarMessage } = useSnackbar();

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (snackbarMessage) {
      setOpen(true);
    }
  }, [snackbarMessage]);

  function handleClose() {
    setOpen(false);
  }

  function handleExited() {
    setSnackbarMessage("");
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      onExited={handleExited}
    >
      <Alert onClose={handleClose} severity="success">
        {snackbarMessage}
      </Alert>
    </Snackbar>
  );
};

export { SnackbarProvider, SnackbarElement, useSnackbar };
