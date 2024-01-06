import React, { useRef, useEffect, useState } from 'react';
import { Album, FileData, Site, Categories, APIData } from '@/types';
import ListeningClockWrapperComponent from './ListeningClockWrapperComponent';
import { getDetailedData } from '@/util/analysisHelpers';
import DetailedInfoComponent from './DetailedInfoComponent';
import { getAPIData } from '@/util/apiHelpers';
import Link from 'next/link';
import { FaExternalLinkAlt } from 'react-icons/fa';
import Image from 'next/image';

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
    const [apiData, setApiData] = useState<APIData | null>(null);

    useEffect(() => {
        if (albumNameRef.current) {
            window.scrollTo({
                top: albumNameRef.current.offsetTop - 60,
            });
        }
    }, []);

    useEffect(() => {
        getAPIData({ artist: album.artist.name, albumName: album.name }, Categories.ALBUM).then(setApiData);
    }, [album.name]);

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

    let albumUrl = apiData?.spotifyUrl;
    let imageUrl = apiData?.imageUrl;

    return (
        <div className="px-4">
            <button ref={albumNameRef} onClick={handleBackClick} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }} className="py-6">
                <img src="/backarrow.png" alt="Back" className='back-arrow'/>
            </button>
            <div className="flex flex-col md:pb-8">
                {
                    imageUrl &&
                    (
                        <div className="w-full md:w-64 h-64 md:pb-5">
                            <img src={imageUrl} alt={album.name} className="object-cover w-full h-full" />
                        </div>
                    )
                }
                <div>
                    <h1>
                        {
                            albumUrl ?
                                (
                                    <Link href={albumUrl} className='link-header'>
                                        {album.name} <FaExternalLinkAlt className='inline-block text-gray-400 text-sm' />
                                    </Link>
                                )
                                :
                                album.name
                        }
                        <span className="text-gray-400 px-2 text-3xl font-bold m-0">#{album.position}</span>
                    </h1>
                    
                    <div className="flex items-center">
                        <h2>{album.artist.name}</h2><span className="text-gray-400 px-2 text-2xl font-bold m-0">#{album.artist.position}</span>
                    </div>
                </div>
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