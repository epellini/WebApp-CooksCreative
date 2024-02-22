import { useState, useEffect  } from 'react';

/**
 * Custom hook for handling pagination logic.
 * @param {Array} items The array of items to paginate.
 * @param {number} itemsPerPage Number of items per page.
 * @returns {Object} Pagination properties and methods.
 */
export const usePagination = (items, itemsPerPage) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(items.length / itemsPerPage);

    // Reset to the first page if the data changes
    useEffect(() => {
        setCurrentPage(1);
    }, [items.length]) // Reacting to changes in data length

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
    const handlePrevious = () => setCurrentPage(currentPage => Math.max(1, currentPage - 1));
    const handleNext = () => setCurrentPage(currentPage => Math.min(totalPages, currentPage + 1));

    return {
        currentItems,
        currentPage,
        totalPages,
        handlePageChange,
        handlePrevious,
        handleNext
    };
};