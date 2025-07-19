import React from 'react';
import Pagination from './Pagination';

const ReusableTable = ({
  headers = [],
  data = [],
  currentPage,
  totalPages,
  onPageChange,
  onAddNew,
  onSearch,
  optionalButtons = [],
  searchPlaceholder = "Search result or student",
  addButtonText = "Add New Result",
  showActions = true,
  actionButtons = [], // Array of action button objects
  activeTab = null, // Currently active tab
  onTabChange = null // Function to handle tab changes
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Top Controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {/* Left side - Optional buttons (tabs) */}
        <div className="flex items-center gap-2">
          {optionalButtons.map((button, index) => (
            <button
              key={index}
              onClick={() => onTabChange && onTabChange(button.value)}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === button.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {button.label}
            </button>
          ))}
        </div>

        {/* Right side - Search and Add button */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={e => onSearch && onSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg 
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <button 
            onClick={onAddNew}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {addButtonText}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
              {showActions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {headers.map((header, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row[header]}
                  </td>
                ))}
                {showActions && actionButtons.length > 0 && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-3">
                      {actionButtons.map((actionButton, actionIndex) => (
                        <button
                          key={actionIndex}
                          onClick={() => actionButton.onClick && actionButton.onClick(row)}
                          className={actionButton.className || "text-blue-600 hover:text-blue-800 transition-colors"}
                          title={actionButton.title || actionButton.label}
                        >
                          {typeof actionButton.icon === 'function' ? actionButton.icon(row) : actionButton.icon || actionButton.label}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={onPageChange} 
        />
      )}
    </div>
  );
};

export default ReusableTable;