import React, { useState, useEffect } from 'react';
import Table from "../../Components/ReusableTable/Table";
import { edit, deleteimg } from '../../assets/index'; // Adjust path as needed
import { MdKeyboardArrowRight } from "react-icons/md";

import { fetchResults } from "../../Services/GetResults";
import OrderTable from '../../Components/ReusableTable/OrderTable';
import { SearchResults } from "../../Services/Search";
import useDebouncing from "../../Components/Debouncing/Debouncing"
import { SearchResultsByOrderId } from '../../Services/OrderSearch';
import FormatNumber from "../../Components/Formatter/Format";

import { RxCross2 } from "react-icons/rx";
import { GrStatusGood } from "react-icons/gr";
import AlphaPte from './AlphaPte';
import DealsListing from './DealListing';
import Loader from "../../Components/Loader/Loader"

import { AddResultMutation} from "../../Services/AddResultService"
import { toast } from 'react-hot-toast';

import { useQueryClient } from "@tanstack/react-query";

const OrderList = () => {

  const {
    data: ResultsApi,
    isLoading,
    error,
  } = fetchResults("it-voucher-order-listing", "/api/admin/it-voucher-order-listing/");
 
  const {
    data: voucherOrderStatistics,
    isLoading: LoadingvoucherOrderStatistics,
    error: ErrorvoucherOrderStatistics,
  } = fetchResults("voucher-order-statistics", "/api/admin/voucher-order-statistics/");
  
  const {
    data: dealOrderStatistics,
    isLoading: LoadingdealOrderStatistics,
    error: ErrordealOrderStatistics,
  } = fetchResults("deal-order-statistics", "/api/admin/deal-order-statistics/");

  const {
    data: alphapteOrderStatistics,
    isLoading: LoadingalphapteOrderStatistics,
    error: ErroralphapteOrderStatistics,
  } = fetchResults("deal-order-statistics", "/api/admin/aplha-pte-order-statistics/");

  const {
    data: totalRevenue,
    isLoading: isLoadingtotalRevenue,
    error: errortotalRevenue,
  } = fetchResults("total-revenue", "/api/admin/total-revenue/");
 
  const {
    data: PayFastPaymentCount,
    isLoading: PayFastPaymentLoading,
    error: PayFastPaymentError,
  } = fetchResults("payfast-payment-count", "/api/admin/total-payment-count/");

  const mutation = AddResultMutation(["it-voucher-order-listing"]);
  const filterMutation = AddResultMutation(); // New mutation for filtering

  const queryClient = useQueryClient();

  // SearchApi 
  const [searchTable1, setSearchTable1] = useState("")
  const debouncedSearchTable1 = useDebouncing(searchTable1, 2000)

  const { data: ResultSearch, isLoading: IsLoadingResultSearch } = 
  SearchResultsByOrderId("it-voucher-order-listing", "/api/admin/get-order-by-id/", debouncedSearchTable1);

  const [transformedData1, setTransformedData1] = useState({
    "Table Data1": [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [parentActiveTab, setParentActiveTab] = useState("all");
  const [activeCategoryTab, setActiveCategoryTab] = useState(0);

  const [formState, setFormState] = useState();
  const [isEditResultModalOpen, setEditResultIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const filterOptions = ["Show All", "Debit Credit", "Bank Transfer"];
    const [selectedFilter, setSelectedFilter] = useState("Show All");
    const [filteredData, setFilteredData] = useState(null); // Store filtered data

  // Process PayFast Payment Count data similar to Dashboard
  const rawStatusCounts = PayFastPaymentCount?.data?.status_counts || {};
  
  const filteredCards = Object.entries(rawStatusCounts)
    .filter(([status]) => status === "PENDING" || status === "COMPLETED")
    .map(([status, value]) => ({
      status,
      count: value.count,
      total_amount: value.total_amount,
    }));
  
  // Separate them
  const completed = filteredCards.find(item => item.status === "COMPLETED") || { count: 0, total_amount: 0 };
  const pending = filteredCards.find(item => item.status === "PENDING") || { count: 0, total_amount: 0 };

  // Transform function for fetch API response (array of payments)
  const transformFetchApiResponse = (apiResponse, currentPage, pageSize) => {
    let data = [];
    
    if (Array.isArray(apiResponse)) {
      // Filter API returns direct array
      data = apiResponse;
    } else if (apiResponse?.payments) {
      // Original API returns object with payments property
      data = apiResponse.payments;
    }
  
    return data
      .filter(item => item.order_id && item.product_name)
      .map((item, index) => {
        const srNo = (currentPage - 1) * pageSize + index + 1;
  
        const status = item.type === 'bank_transfer' || item.type === 'bank transfer'
          ? item.payment_approved ? 'APPROVED' : 'PENDING'
          : item.status || 'UNKNOWN';
  
        return {
          id: `${item?.id}`,
          orderId: item.order_id || 'N/A',
          voucherName: item.product_name || 'N/A',
          quantity: item.product_quantity || 1,
          amount: item.product_price || '0.00',
          date: item.created_at 
            ? new Date(item.created_at).toLocaleDateString() 
            : 'N/A',
          customerName: item.full_name || 'Unknown',
          email: ` ${item.email || 'N/A'}`,
          phone: item.phone_number || 'N/A',
          paymentType: item.type || 'N/A',
          cardHolder: item.card_holder_name || item.full_name,
          cardNumber: item.card_number || (item.type.includes('bank') ? 'N/A' : 'Unknown'),
          status: status,
          screenshot: item.payment_image || null,
          ...item,
        };
      });
  };

  // Transform function for search API response (single object)
  const transformSearchApiResponse = (apiResponse, currentPage, pageSize) => {
    const item = apiResponse?.data;
    
    if (!item || !item.order_id || !item.product_name) {
      return [];
    }

    const status = item.type === 'bank_transfer' || item.type === 'bank transfer'
      ? item.payment_approved ? 'APPROVED' : 'PENDING'
      : item.status || 'UNKNOWN';

    return [{
      id: item?.id,
      orderId: item.order_id || 'N/A',
      voucherName: item.product_name || 'N/A',
      quantity: item.product_quantity || 1,
      amount: item.product_price || '0.00',
      date: item.created_at 
        ? new Date(item.created_at).toLocaleDateString() 
        : 'N/A',
      customerName: item.full_name || 'Unknown',
      email: ` ${item.email || 'N/A'}`,
      phone: item.phone_number || 'N/A',
      paymentType: item.type || 'N/A',
      cardHolder: item.card_holder_name || item.full_name,
      cardNumber: item.card_number || (item.type.includes('bank') ? 'N/A' : 'Unknown'),
      status: status,
      screenshot: item.payment_image || null,
      ...item,
    }];
  };

  const columns = [
    {label:"ID",accessor:"id"},
    { label: "Order ID", accessor: "orderId" },
    { label: "Voucher Name", accessor: "voucherName" },
    { label: "Quantity", accessor: "quantity" },
    { label: "Amount", accessor: "amount" },
    { label: "Date", accessor: "date" },
    { label: "Customer Name", accessor: "customerName" },
    { label: "Email", accessor: "email" },
    { label: "Phone Number", accessor: "phone" },
    { label: "Payment Type", accessor: "paymentType" },
    { label: "Card Holder", accessor: "cardHolder" },
    { label: "ScreenShot", accessor: "screenshot" },
    { label: "Card Number", accessor: "cardNumber" },
    { label: "Status", accessor: "status" },
  ];
  
  // Effects for handling search and fetch results
  useEffect(() => {
    if (debouncedSearchTable1 && ResultSearch?.data) {
      const transformed = transformSearchApiResponse(
        ResultSearch,
        currentPage,
        10
      );
      setTransformedData1({ "Table Data1": transformed });
    }
  }, [ResultSearch, currentPage, debouncedSearchTable1]);
  
  useEffect(() => {
    if (!debouncedSearchTable1) {
      // If we have filtered data, use it; otherwise use original data
      const dataToUse = filteredData || ResultsApi?.data;
      
      if (dataToUse) {
        const transformed = transformFetchApiResponse(
          dataToUse,
          currentPage,
          10
        );
        setTransformedData1({ "Table Data1": transformed });
      }
    }
  }, [ResultsApi, filteredData, currentPage, debouncedSearchTable1]);


 // Effect to reset to original data when search is cleared
 useEffect(() => {
  if (debouncedSearchTable1 === "") {
    const dataToUse = filteredData || ResultsApi?.data;
    
    if (dataToUse) {
      const transformed = transformFetchApiResponse(
        dataToUse,
        currentPage,
        10
      );
      setTransformedData1({ "Table Data1": transformed });
    }
  }
}, [debouncedSearchTable1, ResultsApi, filteredData, currentPage]);

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
  };

  const handleApprove = (payment_approved) => {
    if (!formState?.id) {
      return;
    }

    const id = formState.id;
    const formData = new FormData();
    formData.append("payment_id", id)
    formData.append("payment_approved", payment_approved ? "True" : "False");
  
    mutation.mutate(
      {
        payload: formData,
        path: "bank-payment-approval/",
      },
      {
        onSuccess: () => {
          toast.success(payment_approved ? "Payment Approved ✅" : "Payment Cancelled ❌");
          setShowModal(false);
          setFormState(null);
          queryClient.invalidateQueries(["it-voucher-order-listing"]);
          
          // ✅ Re-run filter API if we're currently on a filtered view
          if (selectedFilter !== "Show All") {
            const filterTypeMap = {
              "Debit Credit": "debit/credit",
              "Bank Transfer": "bank transfer"
            };
            
            const apiFilterValue = filterTypeMap[selectedFilter];
            
            if (apiFilterValue) {
              const formData = new FormData();
              formData.append("type", apiFilterValue);

              filterMutation.mutate(
                {
                  payload: formData,
                  path: "admin/filter-voucher/", // Note: using filter-voucher for OrderList
                },
                {
                  onSuccess: (data) => {
                    console.log("Re-filtered after approval:", data);
                    setFilteredData(data);
                  },
                  onError: (error) => {
                    console.error("Re-filter Error:", error);
                    // If re-filtering fails, reset to show all
                    setSelectedFilter("Show All");
                    setFilteredData(null);
                  },
                }
              );
            }
          }
        },
        onError: (error) => {
          const errorMessage = error?.response?.data?.error || "Failed to update approval";
          toast.error(errorMessage);
          setShowModal(false);
        },
      }
    );
  };
   
  const actions = { viewDetails: false, edit: true, delete: true };
  const icons = {
    viewDetails: <MdKeyboardArrowRight />,
    edit: <GrStatusGood className="w-4 h-4" />,
    delete: <RxCross2  className="w-4 h-4" />,
  };

  const dateFilterButtons = [
    {label:"All",value:"all"},
    { label: "Vouchers", value: "voucher" },
    { label: "Deals", value: "deal" },
    { label: "Alpha Pte", value: "alphapte" },
  ];

  const onTabChange = (value) => {
    setParentActiveTab(value);
  };


  const handleFilterChange = (filterValue) => {
    setSelectedFilter(filterValue);
    
    if (filterValue === "Show All") {
      // Reset to original data
      setFilteredData(null);
      return;
    }

    // Map filter options to API values
    const filterTypeMap = {
      "Debit Credit": "debit/credit",
      "Bank Transfer": "bank transfer"
    };

    const apiFilterValue = filterTypeMap[filterValue];
    
    if (apiFilterValue) {
      const formData = new FormData();
      formData.append("type", apiFilterValue);

      filterMutation.mutate(
        {
          payload: formData,
          path: "admin/filter-voucher/",
        },
        {
          onSuccess: (data) => {
            console.log("Filter API Response:", data);
            setFilteredData(data);
            toast.success(`Filtered by ${filterValue}`);
            queryClient.invalidateQueries(["it-voucher-order-listing"]);
          },
          onError: (error) => {
            console.error("Filter Error:", error);
            const errorMessage =
              error?.response?.data?.error || "Failed to filter data";
            toast.error(errorMessage);
          },
        }
      );
    }
  };

  const categories = ['Vouchers', 'Alfa PTE', 'Our Deals'];

  // Function to get current data based on active tab
  const getCurrentData = () => {
    switch (parentActiveTab) {
      case "all":
        return {
          data: {
            total_revenue: totalRevenue?.data?.total_revenue ?? 0,
            total_orders: totalRevenue?.data?.total_orders ?? 0,
            payfast_completed: completed.total_amount,
            payfast_pending: pending.total_amount,
            payfast_completed_count: completed.count,
            payfast_pending_count: pending.count,
          },
          isLoading: isLoadingtotalRevenue || PayFastPaymentLoading,
          error: errortotalRevenue || PayFastPaymentError,
        };
      case "voucher":
        return {
          data: voucherOrderStatistics,
          isLoading: LoadingvoucherOrderStatistics,
          error: ErrorvoucherOrderStatistics,
        };
      case "deal":
        return {
          data: dealOrderStatistics,
          isLoading: LoadingdealOrderStatistics,
          error: ErrordealOrderStatistics,
        };
      case "alphapte":
        return {
          data: alphapteOrderStatistics,
          isLoading: LoadingalphapteOrderStatistics,
          error: ErroralphapteOrderStatistics,
        };
      default:
        return {
          data: null,
          isLoading: false,
          error: null,
        };
    }
  };

  const { data: currentData, isLoading: currentLoading, error: currentError } = getCurrentData();

  // Function to render content based on active category tab
  const renderCategoryContent = () => {
    switch (activeCategoryTab) {
      case 0: // IT Vouchers
        return (
          <OrderTable
            columns={columns}
            data={transformedData1["Table Data1"]}
            actions={actions}
            icons={icons}
            borderRadius={true}
            download={false}
            search={true}

            filter={true}

            filterOptions={filterOptions}
            setSelectedFilter={handleFilterChange} // Updated to use our handler
            selectedFilter={selectedFilter}
            filterLoading={filterMutation.isPending} // Show loading state during filter
    
    
            pagination={true}
            modal={false}
            Loading={isLoading || IsLoadingResultSearch}
            setSearchTable={setSearchTable1}
            setOpenModal={setShowModal}
            setDeleteModal={setShowModal}
            onEdit={setFormState}
            setDeleteUser={setFormState}
          />
        );
      case 1: // Alfa PTE
        return <AlphaPte />;
      case 2: // Our Deals
        return <DealsListing/>
      default:
        return (
          <OrderTable
            columns={columns}
            data={transformedData1["Table Data1"]}
            actions={actions}
            icons={icons}
            borderRadius={true}
            download={false}
            search={true}
            filter={true}
            pagination={true}
            modal={false}
            Loading={isLoading || IsLoadingResultSearch}
            setSearchTable={setSearchTable1}
            setOpenModal={setShowModal}
            setDeleteModal={setShowModal}
            onEdit={setFormState}
            setDeleteUser={setFormState}
          />
        );
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center">
        <div className="lato text-[#023337] text-lg font-bold">Order List</div>

        <div className="inline-flex bg-white border border-[#F0F1F3] p-2 rounded-md">
          {dateFilterButtons.map((button, index) => (
            <button
              key={index}
              onClick={() => onTabChange && onTabChange(button.value)}
              className={`px-3 py-1 text-sm lato font-medium rounded-md transition-all
                ${
                  parentActiveTab === button.value
                    ? "bg-[#3651BF1A] text-black"
                    : "bg-transparent text-[#4B5563]"
                }`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards - Enhanced with PayFast data */}
      {currentLoading ? (
        <Loader />
      ) : currentError ? (
        <div className="flex justify-center text-red-400 items-center h-20">
          Error Fetching Data
        </div>
      ) : (
        currentData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
            {parentActiveTab === "all" ? (
              <>
                {/* Total Revenue Card */}
                <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col justify-between gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-gray-900 text-lg font-semibold">Total Revenue</h3>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <span className="text-4xl font-medium text-gray-900">
                      Rs. {FormatNumber(currentData.total_revenue)}
                    </span>
                  </div>
                  <div className="flex justify-end items-center">
                    <button className="px-6 py-2 border border-blue-500 text-blue-500 rounded-full text-sm hover:bg-blue-50 transition-colors">
                      Details
                    </button>
                  </div>
                </div>

                {/* Total Orders Card */}
                <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col justify-between gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-gray-900 text-lg font-semibold">Total Orders</h3>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <span className="text-4xl font-medium text-gray-900">
                      {FormatNumber(currentData.total_orders)}
                    </span>
                  </div>
                  <div className="flex justify-end items-center">
                    <button className="px-6 py-2 border border-blue-500 text-blue-500 rounded-full text-sm hover:bg-blue-50 transition-colors">
                      Details
                    </button>
                  </div>
                </div>

                {/* PayFast Payment Status Card */}
                <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col gap-4 md:col-span-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-gray-900 text-lg font-semibold">PayFast Payment Status</h3>
                    </div>
                  </div>

                  <div className="flex justify-between gap-6">
                    {/* Completed Block */}
                    <div className="flex flex-col gap-1 flex-1 border-r pr-4">
                      <div className="text-sm text-green-900">Completed</div>
                      <span className="text-2xl font-medium text-green-600">
                        Rs.{FormatNumber(currentData.payfast_completed.toFixed(2))}
                      </span>
                      <span className="text-green-700 text-sm font-medium">
                        {currentData.payfast_completed_count} orders
                      </span>
                    </div>

                    {/* Pending Block */}
                    <div className="flex flex-col gap-1 flex-1 pl-4">
                      <div className="text-sm text-yellow-600">Pending</div>
                      <span className="text-2xl font-medium text-yellow-500">
                        Rs.{FormatNumber(currentData.payfast_pending.toFixed(2))}
                      </span>
                      <span className="text-yellow-700 text-sm font-medium">
                        {currentData.payfast_pending_count} orders
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end items-center">
                    <button className="px-6 py-2 border border-blue-500 text-blue-500 rounded-full text-sm hover:bg-blue-50 transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // Other tab stats (voucher, deal, alphapte)
              Object.entries(currentData).map(([key, value], index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-1dp-ambient relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-bold mb-2 lato text-[#23272E]">
                        {key
                          .replace(/_/g, ' ')
                          .replace(/\b\w/g, (l) => l.toUpperCase())
                        }
                      </h2>
                      <p className="text-3xl font-bold lato text-green-800">{value}</p>
                      <p className="text-sm text-gray-500 mt-1">Till Date</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )
      )}

      {/* Category Filter Buttons */}
      <div className="bg-gray-100 p-1 rounded-lg mb-3 w-full lg:w-[30%]">
        <div className="flex gap-1 overflow-x-auto">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveCategoryTab(index)}
              className={`px-4 py-2 rounded-md whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                index === activeCategoryTab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Content Based on Category Tab */}
      {renderCategoryContent()}

      {/* Approval Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center backdrop-blur-md bg-gray-800/30 justify-center z-60">
          <div className="bg-white p-5 rounded-lg w-[95%] lg:w-[40%] 2xl:w-[40%] shadow-2xl max-h-[95vh] overflow-y-auto">
            <h2 className="text-lg text-center font-semibold text-gray-800 mb-4">
              Are you sure you want to Proceed?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleApprove(false)}
                className="cursor-pointer px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                 onClick={() => handleApprove(true)}
                className="cursor-pointer px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;