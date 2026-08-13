const isLate = (timeIn, flexType, punchDate) => {
    if (!timeIn || !flexType) return false;

    const [hour, minute] = timeIn.split(":").map(Number);

    if (flexType === "FWA-A") {
        // Monday: fixed 08:00 AM
        if (punchDate) {
            const date = new Date(`${punchDate}T00:00:00`);

            // JavaScript: Sunday = 0, Monday = 1
            if (date.getDay() === 1) {
                return hour > 8 || (hour === 8 && minute > 0);
            }
        }

        // Tuesday - Thursday: 09:00 AM
        return hour > 9 || (hour === 9 && minute > 0);
    }

    if (flexType === "FWA-B") {
        // 08:00 AM
        return hour > 8 || (hour === 8 && minute > 0);
    }

    return false;
};

export default isLate;
