"use client"
import React, { useState } from 'react'
import PageChangerComponent from './PageChangerComponent';

interface MostListenedToTableComponentProps {
    setSelectedRowIndex: (index: number) => void;
    disclaimerText: string;
    detailsComponent: JSX.Element;
    tableHeaders: string[];
    data: any[];
    renderRow: (row: any, index: number) => JSX.Element;
}

/**
 * This component takes in the file JSON content and displays a list of table data as desired
 * @param setSelectedRowData the function to set the selected row data (e.g. setSelectedRowData={setSelectedSong})
 * @param disclaimerText the text to display at the bottom of the table
 * @param tableHeaders the headers of the table
 * @param data the data to display in the table
 * @param renderRow the function to render a row, which will have to handle
 * onClick events as well (e.g. renderRow={(song, index) => (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{song.artist.name}</td>
            <td>{song.name}</td>
            <td>{song.album ? song.album.name : 'Unknown Album'}</td>
            <td>{timeFormat(song.minutesListened)} ({song.minutesListened.toFixed(1)} minutes)</td>
            <td>{song.timesStreamed}</td>
        </tr>
    )}
    )
 */
const MostListenedToTableComponent: React.FC<MostListenedToTableComponentProps> = ({ setSelectedRowIndex, disclaimerText, tableHeaders, data, renderRow }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 250;

    // Calculate the data for the current page
    const dataForPage = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        
        <div>
            <label className="px-2">Use Ctrl + F to search</label>
            <PageChangerComponent currentPage={currentPage} setCurrentPage={setCurrentPage} numberPerPage={itemsPerPage} maxValue={data.length} totalPages={Math.ceil(data.length / itemsPerPage)} />
            <table className="w-full divide-y divide-gray-200">
                <thead className={`sticky-header`}>
                    <tr>
                        {tableHeaders.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="overflow-auto max-h-screen">
                    {dataForPage.map((item, index) => renderRow(item, index))}
                </tbody>
            </table>
            <PageChangerComponent currentPage={currentPage} setCurrentPage={setCurrentPage} numberPerPage={itemsPerPage} maxValue={data.length} totalPages={Math.ceil(data.length / itemsPerPage)} />
            <label className="py-2 text-gray-400">{disclaimerText}</label>
        </div>
    );
}
    
export default MostListenedToTableComponent;