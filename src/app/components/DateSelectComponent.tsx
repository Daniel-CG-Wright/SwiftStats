// src/app/components/DateSelectComponent.tsx

import React, { useEffect } from 'react';

interface DateSelectComponentProps {
    startDate: string;
    setStartDate: (startDate: string) => void;
    endDate: string;
    setEndDate: (endDate: string) => void;
    firstDate: string;
    lastDate: string;
}

const DateSelectComponent: React.FC<DateSelectComponentProps> = ({ 
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    firstDate,
    lastDate
}) => {

    // Set default values for startDate and endDate
    useEffect(() => {
        if (!startDate) {
            setStartDate(firstDate);
        }
        if (!endDate) {
            setEndDate(lastDate);
        }
    }, [startDate, endDate, setStartDate, setEndDate, firstDate, lastDate]);

    // handles the button input that will clear the date selection
    const handleClearDates = () => {
        setStartDate(firstDate);
        setEndDate(lastDate);
    };

    // Check if max date range is selected
    const isMaxDateRangeSelected = startDate === firstDate && endDate === lastDate;

    return (
        <div className="date-picker-container">
            <span className="date-picker-label px-2">Results from:</span>
            <input type="date" className="date-picker" value={startDate} onChange={e => setStartDate(e.target.value)} min={firstDate} max={lastDate} />
            <span className="date-picker-separator px-2">to</span>
            <input type="date" className="date-picker" value={endDate} onChange={e => setEndDate(e.target.value)} min={firstDate} max={lastDate} />
            <span className="px-4"></span>
            {
                isMaxDateRangeSelected ? 
                (<label>Max date range selected</label>)
                :
                (<button className="" onClick={handleClearDates}>Clear Dates</button>)
            }
        </div>
    );
};

export default DateSelectComponent;