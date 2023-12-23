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
            <label className="px-2">Use Ctrl + F to search</label>
            <table className="w-full divide-y divide-gray-200">
                <thead className={`sticky-header`}>
                    <tr>
                        <th>#</th>
                        <th>Artist</th>
                        <th>Time Listened</th>
                        <th>Times Streamed</th>
                    </tr>
                </thead>
                <tbody className="overflow-auto max-h-screen">
                    {artists.map((artist, index) => (
                        <tr key={index} onClick={() => setSelectedArtist(artist)} className="clickable-row">
                            <td>{index + 1}</td>
                            <td>{artist.name}</td>
                            <td>{timeFormat(artist.minutesListened)} ({artist.minutesListened.toFixed(1)} minutes)</td>
                            <td>{artist.timesStreamed}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <label className="py-2 text-gray-400">Only artists with at least 1 minute listened are shown</label>
        </div>
    );
};

export default MostListenedArtistsComponent;