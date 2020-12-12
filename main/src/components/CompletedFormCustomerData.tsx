import React from "react";
import { CheckoutFormData } from "../types";
import { formatPhone } from "../utils";

const CompletedFormCustomerData: React.FC<CheckoutFormData> = ({
  customerData,
}) => {
  if (!customerData) {
    return null;
  }
  const rows = [
    {
      label: "Name",
      value: customerData.name,
    },
    {
      label: "Email",
      value: customerData.email,
    },
    {
      label: "Phone",
      value: formatPhone(customerData.phone),
    },
  ];
  return (
    <div>
      <table className="table-auto leading-none text-sm">
        <tbody>
          {rows.map(({ label, value }) => {
            return (
              <tr key={label}>
                <td className="pr-1 py-1">{label}:</td>
                <td>{value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CompletedFormCustomerData;
