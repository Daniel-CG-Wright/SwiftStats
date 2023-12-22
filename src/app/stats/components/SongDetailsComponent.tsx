import React from 'react';
import { Song } from '@/types';
import ListeningClockWrapperComponent from './ListeningClockWrapperComponent';
import { getDetailedData } from '@/util/analysisHelpers';
import DetailedInfoComponent from './DetailedInfoComponent';

interface SongDetailsComponentProps {
    fileContent: string;
    song: Song;
    startDate: string;
    endDate: string;
    firstDate: string;
    lastDate: string;
    songPosition: number;
    artistPosition: number;
    onBack: () => void;
}



/**
 * This component displays details of a specific song, including the listening clock
 */
const SongDetailsComponent: React.FC<SongDetailsComponentProps> = ({ fileContent, song, startDate, endDate, firstDate, lastDate, songPosition, artistPosition, onBack }) => {
    // Render song details and listening clock, listening clock will just use this year for now
    // We want to display the song name, artist, time listened, times streamed, average time listened per stream
    // in the same format as the profile stats page.
    // TODO have an arrow left for the back button

    const { timeListened, timesStreamed, averageTimeListenedPerStream, averages } = getDetailedData(fileContent, { trackName: song.name, artist: song.artist }, startDate, endDate);

    return (
        <div>
            <button onClick={onBack} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }} className="py-6 px-2">
                <img src="/backarrow.png" alt="Back" className='back-arrow'/>
            </button>
            <div>
                <h1>{song.name}</h1><span className="text-gray-400">#{songPosition}</span>
                <h2 className="pb-5">{song.artist}</h2><span className="text-gray-400">#{artistPosition}</span>
                
                <table className="py-4 px-4">
                    <tbody>
                        <DetailedInfoComponent timeListened={timeListened} timesStreamed={timesStreamed} averageTimeListenedPerStream={averageTimeListenedPerStream} averages={averages} />
                    </tbody>
                </table>
                <ListeningClockWrapperComponent fileContent={fileContent} criteria={{ artist: song.artist, trackName: song.name }} firstDate={firstDate} lastDate={lastDate} />
            </div>
        </div>
    );
};

export default SongDetailsComponent;