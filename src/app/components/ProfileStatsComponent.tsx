// src\app\stats\components\ProfileStatsComponent.tsx

import React from 'react';
import { JSONSong } from '@/types';
import { getDetailedData, getListeningTimeByMonth } from '@/util/analysisHelpers';
import DetailedInfoComponent from './DetailedInfoComponent';
import ListeningClockWrapperComponent from './ListeningClockWrapperComponent';

interface ProfileStatsComponentProps {
    fileContent: string;
    startDate: string;
    endDate: string;
    firstDate: string;
    lastDate: string;
}

const ProfileStatsComponent: React.FC<ProfileStatsComponentProps> = ({ fileContent, startDate, endDate, firstDate, lastDate }) => {

    // Parse the file content
    const data = JSON.parse(fileContent) as JSONSong[];

    // Filter the data based on the selected start and end time
    const filteredData = data.filter(record => 
        (!startDate || record.endTime.split(' ')[0] >= startDate) && 
        (!endDate || record.endTime.split(' ')[0] <= endDate)
    );

    // Calculate the statistics
    const { timeListened, timesStreamed, averageTimeListenedPerStream, averages } = getDetailedData(fileContent, { trackName: '', artist: '' }, startDate, endDate);
    const uniqueArtists = new Set(filteredData.map(record => record.artistName)).size;
    const uniqueTracks = new Set(filteredData.map(record => record.trackName)).size;

    return (
        <div className="py-2 px-4 h-full w-full flex flex-grow flex-col">
            <h1>Profile Stats</h1>
            <table>
                <tbody>
                    <tr><td>Unique Artists</td><td>{uniqueArtists}</td></tr>
                    <tr><td>Unique Tracks</td><td>{uniqueTracks}</td></tr>
                    <DetailedInfoComponent timeListened={timeListened} timesStreamed={timesStreamed} averageTimeListenedPerStream={averageTimeListenedPerStream} averages={averages} />
                </tbody>
            </table>
            <ListeningClockWrapperComponent fileContent={fileContent} criteria={{ artist: '', trackName: '' }} firstDate={firstDate} lastDate={lastDate} />
        </div>
    );
}

export default ProfileStatsComponent;