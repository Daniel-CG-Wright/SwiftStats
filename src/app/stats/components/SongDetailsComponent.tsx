import React from 'react';
import { Song } from '@/types';
import ListeningClockComponent from './ListeningClockComponent';

interface SongDetailsComponentProps {
    song: Song;
    onBack: () => void;
}

const SongDetailsComponent: React.FC<SongDetailsComponentProps> = ({ song, onBack }) => {
    // Render song details and listening clock, listening clock will just use this year for now
    /// TODO get the listening time by month for the selected song
    // TODO have functions to get other song data like average listening time per day, etc.
    // TODO have an arrow left for the back button
    return (
        <div>
            <button onClick={onBack}>Back</button>
            <h1>{song.name}</h1>
            <h2>{song.artist}</h2>
            <ListeningClockComponent data={song.listeningTimeByMonth} year={new Date().getFullYear().toString()} />

        </div>
    );
};

export default SongDetailsComponent;