import React from "react";
import Work from "../Pages/Work/Index";

const WorkExperience = ({auth, contactdetails}) => {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <Work auth={auth} contactdetails={contactdetails} />
        </div>
    );
};

export default WorkExperience;
