import React from "react";
import Button from "./Button";
import Icon from "./Icon";
import Layout from "./Layout";
import { CONTACT_ROUTE, ORDER_SUCCESS_ROUTE } from "../constants";
import LayoutContainer from "./LayoutContainer";
import { Link } from "gatsby";

export default () => {
  return (
    <Layout
      pageTitle="Order Success"
      pageURL={ORDER_SUCCESS_ROUTE}
      pageDescription="Order success"
    >
      <LayoutContainer>
        <div className="m-auto max-w-sm text-center py-8">
          <div className="h-24 bg-gradient-to-tr from-primary-800 to-primary-700 text-white w-24 rounded-full shadow-md mb-2 m-auto flex items-center justify-center">
            <Icon name="check" width={50} />
          </div>
          <h5 className="text-3xl font-bold mb-3 text-primary-700">Success!</h5>
          <p className="mb-4">
            We have received your order - you will receive an email confirmation
            shortly. If you have any questions or concerns, please <Link className="text-primary-700 transition-colors hover:text-primary-900 focus:text-primary-900" to={CONTACT_ROUTE}>contact us</Link>.
          </p>
          <div>
            <Button variant="primaryContained" linkTo="/">
              BACK TO HOME PAGE
            </Button>
          </div>
        </div>
      </LayoutContainer>
    </Layout>
  );
};
