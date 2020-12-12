import React from 'react';
import MuiSnackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';

const Snackbar = withStyles(() => ({
    root: {
        '& .MuiSnackbarContent-message': {
            lineHeight: 1
        }
    }
}))(MuiSnackbar);

interface LayoutSnackbarProps {
    snackbarMessage: string; 
    setSnackbarMessage: (message: string) => void; 
    setCartOpen: (open: boolean) => void;
}

const LayoutSnackbar: React.FC<LayoutSnackbarProps> = ({ snackbarMessage, setSnackbarMessage, setCartOpen }) => {
    const [open, setOpen] = React.useState(false);
    React.useEffect(() => {
        if (snackbarMessage) {
            setOpen(true);
        }
    }, [snackbarMessage]);
    function handleClose(event?: React.SyntheticEvent, reason?: string) {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
      };
    function handleOpenCart() {
        setCartOpen(true)
    }
    function handleExited() {
        setSnackbarMessage('');
    }
    if (typeof window === "undefined") {
        return null;
    }
    return (
        <Snackbar
            open={open}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            autoHideDuration={4000}
            onClose={handleClose}
            message={snackbarMessage}
            onExited={handleExited}
            action={(
                <button className="text-primary-200 mr-1" onClick={handleOpenCart}>
                    VIEW
                </button>
            )}
        />
    )
}

export default LayoutSnackbar;