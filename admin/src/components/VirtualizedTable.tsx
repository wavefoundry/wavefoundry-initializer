import React from "react";
import { debounce } from "lodash";
import { Table, Column, ColumnProps } from "react-virtualized";
import { makeStyles } from "@material-ui/core/styles";
import DownIcon from "@material-ui/icons/ArrowDownward";
import UpIcon from "@material-ui/icons/ArrowUpward";
import FilterIcon from "@material-ui/icons/FilterList";
import Searchbar from "./Searchbar";
import LoadingIcon from "./LoadingIcon";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/HighlightOff";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import "react-virtualized/styles.css";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    "& .ReactVirtualized__Table__headerRow": {
      backgroundColor: theme.palette.grey[100],
      borderTop: `1px solid ${theme.palette.grey[300]}`,
      borderBottom: `1px solid ${theme.palette.grey[300]}`,
    },
  },
  container: {
    margin: `${theme.spacing(4)}px auto ${theme.spacing(2)}px auto`,
    borderRadius: 4,
    overflow: "hidden",
    boxShadow: theme.shadows[3],
    background: "white",
  },
  headerButton: {
    background: "none",
    border: "none",
    color: theme.palette.common.black,
    cursor: "pointer",
    outline: "none",
    padding: 0,
    display: "flex",
    alignItems: "center",
    fontWeight: "bold",
    "& > span:first-child": {
      paddingRight: 4,
    },
  },
  noData: {
    padding: theme.spacing(5),
    borderTop: `1px solid ${theme.palette.grey[300]}`,
  },
  infobarContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: theme.palette.grey[100],
    padding: `4px ${theme.spacing(1)}px`,
    borderTop: `1px solid ${theme.palette.grey[300]}`,
  },
  filtersContainer: {
    display: "flex",
    alignItems: "center",
    "& > div": {
      marginRight: theme.spacing(2),
    },
    "& svg": {
      verticalAlign: "middle",
    },
  },
  clearIconButton: {
    padding: 0,
  },
}));

interface Filter {
  dataKey: string;
  label: string;
  options: { value: any; label: string }[];
}
export interface VirtualizedTableColumn extends ColumnProps {
  isNotString?: boolean;
}
interface VirtualizedTableProps {
  tableWidth: number;
  searchPlaceholder: string;
  loading: boolean;
  data: any[];
  columns: VirtualizedTableColumn[];
  handleRefresh: () => void;
  SearchbarButtons?: JSX.Element;
  filters?: Filter[];
}

const getSortFunction = (
  dataKey: string,
  returnVal: -1 | 1,
  isNotString?: boolean
) => {
  if (isNotString) {
    return (a: any, b: any) => {
      if (a[dataKey] > b[dataKey]) {
        return 1 * returnVal;
      }
      return -1 * returnVal;
    };
  }
  return (a: any, b: any) => {
    if (a[dataKey].toLowerCase() > b[dataKey].toLowerCase()) {
      return 1 * returnVal;
    }
    return -1 * returnVal;
  };
};

