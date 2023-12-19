import React, { useState } from 'react';
import ListeningClockComponent from './ListeningClockComponent';
import { getMostListenedArtists } from '@/util/analysisHelpers';

interface ListeningClockFullAnalysisComponentProps {
    fileContent: string;
    startDate: string;
    endDate: string;
}

/**
 * This contains the listening clock component and an artist selection button conveyor belt
 * @param fileContent the JSON content of the file
 * @returns the listening clock component and an artist selection button conveyor belt
 */
const ListeningClockFullAnalysisComponent: React.FC<ListeningClockFullAnalysisComponentProps> = ({ fileContent, startDate, endDate }) => {
    const [selectedArtist, setSelectedArtist] = useState<string>('');

    return (
        <div>
            <div className="py-2">
                <h1>Listening Clock</h1>
                <div className="py-2 flex-row" style={{ overflowX: 'auto' }}>
                    <div className="flex">
                        {getMostListenedArtists(fileContent, startDate, endDate).map((artist, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedArtist(artist.name)}
                                className={artist.name === selectedArtist ? '' : 'option-button'}
                                style={{ marginRight: '8px' }}
                            >
                                {artist.name}
                            </button>
                        ))}
                    </div>
                </div>
                <ListeningClockComponent fileContent={fileContent} selectedArtist={selectedArtist} startDate={startDate} endDate={endDate} />
            </div>
        </div>
    );
};

export default ListeningClockFullAnalysisComponent;