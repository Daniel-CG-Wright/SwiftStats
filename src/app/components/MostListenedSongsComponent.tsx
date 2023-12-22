"use client"
import React, { useState } from 'react'
import { Song } from '@/types';
import { timeFormat } from '@/util/dateTimeFormat';
import SongDetailsComponent from './SongDetailsComponent';
import { getMostSongsListenedTo, getMostListenedArtists } from '@/util/analysisHelpers';

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
    // need the artists so that we can display their position
    const artistsListenedTo = getMostListenedArtists(fileContent, startDate, endDate);
    const songsListenedTo = getMostSongsListenedTo(fileContent, startDate, endDate, artistsListenedTo);
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);

    if (selectedSong) {
        return (
            <div>
                <SongDetailsComponent fileContent={fileContent} song={selectedSong} onBack={() => setSelectedSong(null)} startDate={startDate} endDate={endDate} firstDate={firstDate} lastDate={lastDate} />
            </div>
        );
    }

    return (
        
        <div>
            <label className="px-2">Use Ctrl + F to search</label>
            <table className="w-full divide-y divide-gray-200">
                <thead className={`sticky-header bg-gray-900`}>
                    <tr>
                        <th>#</th>
                        <th>Artist</th>
                        <th>Song</th>
                        <th>Time Listened</th>
                        <th>Times Streamed</th>
                    </tr>
                </thead>
                <tbody className="overflow-auto max-h-screen">
                    {songsListenedTo.map((song, index) => (
                        <tr key={index} onClick={() => setSelectedSong(song)} className="clickable-row">
                            <td>{index + 1}</td>
                            <td>{song.artist.name}</td>
                            <td>{song.name}</td>
                            <td>{timeFormat(song.minutesListened)} ({song.minutesListened.toFixed(1)} minutes)</td>
                            <td>{song.timesStreamed}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <label className="py-2 text-gray-400">Only songs with at least 1 minute listened are shown</label>
        </div>
    );
}
    
export default MostListenedToSongsComponent;