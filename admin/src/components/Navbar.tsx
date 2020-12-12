import React from "react";
import { Link, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import firebase from "../firebase";
import { useGatsbyCloudContext } from "./GatsbyCloudContext";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  navButton: {
    marginRight: theme.spacing(2),
    "&.logout": {
      marginRight: 0,
    },
    padding: "18px 12px",
    "&.active": {
      "&::after": {
        content: "''",
        display: "block",
        position: "absolute",
        width: "100%",
        height: 4,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        background: theme.palette.common.white,
        bottom: 0,
        left: 0,
      },
    },
  },
  count: {
    position: "absolute",
    fontWeight: "bold",
    top: 8,
    right: -3,
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.dark,
    height: 20,
    width: 20,
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.common.white,
    boxShadow: theme.shadows[2],
    "&.alert": {
      backgroundColor: theme.palette.error.main,
    },
  },
  saveChangesBtn: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
    marginRight: theme.spacing(3),
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  },
  dialogRoot: {
    padding: theme.spacing(2),
    "& .actions": {
      marginTop: theme.spacing(2),
    },
  },
}));

const ConfirmBuildDialog: React.FC<{
  saveChanges: () => Promise<void>;
  submitting: boolean;
}> = ({ saveChanges, submitting }) => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }
  async function handleSave() {
    await saveChanges();
    setOpen(false);
  }
  function renderContent() {
    return (
      <>
        <Typography>Are you sure you want to publish your changes?</Typography>
        <Grid container spacing={2} justify="flex-end" className="actions">
          <Grid item>
            <Button onClick={handleClose} variant="outlined">
              CANCEL
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={submitting}
              color="primary"
            >
              {submitting ? "PUBLISHING..." : "PUBLISH"}
            </Button>
          </Grid>
        </Grid>
      </>
    );
  }
  return (
    <>
      <Button
        variant="contained"
        className={classes.saveChangesBtn}
        onClick={handleOpen}
        disabled={submitting}
      >
        PUBLISH CHANGES
      </Button>
      <Dialog open={open} fullWidth maxWidth="sm">
        <div className={classes.dialogRoot}>
          <Typography variant="h5" gutterBottom>
            Confirm Publication
          </Typography>
          {renderContent()}
        </div>
      </Dialog>
    </>
  );
};

const routes = [
  { label: "Products", route: "/products" }, 
  { label: "New Orders", route: "/new-orders", showCount: true },
  { label: "Coupons", route: "/coupons" },
  { label: "Page Content", route: "/content"}
];

const Navbar: React.FC<{ orderCount: number }> = ({ orderCount }) => {
  const classes = useStyles();
  const location = useLocation();
  const {
    hasUnsavedChanges,
    saveChanges,
    submitting,
  } = useGatsbyCloudContext();
  function handleClick() {
    firebase.auth().signOut();
  }
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <strong>Admin</strong>
          </Typography>
          {hasUnsavedChanges && (
            <ConfirmBuildDialog
              saveChanges={saveChanges}
              submitting={submitting}
            />
          )}
          {routes.map(item => {
            return (
              <Button
                key={item.route}
                color="inherit"
                size="large"
                className={`${classes.navButton}${location.pathname === item.route ? ' active' : ''}`}
                to={item.route}
                component={Link}
              >
                {item.label}
                {item.showCount && <span className={`${classes.count}${orderCount > 0 ? ' alert' : ''}`}>{orderCount}</span>}
              </Button>
            )
          })}
          <Button
            size="large"
            color="inherit"
            onClick={handleClick}
            className={`${classes.navButton} logout`}
          >
            LOG OUT
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
