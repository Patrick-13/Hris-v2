import logo from "../../../public/denr_logo.png";

export default function ApplicationLogo({ className = "" }) {
    return (
        <img
            src={logo}
            className={`object-contain ${className}`}
            alt="DENR Logo"
        />
    );
}
