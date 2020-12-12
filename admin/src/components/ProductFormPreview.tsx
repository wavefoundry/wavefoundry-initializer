import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { ImageInputValues } from "../constants";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
    margin: "auto",
  },
  imageContainer: {
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
    background: theme.palette.grey[200],
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    overflow: "hidden",
    position: "relative",
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    objectFit: "cover",
    objectPosition: "center center",
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    margin: `${theme.spacing(2)}px auto`,
  },
}));

interface FormPreviewProps {
  imageInputValues: ImageInputValues;
  imageWidth: number;
  imageHeight: number;
  name: string;
  description: string;
  displayPrice: string;
  recommendedImageDimensions: string;
}

const ProductFormPreview: React.FC<FormPreviewProps> = ({
  imageInputValues,
  imageWidth,
  imageHeight,
  name,
  description,
  displayPrice,
  recommendedImageDimensions
}) => {
  const classes = useStyles();
  const src = imageInputValues.blob || imageInputValues.imageURL;
  return (
    <div className={classes.root}>
      <div
        className={classes.imageContainer}
        style={{ width: imageWidth, height: imageHeight }}
      >
        {src ? (
          <img
            src={src}
            className={classes.image}
            alt="Placeholder"
          />
        ) : (
          <div>
            <Typography variant="body1" gutterBottom>IMAGE PREVIEW</Typography>
            <Typography variant="body2" color='textSecondary'>Recommended dimensions: {recommendedImageDimensions}</Typography>
          </div>
        )}
      </div>
      <div className={classes.infoContainer} style={{ width: imageWidth }}>
        <Typography variant="h6" gutterBottom>
          <strong>{name}</strong>
        </Typography>
        {description && <Typography gutterBottom>{description}</Typography>}
        {displayPrice && (
          <Typography variant="h5">
            <strong>${displayPrice}</strong>
          </Typography>
        )}
      </div>
    </div>
  );
};

export default ProductFormPreview;
