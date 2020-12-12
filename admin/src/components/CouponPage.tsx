import React from "react";
import moment from "moment";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import VirtualizedTable from "./VirtualizedTable";
import { FormDialogProvider, useFormDialog } from "./FormDialog";
import firebase from "../firebase";
import { handleError, convertCentsToCurrency } from "../utils";
import { COUPONS } from "../constants";
import CouponForm from "./CouponForm";

const collectionName = COUPONS;

const PageComponent: React.FC<{
  loading: boolean;
  data: any[];
  handleRefresh: () => void;
}> = ({ loading, data, handleRefresh }) => {
  const { openDialog, updateEditValues } = useFormDialog();
  function addClick() {
    updateEditValues(null);
    openDialog(true);
  }
  const SearchbarButtons = (
    <div>
      <Button
        style={{ width: 140 }}
        variant="contained"
        color="primary"
        onClick={addClick}
      >
        ADD COUPON
      </Button>
    </div>
  );
  return (
    <VirtualizedTable
      filters={[
        {
          label: "Enabled",
          dataKey: "enabled",
          options: [
            { value: true, label: "Yes" },
            { value: false, label: "No" },
          ],
        },
        {
          label: "Type",
          dataKey: "type",
          options: [
            { value: "Dollar Amount", label: "Dollar Amount" },
            { value: "Percentage", label: "Percentage" },
          ],
        },
      ]}
      handleRefresh={handleRefresh}
      tableWidth={1000}
      searchPlaceholder="Search by coupon code"
      loading={loading}
      data={data}
      columns={[
        {
          dataKey: "code",
          width: 200,
          label: "Code",
        },
        {
          dataKey: "type",
          width: 250,
          label: "Coupon Type",
        },
        {
          dataKey: "amount",
          width: 150,
          label: "Amount",
          cellRenderer: ({ rowData, cellData }) =>
            rowData.type === "Dollar Amount"
              ? "$" + convertCentsToCurrency(cellData)
              : `${cellData}%`,
          isNotString: true,
        },
        {
          dataKey: "createdAt",
          width: 250,
          label: "Date Added",
          cellRenderer: ({ cellData }) =>
            moment(cellData).format("MMM Do, YYYY"),
          isNotString: true,
        },
        {
          dataKey: "enabled",
          width: 150,
          label: "Enabled?",
          cellRenderer: ({ cellData }) => (cellData ? "Yes" : "No"),
          isNotString: true,
        },
        {
          dataKey: "redemptions",
          width: 150,
          label: "Redeptions",
          isNotString: true,
        },
        {
          dataKey: "id",
          width: 60,
          cellRenderer: ({ rowData }) => {
            const handleClick = () => {
              updateEditValues(rowData);
              openDialog(true);
            };
            return (
              <Tooltip title="Edit">
                <span>
                  <IconButton onClick={handleClick}>
                    <EditIcon fontSize="small" color="secondary" />
                  </IconButton>
                </span>
              </Tooltip>
            );
          },
        },
      ]}
      SearchbarButtons={SearchbarButtons}
    />
  );
};

const CouponPage: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<any[]>([]);
  function handleRefresh() {
    setLoading(true);
    firebase
      .firestore()
      .collection(collectionName)
      .get()
      .then((docs) => {
        const newData: { [key: string]: string }[] = [];
        docs.forEach((doc) => {
          const data = doc.data();
          newData.push({ ...data, id: doc.id });
        });
        setData(newData);
      })
      .catch((err) => handleError(err))
      .finally(() => setLoading(false));
  }
  React.useEffect(() => {
    handleRefresh();
  }, []);
  return (
    <FormDialogProvider
      formLabel="Coupon"
      FormComponent={<CouponForm handleSubmit={handleRefresh} />}
      maxWidth='sm'
    >
      <PageComponent
        data={data}
        loading={loading}
        handleRefresh={handleRefresh}
      />
    </FormDialogProvider>
  );
};

export default CouponPage;
