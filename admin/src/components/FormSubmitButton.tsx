import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    wrapper: {
        marginTop: theme.spacing(2.5)
    }
}))

const FormSubmitButton: React.FC<{ isSubmitting: boolean }> = ({ isSubmitting }) => {
    const classes = useStyles();
    return (
        <div className={classes.wrapper}>
            <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
                size="large"
                disabled={isSubmitting}
                endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
                {isSubmitting ? 'SUBMITTING' : 'SUBMIT'}
            </Button>
        </div>
    )
}

export default FormSubmitButton;