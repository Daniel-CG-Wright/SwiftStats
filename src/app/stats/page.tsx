// pages/index.js
"use client"
import React, { useState, useEffect } from 'react';
import FileUploadComponent from './components/FileUploadComponent';
import MostListenedToSongsComponent from './components/MostListenedSongsComponent';
import MostListenedArtistsComponent from './components/MostListenedArtistsComponent';
import ProfileStatsComponent from './components/ProfileStatsComponent';
import DateSelectComponent from '../components/DateSelectComponent';
import { getMostListenedArtists, getMostSongsListenedTo } from '@/util/analysisHelpers';

/*
TODO:
- Make the pointer not clicky looking on all tables, only the ones that are clickable
- Make the table headers clickable to sort the table
- Adjust spacing of areas
- Maybe make the background have gradient
- Add a favicon
- Add a title
- Add a description
- Add a menu bar with links to "About" and "Contact"
*/

const IndexPage = () => {
    const [fileContent, setFileContent] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<number>(0);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [firstDate, setFirstDate] = useState<string>('');
    const [lastDate, setLastDate] = useState<string>('');

    useEffect(() => {
        if (fileContent) {
            // set the first and last dates
            const parsedContent = JSON.parse(fileContent);
            // set the first date to the first date in the file formatted from YYYY-MM-DD HH:SS to YYYY-MM-DD
            setFirstDate(parsedContent[0].endTime.split(' ')[0]);
            // set the last date to the last date in the file formatted from YYYY-MM-DD HH:SS to YYYY-MM-DD
            setLastDate(parsedContent[parsedContent.length - 1].endTime.split(' ')[0]);
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
                firstDate={firstDate} lastDate={lastDate} />,
            hideDateSelect: false,
        },
        {
            title: 'Artists Ranking',
            component: <MostListenedArtistsComponent fileContent={fileContent} startDate={startDate} endDate={endDate}
                firstDate={firstDate} lastDate={lastDate} />,
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
        <div className='bg-dark flex-col h-full w-full top-0 left-0'>
            <div className="px-4 py-5">
                <h1>Upload File</h1>
                <FileUploadComponent
                fileContent={fileContent}
                setFileContent={setFileContent}
                />
            </div>
            <div className="py-4 bg-dark">
                {fileContent ? (
                    <div>
                        <h1 className="px-4">File Analysis</h1>
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
                        <DateSelectComponent
                        startDate={startDate} setStartDate={setStartDate}
                        endDate={endDate} setEndDate={setEndDate}
                        firstDate={firstDate} lastDate={lastDate}
                        />
                        }
                    
                        <div className="py-2 px-4">{sections[selectedSection].component}</div>
                    </div>
                )
                : (
                    <div className="px-4 py-2 fixed flex-grow w-full h-full">
                        <label>Upload a file to see your analysis</label>
                    </div>
                )}
            </div>
        </div>
        
    );
};

export default IndexPage;
