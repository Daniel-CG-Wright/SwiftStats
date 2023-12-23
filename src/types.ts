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