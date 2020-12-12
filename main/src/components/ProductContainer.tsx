import React from "react";
import GatsbyImage from "gatsby-image";
import { CartItem, Product } from "../types";
import Button from "./Button";
import { convertCentsToCurrency } from "../utils";
import { PRODUCT_IMAGE_ASPECT_RATIO } from "../constants";

interface ProductContainerProps extends Product {
  addToCart: (cartItem: CartItem) => void;
}
const ProductContainer: React.FC<ProductContainerProps> = ({
  name,
  productImage,
  displayPrice,
  id,
  multiplePriceOptions,
  priceOptionArray,
  addToCart,
}) => {
  const defaultPriceOption = priceOptionArray[0];
  const handleClick = () => {
    const cartItem: CartItem = {
      name,
      productId: id,
      multiplePriceOptions,
      productImage,
      price: defaultPriceOption.price,
      priceOption: defaultPriceOption.key,
      quantity: 1,
    };
    addToCart(cartItem);
  };
  return (
    <div className="shadow-md w-full flex flex-col bg-white rounded overflow-hidden justify-between h-full">
      <div>
        <div className="w-full">
          <GatsbyImage
            fluid={{ ...productImage.childImageSharp.fluid, aspectRatio: PRODUCT_IMAGE_ASPECT_RATIO }}
          />
        </div>
        <div className="py-1 px-2">
          <h6 className="font-bold">{name}</h6>
        </div>
      </div>
      <div className="p-2">
        <h5 className="font-bold text-xl mb-1">
          ${convertCentsToCurrency(displayPrice)}
        </h5>
        <Button
          variant="primaryContained"
          size="small"
          additionalClasses="w-full"
          onClick={handleClick}
        >
          ADD TO CART
        </Button>
      </div>
    </div>
  );
};

export default ProductContainer;
