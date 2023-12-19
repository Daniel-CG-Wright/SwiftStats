// pages/index.js
"use client"
import React, { useState } from 'react';
import FileUploadComponent from './components/FileUploadComponent';
import MostListenedToSongsComponent from './components/MostListenedSongsComponent';
import MostListenedArtistsComponent from './components/MostListenedArtistsComponent';
import ListeningClockFullAnalysisComponent from './components/ListeningClockFullAnalysisComponent';

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
        {
            title: 'Listening Clock',
            component: <ListeningClockFullAnalysisComponent fileContent={fileContent} />,
        }
    ];

    return (
        <div className='bg-dark flex-col h-full w-full top-0 left-0'>
            <div className="px-4 py-5">
                <h1>Upload File</h1>
                <FileUploadComponent
                fileContent={fileContent}
                setFileContent={setFileContent}
                />
            </div>
            <div className="py-4 bg-dark">
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
