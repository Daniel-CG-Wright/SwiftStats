import axios from 'axios';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { criteria, type } = await req.json();

    const response = await axios.post(`https://accounts.spotify.com/api/token?grant_type=client_credentials&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`, '', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    const bearerToken = response.data.access_token;

    let spotifyResponse: any;
    try {
        spotifyResponse = await axios.get(`https://api.spotify.com/v1/search?q=${criteria}&type=${type}&limit=1`, {
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'An error occurred while fetching the Spotify data.' });
    }

    const data = spotifyResponse.data;
    const spotifyData = {
        imageUrl: data[type + 's'].items[0].images ? data[type + 's'].items[0].images[0].url : data[type + 's'].items[0].album.images[0].url,
        spotifyUrl: data[type + 's'].items[0].external_urls.spotify
    };

    return NextResponse.json(spotifyData);
}