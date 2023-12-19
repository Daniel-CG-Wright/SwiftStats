import React, { useState } from 'react';
import ListeningClockComponent from './ListeningClockComponent';
import { getMostListenedArtists } from '@/util/analysisHelpers';
import { NumberByMonth } from '@/types';

interface ListeningClockFullAnalysisComponentProps {
    fileContent: string;
    firstDate: string;
    lastDate: string;
}

/**
 * This function gets the listening time for each month of the year for the selected artist
 * @param fileContent the JSON content of the file
 * @param selectedArtist the artist selected by the user. If empty, all artists are selected
 * @returns an array of objects with the month and the total listening time for that month {
 * month: string,
 * value: number}
 */
// ListeningClockComponent.tsx

const getListeningTimeByMonth = (fileContent: string, selectedArtist: string, startDate: string, endDate: string): NumberByMonth[] => {
    const data = JSON.parse(fileContent);

    const listeningTimeByMonth = new Map<string, number>();

    data.forEach((record: { artistName: string; endTime: string; msPlayed: number }) => {
        // Convert record's endTime to YYYY-MM-DD format
        const recordTime = record.endTime.split(' ')[0];

        // Only process records within the date range
        if (recordTime >= startDate && recordTime <= endDate) {
            const key = record.endTime.split('-')[1];
            if (
                (selectedArtist != '' && record.artistName === selectedArtist)
                || selectedArtist === ''
                ) {
                const currentListeningTime = listeningTimeByMonth.get(key) || 0;
                listeningTimeByMonth.set(key, currentListeningTime + record.msPlayed);
            }
        }
    });

    const listeningTimeByMonthArray = Array.from(listeningTimeByMonth).map(([key, value]) => ({
        month: key,
        value: Number((value / 60000).toFixed(1)),
    }));

    // for months with no listening time, add 0
    for (let i = 1; i <= 12; i++) {
        if (!listeningTimeByMonthArray.some((record: NumberByMonth) => record.month === i.toString())) {
            listeningTimeByMonthArray.push({ month: i.toString(), value: 0 });
        }
    }

    return listeningTimeByMonthArray.sort((a, b) => Number(a.month) - Number(b.month));
};


/**
 * This contains the listening clock component and an artist selection button conveyor belt, it is used
 * for the artist listening clocks only. The base listening clock component is used for the diagram and
 * can be used with any month-number data.
 * @param fileContent the JSON content of the file
 * @param firstDate the first date in the file
 * @param lastDate the last date in the file
 * @returns the listening clock component and an artist selection button conveyor belt
 */
const ListeningClockFullAnalysisComponent: React.FC<ListeningClockFullAnalysisComponentProps> = ({ fileContent, firstDate, lastDate }) => {
    const [selectedArtist, setSelectedArtist] = useState<string>('');
    // select the year, and use the current year as the default
    const [year, setYear] = useState<string>(new Date().getFullYear().toString());
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    // use a row of buttons to select the year, and a dropdown to select the artist

    // get the listening time by month for the selected artist
    const data = getListeningTimeByMonth(fileContent, selectedArtist, startDate, endDate);

    return (
        <div>
            <div className="py-2">
                <h1>Listening Clock</h1>
                <div className="py-2 flex-row" style={{ overflowX: 'auto' }}>
                    <div className="flex">
                        {
                            // create a button for each year within the firstDate and lastDate years
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
                <div>
                    <select
                        value={selectedArtist}
                        onChange={e => setSelectedArtist(e.target.value)}
                        className="bg-dark text-white"
                    >
                        <option value="">All artists</option>
                        {getMostListenedArtists(fileContent, startDate, endDate).map(artist => (
                            <option key={artist.name} value={artist.name}>{artist.name}</option>
                        ))}
                    </select>
                </div>
                <ListeningClockComponent data={data} year={year} />
            </div>
        </div>
    );
};

export default ListeningClockFullAnalysisComponent;