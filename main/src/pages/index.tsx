import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import Layout from "../components/Layout";
import LayoutContainer from "../components/LayoutContainer";
import { Product, CartPageProps } from "../types";
import ProductContainer from "../components/ProductContainer";

const IndexPageWrapper: React.FC<CartPageProps> = ({ addToCart }) => {
  const pageData = useStaticQuery(graphql`
    query {
      allProduct {
        edges {
          node {
            displayPrice
            id
            multiplePriceOptions
            name
            priceOptionArray {
              key
              price
            }
            productImage {
              childImageSharp {
                fluid(maxWidth: 800) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  `);
  const products = pageData.allProduct.edges as { node: Product }[];
  return (
    <>
      <div className="bg-primary-700 text-white">
        <LayoutContainer>
          <div className="h-48 text-center flex items-center justify-center">
            <h2 className="text-4xl leading-none">Shop for cool stuff</h2>
          </div>
        </LayoutContainer>
      </div>
      <section className="py-6">
        <LayoutContainer>
          <h5 className="text-3xl leading-none font-bold">Our Products</h5>
          <span className="block h-1 bg-primary-500 w-40 mt-3 mb-4" />
          <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map(({ node }, index) => {
              return (
                <div key={`product-${index}`}>
                  <ProductContainer {...node} key={`product-${index}`} addToCart={addToCart} />
                </div>
              );
            })}
          </div>
        </LayoutContainer>
      </section>
    </>
  );
};
const IndexPage: React.FC = () => {
  return (
    <Layout pageTitle="Home" pageDescription="Home Page" pageURL="/" addCartProps>
      <IndexPageWrapper />
    </Layout>
  )
}
export default IndexPage;
