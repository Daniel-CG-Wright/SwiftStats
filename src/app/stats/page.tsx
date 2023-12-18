// pages/index.js
"use client"
import React, { useState } from 'react';
import FileUploadComponent from './components/FileUploadComponent';
import MostListenedToSongsComponent from './components/MostListenedSongsComponent';
import MostListenedArtistsComponent from './components/MostListenedArtistsComponent';

const IndexPage = () => {
    const [fileContent, setFileContent] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<number>(0);
    // we will have an array of sections corresponding to the different analysis sections we
    // can display. The user clicks on the corresponding button.
    const sections = [
        {
            title: 'Most Listened To Songs',
            component: <MostListenedToSongsComponent fileContent={fileContent} />,
        },
        {
            title: 'Most Listened To Artists',
            component: <MostListenedArtistsComponent fileContent={fileContent} />,
        },
    ];

    // NEED BUTTONS TO SELECT WHICH SECTION TO DISPLAY
    return (
        <div>
            <h1>Upload File</h1>
            <FileUploadComponent
            fileContent={fileContent}
            setFileContent={setFileContent}
            />
            {fileContent && sections[selectedSection].component}
        </div>
    );
};

export default IndexPage;
