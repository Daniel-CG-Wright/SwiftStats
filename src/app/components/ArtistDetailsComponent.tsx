import React, { useEffect, useRef } from 'react';
import { Artist } from '@/types';
import ListeningClockWrapperComponent from './ListeningClockWrapperComponent';
import { getDetailedData } from '@/util/analysisHelpers';
import DetailedInfoComponent from './DetailedInfoComponent';

interface ArtistDetailsComponentProps {
    fileContent: string;
    artist: Artist;
    startDate: string;
    endDate: string;
    firstDate: string;
    lastDate: string;
    onBack: () => void;
}

/**
 * This component displays details of a specific artist, including the listening clock
 */
const ArtistDetailsComponent: React.FC<ArtistDetailsComponentProps> = ({ fileContent, artist, startDate, endDate, firstDate, lastDate, onBack }) => {
    const { timeListened, timesStreamed, averageTimeListenedPerStream, averages } = getDetailedData(fileContent, { artist: artist.name, trackName: '' }, startDate, endDate);
    const backButtonRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        if (backButtonRef.current) {
            window.scrollTo({
                top: backButtonRef.current.offsetTop - 60,
            });
        }
    
    }, []);

    const handleBackClick = () => {
        // Get the index of the clicked song row
        const clickedArtistRow = sessionStorage.getItem('clickedArtistRow');
    
        // Scroll to the clicked song row
        if (clickedArtistRow) {
            setTimeout(() => {
                const songRowElement = document.querySelector(`.clickable-row:nth-child(${parseInt(clickedArtistRow) + 1})`);
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
    return (
        <div className="px-4">
            <button ref={backButtonRef} onClick={handleBackClick} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }} className="py-6">
                <img src="/backarrow.png" alt="Back" className='back-arrow'/>
            </button>
            <div className="flex items-center">
                <h1>{artist.name}</h1><span className="text-gray-400 px-2 text-3xl font-bold m-0">#{artist.position}</span>
            </div>
            <table>
                <tbody>
                    <DetailedInfoComponent timeListened={timeListened} timesStreamed={timesStreamed} averageTimeListenedPerStream={averageTimeListenedPerStream} averages={averages} />
                </tbody>
            </table>
            <ListeningClockWrapperComponent fileContent={fileContent} criteria={{ artist: artist.name, trackName: '' }} firstDate={firstDate} lastDate={lastDate} />
        </div>
    );
};

export default ArtistDetailsComponent;