// components/FileUploadComponent.tsx

import React, { useState, useEffect, ChangeEvent } from 'react';
import { dateFormat } from '@/util/dateTimeFormat';
import { JSONSong, Site } from '@/types';
import { getFileSite } from '@/util/analysisHelpers';

interface Props {
    fileContent: string;
    setFileContent: (fileContent: string) => void;
}
const mergeFileContents = (fileContents: any[]): any[] => {
    // merge the file contents into one array
    let mergedData: any[] = [];
    fileContents.forEach((fileContent) => {
        mergedData = mergedData.concat(fileContent);
    });
    // remove duplicates which have same data
    // @ts-ignore
    const uniqueData = Array.from(new Set(mergedData.map(JSON.stringify))).map(JSON.parse);
    return uniqueData;
}

const FileUploadComponent: React.FC<Props> = ({ fileContent, setFileContent }) => {
    const [isSaved, setIsSaved] = useState(false);


    useEffect(() => {
        // when the component mounts, check if there is a saved file and if so, set the file content
        const savedFileContent = localStorage.getItem('uploadedFile');
        if (savedFileContent) {
            setFileContent(savedFileContent);
            setIsSaved(true);
            // set the latest streamed track
            const parsedContent = JSON.parse(savedFileContent);        }
    }, []);


    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const filePromises = Array.from(files).map((file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e: ProgressEvent<FileReader>) => {
                        if (e.target?.result) {
                            const content = e.target.result as string;
                            const parsedContent = JSON.parse(content);
                            resolve(parsedContent);
                        }
                    };
                    reader.readAsText(file);
                });
            });

            try {
                const fileContents = await Promise.all(filePromises);
                const mergedData = mergeFileContents(fileContents);
                const mergedContent = JSON.stringify(mergedData);
                setFileContent(mergedContent);
                localStorage.setItem('uploadedFile', mergedContent);
                setIsSaved(true);
            }
            catch (error) {
                alert(error);
            }
        }
    };

    const clearFile = () => {
        setFileContent('');
        setIsSaved(false);
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
                <input type="file" className="file-input" id="file-input" accept=".json" onChange={handleFileChange} multiple />
                <label htmlFor="file-input" className="file-input-label">Choose file</label><span className="px-2">(upload StreamingHistory0.json)</span>
            </div>
            <div className="py-1">
                {fileContent && isSaved && (
                    <button onClick={deleteSavedFile}>Remove data from local storage</button>
                )}
                {
                    fileContent && !isSaved && (
                        <button onClick={() => setIsSaved(true)}>Save data to local storage</button>
                    )
                }
            </div>
            {fileContent && <button onClick={() => clearFile()}>Clear current file</button>}
        </div>
    );
};

export default FileUploadComponent;