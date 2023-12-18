import React from 'react';

interface Artist {
    name: string;
    minutesListened: number;
}

const getMostListenedArtists = (fileContent: string): Artist[] => {
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

const MostListenedArtistsComponent: React.FC<{ fileContent: string }> = ({ fileContent }) => {
    const artists = getMostListenedArtists(fileContent);

    return (
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Artist</th>
                    <th>Minutes Listened</th>
                </tr>
            </thead>
            <tbody>
                {artists.map((artist, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{artist.name}</td>
                        <td>{artist.minutesListened.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default MostListenedArtistsComponent;