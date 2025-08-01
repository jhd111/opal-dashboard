import React, { useState, useEffect, useRef } from "react";

import { CgSortAz } from "react-icons/cg";

import arrowDowncircle from "../../assets/Oval.png";
import doc from "../../assets/Oval.png";

import {plus,message} from "../../assets/index"

import { Calendar, ChevronUp, Check } from "lucide-react";

import Loader from "../Loader/Loader";

import { toast } from "react-hot-toast";


// import DateRangePicker from "../Calender/CustomCalender"
import Pagination from "./Pagination";
import { Link } from "react-router-dom";

const ReusableTable = ({
  columns,
  data,
  actions,
  icons,
  borderRadius,
  download,
  onViewDetails,
  search,
  textStatus,
  text,
  pagination,
  viewlessOrders,
  viewAllOrders,
  detailsOnEdit,
  compose,
  onViewIconClick,
  onViewIconClickCheck,

  setDeleteModal,
  modal,
  onAddNewProduct,
  onEdit,
  onToggle,
  toggleIcon,
  status,
  modalTitle,
  handleRowClick,
  dataLength,
  setPageSize,
  setPage,
  pageSize,
  date,
  Loading,
  setSearchTable,
  SearchLoading,
  setDeleteUser,
  setOpenModal,
  filter,
  filterOptions,
  setSelectedFilter,
  selectedFilter,
  filterLoading,
  currentPage,
  searchError,
  filterError,
  ErrorTableError,
  setStartDate,
  setEndDate,
  downloadTransaction,
  isLoadingdownloadTransaction,
  handleDownload,
  setIs_approve,
  category,
  categoryTitle,
  addCategory,
  optionalButtons,
  onTabChange,
  activeTab,
  openCompose,
  
}) => {
  const [isOpen, setIsOpen] = useState(false);
  // Refs for scrollbars and table container
  const topScrollRef = useRef(null);
  const tableContainerRef = useRef(null);
  const bottomScrollRef = useRef(null);
  // Synchronize scrollbars with table
  useEffect(() => {
    const tableContainer = tableContainerRef.current;
    const topScroll = topScrollRef.current;
    const bottomScroll = bottomScrollRef.current;

    if (tableContainer && topScroll && bottomScroll) {
      // Set the width of dummy content to match table's scroll width
      const scrollWidth = tableContainer.scrollWidth;
      topScroll.querySelector(".scroll-content").style.width = `${scrollWidth}px`;
      bottomScroll.querySelector(".scroll-content").style.width = `${scrollWidth}px`;

      // Function to sync scroll positions
      const syncScroll = (source, targets) => {
        targets.forEach((target) => {
          target.scrollLeft = source.scrollLeft;
        });
      };

      // Add scroll event listeners
      tableContainer.addEventListener("scroll", () =>
        syncScroll(tableContainer, [topScroll, bottomScroll])
      );
      topScroll.addEventListener("scroll", () =>
        syncScroll(topScroll, [tableContainer, bottomScroll])
      );
      bottomScroll.addEventListener("scroll", () =>
        syncScroll(bottomScroll, [tableContainer, topScroll])
      );

      // Cleanup event listeners
      return () => {
        tableContainer.removeEventListener("scroll", () =>
          syncScroll(tableContainer, [topScroll, bottomScroll])
        );
        topScroll.removeEventListener("scroll", () =>
          syncScroll(topScroll, [tableContainer, bottomScroll])
        );
        bottomScroll.removeEventListener("scroll", () =>
          syncScroll(bottomScroll, [tableContainer, topScroll])
        );
      };
    }
  }, [data, columns]);

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedFilter(option); // ✅ Set selected option
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --------------------------date picker-----------------------------
  // --------------------------date picker-----------------------------
  const [showPicker, setShowPicker] = useState(false);
  // const [startDate, setStartDate] = useState(null);
  // const [endDate, setEndDate] = useState(null);
  const buttonRef1 = useRef(null);
  const pickerRef = useRef(null);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });

  // Update picker position whenever showPicker changes
  useEffect(() => {
    if (showPicker && buttonRef1.current) {
      calculatePickerPosition();
    }
  }, [showPicker]);

  // Add event listeners when picker is shown, remove when hidden
  useEffect(() => {
    const handleScroll = () => {
      if (showPicker) {
        calculatePickerPosition();
      }
    };

    const handleResize = () => {
      if (showPicker) {
        calculatePickerPosition();
      }
    };

    // Handle clicks outside of picker and button
    const handleClickOutside = (event) => {
      if (
        showPicker &&
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        buttonRef1.current &&
        !buttonRef1.current.contains(event.target)
      ) {
        setShowPicker(false);
      }
    };

    // Add all event listeners
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Clean up all event listeners
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [showPicker]); // Re-run effect when showPicker changes

  const calculatePickerPosition = () => {
    if (!buttonRef1.current) return;

    const buttonRect = buttonRef1.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const pickerHeight = 380; // Approximate height of your date picker
    const pickerWidth = 320; // Approximate width of your date picker

    // Calculate horizontal position (aligned to the left of the button)
    let left = buttonRect.left - pickerWidth - 8; // Align to the left with margin

    // Ensure the picker doesn't go off-screen horizontally
    if (left < 8) {
      left = buttonRect.left + 8; // If no space on the left, align to the right
    }

    // Check if there's enough space below the button
    const spaceBelow = viewportHeight - buttonRect.bottom;
    const shouldShowBelow = spaceBelow >= pickerHeight;

    // Calculate top position based on available space
    const top = shouldShowBelow
      ? buttonRect.bottom + 10 // Show below with margin
      : buttonRect.top - pickerHeight - 10; // Show above with margin

    setPickerPosition({ top, left });
  };

  const handleClick = () => {
    setShowPicker(!showPicker);
  };

  const formatDateToYYYYMMDD = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateSelection = (start, end) => {
    const formattedStartDate = formatDateToYYYYMMDD(start);
    const formattedEndDate = formatDateToYYYYMMDD(end);

    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
    setShowPicker(false);
  };

  const handleCancel = () => {
    setShowPicker(false);
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    // <div className="w-full overflow-x-auto border border-[#A4A5AB1A] rounded-lg p-4">

    <div
      className="w-full  border bg-white border-[#A4A5AB1A] rounded-lg p-4"
      style={{ boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.2)" }}
    >
      <div className="flex flex-col gap-2 lg:gap-0 lg:flex-row items-center justify-between mb-4">
        {optionalButtons && (
          <div className="inline-flex bg-[#3651BF1A] p-1 rounded">
            {optionalButtons.map((button, index) => (
              <button
                key={index}
                onClick={() => onTabChange && onTabChange(button.value)}
                className={`px-2 py-1 text-sm lato font-medium rounded transition-all
        ${
          activeTab === button.value
            ? "bg-white text-black"
            : "bg-transparent text-[#4B5563]"
        }`}
              >
                {button.label}
                {button.count && (
                  <span
                    className={`ml-1 ${
                      activeTab === button.value ? "text-blue-600" : ""
                    }`}
                  >
                    ({button.count})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
        {/* Search Bar */}
        {search && (
          <div className="relative w-56">
            <input
              type="search"
              className="px-4 py-2 pr-10 text-sm text-[#6A717F] rounded-md bg-[#F9FAFB] w-full"
              onChange={(e) => setSearchTable(e.target.value)}
              placeholder="Enter for search"
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242 1.398a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" />
            </svg>
          </div>
        )}

        {textStatus && <span className="lexend font-semibold ">{text}</span>}

        <div className="flex items-center space-x-1.5">
          {/* download button */}
          {download && (
            <button
              type="button"
              // disabled={isLoadingdownloadTransaction || !downloadTransaction?.data?.pdf_url}
              onClick={handleDownload}
              className={`flex items-center space-x-2 px-4 py-3 border border-[#A4A5AB1A] rounded-full focus:outline-none cursor-pointer
      ${
        isLoadingdownloadTransaction || !downloadTransaction?.data?.pdf_url
          ? "bg-[#4755E5] text-white cursor-not-allowed"
          : "bg-[#4755E5] text-white hover:bg-blue-600"
      }
    `}
            >
              <span>
                <img src={arrowDowncircle} alt="" className="w-4 h-5" />
              </span>
              <span>
                {isLoadingdownloadTransaction ? "Downloading..." : "Download"}
              </span>
            </button>
          )}

          {compose && (
            <button
              type="button"
              onClick={()=>openCompose?.()}
              className="flex items-center space-x-1 px-4 py-2 bg-[#4755E5] border border-[#A4A5AB1A] text-white rounded-full cursor-pointer focus:outline-none"
            >
              <span>
                <img src={message} alt="" className="w-6 h-7 text-white" />
              </span>
              <span>Compose</span>
            </button>
          )}

          {category && (
            <button
              type="button"
              className="flex items-center space-x-1 px-4 py-2 bg-[#4755E5] border border-[#A4A5AB1A] text-white rounded-full cursor-pointer focus:outline-none"
              onClick={() => addCategory?.()}
            >
              <span>
                <img src={plus} alt="" className="w-6 h-6 text-white" />
              </span>
              <span className="lexend">{categoryTitle}</span>
            </button>
          )}
          
          <div className="flex justify-between items-center gap-2">

             {/* Filter Button */}
             {filter &&
             <div className="inline-block text-left z-50">
              {/* Filter Button */}
              <button
                ref={buttonRef}
                className="relative  cursor-pointer flex items-center p-1 bg-white border border-gray-200 text-gray-800 rounded-md hover:bg-gray-100 focus:outline-none "
                onClick={toggleDropdown}
              >
                <CgSortAz className="w-8 h-8  text-[#4B5563]" />
               
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute z-50 w-36  rounded-md shadow-lg bg-white  right-6  mt-"
                >
                  <div className="flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 border-b">
                    <span>Sort by</span>
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="py-1">
                    {filterOptions?.map((option, index) => (
                      <button
                        key={index}
                        className={`flex items-center justify-between w-full px-4 py-2 text-left text-sm text-gray-700 ${
                          selectedFilter === option ? "bg-blue-50" : ""
                        }`}
                        onClick={() => handleOptionClick(option)}
                      >
                        {option}
                        {selectedFilter === option && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
}

          {modal && (
            <button
              type="button"
              className="flex items-center text-sm space-x-1 px-4 py-2 bg-[#3651BF] border border-[#A4A5AB1A] text-white rounded-md cursor-pointer focus:outline-none"
              onClick={() => onAddNewProduct?.()}
            >
              <span>
                <img src={plus} alt="" className="w-6 h-6 text-white" />
              </span>
              <span className="lexend">{modalTitle}</span>
            </button>
          )}

         
            </div>

        </div>
      </div>

      {/* Table */}

      {Loading || SearchLoading || filterLoading ? (
        <div className="w-full ">
          <Loader />
        </div>
      ) : searchError || filterError || ErrorTableError ? (
        <div className="text-red-500 text-center">Error Fetching Data</div>
      ) : (
        <>
         <div className="relative">
    <div className="overflow-x-auto max-w-full">
      <table className="min-w-max w-full table-auto rounded-lg">
            <thead >
              <tr className="bg-[#3651BF1A] rounded-md" >
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className={`${
                      col.className || ""
                    } w-auto px-4 py-2 lato font-bold text-[#023337] text-start lg:text-[12px] 2xl:text-[16px]`}
                  >
                    {col.label}
                  </th>
                ))}

                {/* Conditionally render the Status column if needed */}
                {status && (
                  <th className="w-auto px-4 py-2 lato font-bold text-[#023337] text-center lg:text-[12px] 2xl:text-[16px]">
                    Status
                  </th>
                )}

                {/* Always render the Action column */}
                { actions &&
                (actions.edit || actions.delete || actions.viewDetails) && (
                  <th className="w-auto px-4 py-2 lato font-bold text-[#023337] lg:text-[12px] 2xl:text-[16px] text-center">
                    Action
                  </th>
                )
}
              </tr>
            </thead>
            <tbody>
              {data && data?.length === 0 ? (
                <tr className="text-red-500 text-center w-full mt-4 flex justify-center items-center">
                  <td>No Record Found</td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={` text-[#555F7E] font-normal inter lg:text-[13px] 2xl:text-lg  border-b border-[#D1D5DB]`}
                  >
                    {columns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className={`${col.className} px-4 py-2 cursor-pointer`}
                      >
                        {
                        
                        ["email", "phone", "phone_number","phoneNumber"].includes(col.accessor) ? (
                          <div className="group inline-flex items-center gap-2">
                            <span>{row[col.accessor]}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(row[col.accessor]);
                                toast.success(`${col.label || col.accessor} copied to clipboard`);
                              }}
                              className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-blue-600 p-1"
                              title="Copy"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        )

                        :
                        col.accessor === "docs" ? (
                          row[col.accessor] ? (
                            <Link
                              to="/dashboard/ConsumerDetail"
                              state={{ row }}
                              // target="_blank"
                              // rel="noopener noreferrer"
                            >
                              <img
                                src={doc}
                                alt="PDF"
                                className="text-blue-500 cursor-pointer ml-2 w-5"
                              />
                            </Link>
                          ) : (
                            <span className="text-gray-400">No Docs</span>
                          )
                        ) : col.accessor === "name" ? (
                          // Special case: render image + name
                          <div className="flex items-center space-x-3">
                            {row.name?.image && (
                              <img
                                src={row.name.image}
                                alt={row.name.name || "User"}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            )}
                            <span>{row.name?.name || row[col.accessor]}</span>
                          </div>
                        ) : col.accessor === "status" ?
                         (
                          // Conditional styling based on the status value
                          <span
                            className={`px-4 py-1 rounded-sm font-normal lexend ${
                              row[col.accessor] === "Completed" ||
                              row[col.accessor] === "In Stock"
                                ? "text-[#3FC28A] bg-[#3FC28A1A]"
                                : row[col.accessor] === "Pending"
                                ? "text-[#EFBE12] bg-[#EFBE121A]"
                                : row[col.accessor] === "Cancel" ||
                                  row[col.accessor] === "Out Of Stock"
                                ? "text-red-600 bg-red-100"
                                : "text-gray-600 bg-gray-100"
                            }`}
                          >
                            {row[col.accessor]}
                          </span>
                        ) : (
                          row[col.accessor]
                        )
                        
                        }
                      </td>
                    ))}

                    {/* FIXED: Conditionally render the status toggle column */}
                    {status && (
                      <td className="px-4 py-2 flex items-center justify-center space-x-2 mt-1">
                        {/* Check if toggleIcon.status is a function */}
                        {typeof toggleIcon?.status === 'function' ? (
                          toggleIcon.status(row)
                        ) : (
                          // Fallback: Create a proper toggle switch
                          <div className="flex items-center space-x-2">
                            <label className="inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={row.status === true || row.status === "true" || row.status === 1}
                                onChange={() => onToggle(row.status, row.id)}
                              />
                              <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"></div>
                            </label>
                            <span className="text-sm text-gray-600">
                              {(row.status === true || row.status === "true" || row.status === 1) ? "Active" : "Inactive"}
                            </span>
                          </div>
                        )}
                      </td>
                    )}

                    {/* Render action buttons for Edit, Delete, View Details */}
                    {actions && (actions.viewDetails ||
                      actions.edit ||
                      actions.delete ||
                      actions.viewicon) && (
                      <td className="px-4 py-2 text-center space-x-2">
                        {actions.viewDetails && (
                          <button
                            onClick={() => onViewDetails(row)}
                            className="cursor-pointer  px-3 py-1 border border-[#EDEDEE] rounded-lg text-black hover:bg-gray-100"
                          >
                            <span className="flex items-center justify-center">
                              View Details {icons.viewDetails}
                            </span>
                            {/* {icons.viewDetails && (
                        <span className="ml-2">
                          
                        </span>
                      )} */}
                          </button>
                        )}

                        {actions.edit && (
                          <button
                            onClick={() => {
                              onEdit(row); // Set the user for deletion
                              setOpenModal(true); // Close the modal
                              if (setIs_approve) {
                                setIs_approve(true); // Update approval status if the function exists
                              }
                            }}
                            className="text-black text-lg hover:text-blue-700 cursor-pointer mt-1"
                          >
                            {icons.edit && icons.edit}
                          </button>
                        )}

                        {actions.delete && (
                          <button
                            // onClick={() => setDeleteUser(row.id)}
                            // onClick={() => {
                            //   setDeleteUser(row); // Set the user for deletion
                            //   setOpenModal(true); // Close the modal
                            //   if (setIs_approve) {
                            //     setIs_approve(false); // Update approval status if the function exists
                            //   }
                            // }}
                            onClick={() => {
                              setDeleteUser(row); // Set the user for deletion
                              setDeleteModal(true); // Close the modal
                              if (setIs_approve) {
                                setIs_approve(false); // Update approval status if the function exists
                              }
                            }}
                            className="text-black hover:text-red-700 cursor-pointer mt-1"
                          >
                            {icons.delete && icons.delete}
                          </button>
                        )}

                        {actions.viewicon && (
                          <button
                            onClick={() => onViewIconClick(row)}
                            className="text-black text-lg hover:text-blue-700 cursor-pointer mt-2"
                          >
                            {icons.viewicon && icons.viewicon}
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
</div>
</div>
          {dataLength > 5 && (
            <Pagination
              currentPage={currentPage}
              dataLength={dataLength}
              setPage={setPage}
              // itemsPerPage={itemsPerPage}
              setPageSize={setPageSize}
              pageSize={pageSize}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ReusableTable;