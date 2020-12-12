import { Link } from "gatsby";
import React from "react";
import { ABOUT_ROUTE, CONTACT_ROUTE } from "../constants";
import LayoutContainer from "./LayoutContainer";
import Logo from "./Logo";
import SocialButtons from "./SocialButtons";

const footerLinks = [
  {
    label: "CONTACT US",
    to: CONTACT_ROUTE,
  },
  {
    label: "ABOUT US",
    to: ABOUT_ROUTE,
  },
];
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <LayoutContainer>
        <div className="flex justify-between items-center flex-col md:flex-row">
          <div className="flex flex-col md:flex-row">
            <div>
              <div>
                <Link to="/">
                  <div className="w-48">
                    <Logo />
                  </div>
                </Link>
              </div>
            </div>
            <div className="flex ml-0 md:ml-4 flex-col md:flex-row items-center md:items-start my-2 md:my-0">
              {footerLinks.map(({ label, to }) => {
                return (
                  <div key={to} className="ml-0 md:ml-4 my-1 md:my-0">
                    <Link
                      to={to}
                      className="transition-colors transition-duration-150 text-gray-200 hover:text-white text-sm"
                    >
                      {label}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <SocialButtons bgColor="bg-gray-700" bgHoverColor="bg-gray-600" />
          </div>
        </div>
        <p className="font-size-10 tracking-widest mt-6 text-gray-300 text-center md:text-left">
          © COPYRIGHT {new Date().getFullYear()} WAVEFOUNDRY, LLC
        </p>
      </LayoutContainer>
    </footer>
  );
};

export default Footer;
