import React from 'react';
import { useNavigate } from 'react-router-dom';


const RegisterButton = ({ label = 'Go to Register', className = '', ...props }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/register');
    };

    return (
        <button type="button" onClick={handleClick} className={className} {...props}>
            {label}
        </button>
    );
};

export default RegisterButton;

