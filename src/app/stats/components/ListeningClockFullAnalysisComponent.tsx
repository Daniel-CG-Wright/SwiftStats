import React, { useState } from 'react';
import ListeningClockComponent from './ListeningClockComponent';
import { getMostListenedArtists } from '@/util/analysisHelpers';

interface ListeningClockFullAnalysisComponentProps {
    fileContent: string;
    firstDate: string;
    lastDate: string;
}

/**
 * This contains the listening clock component and an artist selection button conveyor belt
 * @param fileContent the JSON content of the file
 * @returns the listening clock component and an artist selection button conveyor belt
 */
const ListeningClockFullAnalysisComponent: React.FC<ListeningClockFullAnalysisComponentProps> = ({ fileContent, firstDate, lastDate }) => {
    const [selectedArtist, setSelectedArtist] = useState<string>('');
    // select the year, and use the current year as the default
    const [year, setYear] = useState<string>(new Date().getFullYear().toString());
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    // use a row of buttons to select the year, and a dropdown to select the artist

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
                <ListeningClockComponent fileContent={fileContent} selectedArtist={selectedArtist} startDate={startDate} endDate={endDate} />
            </div>
        </div>
    );
};

export default ListeningClockFullAnalysisComponent;