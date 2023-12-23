import React from 'react';

interface PageChangerProps {
    currentPage: number;
    totalPages: number;
    numberPerPage: number;
    maxValue: number;
    setCurrentPage: (page: number) => void;
}

const PageChangerComponent: React.FC<PageChangerProps> = ({
    currentPage,
    totalPages,
    numberPerPage,
    maxValue,
    setCurrentPage,
}) => {
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div>
            <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="bg-transparent text-white hover:bg-transparent hover:text-standard-green disabled:opacity-50 disabled:text-gray-400"
            >
                {'<'}
            </button>
            <span>
                {(currentPage - 1) * numberPerPage + 1}-{Math.min(currentPage * numberPerPage, maxValue)}
            </span>
            <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="bg-transparent text-white hover:bg-transparent hover:text-standard-green disabled:opacity-50 disabled:text-gray-400"
            >
                {'>'}
            </button> ({currentPage}/{totalPages})
        </div>
    );
}

export default PageChangerComponent;