import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      "& > * + *": {
        marginLeft: theme.spacing(2),
      },
      "& > .text": {
        paddingTop: theme.spacing(1),
      },
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing(5),
    },
  })
);

const LoadingIcon: React.FC<{ text?: string }> = ({ text }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CircularProgress />
      {text && (
        <Typography align="center" className="text">
          {text}
        </Typography>
      )}
    </div>
  );
};

export default LoadingIcon;
