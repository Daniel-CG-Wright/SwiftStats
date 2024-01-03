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
                    localStorage.setItem('uploadedFile', content);
                    setIsSaved(true);
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
                (
                    parsedContent[0].endTime &&
                    parsedContent[0].artistName &&
                    parsedContent[0].trackName &&
                    parsedContent[0].msPlayed
                ) ||
                (
                    // youtube music
                    parsedContent[0].header &&
                    parsedContent[0].title &&
                    parsedContent[0].titleUrl &&
                    parsedContent[0].subtitles &&
                    parsedContent[0].time
                )
            ) {
                return true;
            }
        } catch (error) {
            return false;
        }
        return false;
    };

    const clearFile = () => {
        setFileContent('');
        setIsSaved(false);
        setLatestStreamedTrack(null);
        // reset the file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        fileInput.value = '';
    };

    const deleteSavedFile = () => {
        localStorage.removeItem('uploadedFile');
        setIsSaved(false);
    };
    
    return (
        <div>
            <div className="py-1">
                <input type="file" className="file-input" id="file-input" accept=".json" onChange={handleFileChange} />
                <label htmlFor="file-input" className="file-input-label">Choose file</label><span className="px-2">(upload StreamingHistory0.json)</span>
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
                {fileContent && isSaved && (
                    <button onClick={deleteSavedFile}>Remove file from local storage</button>
                )}
                {
                    fileContent && !isSaved && (
                        <button onClick={() => setIsSaved(true)}>Save file to local storage</button>
                    )
                }
            </div>
            {fileContent && <button onClick={() => clearFile()}>Clear current file</button>}
        </div>
    );
};

export default FileUploadComponent;