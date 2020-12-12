import React from "react";
import Drawer from "@material-ui/core/Drawer";
import Icon from "./Icon";
import Logo from "./Logo";
import { NAV_ITEMS } from "../constants";
import { Link } from "gatsby";
import SocialButtons from "./SocialButtons";

export default () => {
  const [open, setOpen] = React.useState(false);
  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }
  return (
    <>
      <button
        className="focus:outline-black flex items-center text-primary-700 hover:text-primary-900 transition-colors duration-150"
        onClick={handleOpen}
      >
        <Icon name="menuBars" width={26} />
      </button>
      <Drawer onClose={handleClose} open={open} anchor="right">
        <div className="w-64 h-full">
          <header className="h-12 sm:h-16 flex items-center shadow-sm absolute top-0 left-0 w-full z-10">
            <div className="w-40 m-auto text-primary-700">
              <Logo />
            </div>
          </header>
          <div className="flex flex-col justify-between h-full">
            <div className="pt-20 sm:pt-24">
              <ul className="text-center">
                {NAV_ITEMS.map(({ label, to }, index) => {
                  return (
                    <li key={label}>
                      <Link className="text-primary-700 text-lg tracking-wide" to={to}>
                        {label}
                      </Link>
                      {index + 1 !== NAV_ITEMS.length && (
                        <div className="m-auto w-16 h-0.5 bg-primary-300 my-4"></div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="flex justify-center py-4">
              <SocialButtons bgHoverColor="bg-primary-900" bgColor="bg-primary-700" />
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};
