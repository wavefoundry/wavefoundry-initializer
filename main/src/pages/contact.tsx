import React from "react";
import ContactForm from "../components/ContactForm";
import Layout from "../components/Layout";
import LayoutContainer from "../components/LayoutContainer";
import { CONTACT_ROUTE } from "../constants";

const ContactPage = () => {
  return (
    <Layout
      pageDescription="Contact Us"
      pageTitle="Contact Us"
      pageURL={CONTACT_ROUTE}
    >
      <LayoutContainer>
        <div className="py-10">
          <div className="bg-white shadow-lg rounded overflow-hidden p-4 m-auto max-w-screen-sm">
            <h5 className="leading-none text-xl text-primary-700 font-bold">
              Send us a message
            </h5>
            <span className="block mt-4 mb-2 w-24 h-1 bg-primary-500" />
            <ContactForm />
          </div>
        </div>
      </LayoutContainer>
    </Layout>
  );
};

export default ContactPage;
