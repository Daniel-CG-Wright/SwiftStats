"use client"
import React, { useState } from 'react'
import { Song, FileData, Site } from '@/types';
import { timeFormat } from '@/util/dateTimeFormat';
import SongDetailsComponent from './SongDetailsComponent';
import { getMostSongsListenedTo, getMostListenedArtists, getMostListenedAlbums } from '@/util/analysisHelpers';
import StandardTableComponent from './StandardTableComponent';

interface MostListenedToSongsComponentProps {
    fileData: FileData;
    startDate: string;
    endDate: string;
}

/**
 * This component takes in the file JSON content and displays a list of songs listened
 * to in order of most listened to by ms listened.
 * @param fileContent the JSON content of the file
 * @param startDate the start date of the filter
 * @param endDate the end date of the filter
 */
const MostListenedToSongsComponent: React.FC<MostListenedToSongsComponentProps> = ({ fileData, startDate, endDate }) => {
    // need the artists so that we can display their position
    const artistsListenedTo = getMostListenedArtists(fileData, startDate, endDate);
    const albumsListenedTo = getMostListenedAlbums(fileData, startDate, endDate, artistsListenedTo);
    const songsListenedTo = getMostSongsListenedTo(fileData, startDate, endDate, artistsListenedTo, albumsListenedTo);
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 250;

    const disclaimerText = fileData.site === Site.YOUTUBE ? 'Only songs with at least 1 stream are shown' : 'Only songs with at least 1 minute listened are shown';

    const handleSongClick = (song: Song, index: number) => {
        // Save the current scroll position
        sessionStorage.setItem('clickedSongRow', index.toString());
      
        // Set the selected song
        setSelectedSong(song);
    };

    if (selectedSong) {
        return (
            <div>
                <SongDetailsComponent fileData={fileData} song={selectedSong} onBack={() => setSelectedSong(null)} startDate={startDate} endDate={endDate} />
            </div>
        );
    }

    const renderRow = (song: Song, index: number) => (
        <tr key={index} onClick={() => handleSongClick(song, index)} className="clickable-row">
            <td style={{ height: 'auto' }}>{(index + 1) + (currentPage - 1) * itemsPerPage}</td>
            <td style={{ height: 'auto' }}>{song.artist.name}</td>
            <td style={{ height: 'auto' }}>{song.name}</td>
            {
                fileData.site === Site.SPOTIFY_EXTENDED &&
                <td style={{ height: 'auto' }}>{song.album ? song.album.name : "Unknown Album"}</td>
            }
            {
                fileData.site !== Site.YOUTUBE &&
                <td style={{ height: 'auto' }}>{timeFormat(song.minutesListened)} ({song.minutesListened.toFixed(1)} minutes)</td>
            }
            <td style={{ height: 'auto' }}>{song.timesStreamed}</td>
        </tr>
    );

    const headers = ['#', 'Artist', 'Song'];
    if (fileData.site === Site.SPOTIFY_EXTENDED) {
        headers.push('Album');
    }
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
        data={songsListenedTo}
        renderRow={renderRow}
        itemsPerPage={itemsPerPage}
        />
    );
}
    
export default MostListenedToSongsComponent;