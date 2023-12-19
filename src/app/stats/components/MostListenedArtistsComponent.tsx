import React from 'react';
import { Artist } from '@/types';
import { timeFormat } from '@/util/dateTimeFormat';
import { getMostListenedArtists } from '@/util/analysisHelpers';


const MostListenedArtistsComponent: React.FC<{ fileContent: string, startDate: string, endDate: string }> = ({ fileContent, startDate, endDate }) => {
    const artists = getMostListenedArtists(fileContent, startDate, endDate);

    return (
        <div>
            <label>Use Ctrl + F to search</label>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Artist</th>
                        <th>Time Listened</th>
                        <th>Times Streamed</th>
                    </tr>
                </thead>
                <tbody>
                    {artists.map((artist, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{artist.name}</td>
                            <td>{timeFormat(artist.minutesListened)} ({artist.minutesListened.toFixed(1)} minutes)</td>
                            <td>{artist.timesStreamed}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MostListenedArtistsComponent;