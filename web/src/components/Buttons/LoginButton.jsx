import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginButton = ({ label = 'Go to Login', className = '', ...props }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/login');
    };

    return (
        <button type="button" onClick={handleClick} className={className} {...props}>
            {label}
        </button>
    );
};

export default LoginButton;