
export const formatTo12Hour = (time24) => {
    if (!time24) return null;

    try {
        const [hours, minutes] = time24.split(':').map(Number);


        const period = hours >= 12 ? 'PM' : 'AM';


        const hours12 = hours % 12 || 12;


        const formattedMinutes = minutes.toString().padStart(2, '0');

        return `${hours12}:${formattedMinutes} ${period}`;
    } catch (error) {
        return time24;
    }
};
