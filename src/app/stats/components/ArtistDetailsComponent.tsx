import React from 'react';
import { Artist } from '@/types';
import ListeningClockComponent from './ListeningClockComponent';
import { getListeningTimeByMonth, getDetailedData } from '@/util/analysisHelpers';
import DetailedInfoComponent from './DetailedInfoComponent';

interface ArtistDetailsComponentProps {
    fileContent: string;
    artist: Artist;
    startDate: string;
    endDate: string;
    onBack: () => void;
}

/**
 * This component displays details of a specific artist, including the listening clock
 */
const ArtistDetailsComponent: React.FC<ArtistDetailsComponentProps> = ({ fileContent, artist, startDate, endDate, onBack }) => {
    const { timeListened, timesStreamed, averageTimeListenedPerStream, averages } = getDetailedData(fileContent, { artist: artist.name, trackName: '' }, startDate, endDate);

    const data = getListeningTimeByMonth(fileContent, { artist: artist.name, trackName: '' }, new Date().getFullYear().toString());
    return (
        <div>
            <button onClick={onBack}>Back</button>
            <h1>{artist.name}</h1>

            <table>
                <tbody>
                    <DetailedInfoComponent timeListened={timeListened} timesStreamed={timesStreamed} averageTimeListenedPerStream={averageTimeListenedPerStream} averages={averages} />
                </tbody>
            </table>
            <ListeningClockComponent data={data} year={new Date().getFullYear().toString()} />
        </div>
    );
};

export default ArtistDetailsComponent;