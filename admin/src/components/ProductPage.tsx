import React from "react";
import moment from "moment";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import ProductForm from "./ProductForm";
import VirtualizedTable from "./VirtualizedTable";
import { FormDialogProvider, useFormDialog } from "./FormDialog";
import TableThumbnailImage from "./TableThumbnailImage";
import firebase from "../firebase";
import { handleError, convertCentsToCurrency } from "../utils";
import { PRODUCTS } from "../constants";

const collectionName = PRODUCTS;

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
        ADD PRODUCT
      </Button>
    </div>
  );
  return (
    <VirtualizedTable
      filters={[
        {
          label: "Archived",
          dataKey: "archived",
          options: [
            { value: true, label: "Yes" },
            { value: false, label: "No" },
          ],
        },
      ]}
      handleRefresh={handleRefresh}
      tableWidth={1000}
      searchPlaceholder="Search by product name"
      loading={loading}
      data={data}
      columns={[
        {
          dataKey: "image",
          width: 56,
          label: "",
          cellRenderer: ({ cellData }) => (
            <TableThumbnailImage src={cellData.imageURL} />
          ),
        },
        {
          dataKey: "name",
          width: 200,
          label: "Name",
        },
        {
          dataKey: "description",
          width: 250,
          label: "Description",
        },
        {
          dataKey: "displayPrice",
          width: 150,
          label: "Price",
          cellRenderer: ({ cellData }) =>
            "$" + convertCentsToCurrency(cellData),
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
          dataKey: "archived",
          width: 150,
          label: "Archived?",
          cellRenderer: ({ cellData }) => (cellData ? "Yes" : "No"),
          isNotString: true,
        },
        {
          dataKey: "id",
          width: 50,
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

const ProductPage: React.FC = () => {
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
      formLabel="Product"
      FormComponent={<ProductForm handleSubmit={handleRefresh} />}
      fullScreen
    >
      <PageComponent
        data={data}
        loading={loading}
        handleRefresh={handleRefresh}
      />
    </FormDialogProvider>
  );
};

export default ProductPage;
