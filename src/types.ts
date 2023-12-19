export interface Artist {
    name: string;
    minutesListened: number;
    timesStreamed: number;
}

export interface Song {
    name: string;
    artist: string;
    minutesListened: number;
    timesStreamed: number;
}

export interface JSONSong {
    endTime: string;
    artistName: string;
    trackName: string;
    msPlayed: number;
}

export interface NumberByMonth {
    month: string;
    value: number;
}