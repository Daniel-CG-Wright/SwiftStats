"use client"
import React from 'react'
import { Song } from '@/types';
import { timeFormat } from '@/util/dateTimeFormat';

interface MostListenedToSongsComponentProps {
    fileContent: string;
}



/**
 * This function takes in the file JSON content and returns a list of songs listened
 * to in order of most listened to by ms listened. This is using the Spotify ListenignData JSOn file
 * @param fileContent the JSON content of the file
 * @returns a list of songs listened to in order of most listened to by ms listened
 * (see the Song interface for more details)
 */
const getSongsListenedTo = (fileContent: string): Song[] => {
    // this character is used to separate artist and track name when using their combination
    // as a key in the map
    const artistTrackSeparator = '¬sep¬';
    // Parse the JSON content
    const data = JSON.parse(fileContent);

    // Aggregate the total msPlayed for each song
    const playtimeMap = new Map<string, number>();
    const streamCountMap = new Map<string, number>();
    data.forEach((record: { artistName: string; trackName: string; msPlayed: number;}) => {
        const key = `${record.artistName}${artistTrackSeparator}${record.trackName}`;
        const currentPlaytime = playtimeMap.get(key) || 0;
        const currentStreamCount = streamCountMap.get(key) || 0;
        playtimeMap.set(key, currentPlaytime + record.msPlayed);
        streamCountMap.set(key, currentStreamCount + 1);
    });

    // Filter and sort the songs
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
}

/**
 * This component takes in the file JSON content and displays a list of songs listened
 * to in order of most listened to by ms listened.
 * @param fileContent the JSON content of the file
 */
const MostListenedToSongsComponent: React.FC<MostListenedToSongsComponentProps> = ({ fileContent }) => {
    const songsListenedTo = getSongsListenedTo(fileContent);

    return (
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
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{song.artist}</td>
                        <td>{song.name}</td>
                        <td>{timeFormat(song.minutesListened)} ({song.minutesListened.toFixed(1)} minutes)</td>
                        <td>{song.timesStreamed}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
    
export default MostListenedToSongsComponent;