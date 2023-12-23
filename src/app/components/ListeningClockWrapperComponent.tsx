import React, { useState } from 'react';
import { getListeningTimeByMonth } from '@/util/analysisHelpers';
import { QuantityCriteria } from '@/types';
import ListeningClockComponent from './ListeningClockComponent';

interface ListeningClockWrapperComponentProps {
    fileContent: string;
    criteria: QuantityCriteria;
    firstDate: string;
    lastDate: string;
}
/**
 * This component displays the listening clock along with the year selector.
 */
const ListeningClockWrapperComponent: React.FC<ListeningClockWrapperComponentProps> = ({ fileContent, criteria, firstDate, lastDate }) => {
    const [year, setYear] = useState<string>(new Date().getFullYear().toString());
    const data = getListeningTimeByMonth(fileContent, criteria, year);

    return (
        <div>
            <h2 className="py-2">Stream Time Clock</h2>
            <div className="py-2 flex-row" style={{ overflowX: 'auto' }}>
                <div className="flex">
                    {
                        // create a button for each year
                        Array.from({ length: Number(lastDate.split('-')[0]) - Number(firstDate.split('-')[0]) + 1 }, (_, i) => i + Number(firstDate.split('-')[0])).map(year => (
                            <button
                                key={year}
                                onClick={() => setYear(year.toString())}
                                className={year === Number(year) ? '' : 'option-button'}
                                style={{ marginRight: '8px' }}
                            >
                                {year}
                            </button>
                        ))
                    }
                </div>
            </div>
            <ListeningClockComponent data={data} year={year} />
        </div>
    );
}

export default ListeningClockWrapperComponent;