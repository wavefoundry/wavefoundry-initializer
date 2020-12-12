import React from 'react';

const PrivateRoute: React.FC<{ component: React.FC; path: string; }> = ({ component: Component, ...rest }) => {
    if (typeof window !== "undefined") {
        return (
            <Component {...rest} />
        )
    }
    return null;
}

export default PrivateRoute;