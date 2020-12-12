import { HOST_URL, LINK_COLOR, TABLE_STYLE } from '../constants';
import { PaidOrder } from '../types';
import { convertCentsToCurrency } from '.';
import wrapEmailHTML from './wrapEmailHTML';

const smallParagraph = "margin: 0 0 4px 0";
const totalLabelCell = "padding: 8px 8px 0 8px";
const totalPriceCell = `width: 80px; ${totalLabelCell}`;

export default async (order: PaidOrder) => {
    const orderProducts = order.orderItems;
    let productRows = '';
    orderProducts.forEach(product => {
        productRows += `
            <tr style="border-bottom: 1px solid #dddddd">
                <td style="padding: 8px; width: 76px; vertical-align: top;">
                    <div style="width: 70px">
                        <img style="width: 100%; border-radius: 4px" src="${product.imageURL}" alt="${product.name}" />
                    </div>
                </td>
                <td style="padding: 8px 8px 8px 0; vertical-align: top;">
                    <p style="font-weight: bold; ${smallParagraph}">${product.name}</p>
                    <p style="${smallParagraph}">${product.priceOption}</p>
                    <p style="${smallParagraph}">Price: $${convertCentsToCurrency(product.price)}</p>
                    <p style="${smallParagraph}">Quantity: ${product.quantity}</p>
                </td>
            </tr>
        `
    })
    let customerRows = '';
    const customerDetails: { [key: string]: string }= { name: order.customerName, phone: order.phone, email: order.email };
    for (const prop in customerDetails) {
        customerRows += `
            <tr>
                <td style="width: 60px">
                    <p style="font-size: 16px; ${smallParagraph}; padding-left: 8px">${prop.slice(0,1).toUpperCase() + prop.slice(1).toLowerCase()}:</p>
                </td>
                <td>
                    <p style="font-size: 16px; ${smallParagraph}">${prop === "email" ? `<a style="color: ${LINK_COLOR}" href="mailto:${customerDetails.email}">${customerDetails.email}</a>` : `${customerDetails[prop]}`}</p>
                </td>
            </tr>
        `
    }
    const firstName = order.customerName.split(' ')[0].slice(0, 1).toUpperCase() + order.customerName.split(' ')[0].slice(1).toLowerCase();
    const emailBody = `
        <table style="${TABLE_STYLE}">
            <tbody>
                <tr>
                    <td>
                        <p style="font-size: 16px; margin-bottom: 8px; margin-top: 16px">Hi ${firstName},</p>
                        <p style="font-size: 16px; margin-bottom: 24px">We have successfully received your order!
                        Please bring cash or check to pay for your order once it's ready. If you have any questions in the meantime, please feel free to <a href="${HOST_URL}/contact/" style="color: ${LINK_COLOR}">contact us</a>.</p>
                    </td>
                </tr>
            </tbody>
        </table>
        <table style="${TABLE_STYLE}">
            <tbody>
                <tr style="background-color: #f1f1f1">
                    <td style="padding: 8px" colspan="2">
                        <h5 style="font-size: 18px; margin: 0">Customer Details</h5>
                    </td>
                </tr>
                ${customerRows}
            </tbody>
        </table>
        <table style="${TABLE_STYLE}">
            <tbody>
                <tr style="background-color: #f1f1f1">
                    <td style="padding: 8px" colspan="2">
                        <h5 style="font-size: 18px; margin: 0">Order Details</h5>
                    </td>
                </tr>
                ${productRows}
            </tbody>
        </table>
        <table style="${TABLE_STYLE}; text-align: right">
            <tbody>
                <tr>
                    <td style="font-weight: bold; font-size: 16px; ${totalLabelCell}">Order total:</td>
                    <td style="font-weight: bold; font-size: 16px; ${totalPriceCell}">$${convertCentsToCurrency(order.orderTotal)}</td>
                </tr>
            </tbody>
        </table>
    `;
    return wrapEmailHTML(emailBody, order.email);
}