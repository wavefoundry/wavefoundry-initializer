import { CartItem, CheckoutFormData, OrderTotals } from "../types"

export const isBrowser = () => typeof window !== "undefined";
export const getLocalStorage = (itemName: string) => {
    if (isBrowser()) {
        const item = window.localStorage.getItem(itemName);
        return item ? JSON.parse(item) : null;
    }
    return null;
}
export const setLocalStorage = (itemName: string, item: any) => {
    window.localStorage.setItem(itemName, JSON.stringify(item));
}
export const removeLocalStorage = (itemName: string) => {
    window.localStorage.removeItem(itemName);
}
export const formatPhone = (number: string) => {
    return `(${number.slice(0,3)}) ${number.slice(3,6)}-${number.slice(6)}`;
}
export function convertCentsToCurrency(cents: number) {
    return `${(cents/100).toFixed(2)}`;
}
export const getOrderSubtotal = (cartItems: CartItem[]) => {
    let orderSubtotal = 0;
    cartItems.forEach(item => {
        orderSubtotal += (item.price * item.quantity);
    });
    return orderSubtotal;
}
export const getOrderTotals = (cartItems: CartItem[], couponData: CheckoutFormData["couponData"]): OrderTotals => {
    const orderSubtotal = getOrderSubtotal(cartItems);
    let orderTotal = orderSubtotal;
    if (couponData) {
        orderTotal -= couponData.discount;
    }
    return { orderTotal, orderSubtotal, couponData };
}