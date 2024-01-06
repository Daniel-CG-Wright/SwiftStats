import axios from 'axios';
import { APIData, SongAPIData, QuantityCriteria, Categories } from '../types';

let bearerToken: string;

/**
 * This gets API data for a song, album or artist from Spotify's Search API endpoint.
 * @param {QuantityCriteria} criteria - The criteria to search for - includes the name of the song, album or artist.
 * @param {string} type - The type of query to search for. Can be 'track', 'album' or 'artist'.
 * @returns {Promise<APIData | SongAPIData>} The API data for the query (song API data if type is 'track').
 */
export const getAPIData = async (criteria: QuantityCriteria, type: Categories): Promise<APIData | SongAPIData | null> => {
    let query = "";
    if (criteria.trackName && type === Categories.TRACK)
    {
        query += `track:${criteria.trackName}`;
    }
    if (criteria.albumName && (type === Categories.TRACK || type === Categories.ALBUM))
    {
        query += ` album:${criteria.albumName}`;
    }
    query += ` artist:${criteria.artist}`;
    if (type !== Categories.TRACK && type !== Categories.ALBUM && type !== Categories.ARTIST)
    {
        // default to artist
        type = Categories.ARTIST;
    }
    console.log("query: " + query);
    query = encodeURIComponent(query);
    if (!bearerToken)
    {
        await getBearerToken();
    }
    let response;
    try {
        response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=${type}&limit=1`, {
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        });
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            await getBearerToken(); // Get a new bearer token
            response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=${type}&limit=1`, {
                headers: {
                    'Authorization': `Bearer ${bearerToken}`
                }
            });
        } else {
            throw error; // Re-throw the error if it's not an unauthorized error
        }
    }
    const data = response.data;

    // If the API returns no results, return null
    if (data[type + 's'].items.length === 0)
    {
        console.log(`No results found for ${type} ${criteria.artist} ${criteria.trackName} ${criteria.albumName}`);
        return null;
    }

    if (type === 'track')
    {
        const songData: SongAPIData = {
            imageUrl: data.tracks.items[0].album.images[0].url,
            spotifyUrl: data.tracks.items[0].external_urls.spotify,
            previewUrl: data.tracks.items[0].preview_url
        };
        return songData;
    }
    else
    {
        const dataToReturn: APIData = {
            imageUrl: data[type + 's'].items[0].images[0].url,
            spotifyUrl: data[type + 's'].items[0].external_urls.spotify
        };
        return dataToReturn;
    }

}

/**
 * This gets a bearer token from Spotify's API using the client ID and client secret.
 * It then sets the bearer token in memory.
 */
const getBearerToken = async () => {
    const response = await axios.post(`https://accounts.spotify.com/api/token?grant_type=client_credentials&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_CLIENT_SECRET}`,
    ``, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    
    bearerToken = response.data.access_token;
}