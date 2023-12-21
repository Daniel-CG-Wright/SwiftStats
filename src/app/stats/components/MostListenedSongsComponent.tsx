"use client"
import React, { useState } from 'react'
import { Song } from '@/types';
import { timeFormat } from '@/util/dateTimeFormat';
import SongDetailsComponent from './SongDetailsComponent';
import { getMostSongsListenedTo } from '@/util/analysisHelpers';

interface MostListenedToSongsComponentProps {
    fileContent: string;
    startDate: string;
    endDate: string;
    firstDate: string;
    lastDate: string;
}

/**
 * This component takes in the file JSON content and displays a list of songs listened
 * to in order of most listened to by ms listened.
 * @param fileContent the JSON content of the file
 * @param startDate the start date of the filter
 * @param endDate the end date of the filter
 */
const MostListenedToSongsComponent: React.FC<MostListenedToSongsComponentProps> = ({ fileContent, startDate, endDate, firstDate, lastDate }) => {
    const songsListenedTo = getMostSongsListenedTo(fileContent, startDate, endDate);
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    if (selectedSong) {
        return (
            <div>
                <SongDetailsComponent fileContent={fileContent} song={selectedSong} onBack={() => setSelectedSong(null)} startDate={startDate} endDate={endDate}
                    firstDate={firstDate} lastDate={lastDate} />
            </div>
        );
    }

    return (
        
        <div>
            <label>Use Ctrl + F to search</label>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Artist</th>
                        <th>Song</th>
                        <th>Time Listened</th>
                        <th>Times Streamed</th>
                    </tr>
                </thead>
                <tbody>
                    {songsListenedTo.map((song, index) => (
                        <tr key={index} onClick={() => setSelectedSong(song)}>
                            <td>{index + 1}</td>
                            <td>{song.artist}</td>
                            <td>{song.name}</td>
                            <td>{timeFormat(song.minutesListened)} ({song.minutesListened.toFixed(1)} minutes)</td>
                            <td>{song.timesStreamed}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
    
export default MostListenedToSongsComponent;