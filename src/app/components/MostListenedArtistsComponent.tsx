import React, { useState } from 'react';
import { timeFormat } from '@/util/dateTimeFormat';
import ArtistDetailsComponent from './ArtistDetailsComponent';
import { getMostListenedArtists } from '@/util/analysisHelpers';
import { Artist, FileData } from '@/types';
import PageChangerComponent from './PageChangerComponent';

interface MostListenedArtistsComponentProps {
    fileData: FileData;
    startDate: string;
    endDate: string;
}

const MostListenedArtistsComponent: React.FC<MostListenedArtistsComponentProps> = ({ fileData, startDate, endDate }) => {
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
    const artists = getMostListenedArtists(fileData, startDate, endDate);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 250;

    // Calculate the songs for the current page
    const artistsForPage = artists.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleArtistClick = (artist: Artist, index: number) => {
        // Save the current scroll position
        sessionStorage.setItem('clickedArtistRow', index.toString());
      
        // Set the selected song
        setSelectedArtist(artist);
    };

    if (selectedArtist) {
        return <ArtistDetailsComponent fileData={fileData} artist={selectedArtist} startDate={startDate} endDate={endDate} onBack={() => setSelectedArtist(null)} />;
    }

    
    return (
        <div>
            <label className="px-2">Use Ctrl + F to search</label>
            <PageChangerComponent currentPage={currentPage} setCurrentPage={setCurrentPage} numberPerPage={itemsPerPage} maxValue={artists.length} totalPages={Math.ceil(artists.length / itemsPerPage)} />
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
                    {artistsForPage.map((artist, index) => (
                        <tr key={index} onClick={() => handleArtistClick(artist, index)} className="clickable-row">
                            <td>{index + 1}</td>
                            <td>{artist.name}</td>
                            <td>{timeFormat(artist.minutesListened)} ({artist.minutesListened.toFixed(1)} minutes)</td>
                            <td>{artist.timesStreamed}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <PageChangerComponent currentPage={currentPage} setCurrentPage={setCurrentPage} numberPerPage={itemsPerPage} maxValue={artists.length} totalPages={Math.ceil(artists.length / itemsPerPage)} />
            <label className="py-2 text-gray-400">Only artists with at least 1 minute listened are shown</label>
        </div>
    );
};

export default MostListenedArtistsComponent;