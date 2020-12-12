import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
    defaultHeading: {
        padding: theme.spacing(2),
        position: 'relative',
        '& .close-btn': {
            position: 'absolute',
            top: 2,
            right: 2,
            padding: 4
        }
    },
    fullScreenHeading: {
        backgroundColor: theme.palette.primary.main,
        boxShadow: theme.shadows[2],
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: theme.palette.common.white,
        '& .close-btn': {
            position: 'relative',
            padding: theme.spacing(1),
            color: 'inherit'
        }
    }
}))

interface FormDialogContextProps {
    dialogOpen: boolean;
    editValues: any;
}

const FormDialogContext = React.createContext<[FormDialogContextProps, React.Dispatch<React.SetStateAction<FormDialogContextProps>>]>([{ dialogOpen: false, editValues: null }, () => {}]);

interface FormDialogProviderProps {
    formLabel: string;
    fullScreen?: boolean;
    FormComponent: JSX.Element;
    maxWidth?: false | "sm" | "xs" | "md" | "lg" | "xl";
    labelPrefix?: string;
}

const useFormDialog = () => {
    const [state, setState] = React.useContext(FormDialogContext);
    function openDialog(dialogOpen: boolean) {
        setState(current => ({ ...current, dialogOpen }));
    }
    function updateEditValues(editValues: any) {
        setState(current => ({ ...current, editValues }));
    }
    const editValues = state.editValues;
    return { openDialog, updateEditValues, editValues };
  };

const FormDialogProvider: React.FC<FormDialogProviderProps> = ({ fullScreen, formLabel, children, FormComponent, maxWidth='sm', labelPrefix }) => {
    const [state, setState] = React.useState<FormDialogContextProps>({ dialogOpen: false, editValues: null });
    const classes = useStyles();

    function handleClose() {
        setState(current => ({ ...current, dialogOpen: false }));
    }
    return (
        <FormDialogContext.Provider value={[state, setState]}>
            <>
                <Dialog open={state.dialogOpen} fullWidth maxWidth={maxWidth} fullScreen={Boolean(fullScreen)}>
                    <div className={fullScreen ? classes.fullScreenHeading : classes.defaultHeading}>
                        <Typography variant='h6'>{labelPrefix ? labelPrefix : (state.editValues ? 'Edit' : 'Add')} {formLabel}</Typography>
                        <IconButton className='close-btn' onClick={handleClose}>
                            <CloseIcon fontSize={fullScreen ? 'default' : 'small'} />
                        </IconButton>
                    </div>
                    {FormComponent}
                </Dialog>
                {children}
            </>
        </FormDialogContext.Provider>
    );
};

export { FormDialogProvider, useFormDialog };