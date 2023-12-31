import React, { useRef, useEffect, useState } from 'react';
import { Song, FileData, Site, SongAPIData, Categories } from '@/types';
import ListeningClockWrapperComponent from './ListeningClockWrapperComponent';
import { getListeningTimeByMonth, getDetailedData } from '@/util/analysisHelpers';
import DetailedInfoComponent from './DetailedInfoComponent';
import Link from 'next/link';
import { FaExternalLinkAlt } from 'react-icons/fa';

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
    const [apiData, setApiData] = useState<SongAPIData | null>(null);

    useEffect(() => {
        if (songNameRef.current) {
            window.scrollTo({
                top: songNameRef.current.offsetTop - 60,
            });
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            // getAPIData({ artist: song.artist.name, trackName: song.name }, Categories.SONG).then(setApiData);
            const response = await fetch(`/spotifyData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    criteria: `${song.artist.name} ${song.name}`,
                    type: Categories.TRACK
                })
            });
            const spotifyData = await response.json();
            setApiData(spotifyData);
        }

        fetchData();
    }, [song.name, song.artist.name]);


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

    let songUrl: string | undefined = apiData?.spotifyUrl;
    if (fileData.site === Site.YOUTUBE && song.songUrl) {
        songUrl = song.songUrl;
    }

    let imageUrl = apiData?.imageUrl;
    let imageComponent = (
        <img src={imageUrl} alt={song.name} className="object-cover w-full h-full" />
    )

    return (
        <div className="px-4">
            <button ref={songNameRef} onClick={handleBackClick} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }} className="py-6">
                <img src="/backarrow.png" alt="Back" className='back-arrow'/>
            </button>
            <div className="flex flex-col md:pb-8">
            {
                imageUrl &&
                (
                    <div className="w-full md:w-64 h-64 md:mb-5">
                        {
                            songUrl ?
                            (
                                <Link href={songUrl} className='link-header'>
                                    {imageComponent}
                                </Link>
                            ) :
                            (
                                imageComponent
                            )
                        }
                    </div>
                )
            }
            <h1>
                {
                    songUrl ?
                        (
                            <Link href={songUrl} className='link-header'>
                                {song.name} <FaExternalLinkAlt className='inline-block text-gray-400 text-sm' />
                            </Link>
                        ) :
                        song.name
                }
                <span className="text-gray-400 px-2 text-3xl font-bold m-0">#{song.position}</span>
            </h1>
            
                {
                    song.album?.name &&
                    (
                        <div className="flex items-center pb-2">
                            <h2 className="text-2xl">{song.album.name}</h2>
                            <span className="text-gray-400 px-2 text-xl font-bold m-0">#{song.album.position}</span>
                        </div>
                    )
                }
            <div className="flex items-center">
                <h2>{song.artist.name}</h2><span className="text-gray-400 px-2 text-2xl font-bold m-0">#{song.artist.position}</span>
            </div>
        </div>
        
            
            <table>
                <tbody>
                    <DetailedInfoComponent
                    site={fileData.site}
                    timeListened={timeListened}
                    timesStreamed={timesStreamed}
                    averageTimeListenedPerStream={averageTimeListenedPerStream}
                    averages={averages} />
                </tbody>
            </table>
            <ListeningClockWrapperComponent fileData={fileData} criteria={{ artist: song.artist.name, trackName: song.name }} />
        </div>
    );
};

export default SongDetailsComponent;