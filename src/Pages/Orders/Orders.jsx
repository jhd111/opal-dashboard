import React, { useState, useEffect } from 'react';
import Table from "../../Components/ReusableTable/Table";
import { edit, deleteimg } from '../../assets/index'; // Adjust path as needed
import { MdKeyboardArrowRight } from "react-icons/md";

import { fetchResults } from "../../Services/GetResults";
import OrderTable from '../../Components/ReusableTable/OrderTable';
import { SearchResults } from "../../Services/Search";
import useDebouncing from "../../Components/Debouncing/Debouncing"
import { SearchResultsByOrderId } from '../../Services/OrderSearch';

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
    isLoading:LoadingvoucherOrderStatistics,
    error:ErrorvoucherOrderStatistics,
  } = fetchResults("voucher-order-statistics", "/api/admin/voucher-order-statistics/");
  const {
    data: dealOrderStatistics,
    isLoading:LoadingdealOrderStatistics,
    error:ErrordealOrderStatistics,
  } = fetchResults("deal-order-statistics", "/api/admin/deal-order-statistics/");

  const {
    data: alphapteOrderStatistics,
    isLoading:LoadingalphapteOrderStatistics,
    error:ErroralphapteOrderStatistics,
  } = fetchResults("deal-order-statistics", "/api/admin/aplha-pte-order-statistics/");

  
 

  const mutation = AddResultMutation(["it-voucher-order-listing"]);

  const queryClient = useQueryClient(); // initialize query client

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
  const [parentActiveTab, setParentActiveTab] = useState("voucher");
  const [activeCategoryTab, setActiveCategoryTab] = useState(0); // New state for category tabs

  const [formState, setFormState] = useState();

  const [isEditResultModalOpen, setEditResultIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);


  // Add this handler
  const handleAddNewProduct = (row) => {
    console.log(row);
    // Handle add new product logic
  };

  // Transform function for fetch API response (array of payments)
  const transformFetchApiResponse = (apiResponse, currentPage, pageSize) => {
    const data = apiResponse?.payments || [];
  
    return data
      .filter(item => item.order_id && item.product_name) // Filter out entries with missing order_id or product_name
      .map((item, index) => {
        const srNo = (currentPage - 1) * pageSize + index + 1;
  
        // Determine status based on payment type
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
          ...item, // Include rest of the fields in case needed elsewhere
        };
      });
  };

  // Transform function for search API response (single object)
  const transformSearchApiResponse = (apiResponse, currentPage, pageSize) => {
    const item = apiResponse?.data;
    
    if (!item || !item.order_id || !item.product_name) {
      return []; // Return empty array if no valid data
    }

    // Determine status based on payment type
    const status = item.type === 'bank_transfer' || item.type === 'bank transfer'
      ? item.payment_approved ? 'APPROVED' : 'PENDING'
      : item.status || 'UNKNOWN';

    return [{
      id: item?.id, // Since it's a single result
      orderId: item.order_id || 'N/A',
      voucherName: item.product_name || 'N/A',
      quantity: item.product_quantity || 1,
      amount: item.product_price || '0.00',
      date: item.created_at 
        ? new Date(item.created_at).toLocaleDateString() 
        : 'N/A',
      customerName: item.full_name || 'Unknown',
      // contact: `${item.email || 'N/A'} / ${item.phone_number || 'N/A'}`,
      email: ` ${item.email || 'N/A'}`,
      phone: item.phone_number || 'N/A',
      paymentType: item.type || 'N/A',
      cardHolder: item.card_holder_name || item.full_name,
      cardNumber: item.card_number || (item.type.includes('bank') ? 'N/A' : 'Unknown'),
      status: status,
      screenshot: item.payment_image || null,
      ...item, // Include rest of the fields in case needed elsewhere
    }];
  };

  // columns 
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
  
  // Effect to handle search results
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
  
  // Effect to handle fetch results (when no search or search is cleared)
  useEffect(() => {
    if (!debouncedSearchTable1 && ResultsApi?.data) {
      const transformed = transformFetchApiResponse(
        ResultsApi.data,
        currentPage,
        10
      );
      setTransformedData1({ "Table Data1": transformed });
    }
  }, [ResultsApi, currentPage, debouncedSearchTable1]);

  // Effect to reset to original data when search is cleared
  useEffect(() => {
    if (debouncedSearchTable1 === "") {
      if (ResultsApi?.data) {
        const transformed = transformFetchApiResponse(
          ResultsApi.data,
          currentPage,
          10
        );
        setTransformedData1({ "Table Data1": transformed });
      }
    }
  }, [debouncedSearchTable1, ResultsApi, currentPage]);
  
  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
  };

  


  // Aceept reject
  const handleApprove = (payment_approved) => {
    console.log("formState",formState)
    if (!formState?.id) {
      return;
    }
  

    const id = formState.id;

    const formData = new FormData();
    formData.append("payment_id",id)
    formData.append("payment_approved", payment_approved ? "True" : "False");
  
    mutation.mutate(
      {
        payload: formData,
        path: "bank-payment-approval/",
        // queryKey: "it-voucher-order-listing",
      },
      {
        onSuccess: () => {
          toast.success(payment_approved ? "Payment Approved ✅" : "Payment Cancelled ❌");
          setShowModal(false);
          setFormState(null);

          // ✅ Refetch the voucher list to show updated status
      queryClient.invalidateQueries(["it-voucher-order-listing"]);
        },
        onError: (error) => {
          const errorMessage =
    error?.response?.data?.error || "Failed to update approval";
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

  // const dateFilterButtons = [
  //   { label: "All Date", value: "all" },
  //   { label: "12 Months", value: "12months" },
  //   { label: "30 Days", value: "30days" },
  //   { label: "7 Days", value: "7days" },
  //   { label: "24 Hour", value: "24hours" },
  // ];

   const dateFilterButtons = [
    { label: "Vouchers", value: "voucher" },
    { label: "Deals", value: "deal" },
    { label: "Alpha Pte", value: "alphapte" },
    
  ];

  const onTabChange = (value) => {
    setParentActiveTab(value);
    // any other logic on click
  };

  const categories = ['IT Vouchers', 'Alfa PTE', 'Our Deals'];

  // / Function to get current data based on active tab
const getCurrentData = () => {
  switch (parentActiveTab) {
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
        return  <DealsListing/>
          
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
    <div className="flex flex-col gap-2  w-full">
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

      {/* ------------------Stats Cards------------------ */}
 {/* Stats Cards - Conditional Rendering */}
 {currentLoading ? (
      <Loader />
    ) : currentError ? (
      <div>Error Fetching Data</div>
    ) : (
      currentData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
          {Object.entries(currentData).map(([key, value], index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-1dp-ambient relative">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold mb-2 lato text-[#23272E]">
                    {key
                      .replace(/_/g, ' ') // Replace underscores with spaces
                      .replace(/\b\w/g, (l) => l.toUpperCase()) // Capitalize words
                    }
                  </h2>
                  <p className="text-3xl font-bold lato text-green-800">{value}</p>
                  <p className="text-sm text-gray-500 mt-1">Till Date</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    )}


        {/* New Orders
        <div className="bg-white rounded-lg p-6 shadow-1dp-ambient relative">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold mb-2 lato text-[#23272E]">
                New Orders
              </h2>
              <div className="flex items-center space-x-2 mb-1">
                <p className="text-3xl font-bold lato text-[#23272E]">240</p>
                <span className="text-sm text-green-600 font-medium">↑ 20%</span>
              </div>
              <p className="text-sm text-gray-500">Last 7 days</p>
            </div>
          </div>
        </div>

        Completed Orders
        <div className="bg-white rounded-lg p-6 shadow-1dp-ambient relative">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold mb-2 lato text-[#23272E]">
                Completed Orders
              </h2>
              <div className="flex items-center space-x-2 mb-1">
                <p className="text-3xl font-bold lato text-[#23272E]">960</p>
                <span className="text-sm text-green-600 font-medium">85%</span>
              </div>
              <p className="text-sm text-gray-500">Last 7 days</p>
            </div>
          </div>
        </div>

        Pending Orders
        <div className="bg-white rounded-lg p-6 shadow-1dp-ambient relative">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold mb-2 lato text-[#23272E]">
                Pending Orders
              </h2>
              <div className="flex items-center space-x-2 mb-1">
                <p className="text-3xl font-bold lato text-[#23272E]">87</p>
                <span className="text-sm text-red-600 font-medium">↓ 5%</span>
              </div>
              <p className="text-sm text-gray-500">Last 7 days</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* ------------------Category Filter Buttons------------------ */}
      <div className="bg-gray-100 p-1 rounded-lg mb-3 w-full lg:w-[33%]">
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

      {/* ------------------Dynamic Content Based on Category Tab------------------ */}
      {renderCategoryContent()}
      {/* modal  */}
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