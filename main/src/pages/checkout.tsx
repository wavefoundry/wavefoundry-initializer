import React from 'react';
import { Router } from '@reach/router';
import CheckoutPage from '../components/CheckoutPage';
import PrivateRoute from '../components/PrivateRoute';
import OrderSuccessPage from '../components/OrderSuccessPage';
import { ORDER_SUCCESS_SUFFIX } from '../constants';

export default () => {
    return (
        <Router basepath="/checkout">
            <>
                <PrivateRoute component={OrderSuccessPage} path={`/${ORDER_SUCCESS_SUFFIX}`} />
                <PrivateRoute component={CheckoutPage} path="/" />
            </>
        </Router>
    )
}