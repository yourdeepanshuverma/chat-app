import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

const Protect = ({ children, authentication = true, }) => {
    const authStatus = useSelector(({ auth }) => auth.status);
    const navigate = useNavigate()

    useEffect(() => {
        if (authentication && authStatus !== authentication) {
            navigate("/login")
        } else if (!authentication && authStatus !== authentication) {
            navigate("/")
        }
    }, [authStatus, authentication, Navigate]);

    return children ? children : <Outlet />
}

export default Protect