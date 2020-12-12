import React from "react";
import { Link } from "gatsby";
import LayoutContainer from "./LayoutContainer";
import Logo from "./Logo";
import MenuDrawer from "./MenuDrawer";
import CartDrawer from "./CartDrawer";
import { NAV_ITEMS } from "../constants";
import { CartItem } from "../types";

interface NavbarProps {
  cartItems: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  updateCartItem: (cartItem: CartItem, index: number) => void;
  removeCartItem: (index: number) => void;
}
const Navbar: React.FC<NavbarProps> = (props) => {
  return (
    <nav className="fixed w-full top-0 left-0 z-50 bg-white shadow-md h-12 flex items-center sm:h-16">
      <LayoutContainer>
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center">
            <div>
              <Link to="/">
                <div className="w-40 text-primary-700">
                  <Logo />
                </div>
              </Link>
            </div>
            <div className="pl-6 hidden lg:block">
              <ul className="flex">
                {NAV_ITEMS.map(({ label, to }) => {
                  return (
                    <li key={label} className="pr-6">
                      <Link
                        to={to}
                        className="text-primary-700 hover:text-primary-900 transition-colors duration-150 text-sm"
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="flex items-center">
            <div className="pl-4">
              <CartDrawer {...props} />
            </div>
            <div className="pl-4">
              <MenuDrawer />
            </div>
          </div>
        </div>
      </LayoutContainer>
    </nav>
  );
};

export default Navbar;
