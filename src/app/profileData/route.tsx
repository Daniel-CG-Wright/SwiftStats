import axios from 'axios';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const username = req.nextUrl.searchParams.get('username');

    const response = await axios.post(`https://accounts.spotify.com/api/token?grant_type=client_credentials&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`, '', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    const bearerToken = response.data.access_token;
    let profileResponse: any;
    try {
        profileResponse = await axios.get(`https://api.spotify.com/v1/users/${username}`, {
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: 'An error occurred while fetching the Spotify data.' + error.message });
    }

    const data = profileResponse.data;
    const imageUrl = data.images.length > 0 ? data.images[0].url : "";
    const profileData = {
        imageUrl: imageUrl,
        spotifyUrl: data.external_urls.spotify,
        displayName: data.display_name,
        followers: data.followers.total
    };

    return NextResponse.json(profileData);
}