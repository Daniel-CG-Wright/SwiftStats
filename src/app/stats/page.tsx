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
            title: 'Songs Ranking',
            component: <MostListenedToSongsComponent fileContent={fileContent} />,
        },
        {
            title: 'Artists Ranking',
            component: <MostListenedArtistsComponent fileContent={fileContent} />,
        },
    ];

    // NEED BUTTONS TO SELECT WHICH SECTION TO DISPLAY
    return (
        <div>
            <div className="px-4 py-5">
                <h1>Upload File</h1>
                <FileUploadComponent
                fileContent={fileContent}
                setFileContent={setFileContent}
                />
            </div>
            <div className="px-4 py-4">
                {fileContent && (
                    <div>
                        <h1>File Analysis</h1>
                        <div className="py-2 flex-row" style={{ overflowX: 'auto' }}>
                            <div className="flex">
                                {sections.map((section, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedSection(index)}
                                        className={index === selectedSection ? '' : 'option-button'}
                                        style={{ marginRight: '8px' }}
                                    >
                                        {section.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="py-2">{sections[selectedSection].component}</div>
                    </div>
                )}
            </div>
        </div>
        
    );
};

export default IndexPage;
