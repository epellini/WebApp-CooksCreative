import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/AuthProvider';

import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
    const { session } = useAuth();
    const location = useLocation();

    if (!session) {
        return <Navigate to="/login" state={{from: location}} replace />;
    } else {
        return children;
    }
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default ProtectedRoute;
