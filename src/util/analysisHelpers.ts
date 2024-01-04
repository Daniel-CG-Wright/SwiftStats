import { Song, Artist, Album, JSONSong, AverageListeningData, QuantityCriteria, FileData, Site, ListeningDataByMonth } from '../types';

export const getFileSite = (parsedFile: any[]): Site => {
    try {
        // ts is on extended spotify files
        if (parsedFile[0].artistName) {
            return Site.SPOTIFY;
        }
        else if (parsedFile[0].ts)
        {
            return Site.SPOTIFY_EXTENDED
        }
        return Site.YOUTUBE;
    } catch {
        return Site.NONE;
    }

}


/**
 * This function takes in the file string content and returns FileData
 * @param fileContent the string content of the file
 * @param cutoffTime the cutoff time for the file (records with less than this time will be filtered out)
 * @returns FileData
 */
export const getFileData = (fileContent: string, cutoffTime: number): FileData => {
    const parsedContent = JSON.parse(fileContent);
    // content was validated in the file upload component
    const site = getFileSite(parsedContent);
    // convert the data to the JSONSong format - spotify can be used as is, youtube needs to be converted
    let data: JSONSong[] = [];
    try {
        if (site === Site.SPOTIFY) {

            data = parsedContent;
            // filter out songs with less than 5000 ms played, and split " " from the date to get the left part which is the YYYY-MM-DD format
            data = 
            // filter out songs without the required fields as wel
            data
            .filter((record: JSONSong) => record.artistName && record.trackName && 
            record.endTime && record.msPlayed && record.msPlayed >= cutoffTime)
            .map((record: JSONSong) => ({ ...record, endTime: record.endTime.split(' ')[0] }));
            
        } 
        else if (site === Site.SPOTIFY_EXTENDED) {
            data = parsedContent
                .filter((record: 
                    { 
                        ms_played: number;
                        master_metadata_album_artist_name: string; 
                        master_metadata_track_name: string;
                    }) => record.ms_played >= cutoffTime
                && record.master_metadata_album_artist_name && record.master_metadata_track_name)
                .map((record: {
                    ts: string; master_metadata_album_artist_name: string;
                    master_metadata_track_name: string;
                    ms_played: number;
                    spotify_track_uri: string;
                    master_metadata_album_album_name: string; }) => ({
                    endTime: record.ts.split('T')[0],
                    artistName: record.master_metadata_album_artist_name,
                    trackName: record.master_metadata_track_name,
                    msPlayed: record.ms_played,
                    trackUri: record.spotify_track_uri,
                    albumName: record.master_metadata_album_album_name,
                }));
        }
        else {        
            data = parsedContent
            // @ts-expect-error
            .filter(record => 
                record.activityControls && record.activityControls.length === 1 && record.activityControls[0].toLowerCase() === 'youtube watch history'
                && record.header && record.header.toLowerCase() === 'youtube music')
            .map((record: { 
                title: string,
                titleUrl: string,
                subtitles: { 
                    name: string,
                    url: string,
                    }[],
                time: string
                }) => ({
                    // convert time to YYYY-MM-DD format
                endTime: record.time.split('T')[0],
                artistName: record.subtitles && record.subtitles.length > 0 ? record.subtitles[0].name : "Unknown Artist",
                trackName: record.title,
                trackUrl: record.titleUrl,
                artistUrl: record.subtitles && record.subtitles.length > 0 ? record.subtitles[0].url : null,
                msPlayed: 0,
            }));
        }
        if (data.length === 0) {
            return { site: Site.NONE, data: [], lastDate: '', firstDate: '' };
        }
    } catch {
        return { site: Site.NONE, data: [], lastDate: '', firstDate: '' };
    }
    // find the earliest and latest dates
    let firstDate = data[0].endTime;
    let lastDate = data[0].endTime;
    data.forEach((record: { endTime: string; }) => {
        if (record.endTime < firstDate) {
            firstDate = record.endTime;
        }
        if (record.endTime > lastDate) {
            lastDate = record.endTime;
        }
    });

    return { site, data, lastDate, firstDate };
}

/**
 * This function takes in the file JSON content and returns a list of songs listened
 * to in order of most listened to by ms listened. This is using the Spotify ListenignData JSOn file
 * @param fileContent the JSON content of the file
 * @param startDate the start date of the filter
 * @param endDate the end date of the filter
 * @param artists the list of artists so that the song can be linked to an artist
 * @param albums the list of albums so that the song can be linked to an album
 * @returns a list of songs listened to in order of most listened to by ms listened
 * (see the Song interface for more details)
 */
