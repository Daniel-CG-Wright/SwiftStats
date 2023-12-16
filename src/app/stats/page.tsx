// pages/index.js
"use client"
import React from 'react';
import FileUploadComponent from './components/FileUploadComponent';

const IndexPage = () => {
    return (
        <div>
            <h1>Upload File</h1>
            <FileUploadComponent />
            {/* Other components or content */}
        </div>
    );
};

export default IndexPage;
