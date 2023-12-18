import { Song, Artist } from '../types';

/**
 * This function gets a list of artists in order of most listened to least listened
 * and returns an array of objects with the artist name and the number of minutes listened
 * @param fileContent - The contents of the listening history file.
 * @returns An array of objects with the artist name and the number of minutes listened
 */
export const getMostListenedArtists = (fileContent: string): Artist[] => {
    const data = JSON.parse(fileContent);
    const playtimeMap = new Map<string, number>();

    data.forEach((record: { artistName: string; msPlayed: number }) => {
        const currentPlaytime = playtimeMap.get(record.artistName) || 0;
        playtimeMap.set(record.artistName, currentPlaytime + record.msPlayed);
    });

    const artists = Array.from(playtimeMap, ([name, minutesListened]) => ({ name, minutesListened: minutesListened / 60000 }));

    // Sort artists by minutes listened in descending order
    return artists.filter(song => song.minutesListened > 1).sort((a, b) => b.minutesListened - a.minutesListened);
};