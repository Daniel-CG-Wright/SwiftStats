import { Song, Artist } from '../types';

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

    const artists = Array.from(playtimeMap, ([name, minutesListened]) => ({ name, minutesListened: minutesListened / 60000, timesStreamed: timesStreamedMap.get(name) || 0}));

    // Sort artists by minutes listened in descending order
    return artists.filter(song => song.minutesListened > 1).sort((a, b) => b.minutesListened - a.minutesListened);
};