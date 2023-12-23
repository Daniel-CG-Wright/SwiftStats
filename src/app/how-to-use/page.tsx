// src/app/how-to-use/page.tsx
"use client"
import React from 'react';

const HowToUsePage: React.FC = () => {
    return (
        <div className="px-2 py-4">
            <h1>How To Use SwiftStats</h1>
            <div className="text-section">
                <h2>Step 1: Request your listening data</h2>
                <p>
                    To request your listening data, go to <a href="https://www.spotify.com/uk/account/privacy/">Spotify's privacy page</a>.
                    After logging in, you then have 2 options - you can request your extended streaming history, or just your basic streaming history.
                    The extended streaming history takes longer to receive, but it will have your entire listening history, whereas the basic streaming
                    history will only have your last 12 months of listening history. Once you have requested your data, you will receive an email from
                    Spotify when your data is ready to download.
                </p>
            </div>
            <div className="text-section">
                <h2>Step 2: Download your data</h2>
                <p>
                    Once you have received the email from Spotify, you can download your data. This will be a zip file containing a number of JSON files.
                    You will need to unzip this file to continue. On Windows, you can do this by right clicking the file and clicking "Extract All".
                    You should then see a folder with the same name as the zip file. Open this folder, and you should see a number of JSON files.
                </p>
            </div>
            <div className="text-section">
                <h2>Step 3: Upload your data</h2>
                <p>
                    Now that you have your data, you can upload it to SwiftStats. Click the "Choose File" button and select the "StreamingHistory0.json"
                    file. This is the main file that contains all of your listening data. Once you have selected this file, click the "Upload" button.
                    SwiftStats will then process your data and display the results.
                </p>
            </div>
            <div className="text-section">
                <h2>Step 4: Explore your data</h2>
                <p>
                    You can now explore your listening data. You can use the date pickers to select a date range to filter your data by. You can also
                    click on the different sections to see more information about your listening habits. You can click on a song to see more information
                    about that song, including a listening clock and a graph of the times you listened to that song. You can also click on an artist to
                    see more information about that artist, including a graph of the times you listened to that artist.
                </p>
            </div>
        </div>
    );
};

export default HowToUsePage;