const VirtualizedTable: React.FC<VirtualizedTableProps> = ({
  tableWidth,
  searchPlaceholder,
  loading,
  data,
  columns,
  handleRefresh,
  SearchbarButtons,
  filters,
}) => {
  const initFilterValues = filters
    ? filters.map(({ dataKey }) => ({ dataKey, value: "" }))
    : [];
  const [filterValues, setFilterValues] = React.useState<
    Array<{ dataKey: string; value: string }>
  >(initFilterValues);
  const [searchValue, setSearchValue] = React.useState("");
  const [sortColumnIsNotString, setSortColumnIsNotString] = React.useState(
    false
  );
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDesc, setSortDesc] = React.useState(true);
  const [tableHeight, setTableHeight] = React.useState(500);
  React.useEffect(() => {
    setTableHeight(window.innerHeight - 230);
    const handleResize = debounce(() => {
      setTableHeight(window.innerHeight - 230);
    }, 300);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  function handleClick(dataKey: string, isNotString?: boolean) {
    setSortColumnIsNotString(Boolean(isNotString));
    if (sortColumn === dataKey) {
      setSortDesc((val) => !val);
    } else {
      setSortColumn(dataKey);
      setSortDesc(true);
    }
  }
  function getSortedData(inputData: any[]) {
    if (sortColumn) {
      return inputData.sort(
        getSortFunction(sortColumn, sortDesc ? 1 : -1, sortColumnIsNotString)
      );
    }
    return inputData;
  }
  function getCategoryFilterData(inputData: any[]) {
    if (filters) {
      for (const filter of filterValues) {
        if (filter.value) {
          inputData = inputData.filter(
            (item) => `${item[filter.dataKey]}` === filter.value
          );
        }
      }
      return getSearchFilterData(inputData);
    }
    return getSearchFilterData(inputData);
  }
  function getSearchFilterData(inputData: any[]) {
    if (searchValue) {
      const regExp = new RegExp(
        searchValue.replace(/[|&;$%@"<>()+,\\]/g, ""),
        "i"
      );
      return getSortedData(
        inputData
          .map((item) => {
            return {
              ...item,
              searchString: Object.keys(item).reduce((a, b) => {
                if (typeof item[b] === "string") {
                  a += item[b];
                }
                return a;
              }, ""),
            };
          })
          .filter(({ searchString }) => regExp.test(searchString))
      );
    }
    return getSortedData(inputData);
  }
  const filteredData = getCategoryFilterData(data);
  const classes = useStyles();
  function clearFilters() {
    setFilterValues(initFilterValues);
  }
  function renderIcon() {
    let filtersActive = false;
    if (filters) {
      for (const filter of filterValues) {
        if (filter.value) {
          filtersActive = true;
          break;
        }
      }
    }
    if (filtersActive) {
      return (
        <Tooltip title="Clear filters">
          <IconButton
            onClick={clearFilters}
            className={classes.clearIconButton}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      );
    }
    return <FilterIcon fontSize="small" />;
  }
  function renderContent() {
    if (loading) {
      return <LoadingIcon />;
    }
    return (
      <div style={{ width: tableWidth }} className={classes.container}>
        <Searchbar
          searchPlaceholder={searchPlaceholder}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          SearchbarButtons={SearchbarButtons}
          handleRefresh={handleRefresh}
        />
        <div className={classes.infobarContainer}>
          {filters ? (
            <div className={classes.filtersContainer}>
              <div>{renderIcon()}</div>
              {filters.map(({ label, options, dataKey }, index) => {
                function handleChange(
                  event: React.ChangeEvent<HTMLSelectElement>
                ) {
                  const values = [...filterValues];
                  values[index] = { dataKey, value: event.target.value };
                  setFilterValues(values);
                }
                return (
                  <div key={`filter-${index}`}>
                    <label>{label}: </label>
                    <select
                      onChange={handleChange}
                      value={filterValues[index].value}
                    >
                      <option value=""></option>
                      {options.map(({ value, label }) => {
                        return (
                          <option key={label} value={value}>
                            {label}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                );
              })}
            </div>
          ) : (
            <div />
          )}
          <div>
            <Typography variant="caption" color="textSecondary">
              Showing {filteredData.length} of {data.length} item
              {data.length === 1 ? "" : "s"}
            </Typography>
          </div>
        </div>
        <div className={classes.tableContainer}>
          {data.length > 0 ? (
            <Table
              width={tableWidth}
              height={tableHeight}
              headerHeight={24}
              rowHeight={42}
              rowCount={filteredData.length}
              rowGetter={({ index }) => filteredData[index]}
            >
              {columns.map((column, index) => {
                const { label, ...columnProps } = column;
                return (
                  <Column
                    key={`column-${index}`}
                    {...columnProps}
                    headerRenderer={() => {
                      if (!label) {
                        return null;
                      }
                      return (
                        <button
                          className={classes.headerButton}
                          onClick={() =>
                            handleClick(column.dataKey, column.isNotString)
                          }
                        >
                          <span>{label}</span>
                          {sortColumn === column.dataKey && (
                            <span>
                              {sortDesc ? (
                                <DownIcon fontSize="small" />
                              ) : (
                                <UpIcon fontSize="small" />
                              )}
                            </span>
                          )}
                        </button>
                      );
                    }}
                  />
                );
              })}
            </Table>
          ) : (
            <div className={classes.noData}>
              <Typography align="center" color="textSecondary" variant="body2">
                No data to display
              </Typography>
            </div>
          )}
        </div>
      </div>
    );
  }
  return <div>{renderContent()}</div>;
};

export default VirtualizedTable;
