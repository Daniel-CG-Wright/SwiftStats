import React from 'react';
import { Artist } from '@/types';
import { timeFormat } from '@/util/dateTimeFormat';
import { getMostListenedArtists } from '@/util/analysisHelpers';


const MostListenedArtistsComponent: React.FC<{ fileContent: string }> = ({ fileContent }) => {
    const artists = getMostListenedArtists(fileContent);

    return (
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Artist</th>
                    <th>Time Listened</th>
                </tr>
            </thead>
            <tbody>
                {artists.map((artist, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{artist.name}</td>
                        <td>{timeFormat(artist.minutesListened)} ({artist.minutesListened.toFixed(1)} minutes)</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default MostListenedArtistsComponent;