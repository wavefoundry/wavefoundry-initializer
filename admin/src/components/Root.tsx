import React from "react";
import { Switch, BrowserRouter, Route, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import FireTypes from "firebase";
import { PAID_ORDERS } from '../constants';
import Navbar from "./Navbar";
import LoadingIcon from "./LoadingIcon";
import LoginPage from "./LoginPage";
import { SnackbarProvider, SnackbarElement } from "./Snackbar";
import firebase from "../firebase";
import ProductPage from "./ProductPage";
import { GatsbyCloudContextProvider } from "./GatsbyCloudContext";
import ContentPage from "./ContentPage";
import CouponPage from "./CouponPage";
import NewOrderPage from "./NewOrderPage";

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.default,
    display: "flex",
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
}));

const Root: React.FC = () => {
  const [authenticating, setAuthenticating] = React.useState(true);
  const [authUser, setAuthUser] = React.useState<FireTypes.User | null>(null);
  const [orderCount, setOrderCount] = React.useState(0);
  const classes = useStyles();
  const refreshOrderCount = () => {
    firebase.firestore().collection(PAID_ORDERS).where('status', '==', 'Unfulfilled').get()
    .then(docs => {
      setOrderCount(docs.size);
    })
    .catch(console.log);
  };
  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
      setAuthenticating(false);
    });
  }, []);
  function renderContent() {
    if (authenticating) {
      return (
        <div className={classes.root}>
          <LoadingIcon text="Loading..." />
        </div>
      );
    } else if (!authUser) {
      return <LoginPage />;
    }
    return (
      <SnackbarProvider>
        <BrowserRouter>
          <GatsbyCloudContextProvider>
            <Navbar orderCount={orderCount} />
            <Switch>
              <Route path="/products">
                <ProductPage />
              </Route>
              <Route path="/content">
                <ContentPage />
              </Route>
              <Route path="/new-orders">
                <NewOrderPage refreshOrderCount={refreshOrderCount} />
              </Route>
              <Route path="/coupons">
                <CouponPage />
              </Route>
              <Route path="/">
                <Redirect to="/products" />
              </Route>
            </Switch>
          </GatsbyCloudContextProvider>
        </BrowserRouter>
        <SnackbarElement />
      </SnackbarProvider>
    );
  }
  return renderContent();
};

export default Root;
