import React, { useState } from 'react';
import { getListeningTimeByMonth } from '@/util/analysisHelpers';
import { QuantityCriteria, FileData, Site } from '@/types';
import ListeningClockComponent from './ListeningClockComponent';

interface ListeningClockWrapperComponentProps {
    fileData: FileData;
    criteria: QuantityCriteria;
}
/**
 * This component displays the listening clock along with the year selector.
 */
const ListeningClockWrapperComponent: React.FC<ListeningClockWrapperComponentProps> = ({ fileData, criteria }) => {
    const [selectedYear, setYear] = useState<string>(new Date().getFullYear().toString());
    const data = getListeningTimeByMonth(fileData, criteria, selectedYear);

    return (
        <div>
            <h2 className="py-2">Stream Time Clock</h2>
            <div className="py-2 flex-row" style={{ overflowX: 'auto' }}>
                <div className="flex">
                    {
                        // create a button for each year with data
                        Array.from({ length: Number(fileData.lastDate.split('-')[0]) - Number(fileData.firstDate.split('-')[0]) + 1 }, (_, i) => i + Number(fileData.firstDate.split('-')[0]))
                            .filter(year => {
                                const dataForYear = getListeningTimeByMonth(fileData, criteria, year.toString());
                                return dataForYear.some(monthData => (fileData.site === Site.YOUTUBE || monthData.minutesListened !== 0) && monthData.timesStreamed !== 0);
                            })
                            .map(year => (
                                <button
                                    key={year}
                                    onClick={() => setYear(year.toString())}
                                    className={year === Number(selectedYear) ? '' : 'option-button'}
                                    style={{ marginRight: '8px' }}
                                >
                                    {year}
                                </button>
                            ))
                    }
                </div>
            </div>
            {
                    fileData.site !== Site.YOUTUBE && <ListeningClockComponent
                    data={data.map(monthData => ({ month: monthData.month, value: monthData.minutesListened }))}
                    year={selectedYear}
                />
            }
            <ListeningClockComponent
                data={data.map(monthData => ({ month: monthData.month, value: monthData.timesStreamed }))}
                year={selectedYear}
            />
        </div>
    );
}

export default ListeningClockWrapperComponent;