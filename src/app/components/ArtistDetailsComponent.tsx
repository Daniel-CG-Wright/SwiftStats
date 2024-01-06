import React, { useEffect, useRef, useState } from 'react';
import { Artist, FileData, APIData, Categories, Site } from '@/types';
import ListeningClockWrapperComponent from './ListeningClockWrapperComponent';
import { getDetailedData } from '@/util/analysisHelpers';
import DetailedInfoComponent from './DetailedInfoComponent';
import { getAPIData } from '@/util/apiHelpers';
import { FaExternalLinkAlt } from 'react-icons/fa';
import Link from 'next/link';

interface ArtistDetailsComponentProps {
    fileData: FileData;
    artist: Artist;
    startDate: string;
    endDate: string;
    onBack: () => void;
}

/**
 * This component displays details of a specific artist, including the listening clock
 */
const ArtistDetailsComponent: React.FC<ArtistDetailsComponentProps> = ({ fileData, artist, startDate, endDate, onBack }) => {
    const { timeListened, timesStreamed, averageTimeListenedPerStream, averages } = getDetailedData(fileData, { artist: artist.name, trackName: '' }, startDate, endDate);
    const backButtonRef = useRef<HTMLButtonElement>(null);
    // State to hold API data
    const [apiData, setApiData] = useState<APIData | null>(null);

    useEffect(() => {
        // Fetch API data when component mounts
        const fetchData = async () => {
            if (fileData.site === Site.SPOTIFY_EXTENDED) {
                const data = await getAPIData({ artist: artist.name }, Categories.ARTIST);
                setApiData(data);
            }
        };

        fetchData();
    }, [artist.name]);

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

    let artistUrl: string | null = null;
    if (apiData) {
        artistUrl = apiData.spotifyUrl;
    }
    else if (artist.artistUrl)
    {
        artistUrl = artist.artistUrl;
    }


    return (
        <div className="px-4">
            <button ref={backButtonRef} onClick={handleBackClick} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }} className="py-6">
                <img src="/backarrow.png" alt="Back" className='back-arrow'/>
            </button>
            <div className="flex items-center">
                <h1>
                    {
                        apiData ? (
                            <Link href={apiData.spotifyUrl} className="link-header">
                                {artist.name} <FaExternalLinkAlt className="inline-block text-gray-400 text-sm" />
                            </Link>
                        ) : (
                            artist.name
                        )
                    }
                </h1><span className="text-gray-400 px-2 text-3xl font-bold m-0">#{artist.position}</span>
            </div>
            <table>
                <tbody>
                    <DetailedInfoComponent site={fileData.site} timeListened={timeListened} timesStreamed={timesStreamed} averageTimeListenedPerStream={averageTimeListenedPerStream} averages={averages} />
                </tbody>
            </table>
            <ListeningClockWrapperComponent fileData={fileData} criteria={{ artist: artist.name, trackName: '' }}/>
        </div>
    );
};

export default ArtistDetailsComponent;