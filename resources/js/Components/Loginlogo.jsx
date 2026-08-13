import logo from "../../../public/login_logo.png";

export default function Loginlogo({ className = "" }) {
    return (
        <img
            src={logo}
            className={`object-contain ${className}`}
            alt="Login Logo"
        />
    );
}
