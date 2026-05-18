import React from "react";

const AcceptedBadge: React.FC = () => {
    return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-md bg-green-100 text-green-700 border border-green-300">
            <i className="fas fa-check"></i>
            Accepted
        </span>
    );
};

export default AcceptedBadge;