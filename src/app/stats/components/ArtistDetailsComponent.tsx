import React from 'react';
import { Artist } from '@/types';
import ListeningClockWrapperComponent from './ListeningClockWrapperComponent';
import { getListeningTimeByMonth, getDetailedData } from '@/util/analysisHelpers';
import DetailedInfoComponent from './DetailedInfoComponent';

interface ArtistDetailsComponentProps {
    fileContent: string;
    artist: Artist;
    startDate: string;
    endDate: string;
    firstDate: string;
    lastDate: string;
    onBack: () => void;
}

/**
 * This component displays details of a specific artist, including the listening clock
 */
const ArtistDetailsComponent: React.FC<ArtistDetailsComponentProps> = ({ fileContent, artist, startDate, endDate, firstDate, lastDate, onBack }) => {
    const { timeListened, timesStreamed, averageTimeListenedPerStream, averages } = getDetailedData(fileContent, { artist: artist.name, trackName: '' }, startDate, endDate);

    return (
        <div>
            <button onClick={onBack}>Back</button>
            <h1>{artist.name}</h1>

            <table>
                <tbody>
                    <DetailedInfoComponent timeListened={timeListened} timesStreamed={timesStreamed} averageTimeListenedPerStream={averageTimeListenedPerStream} averages={averages} />
                </tbody>
            </table>
            <ListeningClockWrapperComponent fileContent={fileContent} criteria={{ artist: artist.name, trackName: '' }} firstDate={firstDate} lastDate={lastDate} />
        </div>
    );
};

export default ArtistDetailsComponent;