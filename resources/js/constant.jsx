export const DEVICE_STATUS_CLASS_MAP = {
    available: "bg-emerald-500",
    assigned: "bg-blue-500 ",
    maintenance: "bg-amber-500",
    retired: "bg-red-500",
    unavailable: "bg-red-500",
    "partially assigned": "bg-orange-500",
};

export const DEVICE_STATUS_TEXT_MAP = {
    available: "available",
    assigned: "assigned",
    maintenance: "maintenance",
    retired: "retired",
    unavailable: "unavailable",
    "partially assigned": "partially assigned",
};

export const capitalizeWords = (str = "") =>
    str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

export function base64ToFile(base64, filename) {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);

    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
}

export const onlyMap = {
    pending: [
        "personneleaves",
        "queryParams",
        "totalCount",
        "currentPageCount",
        "currentPage",
    ],
    waiting: [
        "personneleavewaiting",
        "queryParams",
        "totalCountWaiting",
        "currentPageCountWaiting",
        "currentPageWaiting",
    ],
    approved: [
        "personneleaveapproved",
        "queryParams",
        "totalCountapproved",
        "currentPageCountapproved",
        "currentPageapproved",
    ],
    rejected: [
        "personneleaverejected",
        "queryParams",
        "totalCountrejected",
        "currentPageCountrejected",
        "currentPagerejected",
    ],
    cancelled: [
        "personneleavecancelled",
        "queryParams",
        "totalCountCancelled",
        "currentPageCountCancelled",
        "currentPageCancelled",
    ],
};

export const onlyMapTko = {
    pending: [
        "tkos",
        "queryParams",
        "totalCount",
        "currentPageCount",
        "currentPage",
    ],
    waiting: [
        "tkowaiting",
        "queryParams",
        "totalCountwaiting",
        "currentPageCountwaiting",
        "currentPagewaiting",
    ],
    approved: [
        "tkoapproved",
        "queryParams",
        "totalCountapproved",
        "currentPageCountapproved",
        "currentPageapproved",
    ],
    rejected: [
        "tkorejected",
        "queryParams",
        "totalCountCancelled",
        "currentPageCountCancelled",
        "currentPageCancelled",
    ],
};

export const onlyMapRaro = {
    pending: [
        "personnelovertimes",
        "queryParams",
        "totalCount",
        "currentPageCount",
        "currentPage",
    ],
    waiting: [
        "personnelovertimewaiting",
        "queryParams",
        "totalCountwaiting",
        "currentPageCountwaiting",
        "currentPagewaiting",
    ],
    approved: [
        "personnelovertimeapproved",
        "queryParams",
        "totalCountapproved",
        "currentPageCountapproved",
        "currentPageapproved",
    ],
    rejected: [
        "personnelovertimerejected",
        "queryParams",
        "totalCountrejected",
        "currentPageCountrejected",
        "currentPagerejected",
    ],
};

export const onlyMapAro = {
    pending: [
        "personnelaccomplishments",
        "queryParams",
        "totalCount",
        "currentPageCount",
        "currentPage",
    ],
    waiting: [
        "personnelaccomplishmentwaiting",
        "queryParams",
        "totalCountwaiting",
        "currentPageCountwaiting",
        "currentPagewaiting",
    ],
    approved: [
        "personnelaccomplishmentapproved",
        "queryParams",
        "totalCountapproved",
        "currentPageCountapproved",
        "currentPageapproved",
    ],
    resubmitted: [
        "personnelaccomplishmentresubmitted",
        "queryParams",
        "totalCountresubmitted",
        "currentPageCountresubmitted",
        "currentPageresubmitted",
    ],
};

export const tabs = [
    {
        key: "pending",
        label: "Pending",
        badgeColor: "bg-red-500",
    },
    {
        key: "waiting",
        label: "Waiting",
    },
    {
        key: "approved",
        label: "Approved",
    },
    {
        key: "cancelled",
        label: "Cancelled",
    },
    {
        key: "rejected",
        label: "Rejected",
    },
];
