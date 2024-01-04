export interface Artist {
    name: string;
    minutesListened: number;
    timesStreamed: number;
    position: number;
}

export interface Song {
    name: string;
    artist: Artist;
    minutesListened: number;
    timesStreamed: number;
    position: number;
    album?: Album;
}

export interface Album {
    name: string;
    artist: Artist;
    minutesListened: number;
    timesStreamed: number;
    position: number;
}

// designed to incorporate elements from spotify and youtube, used to store JSON
// data in FileData
export interface JSONSong {
    endTime: string;
    artistName: string;
    trackName: string;
    // spotify-exclusive, will be 0 if not spotify
    msPlayed: number;
    // spotify-extended exclusive
    trackUri?: string;
    albumName?: string;
    // youtube-exclusive
    trackUrl?: string;
    artistUrl?: string;
}

export interface NumberByMonth {
    month: string;
    value: number;
}

export interface MinutesAndTimesStreamed {
    minutesListened: number;
    timesStreamed: number;
}

/**
 * We use capitalised starting characters here against convention because
 * this allows us to tranlsate the fields directly to text in the UI.
 */
export interface AverageListeningData {
    Daily: MinutesAndTimesStreamed;
    Weekly: MinutesAndTimesStreamed;
    Monthly: MinutesAndTimesStreamed;
    Yearly: MinutesAndTimesStreamed;
}

export interface QuantityCriteria {
    artist: string;
    trackName: string;
}

export enum Site {
    SPOTIFY = "Spotify",
    YOUTUBE = "YouTube Music",
    SPOTIFY_EXTENDED = "Spotify Extended",
    NONE = "None",
}
export interface FileData {
    site: Site;
    data: JSONSong[];
    // these will be in the format YYYY-MM-DD
    firstDate: string;
    lastDate: string;
}

export interface ListeningDataByMonth {
    month: string;
    minutesListened: number;
    timesStreamed: number;
}
