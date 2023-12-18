// components/FileUploadComponent.tsx

import React, { useState, useEffect, ChangeEvent } from 'react';
import { dateFormat } from '@/util/dateTimeFormat';
import { JSONSong } from '@/types';

interface Props {
    fileContent: string;
    setFileContent: (fileContent: string) => void;
}

const FileUploadComponent: React.FC<Props> = ({ fileContent, setFileContent }) => {
    const [isSaved, setIsSaved] = useState(false);
    const [latestStreamedTrack, setLatestStreamedTrack] = useState<JSONSong | null>(null);
    const [lastScrollPos, setLastScrollPos] = useState(0);
    const [isScrollingUp, setIsScrollingUp] = useState(true);

    useEffect(() => {
        // when the component mounts, check if there is a saved file and if so, set the file content
        const savedFileContent = localStorage.getItem('uploadedFile');
        if (savedFileContent) {
            setFileContent(savedFileContent);
            setIsSaved(true);
            // set the latest streamed track
            const parsedContent = JSON.parse(savedFileContent);
            setLatestStreamedTrack(parsedContent[parsedContent.length - 1]);
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            const scrollingUp = lastScrollPos > currentScrollPos;
            setIsScrollingUp(scrollingUp);
            setLastScrollPos(currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollPos]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            // loads the file and if the file is loaded, set the file content
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target?.result) {
                    const content = e.target.result as string;
                    if (!validateFileContent(content)) {
                        alert('Invalid file content - ensure you are uploading a Spotify ListeningData JSON file');
                        return;
                    }
                    setFileContent(content);
                    const parsedContent = JSON.parse(content);
                    setLatestStreamedTrack(parsedContent[parsedContent.length - 1]);
                    setIsSaved(false);
                }
            };
            reader.readAsText(file);
        }
    };
    const validateFileContent = (content: string): boolean => {
        try {
            const parsedContent = JSON.parse(content);
            // weakly validate the file content by checking that the first record has the expected fields
            if (
                parsedContent[0].endTime &&
                parsedContent[0].artistName &&
                parsedContent[0].trackName &&
                parsedContent[0].msPlayed
            ) {
                return true;
            }
        } catch (error) {
            return false;
        }
        return false;
    };

    const handleSaveClick = () => {
        if (fileContent) {
            localStorage.setItem('uploadedFile', fileContent);
            setIsSaved(true);
        }
    };

    const clearFile = () => {
        setFileContent('');
        setIsSaved(false);
        setLatestStreamedTrack(null);
    };

    
    return (
        <div className={isScrollingUp ? 'show' : 'hide'}>
            <div className="py-1">
                <input type="file" className="file-input" id="file-input" accept=".json" onChange={handleFileChange}/>
                <label htmlFor="file-input" className="file-input-label">Choose file</label>
                {latestStreamedTrack && (
                <div>
                    <label>
                        Latest streamed track: {latestStreamedTrack.artistName} - {latestStreamedTrack.trackName} at {dateFormat(latestStreamedTrack.endTime)}
                    </label>
                </div>
                )
                }
            </div>
            <div className="py-1">
                {fileContent && !isSaved && (
                    <button onClick={handleSaveClick}>Save for next time</button>
                )}
                {isSaved && <span className='text-white text-lg'>Saved locally for future use</span>}
            </div>
            {fileContent && <button onClick={() => clearFile()}>Clear current file</button>}
        </div>
    );
};

export default FileUploadComponent;