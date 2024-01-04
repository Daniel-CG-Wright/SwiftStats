// pages/index.js
"use client"
import React, { useState, useEffect } from 'react';
import FileUploadComponent from './components/FileUploadComponent';
import MostListenedToSongsComponent from './components/MostListenedSongsComponent';
import MostListenedArtistsComponent from './components/MostListenedArtistsComponent';
import ProfileStatsComponent from './components/ProfileStatsComponent';
import DateSelectComponent from './components/DateSelectComponent';
import { FileData, Site, Song } from '@/types';
import { getFileData } from '@/util/analysisHelpers';


const IndexPage = () => {
    const [fileContent, setFileContent] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<number>(0);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [showFileUpload, setShowFileUpload] = useState<boolean>(false);
    const [fileData, setFileData] = useState<FileData>({
        site: Site.NONE,
        data: [],
        firstDate: '',
        lastDate: '',
    });

    const cutoffTime = 5000; // 5000ms at least to count as a song listened to

    useEffect(() => {
        if (fileContent) {
            setFileData(getFileData(fileContent, cutoffTime));
            // if the file data is an empty object then the file is invalid
            if (fileData.site === Site.NONE) {
                setFileContent('');
                // show an error message
                alert('Invalid file content - ensure you are uploading valid Spotify or Youtube Music data');
                // clear local storage
                localStorage.removeItem('uploadedFile');
            }
        }
        else
        {
            setShowFileUpload(true);
            setFileData({
                site: Site.NONE,
                data: [],
                firstDate: '',
                lastDate: '',
            })
        }
    }, [fileContent]);

    // we will have an array of sections corresponding to the different analysis sections we
    // can display. The user clicks on the corresponding button.
    const sections = [
        {
            title: 'Profile Stats',
            component: <ProfileStatsComponent fileData={fileData} startDate={startDate} endDate={endDate} />,
            hideDateSelect: false,
        },
        {
            title: 'Songs Ranking',
            component: <MostListenedToSongsComponent fileData={fileData} startDate={startDate} endDate={endDate} />,
            hideDateSelect: false,
        },
        {
            title: 'Artists Ranking',
            component: <MostListenedArtistsComponent fileData={fileData} startDate={startDate} endDate={endDate} />,
            hideDateSelect: false,
        },

    ];

    // other section ideas:
    /*
    Comparison section (compare 2 time periods such as 2020 vs 2021)
    Top songs for each month (could be on the listening clock)
    */
    

    return (
        <main className="flex flex-col h-screen">
            <div className='flex-col h-full w-full top-0 left-0'>
                <button 
                    onClick={() => setShowFileUpload(!showFileUpload)}
                    className='absolute left-1/2 transform -translate-x-1/2 rounded-full bg-dark hover:text-standard-green hover:bg-dark active:scale-100'
                >
                    {showFileUpload ? '▲' : '▼'}
                </button>
                <div className={`px-4 py-5 ${showFileUpload ? 'block' : 'hidden'}`}>
                    <h1>Upload File</h1>
                    <FileUploadComponent
                        fileContent={fileContent}
                        setFileContent={setFileContent}
                    />
                </div>
                {
                    fileData && fileData.data.length > 0 && (
                        <div className="px-4 py-2">
                            <h1>File Info</h1>
                            <div className="py-2">
                                <p>Site: {fileData.site}</p>
                                <p>Number of songs: {fileData.data.length}</p>
                                <p>First date: {fileData.firstDate}</p>
                                <p>Last date: {fileData.lastDate}</p>
                            </div>
                        </div>
                    )
                }
                <div className="py-4 mt-2">
                    {fileContent ? (
                        <div>
                            <h1 className="px-4 py-2">File Analysis</h1>
                            <div className="px-4 py-2 flex-row" style={{ overflowX: 'auto' }}>
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
                            {!sections[selectedSection].hideDateSelect &&
                            (
                                <div className="py-4">
                                    <DateSelectComponent
                                    startDate={startDate} setStartDate={setStartDate}
                                    endDate={endDate} setEndDate={setEndDate}
                                    firstDate={fileData.firstDate} lastDate={fileData.lastDate}
                                    />
                                </div>
                            )
                            }
                        
                            <div className="py-2">{sections[selectedSection].component}</div>
                        </div>
                    )
                    : (
                        <div className="px-4 py-2">
                            <label>Upload a file to see your analysis</label>
                        </div>
                    )}
                </div>
            </div>
        </main>
        
    );
};

export default IndexPage;
