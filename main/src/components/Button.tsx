import { Link } from 'gatsby';
import React from 'react';

interface ButtonProps {
    disabled?: boolean;
    variant: 'primaryContained' | 'whiteOutlined';
    linkTo?: string;
    additionalClasses?: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    size?: 'normal' | 'small';
}
const buttonStyles = {
    primaryContained: "border-transparent bg-primary-700 hover:bg-primary-900 focus:bg-primary-900 text-white",
    whiteOutlined: "border-gray-300 bg-white hover:bg-gray-100 focus:bg-gray-100 text-black"
}
const buttonSizes = {
    small: 'px-3 py-1',
    normal: 'px-5 py-2'
}
const baseClasses = 'cursor-pointer inline-flex items-center justify-center border text-base rounded-md transition-colors transition-duration-150';
const Button: React.FC<ButtonProps> = ({ children, linkTo, disabled, variant, additionalClasses='', onClick, type='button', size='normal' }) => {
    let className = `${baseClasses} ${buttonStyles[variant]} ${buttonSizes[size]} ${additionalClasses}`;
    if (disabled) {
        className += ' opacity-50 pointer-events-none';
    }
    if (linkTo) {
        return <Link to={linkTo} className={className}>{children}</Link>
    }
    return (
        <button className={className} disabled={Boolean(disabled)} onClick={onClick} type={type}>{children}</button>
    )
}

export default Button;