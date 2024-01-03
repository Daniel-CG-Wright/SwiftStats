import React, { useState } from "react";
import { timeFormat } from "@/util/dateTimeFormat";
import { AverageListeningData, Site } from "@/types";


interface DetailedInfoComponentProps {
    site: Site;
    timeListened: number;
    timesStreamed: number;
    averageTimeListenedPerStream: number;
    averages: AverageListeningData;
}

/**
 * This component displays detailed data, used for songs, artists or profile.
 * @param props the props
 */
const DetailedInfoComponent: React.FC<DetailedInfoComponentProps> = ({ site, timeListened, timesStreamed, averageTimeListenedPerStream, averages }) => {
    const [selectedAveragePeriod, setSelectedAveragePeriod] = useState<string>('Daily');
    return (
        <>
            { site !== Site.YOUTUBE && <tr><td>Stream Time</td><td>{timeFormat(timeListened)} ({timeListened.toFixed(1)} minutes)</td></tr> }
            <tr><td>Streams</td><td>{timesStreamed}</td></tr>
            { site !== Site.YOUTUBE && <tr><td>Average Time per Stream</td><td>{timeFormat(averageTimeListenedPerStream)} ({(averageTimeListenedPerStream).toFixed(1)} minutes)</td></tr> }
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
            { site !== Site.YOUTUBE && <tr><td>Minutes Listened</td><td>{timeFormat(averages[selectedAveragePeriod as keyof AverageListeningData].minutesListened)} ({(averages[selectedAveragePeriod as keyof AverageListeningData].minutesListened).toFixed(1)} minutes)</td></tr> }
            <tr><td>Times Streamed</td><td>{(averages[selectedAveragePeriod as keyof AverageListeningData].timesStreamed).toFixed(1)}</td></tr>
        </>
    );
}

export default DetailedInfoComponent;