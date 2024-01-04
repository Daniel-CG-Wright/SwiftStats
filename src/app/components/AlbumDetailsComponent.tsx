import React, { useRef, useEffect } from 'react';
import { Album, FileData, Site } from '@/types';
import ListeningClockWrapperComponent from './ListeningClockWrapperComponent';
import { getDetailedData } from '@/util/analysisHelpers';
import DetailedInfoComponent from './DetailedInfoComponent';

interface AlbumDetailsComponentProps {
    fileData: FileData;
    album: Album;
    startDate: string;
    endDate: string;
    onBack: () => void;
}



/**
 * This component displays details of a specific album, including the listening clock
 */
const AlbumDetailsComponent: React.FC<AlbumDetailsComponentProps> = ({ fileData, album, startDate, endDate, onBack }) => {
    // Render album details and listening clock, listening clock will just use this year for now
    // We want to display the album name, artist, time listened, times streamed, average time listened per stream
    // in the same format as the profile stats page.
    // TODO have an arrow left for the back button
    const albumNameRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
            if (albumNameRef.current) {
                window.scrollTo({
                    top: albumNameRef.current.offsetTop - 60,
                });
            }
        
    }, []);

    const handleBackClick = () => {
        // Get the index of the clicked album row
        const clickedalbumRow = sessionStorage.getItem('clickedalbumRow');
      
        // Scroll to the clicked album row
        if (clickedalbumRow) {
          setTimeout(() => {
            const albumRowElement = document.querySelector(`.clickable-row:nth-child(${parseInt(clickedalbumRow) + 1})`);
            if (albumRowElement) {
              const offsetTop = albumRowElement.getBoundingClientRect().top + window.scrollY;
              const middleOffset = offsetTop - window.innerHeight / 2;
              window.scrollTo({ top: middleOffset });
            }
          }, 1);
        }
      
        // Call the original onBack function
        onBack();
      };

    

    const { timeListened, timesStreamed, averageTimeListenedPerStream, averages } = getDetailedData(fileData, { artist: album.artist.name, albumName: album.name }, startDate, endDate);

    return (
        <div className="px-4">
            <button ref={albumNameRef} onClick={handleBackClick} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }} className="py-6">
                <img src="/backarrow.png" alt="Back" className='back-arrow'/>
            </button>
            <div className="flex items-center">
                <h1>{album.name}</h1><span className="text-gray-400 px-2 text-3xl font-bold m-0">#{album.position}</span>
            </div>
            <div className="flex items-center">
                <h2>{album.artist.name}</h2><span className="text-gray-400 px-2 text-2xl font-bold m-0">#{album.artist.position}</span>
            </div>
            
            <table>
                <tbody>
                    <DetailedInfoComponent site={fileData.site} timeListened={timeListened} timesStreamed={timesStreamed} averageTimeListenedPerStream={averageTimeListenedPerStream} averages={averages} />
                </tbody>
            </table>
            <ListeningClockWrapperComponent fileData={fileData} criteria={{ artist: album.artist.name, albumName: album.name }} />
        </div>
    );
};

export default AlbumDetailsComponent;