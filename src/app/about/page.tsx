import React from 'react';

const AboutPage: React.FC = () => {
    return (
        <div className="px-2 py-4">
            <h1>About SwiftStats</h1>
            <div className="text-section">
                <p>
                    SwiftStats is a web app that allows you to analyze your Spotify listening history. It uses the JSON data provided by Spotify when you
                    request your listening data via <a className="inline-link" href="https://www.spotify.com/uk/account/privacy/">Spotify's privacy page</a> to provide accurate
                    statistics about your listening habits. Thank you for using SwiftStats!
                </p>
            </div>
            <div className="text-section">
                <h2>Privacy</h2>
                <p>
                    SwiftStats does not store any of your data. As it is open source, you can examine the source code to verify this.
                </p>
            </div>
            <div className="text-section">
                <h2>Why not use the Spotify API?</h2>
                <p>
                    Although the listening data request takes a few days to receive the data for, it is 100% accurate for the timeframe, whereas the Spotify
                    API is quite inaccurate. As the API is not communicated with, no images for albums are shown, but this is a small price to pay for
                    accuracy.
                </p>
            </div>
            <div className="text-section">
                <h2>Development</h2>
                <p>
                    SwiftStats is completely free and open source, developed by Daniel Wright as a personal project. The source code can be found on <a className="inline-link" href="https://github.com/Daniel-CG-Wright/SwiftStats">GitHub</a>. If you have any suggestions or issues, please raise them on the
                    GitHub repo. If you like this silly little website and have cash to spare,
                    please consider donating to me via <a className="inline-link" href="https://paypal.me/danielwright1322?country.x=GB&locale.x=en_GB">PayPal</a>.
                </p>
            </div>
        </div>
    );
};

export default AboutPage;
