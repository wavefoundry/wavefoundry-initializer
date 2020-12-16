/// <reference path="../declarations.d.ts" />

import React from "react";
import { Helmet } from "react-helmet";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Navbar from "./Navbar";
import { FirebaseProvider } from "./Firebase";
import Footer from "./Footer";
import LayoutSnackbar from "./LayoutSnackbar";
import { CartItem, CartPageProps } from "../types";
import { setLocalStorage, getLocalStorage } from "../utils";
import { CART } from "../constants";
import "../stylesheets/index.css";

const HOST_URL = "https://wavefoundry.io";
const defaultOgImage = `${HOST_URL}/og-image.png`;

interface LayoutProps {
  pageTitle: string;
  ogImage?: string;
  pageDescription: string;
  pageURL: string;
  addCartProps?: boolean;
  hideNavbar?: boolean;
  hideFooter?: boolean;
}
const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#8B5CF6",
      main: "#6D28D9",
      dark: "#4C1D95",
    },
    error: {
      light: "#F87171",
      main: "#EF4444",
      dark: "#B91C1C"
    }
  },
  typography: {
    fontFamily: [
      '"Varela Round"',
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

const title = "Wavefoundry Initializer";

const Layout: React.FC<LayoutProps> = ({
  pageTitle,
  pageDescription,
  pageURL,
  children,
  ogImage = defaultOgImage,
  addCartProps,
  hideNavbar,
  hideFooter
}) => {
  const initCartItems = getLocalStorage(CART) || [];
  const [cartItems, setCartItems] = React.useState<CartItem[]>(initCartItems);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const cartItemObject = cartItems.reduce(
    (a: { [key: string]: CartItem }, b) => {
      a[b.productId] = b;
      return a;
    },
    {}
  );

  function updateCart(updatedCartItems: CartItem[]) {
    setLocalStorage(CART, updatedCartItems);
    setCartItems(updatedCartItems);
  }
  function addToCart(cartItem: CartItem) {
    if (cartItemObject.hasOwnProperty(cartItem.productId)) {
      cartItemObject[cartItem.productId].quantity++;
    } else {
      cartItemObject[cartItem.productId] = cartItem;
    }
    const updatedCartItems = [];
    for (const productId in cartItemObject) {
      updatedCartItems.push(cartItemObject[productId]);
    }
    updateCart(updatedCartItems);
    if (!snackbarMessage) {
      setSnackbarMessage("Item added to cart");
    }
  }
  function updateCartItem(cartItem: CartItem, index: number) {
    const updatedCartItems = [...cartItems];
    updatedCartItems[index] = cartItem;
    updateCart(updatedCartItems);
  }
  function removeCartItem(index: number) {
    const updatedCartItems = [...cartItems];
    updatedCartItems.splice(index, 1);
    updateCart(updatedCartItems);
  }
  const wrappedChidren = addCartProps
    ? React.cloneElement(children as React.ReactElement<CartPageProps>, {
        addToCart,
        cartItemObject,
      })
    : children;
  const calculatedTitle = `${title} - ${pageTitle}`;
  return (
    <>
      <Helmet htmlAttributes={{ lang: "en" }}>
        <title>{calculatedTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${HOST_URL}${pageURL}`} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:title" content={calculatedTitle} />
        <meta property="og:image" content={ogImage} />
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:title" content={calculatedTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <link rel="mask-icon" href={`${HOST_URL}/safari-pinned-tab.svg`} color="#3f9796" />
      </Helmet>
      <noscript>
        JavaScript is currently disabled in your browser. Most features of this
        website require JavaScript to work properly, so please enable JavaScript
        in your browser for full site functionality.
      </noscript>
      {!hideNavbar && <Navbar
        cartItems={cartItems}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        updateCartItem={updateCartItem}
        removeCartItem={removeCartItem}
      />}
      <ThemeProvider theme={theme}>
        <FirebaseProvider>
          <main className={`min-h-screen ${hideNavbar ? "" : "pt-12 md:pt-16"}`}>{wrappedChidren}</main>
        </FirebaseProvider>
      </ThemeProvider>
      {!hideFooter && <Footer />}
      <LayoutSnackbar
        setCartOpen={setCartOpen}
        snackbarMessage={snackbarMessage}
        setSnackbarMessage={setSnackbarMessage}
      />
    </>
  );
};

export default Layout;