export const getMostSongsListenedTo = (fileData: FileData, startDate: string, endDate: string, artists: Artist[], albums?: Album[]): Song[] => {
    const artistTrackSeparator = '¬sep¬';
    const data = fileData.data;

    const playtimeMap = new Map<string, number>();
    const streamCountMap = new Map<string, number>();
    const albumMap = new Map<string, Album>();

    data.forEach((record: { artistName: string; trackName: string; msPlayed: number; endTime: string; albumName?: string; }) => {
        // Convert recordTime to YYYY-MM-DD format
        const recordTime = record.endTime.split(' ')[0];

        // Only process records within the date range
        if (recordTime >= startDate && recordTime <= endDate) {
            const key = `${record.artistName}${artistTrackSeparator}${record.trackName}`;
            const currentPlaytime = playtimeMap.get(key) || 0;
            const currentStreamCount = streamCountMap.get(key) || 0;
            playtimeMap.set(key, currentPlaytime + record.msPlayed);
            streamCountMap.set(key, currentStreamCount + 1);
            if (record.albumName && !albumMap.has(key)) {
                // get the album from the list of albums, and if it exists, add it to the map
                const album = albums?.find(album => album.name === record.albumName);
                if (album) {
                    albumMap.set(key, album);
                }
            }
        }
    });
    
    let songsListenedTo = Array.from(playtimeMap)
        .map(([key, msPlayed]) => ({
            artist: artists.find(artist => artist.name === key.split(artistTrackSeparator)[0]) || { name: key.split(artistTrackSeparator)[0], minutesListened: 0, timesStreamed: 0, position: 0 },
            name: key.split(artistTrackSeparator)[1],
            minutesListened: Number((msPlayed / 60000).toFixed(1)),
            timesStreamed: streamCountMap.get(key) || 0,
            position: 0,
            album: albumMap.get(key) || undefined,
    }));
    if (fileData.site === Site.SPOTIFY || fileData.site === Site.SPOTIFY_EXTENDED) {
        songsListenedTo = songsListenedTo.filter(song => song.minutesListened > 1)
        .sort((a, b) => b.minutesListened - a.minutesListened);
    }
    else if (fileData.site === Site.YOUTUBE) {
        songsListenedTo = songsListenedTo.filter(song => song.timesStreamed > 1)
        .sort((a, b) => b.timesStreamed - a.timesStreamed);
    }

    // Add position to each song
    songsListenedTo.forEach((song, index) => {
        song.position = index + 1;
    });

    return songsListenedTo;
};

/**
 * This function gets a list of artists in order of most listened to least listened
 * and returns an array of objects with the artist name and the number of minutes listened
 * @param fileData
 * @param startDate the start date of the filter
 * @param endDate the end date of the filter
 * @returns An array of objects with the artist name and the number of minutes listened
 */
