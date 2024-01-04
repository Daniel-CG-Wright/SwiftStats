import React, { useState } from 'react';
import { timeFormat } from '@/util/dateTimeFormat';
import ArtistDetailsComponent from './ArtistDetailsComponent';
import { getMostListenedArtists } from '@/util/analysisHelpers';
import { Artist, FileData, Site } from '@/types';
import StandardTableComponent from './StandardTableComponent';

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

    const disclaimerText = fileData.site === Site.YOUTUBE ? 'Only artists with at least 1 stream are shown' : 'Only artists with at least 1 minute listened are shown';

    const handleArtistClick = (artist: Artist, index: number) => {
        // Save the current scroll position
        sessionStorage.setItem('clickedArtistRow', index.toString());
      
        // Set the selected song
        setSelectedArtist(artist);
    };

    if (selectedArtist) {
        return <ArtistDetailsComponent fileData={fileData} artist={selectedArtist} startDate={startDate} endDate={endDate} onBack={() => setSelectedArtist(null)} />;
    }

    const renderRow = (artist: Artist, index: number) => (
        <tr key={index} onClick={() => handleArtistClick(artist, index)} className="clickable-row">
            <td>{(index + 1) + (currentPage - 1) * itemsPerPage}</td>
            <td>{artist.name}</td>
            {
                fileData.site !== Site.YOUTUBE &&
                <td>{timeFormat(artist.minutesListened)} ({artist.minutesListened.toFixed(1)} minutes)</td>
            }
            <td>{artist.timesStreamed}</td>
        </tr>
    );

    const headers = ['#', 'Artist'];
    if (fileData.site !== Site.YOUTUBE) {
        headers.push('Time Listened');
    }
    headers.push('Times Streamed');

    return (
        <StandardTableComponent
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        disclaimerText={disclaimerText}
        tableHeaders={headers}
        data={artists}
        renderRow={renderRow}
        itemsPerPage={itemsPerPage}
        />
    );
};

export default MostListenedArtistsComponent;