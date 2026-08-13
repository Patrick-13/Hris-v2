import React from "react";
import Eligibility from "../Pages/Licenses/Index";

const EligibilityLicenses = ({ auth, contactdetails }) => {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <Eligibility auth={auth} contactdetails={contactdetails} />
        </div>
    );
};

export default EligibilityLicenses;
