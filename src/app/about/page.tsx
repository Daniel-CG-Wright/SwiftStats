import React from 'react';
import Image from 'next/image';

const AboutPage: React.FC = () => {
    return (
        <div className="px-2 py-4 dark-background-page">
            <h1>About <span className="font-cursive text-4xl px-1 font-light">Stats Now</span></h1>
            <div className="text-section">
                <p>
                    Stats Now is a web app that allows you to analyze your Spotify listening history. It uses the JSON data provided by Spotify when you
                    request your listening data via <a className="inline-link" href="https://www.spotify.com/uk/account/privacy/">Spotify&lsquo;s privacy page</a> to provide accurate
                    statistics about your listening habits. Thank you for using Stats Now!
                </p>
            </div>
            <div className="text-section">
                <h2>Payment</h2>
                <p>
                    The best websites in life are free! Stats Now is completely free to use.
                    If you like this little project and have cash to spare, please consider donating to me via <a className="inline-link" href="https://paypal.me/danielwright1322?country.x=GB&locale.x=en_GB">PayPal</a>.
                </p>
            </div>
            <div className="text-section">
                <h2>Privacy</h2>
                <p>
                    Stats Now does not store any of your data on its servers. As it is open source, you can examine the source code to verify this.
                    All processing is done in your browser, and when saving a file, the file is saved locally and not on any servers.
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
                    Stats Now is completely free and open source, developed by Daniel Wright as a personal project. The source code can be found on <a className="inline-link" href="https://github.com/Daniel-CG-Wright/SwiftStats">GitHub</a>. If you have any suggestions or issues, please raise them on the
                    GitHub repo, feel free to fork the project! Please see the license for legal information.
                </p>
            </div>
            <div className="items-center flex justify-center">
                <Image src="/logo.png" alt="Stats Now Logo" className="mr-2" width={256} height={256} />
            </div>
        </div>
    );
};

export default AboutPage;
