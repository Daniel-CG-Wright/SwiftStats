import React from 'react';
import { FileData, Album } from '../../types';
import { getMostListenedArtists, getMostListenedAlbums } from '../../util/analysisHelpers';

interface MostListenedAlbumsComponentProps {
    fileData: FileData;
    startDate: string;
    endDate: string;
}

const MostListenedAlbumsComponent: React.FC<MostListenedAlbumsComponentProps> = ({ fileData, startDate, endDate }) => {
    const artistsListenedTo = getMostListenedArtists(fileData, startDate, endDate);
    const albumsListenedTo = getMostListenedAlbums(fileData, startDate, endDate, artistsListenedTo);
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 250;

    return (
        <div>
            <h2>Most Listened Albums</h2>
            {/* TODO: Render the most listened albums here */}
        </div>
    );
};

export default MostListenedAlbumsComponent;