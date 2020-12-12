import React from "react";
import Layout from "../components/Layout";
import { ABOUT_ROUTE } from "../constants";

const AboutPage = () => {
  return (
    <Layout
      pageDescription="Learn more about us"
      pageTitle="About Us"
      pageURL={ABOUT_ROUTE}
    >
      <div>About Us</div>
    </Layout>
  );
};

export default AboutPage;
