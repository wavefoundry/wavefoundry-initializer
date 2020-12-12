import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import { Formik, Form, FieldArray } from "formik";
import FormTextField from "./FormTextField";
import FormSubmitButton from "./FormSubmitButton";
import { useFormDialog } from "./FormDialog";
import {
  handleError,
  generateInitialValues,
  convertCentsToCurrency,
  processImage,
  convertPriceToCents,
} from "../utils";
import { useSnackbar } from "./Snackbar";
import ProductFormPreview from "./ProductFormPreview";
import { PRICE_REG_EX, InputField, ImageInputValues } from "../constants";
import FormSelectField from "./FormSelectField";
import firebase from "../firebase";
import FormPriceField from "./FormPriceField";
import { PRODUCTS } from "../constants";
import { useGatsbyCloudContext } from "./GatsbyCloudContext";
import FormImageField from "./FormImageField";

const yesNoOptions = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];
const categoryOptions = [
  {
    value: "Option 1",
    label: "Option 1",
  },
  {
    value: "Option 2",
    label: "Option 2",
  },
];
const SINGLE_PRICE_VALUE = "singlePriceValue";
const useStyles = makeStyles((theme) => ({
  grid: {
    display: "flex",
    "& > div": {
      flexBasis: "50%",
      maxWidth: "50%",
      minHeight: "calc(100vh - 64px)",
      padding: theme.spacing(2),
    },
    "& > div:first-child": {
      borderRight: `1px solid ${theme.palette.grey[300]}`,
    },
  },
  margin: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  marginTop2: {
    marginTop: theme.spacing(2),
  },
  marginTopDelete: {
    marginTop: theme.spacing(5),
  },
}));

interface PriceOption {
  description: string;
  price: string;
}
interface ConvertedPriceOption {
  [key: string]: { price: number };
}
const fields: InputField[] = [
  { name: "name" },
  { name: "description" },
  { name: "archived", initialValue: false },
  { name: "category" },
  { name: "multiplePriceOptions", initialValue: false },
  { name: SINGLE_PRICE_VALUE },
  {
    name: "priceOptions",
    initialValue: [],
    formatFunction: (value: ConvertedPriceOption) => {
      return Object.keys(value).map((description) => {
        return {
          description,
          price: convertCentsToCurrency(value[description].price),
        };
      });
    },
  },
  {
    name: "image",
    imageField: true,
  },
  {
    name: "additionalImages",
    imageArray: true,
  },
];

const processImageOnSubmit = async (
  imageField: ImageInputValues
): Promise<{ imageURL: string }> => {
  if (imageField.file) {
    const imageURL = await processImage(imageField);
    return { imageURL };
  }
  if (!imageField.imageURL) {
    throw new Error("No image file was found");
  }
  return {
    imageURL: imageField.imageURL,
  };
};

