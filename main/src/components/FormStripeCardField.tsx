import React from 'react';
import TextField from '@material-ui/core/TextField';
import { CardElement } from '@stripe/react-stripe-js';

interface StripeInputProps {
    component: React.FC<any>;
    inputRef: React.Ref<any>;
}
const CARD_ELEMENT_OPTIONS = {
     hidePostalCode: true,
     style: {
       base: {
         color: '#32325d',
         fontFamily: 'sans-serif',
         fontSmoothing: 'antialiased',
         fontSize: "18px",
         '::placeholder': {
           color: '#aaaaaa'
         }
       },
       invalid: {
         color: '#f44336',
         iconColor: '#f44336'
       }
     }
   };
const StripeInput: React.FC<StripeInputProps> = ({ component: Component, inputRef, ...props }) => {
     const elementRef = React.useRef<any>();
     React.useImperativeHandle(inputRef, () => ({
          focus: () => elementRef.current.focus
     }));
     return (
          <Component
               onReady={(element: any) => (elementRef.current = element)}  
               options={CARD_ELEMENT_OPTIONS}
               {...props}
          />
     )
}

interface FormStripeCardFieldProps {
     setCardError: (error: string) => void;
     cardError: string; 
     hasError: boolean;
     handleBlur: () => void;
}
const FormStripeCardField: React.FC<FormStripeCardFieldProps> = ({ cardError, setCardError, hasError, handleBlur }) => {
     function handleChange(event: any) {
          setCardError(event.error && event.error.message ? event.error.message : '');
     }
    return (
        <TextField
            variant="outlined"
            label="Card details"
            fullWidth
            margin="normal"
            name="card"
            error={hasError}
            helperText={hasError ? cardError : ''}
            InputLabelProps={{ shrink: true }}
            InputProps={{
                inputComponent: StripeInput as any,
                inputProps: {
                     component: CardElement,
                     onChange: handleChange,
                     onBlur: handleBlur
                },
           }}
        />
    )
}

export default FormStripeCardField;

