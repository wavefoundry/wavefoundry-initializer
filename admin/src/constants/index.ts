import moment from 'moment';
import { VirtualizedTableColumn } from '../components/VirtualizedTable';
import { convertCentsToCurrency } from '../utils';

export const PAID_ORDERS = "paidOrders";
export const PRODUCTS = "products";
export const COUPONS = "coupons";
export const PRICE_REG_EX = /^\$?([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(.[0-9][0-9])$/;
export const EMAIL_REG_EX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
export const orderColumns: VirtualizedTableColumn[] = [
    {
        dataKey: "name",
        width: 150,
        label: "Customer Name"
    },
    {
        dataKey: "email",
        width: 200,
        label: "Email"
    },
    {
        dataKey: "totalItems",
        width: 120,
        label: "Total Items",
        isNotString: true
    },
    {
        dataKey: "orderTotal",
        width: 120,
        label: "Order Total",
        cellRenderer: ({ cellData }) => '$' + convertCentsToCurrency(cellData),
        isNotString: true
    },
    {
        dataKey: "status",
        width: 130,
        label: "Order Status"
    },
    {
        dataKey: "createdAt",
        width: 140,
        label: "Date Ordered",
        cellRenderer: ({ cellData }) => moment(cellData).format('L'),
        isNotString: true
    },
]

export interface InputField {
    name: string;
    initialValue?: any;
    formatFunction?: (value: any) => any;
    imageField?: boolean;
    imageArray?: boolean;
  }
  
  export interface ImageInputValues {
    file: File | null;
    blob: string;
    imageURL: string;
  }