const ProductForm: React.FC<{ handleSubmit: () => void }> = ({
  handleSubmit,
}) => {
  const classes = useStyles();
  const { editValues, openDialog } = useFormDialog();
  const { toggleUnsavedChanges } = useGatsbyCloudContext();
  const { setSnackbarMessage } = useSnackbar();
  const initialValues = generateInitialValues(fields, editValues);
  if (editValues && !initialValues.multiplePriceOptions) {
    initialValues.singlePriceValue = convertCentsToCurrency(
      editValues.priceOptions[SINGLE_PRICE_VALUE]
    );
    initialValues.priceOptions = [];
  }
  return (
    <div>
      <Formik
        initialValues={initialValues}
        validate={(values) => {
          const errors: { [key: string]: string } = {};
          if (!values.name) {
            errors.name = "Please enter a product name";
          }
          if (!values.category) {
            errors.category = "Please enter a category";
          }
          if (!values.description) {
            errors.description = "Please enter a description";
          }
          if (!values.image.imageURL && !values.image.file) {
            errors.image = "Please add an image";
          }
          if (values.additionalImages.length > 0) {
            let additionalImageError = false;
            for (const additionalImage of values.additionalImages) {
              if (!additionalImage.imageURL && !additionalImage.file) {
                additionalImageError = true;
                break;
              }
            }
            if (additionalImageError) {
              errors.additionalImages = `Please add images for all additional image records`;
            }
          }
          if (values.multiplePriceOptions) {
            if (values.priceOptions.length < 2) {
              errors.priceOptions =
                "You must add at least two price options when multiple price options are enabled";
            } else {
              const descriptions = new Set();
              for (const { description, price } of values.priceOptions) {
                if (descriptions.has(description)) {
                  errors.priceOptions = `Description "${description}" is duplicated - all descriptions should be unique.`;
                } else {
                  descriptions.add(description);
                }
                if (PRICE_REG_EX.test(price) === false) {
                  errors.priceOptions =
                    "Please enter a valid price in dollars and cents for each option";
                }
                if (!description) {
                  errors.priceOptions =
                    "Please enter a valid description for each option";
                }
              }
            }
          } else {
            if (PRICE_REG_EX.test(values.singlePriceValue) === false) {
              errors.singlePriceValue =
                "Please enter a valid price in dollars and cents";
            }
          }
          return errors;
        }}
        onSubmit={async (values, actions) => {
          try {
            const submitValues: { [key: string]: any } = {};
            for (const field of fields) {
              if (field.imageField) {
                submitValues[field.name] = await processImageOnSubmit(
                  values[field.name]
                );
              } else if (field.imageArray) {
                submitValues[field.name] = [];
                for (let i = 0; i < values[field.name].length; i++) {
                  submitValues[field.name][i] = await processImageOnSubmit(
                    values[field.name][i]
                  );
                }
              } else {
                submitValues[field.name] = values[field.name];
              }
            }
            if (values.multiplePriceOptions) {
              submitValues.priceOptions = submitValues.priceOptions.reduce(
                (a: ConvertedPriceOption, b: PriceOption) => {
                  const price = convertPriceToCents(b.price);
                  if (
                    !submitValues.displayPrice ||
                    price < submitValues.displayPrice
                  ) {
                    submitValues.displayPrice = price;
                  }
                  a[b.description] = { price: convertPriceToCents(b.price) };
                  return a;
                },
                {}
              );
            } else {
              const singlePriceValue = convertPriceToCents(
                values.singlePriceValue
              );
              submitValues.priceOptions = { [SINGLE_PRICE_VALUE]: { price: singlePriceValue } };
              submitValues.displayPrice = singlePriceValue;
            }
            delete submitValues[SINGLE_PRICE_VALUE]; // We don't need to persist the singlePriceValue property because we only need the priceOption object
            submitValues.createdAt = editValues
              ? editValues.createdAt
              : Date.now();
            const action = editValues
              ? firebase
                  .firestore()
                  .collection(PRODUCTS)
                  .doc(editValues.id)
                  .set(submitValues)
              : firebase.firestore().collection(PRODUCTS).add(submitValues);
            await action;
            actions.setSubmitting(false);
            openDialog(false);
            toggleUnsavedChanges(true);
            handleSubmit();
            setSnackbarMessage(
              `Product ${editValues ? "updated" : "added"} successfully`
            );
          } catch (err) {
            handleError(err);
          }
        }}
      >
        {({ isSubmitting, values, errors, submitCount }) => {
          const displayPrice = values.multiplePriceOptions
            ? convertCentsToCurrency(
                values.priceOptions.reduce(
                  (a: null | number, b: PriceOption) => {
                    const convertedPrice = convertPriceToCents(b.price);
                    if (!a || convertedPrice < a) {
                      a = convertedPrice;
                    }
                    return a;
                  },
                  null
                ) || 0
              )
            : values.singlePriceValue;
          return (
            <div className={classes.grid}>
              <div>
                <Form>
                  <FormTextField name="name" label="Product Name" />
                  <FormTextField
                    name="description"
                    label="Description"
                    multiline
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormSelectField
                        name="category"
                        label="Category"
                        options={categoryOptions}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormSelectField
                        name="archived"
                        label="Archived?"
                        options={yesNoOptions}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormSelectField
                        name="multiplePriceOptions"
                        label="Multiple Price Options?"
                        options={yesNoOptions}
                      />
                    </Grid>
                    {!values.multiplePriceOptions && (
                      <Grid item xs={6}>
                        <FormPriceField name="singlePriceValue" label="Price" />
                      </Grid>
                    )}
                  </Grid>
                  {values.multiplePriceOptions && (
                    <FieldArray
                      name="priceOptions"
                      validateOnChange={false}
                      render={({ push, remove }) => {
                        const handleAddClick = () => {
                          push({ price: "", description: "" });
                        };
                        return (
                          <div>
                            <Typography
                              color="textSecondary"
                              className={classes.marginTop2}
                            >
                              Price Options
                            </Typography>
                            <div>
                              {values.priceOptions.map(
                                (option: PriceOption, index: number) => {
                                  function handleRemove() {
                                    remove(index);
                                  }
                                  return (
                                    <Grid
                                      container
                                      key={`option-${index}`}
                                      spacing={2}
                                      alignItems="center"
                                    >
                                      <Grid item xs={6}>
                                        <FormTextField
                                          name={`priceOptions.${index}.description`}
                                          label="Description"
                                          placeholder=""
                                        />
                                      </Grid>
                                      <Grid item xs={5}>
                                        <FormPriceField
                                          name={`priceOptions.${index}.price`}
                                          label="Price"
                                          placeholder="50.00"
                                        />
                                      </Grid>
                                      <Grid item xs={1}>
                                        <IconButton
                                          title="Remove this option"
                                          onClick={handleRemove}
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      </Grid>
                                    </Grid>
                                  );
                                }
                              )}
                            </div>
                            {submitCount > 0 &&
                              typeof errors.priceOptions === "string" && (
                                <Typography variant="caption" color="error">
                                  {errors.priceOptions}
                                </Typography>
                              )}
                            <div className={classes.margin}>
                              <Button
                                size="small"
                                onClick={handleAddClick}
                                color="primary"
                                variant="outlined"
                                startIcon={<AddIcon />}
                              >
                                ADD AN OPTION
                              </Button>
                            </div>
                          </div>
                        );
                      }}
                    />
                  )}
                  <FormImageField name="image" label="Product Image" />
                  <FieldArray
                    name="additionalImages"
                    render={({ push, remove }) => {
                      const handleAddClick = () => {
                        const initialImageValues: ImageInputValues = {
                          file: null,
                          blob: "",
                          imageURL: "",
                        };
                        push(initialImageValues);
                      };
                      return (
                        <div>
                          <Typography
                            color="textSecondary"
                            className={classes.marginTop2}
                          >
                            Additional Images (optional)
                          </Typography>
                          <div>
                            {values.additionalImages.map(
                              (image: ImageInputValues, index: number) => {
                                const handleRemoveClick = () => {
                                  remove(index);
                                };
                                return (
                                  <Grid
                                    container
                                    key={`addl-image-${index}`}
                                    justify="space-between"
                                    alignItems="center"
                                  >
                                    <Grid item>
                                      <FormImageField
                                        name={`additionalImages.${index}`}
                                        label={`Additional Image ${index + 1}`}
                                        hideError
                                      />
                                    </Grid>
                                    <Grid item>
                                      <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={handleRemoveClick}
                                        className={classes.marginTopDelete}
                                      >
                                        DELETE IMAGE {index + 1}
                                      </Button>
                                    </Grid>
                                  </Grid>
                                );
                              }
                            )}
                          </div>
                          {submitCount > 0 &&
                            typeof errors.additionalImages === "string" && (
                              <Typography variant="caption" color="error">
                                {errors.additionalImages}
                              </Typography>
                            )}
                          <div className={classes.margin}>
                            <Button
                              size="small"
                              onClick={handleAddClick}
                              color="primary"
                              variant="outlined"
                              startIcon={<AddIcon />}
                            >
                              ADD AN IMAGE
                            </Button>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <FormSubmitButton isSubmitting={isSubmitting} />
                </Form>
              </div>
              <div>
                <ProductFormPreview
                  imageInputValues={values.image}
                  imageWidth={500}
                  imageHeight={500}
                  name={values.name}
                  description={values.description}
                  displayPrice={displayPrice}
                  recommendedImageDimensions="800 x 800 (square)"
                />
              </div>
            </div>
          );
        }}
      </Formik>
    </div>
  );
};

export default ProductForm;
