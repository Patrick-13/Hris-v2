import React from "react";
import Training from "../Pages/Training/Index";

const TrainingSeminar = ({ auth, contactdetails }) => {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <Training auth={auth} contactdetails={contactdetails} />
        </div>
    );
};

export default TrainingSeminar;
