import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form } from "formik";
import Typography from "@material-ui/core/Typography";
import LoadingIcon from "./LoadingIcon";
import { handleError, generateInitialValues, processImage } from "../utils";
import { InputField } from "../constants";
import firebase from "../firebase";
import FormImageField from "./FormImageField";
import FormSubmitButton from "./FormSubmitButton";
import FormTextField from "./FormTextField";
import { useGatsbyCloudContext } from "./GatsbyCloudContext";
import { useSnackbar } from "./Snackbar";
import FormRichTextField from "./FormRichTextField";

const CONTENT = "content";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 1200,
    margin: `${theme.spacing(4)}px auto`,
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
  },
  divider: {
    display: "block",
    width: "100%",
    height: 2,
    background: theme.palette.grey[500],
    margin: `${theme.spacing(2)}px 0`,
  },
  submitBtnContainer: {
    maxWidth: 500,
    marginTop: theme.spacing(2),
    "& .MuiButton-label": {
      fontWeight: "bold",
    },
  },
}));

const fields: InputField[] = [
  { name: "landingBannerHeader" },
  { name: "landingBannerMessage" },
  { name: "landingBannerImage", imageField: true },
  { name: "aboutBannerHeader" },
  { name: "aboutBannerMessage" },
  { name: "aboutBannerImage", imageField: true },
  { name: "aboutBodyFooterMessage" },
];

const ContentHeader: React.FC<{
  header: string;
  handleClick: () => void;
  showing: boolean;
}> = ({ header, handleClick, showing }) => {
  return (
    <Grid container alignItems="center" justify="space-between">
      <Grid item>
        <Typography variant="h6">
          <strong>{header}</strong>
        </Typography>
      </Grid>
      <Grid item>
        <Button
          startIcon={showing ? <RemoveIcon /> : <AddIcon />}
          onClick={handleClick}
          variant="outlined"
        >
          {showing ? "HIDE" : "SHOW"}
        </Button>
      </Grid>
    </Grid>
  );
};

const ContentPage = () => {
  const [displaySections, setDisplaySections] = React.useState<boolean[]>(
    Array.from({ length: 3 }).map(() => false)
  );
  const [loading, setLoading] = React.useState(true);
  const [editValues, setEditValues] = React.useState<any>(null);
  const initialValues = generateInitialValues(fields, editValues);
  const classes = useStyles();
  const { toggleUnsavedChanges } = useGatsbyCloudContext();
  const { setSnackbarMessage } = useSnackbar();
  function handleDisplayClick(index: number) {
    const currentDisplays = [...displaySections];
    currentDisplays[index] = !currentDisplays[index];
    setDisplaySections(currentDisplays);
  }
  function handleRefresh() {
    setLoading(true);
    firebase
      .firestore()
      .collection(CONTENT)
      .doc(CONTENT)
      .get()
      .then((doc) => {
        const data = doc.data();
        setEditValues(data);
      })
      .catch((err) => handleError(err))
      .finally(() => setLoading(false));
  }
  React.useEffect(() => {
    handleRefresh();
  }, []);
  if (loading) {
    return <LoadingIcon />;
  }
  return (
    <div className={classes.root}>
      <Paper elevation={2}>
        <Formik
          initialValues={initialValues}
          validate={(values) => {
            const errors: { [key: string]: string } = {};
            fields.forEach((field) => {
              if (
                field.imageField &&
                !values[field.name].imageURL &&
                !values[field.name].file
              ) {
                errors[field.name] = "Please add an image";
              }
              if (!field.imageField && !values[field.name]) {
                errors[field.name] = "This is a required field";
              }
            });
            return errors;
          }}
          onSubmit={async (values) => {
            try {
              const submitValues: { [key: string]: any } = {};
              for (const field of fields) {
                if (field.imageField) {
                  if (values[field.name].file) {
                    const imageURL = await processImage(values[field.name]);
                    submitValues[field.name] = { imageURL };
                  } else {
                    submitValues[field.name] = {
                      imageURL: editValues[field.name].imageURL,
                    };
                  }
                } else {
                  submitValues[field.name] = values[field.name];
                }
              }
              await firebase
                .firestore()
                .collection(CONTENT)
                .doc(CONTENT)
                .set(submitValues);
              toggleUnsavedChanges(true);
              setSnackbarMessage(`Page content updated successfully`);
            } catch (err) {
              handleError(err);
            }
          }}
        >
          {({ isSubmitting }) => {
            return (
              <div className={classes.paper}>
                <Form>
                  <ContentHeader
                    header="Landing Page"
                    handleClick={() => handleDisplayClick(0)}
                    showing={displaySections[0]}
                  />
                  {displaySections[0] && (
                    <div>
                      <FormTextField
                        name="landingBannerHeader"
                        label="Banner Header"
                      />
                      <FormTextField
                        multiline
                        name="landingBannerMessage"
                        label="Banner Message"
                      />
                      <FormImageField
                        name="landingBannerImage"
                        label="Banner Image"
                      />
                    </div>
                  )}
                  <span className={classes.divider} />
                  <ContentHeader
                    header="About Us Page"
                    handleClick={() => handleDisplayClick(1)}
                    showing={displaySections[1]}
                  />
                  {displaySections[1] && (
                    <div>
                      <FormTextField
                        multiline
                        name="aboutBannerHeader"
                        label="About Us Banner Header"
                      />
                      <FormTextField
                        multiline
                        name="aboutBannerMessage"
                        label="About Us Banner Message"
                      />
                      <FormImageField
                        name="aboutBannerImage"
                        label="About Us Banner Image"
                      />
                      <FormRichTextField
                        name="aboutBodyFooterMessage"
                        label="About Us Body Footer Message"
                        toolbarOptions={["bulletedList", "numberedList"]}
                      />
                    </div>
                  )}
                  <div className={classes.submitBtnContainer}>
                    <FormSubmitButton isSubmitting={isSubmitting} />
                  </div>
                </Form>
              </div>
            );
          }}
        </Formik>
      </Paper>
    </div>
  );
};

export default ContentPage;
