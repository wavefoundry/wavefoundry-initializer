export const CART = "CART";
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
export const CONTACT_ROUTE = "/contact/";
export const ABOUT_ROUTE = "/about/";
export const CHECKOUT_ROUTE = "/checkout/";
export const ORDER_SUCCESS_SUFFIX = "order-success/";
export const ORDER_SUCCESS_ROUTE = `${CHECKOUT_ROUTE}${ORDER_SUCCESS_SUFFIX}`;
export const PRODUCT_IMAGE_ASPECT_RATIO = 1;
export const PAYMENT_METHOD_BRANDS = ["visa", "mastercard", "amex", "discover"];
export const NAV_ITEMS = [
    {
        label: "ABOUT US",
        to: ABOUT_ROUTE
    },
    {
        label: "CONTACT US",
        to: CONTACT_ROUTE
    }
]