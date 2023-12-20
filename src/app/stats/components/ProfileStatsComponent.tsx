// src\app\stats\components\ProfileStatsComponent.tsx

import React, { useState } from 'react';
import { JSONSong } from '@/types';
import { timeFormat } from '@/util/dateTimeFormat';

interface ProfileStatsComponentProps {
    fileContent: string;
    startDate: string;
    endDate: string;
}

const ProfileStatsComponent: React.FC<ProfileStatsComponentProps> = ({ fileContent, startDate, endDate }) => {

    // Parse the file content
    const data = JSON.parse(fileContent) as JSONSong[];

    // Filter the data based on the selected start and end time
    const filteredData = data.filter(record => 
        (!startDate || record.endTime.split(' ')[0] >= startDate) && 
        (!endDate || record.endTime.split(' ')[0] <= endDate)
    );

    // Calculate the statistics
    const totalStreamTime = filteredData.reduce((sum, record) => sum + record.msPlayed, 0) / 60000;
    const totalStreams = filteredData.length;
    const uniqueArtists = new Set(filteredData.map(record => record.artistName)).size;
    const uniqueTracks = new Set(filteredData.map(record => record.trackName)).size;

    return (
        <div className="py-2 h-full w-full flex flex-grow flex-col">
            <h1>Profile Stats</h1>
            <table>
                <tbody>
                    <tr><td>Total Stream Time</td><td>{timeFormat(totalStreamTime)} ({totalStreamTime.toFixed(1)} minutes)</td></tr>
                    <tr><td>Total Streams</td><td>{totalStreams}</td></tr>
                    <tr><td>Unique Artists</td><td>{uniqueArtists}</td></tr>
                    <tr><td>Unique Tracks</td><td>{uniqueTracks}</td></tr>
                    <tr><td>Average Time per Stream</td><td>{timeFormat(totalStreamTime / totalStreams)} ({(totalStreamTime / totalStreams).toFixed(1)} minutes)</td></tr>
                    <tr><td>Average Streams per Day</td><td>{(totalStreams / (new Date(endDate).getTime() - new Date(startDate).getTime()) * 86400000).toFixed(1)}</td></tr>
                    <tr><td>Average Listening Time per Day</td><td>{timeFormat(totalStreamTime / (new Date(endDate).getTime() - new Date(startDate).getTime()) * 86400000)} ({((totalStreamTime / (new Date(endDate).getTime() - new Date(startDate).getTime()) * 86400000)).toFixed(1)} minutes)</td></tr>
                </tbody>
            </table>
        </div>
    );
}

export default ProfileStatsComponent;