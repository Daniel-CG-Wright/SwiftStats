// components/FileUploadComponent.tsx

import React, { useState, useEffect, ChangeEvent } from 'react';

const FileUploadComponent: React.FC = () => {
    const [fileContent, setFileContent] = useState<string>('');
    const [saveLocally, setSaveLocally] = useState<boolean>(false);

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
                    if (saveLocally) {
                        localStorage.setItem('uploadedFile', content);
                    }
                }
            };
            reader.readAsText(file);
        }
    };

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSaveLocally(event.target.checked);
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <label>
                <input 
                    type="checkbox" 
                    checked={saveLocally}
                    onChange={handleCheckboxChange}
                />
                Save file for next time
            </label>
            {/* Render file content or processing results here */}
        </div>
    );
};

export default FileUploadComponent;
