import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useState, useEffect } from "react";

function Pagination({ dataLength, currentPage, setPage, setPageSize, pageSize }) {
  // Options for items per page dropdown
  const itemsPerPageOptions = [10, 20, 50];
  
  // Calculate total pages based on data length and page size
  const totalPages = Math.ceil(dataLength / pageSize) || 1;
  
  // Internal state to track current page (to avoid dependency on parent state updates)
  const [internalPage, setInternalPage] = useState(Number(currentPage) || 1);
  
  // Update internal page when currentPage prop changes
  useEffect(() => {
    setInternalPage(Number(currentPage) || 1);
  }, [currentPage]);
  
  // Debugging: Log when component renders
  useEffect(() => {
    console.log("Pagination render with:", { 
      dataLength,
      externalPage: currentPage,
      internalPage,
      pageSize,
      totalPages
    });
  });

  // Handle page change
  const handlePageChange = (newPage) => {
    const pageNumber = Number(newPage);
    
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      console.log(`Changing page from ${internalPage} to ${pageNumber}`);
      
      // Update internal state immediately for visual feedback
      setInternalPage(pageNumber);
      
      // Update parent component state
      setPage(pageNumber);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newSize) => {
    const size = Number(newSize);
    setPageSize(size);
    setInternalPage(1);
    setPage(1);
  };

  // Calculate displayed records range
  const startRecord = Math.min(((internalPage - 1) * pageSize) + 1, dataLength);
  const endRecord = Math.min(internalPage * pageSize, dataLength);

  return (
    <div className="flex justify-between items-center mt-4 text-gray-600">
      {/* Items per page dropdown */}
      <div className="flex items-center text-[#A4A5AB] font-light space-x-2">
        <span>Showing</span>
        <select
          value={pageSize}
          onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value, 10))}
          className="border border-gray-300 rounded-md p-1 focus:ring-blue-500 focus:border-blue-500"
        >
          {itemsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination info */}
      <span className="hidden text-[#A4A5AB] font-light lg:block xl:block">
        {`Showing ${startRecord} to ${endRecord} of ${dataLength} records`}
      </span>

      {/* Pagination controls */}
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(internalPage - 1)}
          disabled={internalPage <= 1}
          className={`p-2 rounded-md ${
            internalPage <= 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100 cursor-pointer"
          }`}
          aria-label="Previous page"
          data-testid="prev-button"
        >
          <MdKeyboardArrowLeft size={20} />
        </button>

        {/* Page 1 */}
        <button
          onClick={() => handlePageChange(1)}
          className={`w-8 h-8 flex items-center justify-center rounded-md ${
            internalPage === 1
              ? "border-2 border-blue-500 bg-blue-50 text-blue-600"
              : "hover:bg-gray-100"
          }`}
          data-testid="page-1"
        >
          1
        </button>

        {/* Page 2 (always shown if total pages > 1) */}
        {totalPages > 1 && (
          <button
            onClick={() => handlePageChange(2)}
            className={`w-8 h-8 flex items-center justify-center rounded-md ${
              internalPage === 2
                ? "border-2 border-blue-500 bg-blue-50 text-blue-600"
                : "hover:bg-gray-100"
            }`}
            data-testid="page-2"
          >
            2
          </button>
        )}

        {/* Ellipsis and more pages */}
        {totalPages > 3 && internalPage > 3 && <span className="px-1">...</span>}

        {/* Current page (if not 1, 2 or last page) */}
        {internalPage > 2 && internalPage < totalPages && (
          <button
            className="w-8 h-8 flex items-center justify-center rounded-md border-2 border-blue-500 bg-blue-50 text-blue-600"
            data-testid={`page-${internalPage}`}
          >
            {internalPage}
          </button>
        )}

        {/* Ellipsis before last page */}
        {totalPages > 3 && internalPage < totalPages - 1 && <span className="px-1">...</span>}

        {/* Last Page (if total pages > 2) */}
        {totalPages > 2 && (
          <button
            onClick={() => handlePageChange(totalPages)}
            className={`w-8 h-8 flex items-center justify-center rounded-md ${
              internalPage === totalPages
                ? "border-2 border-blue-500 bg-blue-50 text-blue-600"
                : "hover:bg-gray-100"
            }`}
            data-testid={`page-${totalPages}`}
          >
            {totalPages}
          </button>
        )}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(internalPage + 1)}
          disabled={internalPage >= totalPages}
          className={`p-2 rounded-md ${
            internalPage >= totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100 cursor-pointer"
          }`}
          aria-label="Next page"
          data-testid="next-button"
        >
          <MdKeyboardArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;