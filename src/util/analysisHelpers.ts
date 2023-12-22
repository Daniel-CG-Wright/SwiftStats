import { Song, Artist, NumberByMonth, JSONSong, AverageListeningData, QuantityCriteria } from '../types';



/**
 * This function takes in the file JSON content and returns a list of songs listened
 * to in order of most listened to by ms listened. This is using the Spotify ListenignData JSOn file
 * @param fileContent the JSON content of the file
 * @param startDate the start date of the filter
 * @param endDate the end date of the filter
 * @returns a list of songs listened to in order of most listened to by ms listened
 * (see the Song interface for more details)
 */
export const getMostSongsListenedTo = (fileContent: string, startDate: string, endDate: string, artists: Artist[]): Song[] => {
    const artistTrackSeparator = '¬sep¬';
    const data = JSON.parse(fileContent);

    const playtimeMap = new Map<string, number>();
    const streamCountMap = new Map<string, number>();

    data.forEach((record: { artistName: string; trackName: string; msPlayed: number; endTime: string; }) => {
        // Convert recordTime to YYYY-MM-DD format
        const recordTime = record.endTime.split(' ')[0];

        // Only process records within the date range
        if (recordTime >= startDate && recordTime <= endDate) {
            const key = `${record.artistName}${artistTrackSeparator}${record.trackName}`;
            const currentPlaytime = playtimeMap.get(key) || 0;
            const currentStreamCount = streamCountMap.get(key) || 0;
            playtimeMap.set(key, currentPlaytime + record.msPlayed);
            streamCountMap.set(key, currentStreamCount + 1);
        }
    });
    
    const songsListenedTo = Array.from(playtimeMap)
        .map(([key, msPlayed]) => ({
            artist: artists.find(artist => artist.name === key.split(artistTrackSeparator)[0]) || { name: key.split(artistTrackSeparator)[0], minutesListened: 0, timesStreamed: 0, position: 0 },
            name: key.split(artistTrackSeparator)[1],
            minutesListened: Number((msPlayed / 60000).toFixed(1)),
            timesStreamed: streamCountMap.get(key) || 0,
            position: 0,
        }))
        .filter(song => song.minutesListened > 1)
        .sort((a, b) => b.minutesListened - a.minutesListened);

    // Add position to each song
    songsListenedTo.forEach((song, index) => {
        song.position = index + 1;
    });

    return songsListenedTo;
};

/**
 * This function gets a list of artists in order of most listened to least listened
 * and returns an array of objects with the artist name and the number of minutes listened
 * @param fileContent - The contents of the listening history file.
 * @returns An array of objects with the artist name and the number of minutes listened
 */
export const getMostListenedArtists = (fileContent: string, startDate: string, endDate: string): Artist[] => {
    const data = JSON.parse(fileContent);
    const playtimeMap = new Map<string, number>();
    const timesStreamedMap = new Map<string, number>();

    // startDate and endDate are in the format YYYY-MM-DD

    data.forEach((record: { artistName: string; msPlayed: number, endTime: number }) => {
        // Compare the record's end time to the start and end dates (after converting the record's end time to YYYY-MM-DD)
        const recordTime = new Date(record.endTime).toISOString().split('T')[0];

        // Only process records within the date range
        if (recordTime >= startDate && recordTime <= endDate) {
            const currentPlaytime = playtimeMap.get(record.artistName) || 0;
            playtimeMap.set(record.artistName, currentPlaytime + record.msPlayed);
            const currentTimesStreamed = timesStreamedMap.get(record.artistName) || 0;
            timesStreamedMap.set(record.artistName, currentTimesStreamed + 1);
        }
    });

    const artists = Array.from(playtimeMap, ([name, minutesListened]) => ({ name, minutesListened: minutesListened / 60000, timesStreamed: timesStreamedMap.get(name) || 0, position: 0})).filter(artist => artist.minutesListened > 1);
    // need to sort artists and assign position, then return
    artists.sort((a, b) => b.minutesListened - a.minutesListened);
    artists.forEach((artist, index) => {
        artist.position = index + 1;
    });

    return artists;
};

/**
 * This function gets the listening time by month for an artist.
 * @param fileContent - The contents of the listening history file.
 * @param criteria - The criteria to filter the data by. If the artist is not specified, all artists will be included.
 * If the track name is not specified, all tracks by the artist will be included.
 * If both are specified, only the specified track will be included.
 * @param year - The year to get the listening time for.
 * @returns An array of objects with the month and the number of minutes listened
 */
export const getListeningTimeByMonth = (fileContent: string, criteria: QuantityCriteria, year: string): NumberByMonth[] => {
    const data = JSON.parse(fileContent);

    const listeningTimeByMonth = new Map<string, number>();

    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    data.forEach((record: JSONSong) => {
        // Convert record's endTime to YYYY-MM-DD format
        const recordTime = record.endTime.split(' ')[0];

        // Only process records within the date range
        if (recordTime >= startDate && recordTime <= endDate) {
            const key = record.endTime.split('-')[1];
            if (
                (criteria.artist != '' && record.artistName === criteria.artist && (!criteria.trackName || record.trackName === criteria.trackName))
                || criteria.artist === ''
                ) {
                const currentListeningTime = listeningTimeByMonth.get(key) || 0;
                listeningTimeByMonth.set(key, currentListeningTime + record.msPlayed);
            }
        }
    });

    const listeningTimeByMonthArray = Array.from(listeningTimeByMonth).map(([key, value]) => ({
        month: key,
        value: Number((value / 60000).toFixed(1)),
    }));

    // for months with no listening time, add 0
    for (let i = 1; i <= 12; i++) {
        if (!listeningTimeByMonthArray.some((record: NumberByMonth) => record.month === i.toString())) {
            listeningTimeByMonthArray.push({ month: i.toString(), value: 0 });
        }
    }

    return listeningTimeByMonthArray.sort((a, b) => Number(a.month) - Number(b.month));
};

/**
 * This function will get the time listened, times streamed,
 * average time listened per stream, and an Averages object
 * @param fileContent the JSON content of the file
 * @param criteria the criteria to filter the data by - if the artist is not specified, all artists will be included.
 * If the track name is not specified, all tracks by the artist will be included.
 * If both are specified, only the specified track will be included.
 * If neither are specified, all songs will be included.
 * @param startDate the start date of the filter (YYYY-MM-DD)
 * @param endDate the end date of the filter (YYYY-MM-DD)
 * @returns an object containing the time listened in minutes, time streamed,
 * average time listened per stream, and an Averages object
 */
export const getDetailedData = (fileContent: string, criteria: QuantityCriteria, startDate: string, endDate: string): { timeListened: number, timesStreamed: number, averageTimeListenedPerStream: number, averages: AverageListeningData } => {
    const data = JSON.parse(fileContent);
    const songData = data.filter((record: { artistName: string; trackName: string; msPlayed: number; endTime: string; }) => {
        // Convert recordTime to YYYY-MM-DD format
        const recordTime = record.endTime.split(' ')[0];

        // Only process records within the date range
        if (recordTime >= startDate && recordTime <= endDate) {
            return (
                (criteria.artist != '' && record.artistName === criteria.artist && (!criteria.trackName || record.trackName === criteria.trackName))
                || criteria.artist === ''
            );
        }
        return false;
    });
    
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