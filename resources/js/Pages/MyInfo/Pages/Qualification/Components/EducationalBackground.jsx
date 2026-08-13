import React from "react";
import Education from "../Pages/Education/Index";

const EducationalBackground = ({ auth, contactdetails }) => {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <Education auth={auth} contactdetails={contactdetails} />
        </div>
    );
};

export default EducationalBackground;
