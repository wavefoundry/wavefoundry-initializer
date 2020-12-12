import React from "react";
import { render } from "@testing-library/react";
import CheckoutPage from "../CheckoutPage";

describe("Test the CheckoutPage component", () => {
  test("It displays the correct title", () => {
    const { getByText } = render(<CheckoutPage />);
    expect(getByText("CHECKOUT")).toBeInTheDocument();
  });
});
