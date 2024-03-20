import { useState, useEffect  } from 'react';

/**
 * A custom React hook that encapsulates pagination logic.
 * It manages current page state, calculates total pages based on items and items per page,
 * and provides methods to navigate between pages.
 * 
 * @param {Array} items The array of items to paginate.
 * @param {number} itemsPerPage Number of items per page to display.
 * @returns {Object} Pagination properties and methods.
 */
export const usePagination = (items, itemsPerPage) => {
    const [currentPage, setCurrentPage] = useState(1); // State to keep track of the current page
    const totalPages = Math.ceil(items.length / itemsPerPage); // Calculate the total number of pages required to display all items

    // Reset to the first page if the data changes
    useEffect(() => {
        setCurrentPage(1);
    }, [items.length]) // Dependency on the length of the items array ensures the effect runs whenever items change

    const indexOfLastItem = currentPage * itemsPerPage; // Calculate the index of the last item on the current page
    const indexOfFirstItem = indexOfLastItem - itemsPerPage; // Calculate the index of the first item on the current page
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem); // Slice the items array to get only the items for the current page

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber); // Handler function to navigate to a specific page
    const handlePrevious = () => setCurrentPage(currentPage => Math.max(1, currentPage - 1)); // Handler function to navigate to the previous page, ensuring the page number doesn't fall below 1

    const handleNext = () => setCurrentPage(currentPage => Math.min(totalPages, currentPage + 1)); // Handler function to navigate to the next page, ensuring the page number doesn't exceed the total number of pages

    // Return the current items for the page, the current page number, total pages, and the navigation handlers
    return {
        currentItems,
        currentPage,
        totalPages,
        handlePageChange,
        handlePrevious,
        handleNext
    };
};