export const getMostListenedArtists = (fileData: FileData, startDate: string, endDate: string): Artist[] => {
    const data = fileData.data;
    const playtimeMap = new Map<string, number>();
    const timesStreamedMap = new Map<string, number>();

    // startDate and endDate are in the format YYYY-MM-DD

    data.forEach((record: { artistName: string; msPlayed: number, endTime: string }) => {
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

    let artists = Array.from(playtimeMap, ([name, minutesListened]) => ({ name, minutesListened: minutesListened / 60000, timesStreamed: timesStreamedMap.get(name) || 0, position: 0}));
    if (fileData.site === Site.SPOTIFY || fileData.site === Site.SPOTIFY_EXTENDED) {
        artists = artists.filter(artist => artist.minutesListened > 1)
        .sort((a, b) => b.minutesListened - a.minutesListened);
    }
    else if (fileData.site === Site.YOUTUBE) {
        artists = artists.filter(artist => artist.timesStreamed > 1)
        .sort((a, b) => b.timesStreamed - a.timesStreamed);
    }

    artists.forEach((artist, index) => {
        artist.position = index + 1;
    });

    return artists;
};

/**
 * This function gets a list of albums in order of most listened to least listened
 * and returns an array of objects with the album name and the number of minutes listened
 * @param fileData
 * @param startDate the start date of the filter
 * @param endDate the end date of the filter
 * @param artists the list of artists so that the album can be linked to an artist
 * @returns An array of objects with the album name and the number of minutes listened
 */
export const getMostListenedAlbums = (fileData: FileData, startDate: string, endDate: string, artists: Artist[]): Album[] => {
    const data = fileData.data;
    const playtimeMap = new Map<string, number>();
    const timesStreamedMap = new Map<string, number>();

    // startDate and endDate are in the format YYYY-MM-DD

    data.forEach((record: { artistName: string; albumName?: string; msPlayed: number, endTime: string }) => {
        // Compare the record's end time to the start and end dates (after converting the record's end time to YYYY-MM-DD)
        const recordTime = new Date(record.endTime).toISOString().split('T')[0];

        // Only process records within the date range
        if (recordTime >= startDate && recordTime <= endDate) {
            const key = `${record.artistName}¬sep¬${record.albumName}`;
            const currentPlaytime = playtimeMap.get(key) || 0;
            playtimeMap.set(key, currentPlaytime + record.msPlayed);
            const currentTimesStreamed = timesStreamedMap.get(key) || 0;
            timesStreamedMap.set(key, currentTimesStreamed + 1);
        }
    });

    let albums = Array.from(playtimeMap, ([name, minutesListened]) => ({
        name: name.split('¬sep¬')[1],
        artist: artists.find(artist => artist.name === name.split('¬sep¬')[0]) || { name: name.split('¬sep¬')[0], minutesListened: 0, timesStreamed: 0, position: 0 },
        minutesListened: minutesListened / 60000,
        timesStreamed: timesStreamedMap.get(name) || 0,
        position: 0,
    }));
    if (fileData.site === Site.SPOTIFY || fileData.site === Site.SPOTIFY_EXTENDED) {
        albums = albums.filter(album => album.minutesListened > 1)
        .sort((a, b) => b.minutesListened - a.minutesListened);
    }
    else if (fileData.site === Site.YOUTUBE) {
        albums = albums.filter(album => album.timesStreamed > 1)
        .sort((a, b) => b.timesStreamed - a.timesStreamed);
    }

    albums.forEach((album, index) => {
        album.position = index + 1;
    });

    return albums;
};

/**
 * This function gets the listening time by month for an artist. Will do streams instead of minutes listened for youtube
 * @param fileContent - The contents of the listening history file.
 * @param criteria - The criteria to filter the data by. If the artist is not specified, all artists will be included.
 * If the track name is not specified, all tracks by the artist will be included.
 * If both are specified, only the specified track will be included.
 * @param year - The year to get the listening time for.
 * @returns An array of objects with the month and the number of minutes listened and times streamed
 */
export const getListeningTimeByMonth = (fileData: FileData, criteria: QuantityCriteria, year: string): ListeningDataByMonth[] => {
    const data = fileData.data;

    const dataPerMonth = new Map<string, { minutesListened: number, timesStreamed: number }>();

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
                const currentData = dataPerMonth.get(key) || { minutesListened: 0, timesStreamed: 0 };
                dataPerMonth.set(key, {
                    minutesListened: currentData.minutesListened + (record.msPlayed / 60000),
                    timesStreamed: currentData.timesStreamed + 1,
                });
            }
        }
    });

    const dataPerMonthArray = Array.from(dataPerMonth).map(([key, value]) => ({
        month: key,
        minutesListened: value.minutesListened,
        timesStreamed: value.timesStreamed,
    }));

    // for months with no listening time, add 0
    for (let i = 1; i <= 12; i++) {
        if (!dataPerMonthArray.some((record: ListeningDataByMonth) => record.month === i.toString())) {
            dataPerMonthArray.push({ month: i.toString(), minutesListened: 0, timesStreamed: 0 });
        }
    }

    return dataPerMonthArray.sort((a, b) => Number(a.month) - Number(b.month));
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
export const getDetailedData = (fileData: FileData, criteria: QuantityCriteria, startDate: string, endDate: string): { timeListened: number, timesStreamed: number, averageTimeListenedPerStream: number, averages: AverageListeningData } => {
    const data = fileData.data;
    const songData = data.filter((record: { artistName: string; trackName: string; msPlayed: number; endTime: string; }) => {
        // Only process records within the date range
        if (record.endTime >= startDate && record.endTime <= endDate) {
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