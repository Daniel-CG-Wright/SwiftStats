// pages/index.js
"use client"
import React, { useState, useEffect } from 'react';
import FileUploadComponent from './components/FileUploadComponent';
import MostListenedToSongsComponent from './components/MostListenedSongsComponent';
import MostListenedArtistsComponent from './components/MostListenedArtistsComponent';
import ProfileStatsComponent from './components/ProfileStatsComponent';
import DateSelectComponent from './components/DateSelectComponent';


const IndexPage = () => {
    const [fileContent, setFileContent] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<number>(0);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [firstDate, setFirstDate] = useState<string>('');
    const [lastDate, setLastDate] = useState<string>('');
    const [showFileUpload, setShowFileUpload] = useState<boolean>(false);

    const cutoffTime = 5000; // 5000ms at least to count as a song listened to

    useEffect(() => {
        if (fileContent) {
            // set the first and last dates
            const parsedContent = JSON.parse(fileContent);
            // set the first date to the first date in the file formatted from YYYY-MM-DD HH:SS to YYYY-MM-DD
            setFirstDate(parsedContent[0].endTime.split(' ')[0]);
            // set the last date to the last date in the file formatted from YYYY-MM-DD HH:SS to YYYY-MM-DD
            setLastDate(parsedContent[parsedContent.length - 1].endTime.split(' ')[0]);
            // filter out any songs that have less than 5000 ms played
            const filteredContent = parsedContent.filter((song: any) => song.msPlayed >= cutoffTime);
            // set the file content to the filtered content
            setFileContent(JSON.stringify(filteredContent));
            setShowFileUpload(false);
        }
        else
        {
            setShowFileUpload(true);
        }
    }, [fileContent]);

    // we will have an array of sections corresponding to the different analysis sections we
    // can display. The user clicks on the corresponding button.
    const sections = [
        {
            title: 'Profile Stats',
            component: <ProfileStatsComponent fileContent={fileContent} startDate={startDate} endDate={endDate}
                firstDate={firstDate} lastDate={lastDate} />,
            hideDateSelect: false,
        },
        {
            title: 'Songs Ranking',
            component: <MostListenedToSongsComponent fileContent={fileContent} startDate={startDate} endDate={endDate}
                firstDate={firstDate} lastDate={lastDate}/>,
            hideDateSelect: false,
        },
        {
            title: 'Artists Ranking',
            component: <MostListenedArtistsComponent fileContent={fileContent} startDate={startDate} endDate={endDate}
                firstDate={firstDate} lastDate={lastDate}/>,
            hideDateSelect: false,
        },

    ];

    // other section ideas:
    /*
    Listening clock for indivdual songs (click on a song and see the listening clock for that song)
    Other stats for indivdual songs (click on a song and see the stats for that song)
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
                                    firstDate={firstDate} lastDate={lastDate}
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
