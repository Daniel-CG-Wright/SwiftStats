"use client"
import React, { useState } from 'react'
import { Song } from '@/types';
import { timeFormat } from '@/util/dateTimeFormat';
import SongDetailsComponent from './SongDetailsComponent';

interface MostListenedToSongsComponentProps {
    fileContent: string;
    startDate: string;
    endDate: string;
}



/**
 * This function takes in the file JSON content and returns a list of songs listened
 * to in order of most listened to by ms listened. This is using the Spotify ListenignData JSOn file
 * @param fileContent the JSON content of the file
 * @param startDate the start date of the filter
 * @param endDate the end date of the filter
 * @returns a list of songs listened to in order of most listened to by ms listened
 * (see the Song interface for more details)
 */
const getSongsListenedTo = (fileContent: string, startDate: string, endDate: string): Song[] => {
    const artistTrackSeparator = '¬sep¬';
    const data = JSON.parse(fileContent);

    const playtimeMap = new Map<string, number>();
    const streamCountMap = new Map<string, number>();

    data.forEach((record: { artistName: string; trackName: string; msPlayed: number; endTime: string; }) => {
        // Convert recordTime to YYYY-MM-DD format
        const recordTime = record.endTime.split(' ')[0];

        // Only process records within the date range
        if (recordTime >= startDate && recordTime <= endDate) {
            const key = `${record.artistName}${artistTrackSeparator}${record.trackName}`;
            const currentPlaytime = playtimeMap.get(key) || 0;
            const currentStreamCount = streamCountMap.get(key) || 0;
            playtimeMap.set(key, currentPlaytime + record.msPlayed);
            streamCountMap.set(key, currentStreamCount + 1);
        }
    });

    const songsListenedTo = Array.from(playtimeMap)
        .map(([key, msPlayed]) => ({
            artist: key.split(artistTrackSeparator)[0],
            name: key.split(artistTrackSeparator)[1],
            minutesListened: Number((msPlayed / 60000).toFixed(1)),
            timesStreamed: streamCountMap.get(key) || 0,
        }))
        .filter(song => song.minutesListened > 1)
        .sort((a, b) => b.minutesListened - a.minutesListened);

    return songsListenedTo;
};

/**
 * This component takes in the file JSON content and displays a list of songs listened
 * to in order of most listened to by ms listened.
 * @param fileContent the JSON content of the file
 * @param startDate the start date of the filter
 * @param endDate the end date of the filter
 */
const MostListenedToSongsComponent: React.FC<MostListenedToSongsComponentProps> = ({ fileContent, startDate, endDate }) => {
    const songsListenedTo = getSongsListenedTo(fileContent, startDate, endDate);
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    if (selectedSong) {
        return (
            <div>
                <SongDetailsComponent song={selectedSong} onBack={() => setSelectedSong(null)} />
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