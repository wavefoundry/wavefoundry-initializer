import React from "react";
import axios from "axios";
import { useSnackbar } from "./Snackbar";
import { GATSBY_WEBHOOK_URL } from "../config";

interface IGatsbyCloudContext {
  unsavedChanges: boolean;
}
const GatsbyCloudContext = React.createContext<
  [
    IGatsbyCloudContext,
    React.Dispatch<React.SetStateAction<IGatsbyCloudContext>>
  ]
>([{ unsavedChanges: false }, () => {}]);

export const useGatsbyCloudContext = () => {
  const [state, setState] = React.useContext(GatsbyCloudContext);
  const [submitting, setSubmitting] = React.useState(false);
  const { setSnackbarMessage } = useSnackbar();
  function toggleUnsavedChanges(unsavedChanges: boolean) {
    setState({ unsavedChanges });
  }
  async function saveChanges() {
    try {
      setSubmitting(true);
      await axios.post(GATSBY_WEBHOOK_URL);
      setSnackbarMessage(
        "Build request sent! Changes should be published in a few minutes."
      );
      toggleUnsavedChanges(false);
      setSubmitting(false);
    } catch {
      setSubmitting(false);
      window.alert(
        "An error occurred while saving changes - please try again later."
      );
    }
  }
  const hasUnsavedChanges = state.unsavedChanges;
  return { hasUnsavedChanges, toggleUnsavedChanges, saveChanges, submitting };
};

export const GatsbyCloudContextProvider: React.FC = ({ children }) => {
  const [state, setState] = React.useState<IGatsbyCloudContext>({
    unsavedChanges: false,
  });
  return (
    <GatsbyCloudContext.Provider value={[state, setState]}>
      {children}
    </GatsbyCloudContext.Provider>
  );
};
