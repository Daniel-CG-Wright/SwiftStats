// components/FileUploadComponent.tsx

import React, { useState, useEffect, ChangeEvent } from 'react';
import FileAnalysisSection from './FileAnalysisSection';

interface Props {
    fileContent: string;
    setFileContent: (fileContent: string) => void;
}

const FileUploadComponent: React.FC<Props> = ({ fileContent, setFileContent }) => {
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const savedFileContent = localStorage.getItem('uploadedFile');
        if (savedFileContent) {
            setFileContent(savedFileContent);
        }
    }, []);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target?.result) {
                    const content = e.target.result as string;
                    setFileContent(content);
                    setIsSaved(false);
                }
            };
            reader.readAsText(file);
        }
    };

    const handleSaveClick = () => {
        if (fileContent) {
            localStorage.setItem('uploadedFile', fileContent);
            setIsSaved(true);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange}/>
            {fileContent && !isSaved && (
                <button onClick={handleSaveClick}>Save for next time</button>
            )}
            {isSaved && <span>Saved</span>}
            <button onClick={() => setFileContent('')}>Clear</button>
        </div>
    );
};

export default FileUploadComponent;