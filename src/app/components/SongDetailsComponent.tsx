import React, { useRef, useEffect } from 'react';
import { Song, FileData } from '@/types';
import ListeningClockWrapperComponent from './ListeningClockWrapperComponent';
import { getListeningTimeByMonth, getDetailedData } from '@/util/analysisHelpers';
import DetailedInfoComponent from './DetailedInfoComponent';

interface SongDetailsComponentProps {
    fileData: FileData;
    song: Song;
    startDate: string;
    endDate: string;
    onBack: () => void;
}



/**
 * This component displays details of a specific song, including the listening clock
 */
const SongDetailsComponent: React.FC<SongDetailsComponentProps> = ({ fileData, song, startDate, endDate, onBack }) => {
    // Render song details and listening clock, listening clock will just use this year for now
    // We want to display the song name, artist, time listened, times streamed, average time listened per stream
    // in the same format as the profile stats page.
    // TODO have an arrow left for the back button
    const songNameRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
            if (songNameRef.current) {
                window.scrollTo({
                    top: songNameRef.current.offsetTop - 60,
                });
            }
        
    }, []);

    const handleBackClick = () => {
        // Get the index of the clicked song row
        const clickedSongRow = sessionStorage.getItem('clickedSongRow');
      
        // Scroll to the clicked song row
        if (clickedSongRow) {
          setTimeout(() => {
            const songRowElement = document.querySelector(`.clickable-row:nth-child(${parseInt(clickedSongRow) + 1})`);
            if (songRowElement) {
              const offsetTop = songRowElement.getBoundingClientRect().top + window.scrollY;
              const middleOffset = offsetTop - window.innerHeight / 2;
              window.scrollTo({ top: middleOffset });
            }
          }, 1);
        }
      
        // Call the original onBack function
        onBack();
      };

    

    const { timeListened, timesStreamed, averageTimeListenedPerStream, averages } = getDetailedData(fileData, { trackName: song.name, artist: song.artist.name }, startDate, endDate);

    return (
        <div className="px-4">
            <button ref={songNameRef} onClick={handleBackClick} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }} className="py-6">
                <img src="/backarrow.png" alt="Back" className='back-arrow'/>
            </button>
            <div className="flex items-center">
                <h1>{song.name}</h1><span className="text-gray-400 px-2 text-3xl font-bold m-0">#{song.position}</span>
            </div>
            <div className="flex items-center">
                <h2>{song.artist.name}</h2><span className="text-gray-400 px-2 text-2xl font-bold m-0">#{song.artist.position}</span>
            </div>
            
            <table>
                <tbody>
                    <DetailedInfoComponent timeListened={timeListened} timesStreamed={timesStreamed} averageTimeListenedPerStream={averageTimeListenedPerStream} averages={averages} />
                </tbody>
            </table>
            <ListeningClockWrapperComponent fileData={fileData} criteria={{ artist: song.artist.name, trackName: song.name }} />
        </div>
    );
};

export default SongDetailsComponent;