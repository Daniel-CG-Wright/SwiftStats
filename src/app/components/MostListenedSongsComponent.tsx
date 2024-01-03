"use client"
import React, { useState, useEffect } from 'react'
import { Song, FileData, Site } from '@/types';
import { timeFormat } from '@/util/dateTimeFormat';
import SongDetailsComponent from './SongDetailsComponent';
import { getMostSongsListenedTo, getMostListenedArtists } from '@/util/analysisHelpers';
import PageChangerComponent from './PageChangerComponent';

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
    const songsListenedTo = getMostSongsListenedTo(fileData, startDate, endDate, artistsListenedTo);
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 250;

    // Calculate the songs for the current page
    const songsForPage = songsListenedTo.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

    return (
        
        <div>
            <label className="px-2">Use Ctrl + F to search</label>
            <PageChangerComponent currentPage={currentPage} setCurrentPage={setCurrentPage} numberPerPage={itemsPerPage} maxValue={songsListenedTo.length} totalPages={Math.ceil(songsListenedTo.length / itemsPerPage)} />
            <table className="w-full divide-y divide-gray-200">
                <thead className={`sticky-header`}>
                    <tr>
                        <th>#</th>
                        <th>Artist</th>
                        <th>Song</th>
                        { fileData.site !== Site.YOUTUBE && <th>Time Listened</th> }
                        <th>Times Streamed</th>
                    </tr>
                </thead>
                <tbody className="overflow-auto max-h-screen">
                    {songsForPage.map((song, index) => (
                        <tr key={index} onClick={() => handleSongClick(song, index)} className="clickable-row">
                            <td>{(index + 1) + (currentPage - 1) * itemsPerPage}</td>
                            <td>{song.artist.name}</td>
                            <td>{song.name}</td>
                            {
                                fileData.site !== Site.YOUTUBE &&
                                <td>{timeFormat(song.minutesListened)} ({song.minutesListened.toFixed(1)} minutes)</td>
                            }
                            <td>{song.timesStreamed}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <PageChangerComponent currentPage={currentPage} setCurrentPage={setCurrentPage} numberPerPage={itemsPerPage} maxValue={songsListenedTo.length} totalPages={Math.ceil(songsListenedTo.length / itemsPerPage)} />
            <label className="py-2 text-gray-400">{disclaimerText}</label>
        </div>
    );
}
    
export default MostListenedToSongsComponent;