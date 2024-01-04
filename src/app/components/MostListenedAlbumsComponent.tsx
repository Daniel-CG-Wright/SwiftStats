import React, { useState } from 'react';
import { FileData, Album, Site } from '../../types';
import { getMostListenedArtists, getMostListenedAlbums } from '../../util/analysisHelpers';
import StandardTableComponent from './StandardTableComponent';

interface MostListenedAlbumsComponentProps {
    fileData: FileData;
    startDate: string;
    endDate: string;
}

const MostListenedAlbumsComponent: React.FC<MostListenedAlbumsComponentProps> = ({ fileData, startDate, endDate }) => {
    const artistsListenedTo = getMostListenedArtists(fileData, startDate, endDate);
    const albumsListenedTo = getMostListenedAlbums(fileData, startDate, endDate, artistsListenedTo);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 250;

    const disclaimerText = fileData.site === Site.YOUTUBE ? 'Only albums with at least 1 stream are shown' : 'Only albums with at least 1 minute listened are shown';

    const handleAlbumClick = (album: Album, index: number) => {
        // Save the current scroll position
        sessionStorage.setItem('clickedAlbumRow', index.toString());
      
        // Set the selected song
        setSelectedAlbum(album);
    };

    if (selectedAlbum) {
        return <div>TODO</div>;
    }

    const renderRow = (album: Album, index: number) => (
        <tr key={index} onClick={() => handleAlbumClick(album, index)} className="clickable-row">
            <td>{(index + 1) + (currentPage - 1) * itemsPerPage}</td>
            <td>{album.name}</td>
            <td>{album.artist.name}</td>
            {
                fileData.site !== Site.YOUTUBE &&
                <td>{album.minutesListened.toFixed(1)} minutes</td>
            }
            <td>{album.timesStreamed}</td>
        </tr>
    );

    const headers = ['#', 'Album', 'Artist'];
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
        data={albumsListenedTo}
        renderRow={renderRow}
        itemsPerPage={itemsPerPage}
        />
    );

};

export default MostListenedAlbumsComponent;