import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import LaunchIcon from '@material-ui/icons/Launch';
import RefundIcon from '@material-ui/icons/MoneyOff';
import Tooltip from '@material-ui/core/Tooltip';
import { FormDialogProvider, useFormDialog } from './FormDialog';
import VirtualizedTable from './VirtualizedTable';
import RefundOrderForm from './RefundOrderForm';
import OrderForm from './OrderForm';
import firebase from '../firebase';
import { orderColumns } from '../constants';
import { handleError } from '../utils';

const collectionName = "paidOrders";

interface PageComponentProps {
    setFormType: React.Dispatch<React.SetStateAction<"default" | "refund">>;
    loading: boolean; data: any[]; 
    handleRefresh: () => void;
}
const PageComponent: React.FC<PageComponentProps> = ({ loading, data, handleRefresh, setFormType }) => {
    const { openDialog, updateEditValues } = useFormDialog();
    return (
        <VirtualizedTable
            handleRefresh={handleRefresh}
            tableWidth={1100} 
            searchPlaceholder="Search by name or email" 
            loading={loading}
            data={data}
            columns={[
                ...orderColumns,
                {
                    dataKey: "id",
                    width: 50,
                    cellRenderer: ({ rowData }) => {
                        const handleClick = () => {
                            setFormType('default');
                            updateEditValues(rowData);
                            openDialog(true);
                        }
                        return (
                            <Tooltip title="Edit">
                                <span>
                                    <IconButton onClick={handleClick}>
                                        <LaunchIcon fontSize='small' color='secondary' />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        )
                    }
                },
                {
                    dataKey: "id",
                    width: 50,
                    cellRenderer: ({ rowData }) => {
                        const handleClick = () => {
                            setFormType('refund');
                            updateEditValues(rowData);
                            openDialog(true);
                        }
                        return (
                            <Tooltip title="Refund Order">
                                <span>
                                    <IconButton onClick={handleClick}>
                                        <RefundIcon fontSize='small' />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        )
                    }
                },
            ]}
        />
    )
}

const NewOrderPage: React.FC<{refreshOrderCount: () => void;}> = ({ refreshOrderCount }) => {
    const [formType, setFormType] = React.useState<'default' | 'refund'>('default');
    const [loading, setLoading] = React.useState(true);
    const [data, setData] = React.useState<any[]>([]);
    function handleRefresh() {
        setLoading(true);
        firebase.firestore().collection(collectionName).where('status', 'in', ['Unfulfilled', 'In Progress']).get()
        .then((docs) => {
            const newData: {[key: string]: string}[] = [];
            docs.forEach(doc => {
                const data = doc.data();
                newData.push({ 
                    ...data, 
                    id: doc.id,
                    totalItems: data.orderItems.length
                });
            })
            setData(newData);
            refreshOrderCount();
        })
        .catch(err => handleError(err))
        .finally(() => setLoading(false));
    }
    React.useEffect(() => {
        handleRefresh();
        // eslint-disable-next-line
    }, []);
    const FormComponent = formType === 'default' ? (
        <OrderForm handleSubmit={handleRefresh} />
    ) : (
        <RefundOrderForm handleSubmit={handleRefresh} />
    )
    return (
        <FormDialogProvider 
            formLabel='Order'
            maxWidth={formType === 'default' ? 'md' : 'sm'}
            FormComponent={FormComponent}
            labelPrefix={formType === 'default' ? undefined : 'Refund'}
        >
            <PageComponent 
                data={data} 
                loading={loading} 
                handleRefresh={handleRefresh}
                setFormType={setFormType}
            />
        </FormDialogProvider>
    )
}

export default NewOrderPage;