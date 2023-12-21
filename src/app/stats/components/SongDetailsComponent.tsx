import React, { useState, useEffect, use } from 'react';
import { Song, AverageListeningData } from '@/types';
import ListeningClockComponent from './ListeningClockComponent';
import { getSongListeningTimeByMonth } from '@/util/analysisHelpers';
import { timeFormat } from '@/util/dateTimeFormat';
import { time } from 'console';

interface SongDetailsComponentProps {
    fileContent: string;
    song: Song;
    startDate: string;
    endDate: string;
    onBack: () => void;
}

/**
 * This function will get the time listened, times streamed,
 * average time listened per stream, and an Averages object
 * @param fileContent the JSON content of the file
 * @param song the song to get the data for
 * @param startDate the start date of the filter (YYYY-MM-DD)
 * @param endDate the end date of the filter (YYYY-MM-DD)
 * @returns an object containing the time listened in minutes, time streamed,
 * average time listened per stream, and an Averages object
 */
const getSongData = (fileContent: string, song: Song, startDate: string, endDate: string): { timeListened: number, timesStreamed: number, averageTimeListenedPerStream: number, averages: AverageListeningData } => {
    const data = JSON.parse(fileContent);
    const songData = data.filter((record: { artistName: string; trackName: string; msPlayed: number; endTime: string; }) => {
        // Convert recordTime to YYYY-MM-DD format
        const recordTime = record.endTime.split(' ')[0];

        // Only process records within the date range
        if (recordTime >= startDate && recordTime <= endDate) {
            console.log("here");
            return record.artistName === song.artist && record.trackName === song.name;
        }
        return false;
    });
    
    console.log("data: " + songData);

    // get the number of days in the date range, ensuring both dates are inclusive
    const dateRange = new Date(endDate).getTime() - new Date(startDate).getTime();
    const days = dateRange / (1000 * 3600 * 24) + 1;

    const timeListened = songData.reduce((accumulator: number, currentValue: { msPlayed: number; }) => accumulator + currentValue.msPlayed, 0) / 60000;
    const timesStreamed = songData.length;
    const averageTimeListenedPerStream = timeListened / timesStreamed;
    const averages = {
        Daily: {
            minutesListened: timeListened / days,
            timesStreamed: timesStreamed / days,
        },
        Weekly: {
            minutesListened: timeListened / (days / 7),
            timesStreamed: timesStreamed / (days / 7),
        },
        Monthly: {
            minutesListened: timeListened / (days / 30),
            timesStreamed: timesStreamed / (days / 30),
        },
        Yearly: {
            minutesListened: timeListened / (days / 365),
            timesStreamed: timesStreamed / (days / 365),
        },

    };

    return { timeListened, timesStreamed, averageTimeListenedPerStream, averages };
}

/**
 * This component displays details of a specific song, including the listening clock
 */
const SongDetailsComponent: React.FC<SongDetailsComponentProps> = ({ fileContent, song, startDate, endDate, onBack }) => {
    // Render song details and listening clock, listening clock will just use this year for now
    // We want to display the song name, artist, time listened, times streamed, average time listened per stream
    // in the same format as the profile stats page.
    // TODO have an arrow left for the back button
    const [selectedAveragePeriod, setSelectedAveragePeriod] = useState<string>('Daily');

    const { timeListened, timesStreamed, averageTimeListenedPerStream, averages } = getSongData(fileContent, song, startDate, endDate);
    console.log(averages);
    console.log(timeListened);
    console.log(timesStreamed);
    console.log(averageTimeListenedPerStream);
    const data = getSongListeningTimeByMonth(fileContent, song, new Date().getFullYear().toString());
    return (
        <div>
            <button onClick={onBack}>Back</button>
            <h1>{song.name}</h1>
            <h2>{song.artist}</h2>
            
            <table>
                <tbody>
                    <tr><td>Stream Time</td><td>{timeFormat(timeListened)} ({timeListened.toFixed(1)} minutes)</td></tr>
                    <tr><td>Streams</td><td>{timesStreamed}</td></tr>
                    <tr><td>Average Time per Stream</td><td>{timeFormat(averageTimeListenedPerStream)} ({(averageTimeListenedPerStream).toFixed(1)} minutes)</td></tr>
                    <div className="py-2 flex-row" style={{ overflowX: 'auto' }}>
                        <div className="flex">
                            {
                                // create buttons for each average period
                                Object.keys(averages).map(period => (
                                    <button
                                        key={period}
                                        onClick={() => setSelectedAveragePeriod(period)}
                                        className={period === selectedAveragePeriod ? '' : 'option-button'}
                                        style={{ marginRight: '8px' }}
                                    >
                                        {period}
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                    <tr><td>Minutes Listened</td><td>{timeFormat(averages[selectedAveragePeriod].minutesListened)} ({(averages[selectedAveragePeriod].minutesListened).toFixed(1)} minutes)</td></tr>
                    <tr><td>Times Streamed</td><td>{(averages[selectedAveragePeriod].timesStreamed).toFixed(1)}</td></tr>
                </tbody>
            </table>
            <ListeningClockComponent data={data} year={new Date().getFullYear().toString()} />

        </div>
    );
};

export default SongDetailsComponent;