"use client"

import React from 'react'
import MostListenedToSongsComponent from './MostListenedSongsComponent';
import MostListenedArtistsComponent from './MostListenedArtistsComponent';

interface FileAnalysisSectionProps {
    fileContent: string;
}

/**
 * This component takes in the file JSON content and displays file analysis components
 * in relevant sections
 * @param fileContent the JSON content of the file
 */
const FileAnalysisSection: React.FC<FileAnalysisSectionProps> = ({ fileContent }) => {
    // if no file content, return nothing
    if (!fileContent) {
        return null;
    }
    return (
        <div>
            <MostListenedToSongsComponent fileContent={fileContent} />
            <MostListenedArtistsComponent fileContent={fileContent} />
        </div>
    )
}

export default FileAnalysisSection;
