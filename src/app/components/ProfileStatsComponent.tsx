// src\app\stats\components\ProfileStatsComponent.tsx

import React, { useState, useEffect } from 'react';
import { FileData, ProfileAPIData } from '@/types';
import { getDetailedData, getListeningTimeByMonth } from '@/util/analysisHelpers';
import DetailedInfoComponent from './DetailedInfoComponent';
import ListeningClockWrapperComponent from './ListeningClockWrapperComponent';
import Link from 'next/link';
import { FaExternalLinkAlt } from 'react-icons/fa';


interface ProfileStatsComponentProps {
    fileData: FileData;
    startDate: string;
    endDate: string;
}

const ProfileStatsComponent: React.FC<ProfileStatsComponentProps> = ({ fileData, startDate, endDate }) => {

    const [profileAPIData, setProfileAPIData] = React.useState<ProfileAPIData | null>(null);

    React.useEffect(() => {
        const fetchData = async () => {
            if (!fileData.username) {
                return;
            }
            const data = await fetch(`/profileData?username=${fileData.username}`).then(res => res.json());
            if (data.error) {
                return;
            }
            setProfileAPIData(data);
        };

        fetchData();
    }, [fileData.username]);

    const data = fileData.data;
    
    // Filter the data based on the selected start and end time
    const filteredData = data.filter(record => 
        (!startDate || record.endTime.split(' ')[0] >= startDate) && 
        (!endDate || record.endTime.split(' ')[0] <= endDate)
    );

    // Calculate the statistics
    const { timeListened, timesStreamed, averageTimeListenedPerStream, averages } = getDetailedData(fileData, { trackName: '', artist: '' }, startDate, endDate);
    const uniqueArtists = new Set(filteredData.map(record => record.artistName)).size;
    const uniqueTracks = new Set(filteredData.map(record => record.trackName)).size;

    const imageUrl = profileAPIData?.imageUrl;
    // add code for image url etc (see details components)

    return (
        <div className="py-2 px-4 h-full w-full flex flex-grow flex-col">
            {
                imageUrl &&
                (
                    <img className="rounded-full w-32 h-32" src={imageUrl} />
                )
            }
            <h1>Profile Stats</h1>
            {
                profileAPIData &&
                (
                    <div className="py-2">
                        <div className="flex flex-col md:flex-row items-left">
                            <h2>
                                {profileAPIData.displayName} 
                            </h2>
                            {
                                profileAPIData.spotifyUrl ? 
                                (
                                    <Link href={profileAPIData.spotifyUrl}>
                                        <span className="text-gray-500 md:px-2 text-2xl">({fileData.username})</span> <FaExternalLinkAlt className='inline-block text-gray-400 text-sm' />
                                    </Link>
                                ) :
                                (
                                    <span className="text-gray-500 md:px-2 text-2xl">({fileData.username})</span>
                                )
                            }
                        </div>
                        <p className='text-gray-500 text-2xl px-0'>{profileAPIData.followers} {profileAPIData.followers === 1 ? 'follower' : 'followers'}</p>
                    </div>
                )
            }
            <table>
                <tbody>
                    <tr><td>Unique Artists</td><td>{uniqueArtists}</td></tr>
                    <tr><td>Unique Tracks</td><td>{uniqueTracks}</td></tr>
                    <DetailedInfoComponent site={fileData.site} timeListened={timeListened} timesStreamed={timesStreamed} averageTimeListenedPerStream={averageTimeListenedPerStream} averages={averages} />
                </tbody>
            </table>
            <ListeningClockWrapperComponent fileData={fileData} criteria={{ artist: '', trackName: '' }} />
        </div>
    );
}

export default ProfileStatsComponent;