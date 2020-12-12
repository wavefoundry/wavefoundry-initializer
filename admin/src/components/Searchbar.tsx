import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Chip from "@material-ui/core/Chip";
import SearchIcon from "@material-ui/icons/Search";
import RefreshIcon from "@material-ui/icons/Refresh";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

interface SearchbarProps {
  searchPlaceholder: string;
  searchValue: string;
  setSearchValue: (value: string) => void;
  handleRefresh: () => void;
  SearchbarButtons?: JSX.Element;
}

const useStyles = makeStyles((theme) => ({
  icon: {
    flex: "0 0 50px",
    display: "flex",
  },
  inputContainer: {
    flex: "1 1 0",
  },
  input: {
    font: "inherit",
    fontSize: 16,
    border: "none",
    outline: "none",
    padding: "12px 0",
  },
  buttonsContainer: {
    display: "flex",
    flex: "0 0 100px",
    justifyContent: "flex-end",
    alignItems: "center",
    "& > div": {
      marginRight: theme.spacing(2),
    },
    "& > .refresh-container": {
      marginRight: -theme.spacing(1),
    },
  },
  inputWrapper: {
    background: theme.palette.common.white,
    willChange: "box-shadow",
    transition: "box-shadow .25s",
    position: "relative",
    "&.focused": {
      boxShadow: theme.shadows[4],
    },
  },
}));

const Searchbar: React.FC<SearchbarProps> = ({
  searchPlaceholder,
  searchValue,
  setSearchValue,
  handleRefresh,
  SearchbarButtons = null,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [focused, setFocused] = React.useState(false);
  const classes = useStyles();
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.target.value);
  }
  function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setFocused(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  }
  function handleFocus() {
    setFocused(true);
  }
  function handleBlur() {
    setFocused(false);
  }
  function handleDelete() {
    if (inputRef.current) {
      inputRef.current.focus();
      setFocused(true);
      setSearchValue("");
    }
  }
  function handleClick() {
    if (inputRef.current) {
      inputRef.current.focus();
      setFocused(true);
    }
  }
  const showChip = !focused && searchValue;
  return (
    <form onSubmit={handleSubmit}>
      <div className={`${classes.inputWrapper}${focused ? " focused" : ""}`}>
        <Toolbar>
          <div className={classes.icon}>
            <SearchIcon
              fontSize="large"
              color={focused ? "primary" : "inherit"}
            />
          </div>
          <div className={classes.inputContainer}>
            {showChip && (
              <Chip
                label={searchValue}
                onDelete={handleDelete}
                color="primary"
                variant="outlined"
                onClick={handleClick}
              />
            )}
            <input
              name="search"
              placeholder={searchPlaceholder}
              className={classes.input}
              autoComplete="off"
              autoCorrect="off"
              value={searchValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              ref={inputRef}
              style={{ width: showChip ? 0 : "100%" }}
            />
          </div>
          {!focused && (
            <div className={classes.buttonsContainer}>
              <>
                {SearchbarButtons}
                <div className="refresh-container">
                  <Tooltip title="Refresh">
                    <IconButton onClick={handleRefresh}>
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </>
            </div>
          )}
        </Toolbar>
      </div>
    </form>
  );
};

export default Searchbar;
