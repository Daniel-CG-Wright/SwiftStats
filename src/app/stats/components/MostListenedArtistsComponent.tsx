import React, { useState } from 'react';
import { timeFormat } from '@/util/dateTimeFormat';
import ArtistDetailsComponent from './ArtistDetailsComponent';
import { getMostListenedArtists } from '@/util/analysisHelpers';
import { Artist } from '@/types';

interface MostListenedArtistsComponentProps {
    fileContent: string;
    startDate: string;
    endDate: string;
    firstDate: string;
    lastDate: string;
}

const MostListenedArtistsComponent: React.FC<MostListenedArtistsComponentProps> = ({ fileContent, startDate, endDate, firstDate, lastDate }) => {
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
    const artists = getMostListenedArtists(fileContent, startDate, endDate);

    if (selectedArtist) {
        return <ArtistDetailsComponent fileContent={fileContent} artist={selectedArtist} startDate={startDate} endDate={endDate} onBack={() => setSelectedArtist(null)} firstDate={firstDate} lastDate={lastDate} />;
    }
    
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
                        <tr key={index} onClick={() => setSelectedArtist(artist)}>
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