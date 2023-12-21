import { Song, Artist, NumberByMonth, JSONSong, QuantityCriteria } from '../types';

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

/**
 * This function gets the listening time by month for an artist.
 * @param fileContent - The contents of the listening history file.
 * @param selectedArtist - The artist name to get the listening time for.
 * @param year - The year to get the listening time for.
 * @returns An array of objects with the month and the number of minutes listened
 */
export const getArtistListeningTimeByMonth = (fileContent: string, selectedArtist: string, year: string): NumberByMonth[] => {
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
                (selectedArtist != '' && record.artistName === selectedArtist)
                || selectedArtist === ''
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
 * This function gets the listening time by month for a song.
 * @param fileContent - The contents of the listening history file.
 * @param song - The song to get the listening time for.
 * @param year - The year to get the listening time for.
 * @returns An array of objects with the month and the number of minutes listened
 */
export const getSongListeningTimeByMonth = (fileContent: string, song: Song, year: string): NumberByMonth[] => {
    const data = JSON.parse(fileContent);

    const listeningTimeByMonth = new Map<string, number>();

    // if song is undefined, make an empty song object
    if (!song) {
        song = { name: '', artist: '', minutesListened: 0, timesStreamed: 0 };
    }

    data.forEach((record: JSONSong) => {
        // get the year from the record's endTime
        const recordYear = record.endTime.split('-')[0];

        // Only process records within the date range
        if (recordYear === year) {
            const key = record.endTime.split('-')[1];
            if (
                (record.trackName === song.name && record.artistName === song.artist)
                || (song.name === '' && song.artist === '')
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
}

/**
 * This function gets the date that an
 */