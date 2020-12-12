import firebase from "../firebase";
import { InputField, ImageInputValues } from '../constants';

export const handleError = (err: Error) => {
  window.alert(`An error occurred - ${err.message}`);
};

export const generateInitialValues = (
  fields: InputField[],
  editValues: any
) => {
  const initialValues: { [key: string]: any } = {};
  if (editValues) {
    fields.forEach((field: InputField) => {
      if (field.imageField) {
        const imageValues: ImageInputValues = {
          file: null,
          blob: "",
          imageURL: editValues[field.name].imageURL,
        };
        initialValues[field.name] = imageValues;
      } else if (field.formatFunction) {
        initialValues[field.name] = field.formatFunction(
          editValues[field.name]
        );
      } else {
        initialValues[field.name] = editValues[field.name];
      }
    });
  } else {
    fields.forEach((field: InputField) => {
      if (field.imageField) {
        const imageValues: ImageInputValues = {
          file: null,
          blob: "",
          imageURL: "",
        };
        initialValues[field.name] = imageValues;
      } else if (field.imageArray) {
        initialValues[field.name] = [];
      } else {
        initialValues[field.name] =
          field.initialValue === false ? false : field.initialValue || "";
      }
    });
  }
  return initialValues;
};
export function formatPhone(number: string) {
  return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
}
export function convertPriceToCents(price: string) {
  return parseInt(price.replace(/\D/g, ""));
}
export function convertCentsToCurrency(cents: number) {
  return `${(cents / 100).toFixed(2)}`;
}

export const processImage = async (
  imageInputValues: ImageInputValues
): Promise<string> => {
  if (imageInputValues.file) {
    const storageRef = firebase.storage().ref();
    const fileName = `image-${Date.now()}`;
    const image = await storageRef.child(fileName).put(imageInputValues.file);
    const imageURL = await image.ref.getDownloadURL();
    return imageURL;
  }
  return "";
};
