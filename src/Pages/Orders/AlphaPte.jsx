import React, { useState, useEffect } from "react";
import Table from "../../Components/ReusableTable/Table";
import { edit, deleteimg,alfa } from "../../assets/index"; // Adjust path as needed
import { MdKeyboardArrowRight } from "react-icons/md";

import { fetchResults } from "../../Services/GetResults";
import { SearchResults } from "../../Services/Search";
import useDebouncing from "../../Components/Debouncing/Debouncing";
import { SearchResultsByOrderId } from "../../Services/OrderSearch";

import { RxCross2 } from "react-icons/rx";
import { GrStatusGood } from "react-icons/gr";
import AlphaPteDealTable from "../../Components/ReusableTable/AlphaPteDealTable";

import { AddResultMutation} from "../../Services/AddResultService"
import { toast } from 'react-hot-toast';

import { useQueryClient } from "@tanstack/react-query";
const AlphaPte = () => {
  // fetch it voucher
  const {
    data: ResultsApi,
    isLoading,
    error,
  } = fetchResults(
    "aplpha-pte-voucher-listing",
    "/api/admin/aplpha-pte-voucher-listing/"
  );

  // SearchApi
  const [searchTable1, setSearchTable1] = useState("");
  const debouncedSearchTable1 = useDebouncing(searchTable1, 2000);

  const { data: ResultSearch, isLoading: IsLoadingResultSearch } =
    SearchResultsByOrderId(
      "aplpha-pte-voucher-listings",
      "/api/admin/get-alpha-pte-order-by-id/",
      debouncedSearchTable1
    );

    const mutation = AddResultMutation(["aplpha-pte-voucher-listings"]);
    const filterMutation = AddResultMutation(); // New mutation for filtering
    const queryClient = useQueryClient();

    const filterOptions = ["Show All", "Debit Credit", "Bank Transfer"];
    const [selectedFilter, setSelectedFilter] = useState("Show All");
    const [filteredData, setFilteredData] = useState(null); // Store filtered data
  const [transformedData1, setTransformedData1] = useState({
    "Table Data1": [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [parentActiveTab, setParentActiveTab] = useState("all");
  const [activeCategoryTab, setActiveCategoryTab] = useState(0); // New state for category tabs

  const [formState, setFormState] = useState();
  console.log(formState)

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isEditResultModalOpen, setEditResultIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Add this handler
  const handleAddNewProduct = (row) => {
    console.log(row);
    // Handle add new product logic
  };

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
      .filter((item) => item.order_id && item.product_name) // Filter out entries with missing order_id or product_name
      .map((item, index) => {
        const srNo = (currentPage - 1) * pageSize + index + 1;

        // Determine status based on payment type
        const status =
          item.type === "bank_transfer" || item.type === "bank transfer"
            ? item.payment_approved
              ? "APPROVED"
              : "PENDING"
            : item.status || "UNKNOWN";

        return {
          no: `${srNo}`,
          orderId: item.order_id || "N/A",
          voucherName: item.product_name || "N/A",
          quantity: item.product_quantity || 1,
          amount: item.product_price || "0.00",
          date: item.created_at
            ? new Date(item.created_at).toLocaleDateString()
            : "N/A",
          customerName: item.full_name || "Unknown",
          // contact: `${item.email || "N/A"} / ${item.phone_number || "N/A"}`,
          email: ` ${item.email || 'N/A'}`,
          phone: item.phone_number || 'N/A',
          paymentType: item.type || "N/A",
          cardHolder: item.card_holder_name || item.full_name,
          cardNumber:
            item.card_number ||
            (item.type.includes("bank") ? "N/A" : "Unknown"),
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
    const status =
      item.type === "bank_transfer" || item.type === "bank transfer"
        ? item.payment_approved
          ? "APPROVED"
          : "PENDING"
        : item.status || "UNKNOWN";

    return [
      {
        no: `1`, // Since it's a single result
        orderId: item.order_id || "N/A",
        voucherName: item.product_name || "N/A",
        quantity: item.product_quantity || 1,
        amount: item.product_price || "0.00",
        date: item.created_at
          ? new Date(item.created_at).toLocaleDateString()
          : "N/A",
        customerName: item.full_name || "Unknown",
        // contact: `${item.email || "N/A"} / ${item.phone_number || "N/A"}`,
        email: ` ${item.email || 'N/A'}`,
          phone: item.phone_number || 'N/A',
        paymentType: item.type || "N/A",
        cardHolder: item.card_holder_name || item.full_name,
        cardNumber:
          item.card_number || (item.type.includes("bank") ? "N/A" : "Unknown"),
        status: status,
        screenshot: item.payment_image || null,
        ...item, // Include rest of the fields in case needed elsewhere
      },
    ];
  };

  // columns
  const columns = [
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

  // const toggle = { toggle: true };

  // const toggleIcon = {
  //   status: (
  //     <label className="inline-flex items-center cursor-pointer">
  //       <input type="checkbox" className="sr-only peer" />
  //       <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"></div>
  //     </label>
  //   ),
  // };

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
  };

  const getCurrentData = () => {
    if (activeTab === "all") return allOrdersData;
    if (activeTab === "completed") return completedData;
    if (activeTab === "pending") return pendingData;
    return allOrdersData;
  };

  const actions = { viewDetails: false, edit: true, delete: true };

  const icons = {
    viewDetails: <MdKeyboardArrowRight />,
    edit: <GrStatusGood className="w-4 h-4" />,
    delete: <RxCross2 className="w-4 h-4" />,
  };

  const dateFilterButtons = [
    { label: "All Date", value: "all" },
    { label: "12 Months", value: "12months" },
    { label: "30 Days", value: "30days" },
    { label: "7 Days", value: "7days" },
    { label: "24 Hour", value: "24hours" },
  ];

  const onTabChange = (value) => {
    setParentActiveTab(value);
    // any other logic on click
  };

  const categories = ["IT Vouchers", "Alfa PTE", "Our Deals"];

  // Aceept reject

  const handleApprove = (payment_approved) => {
    if (!formState?.id) {
      console.error("No item selected for approval");
      return;
    }
  
    const id = formState.id;
    const paymentType = formState.type; // assumed to be 'debit/credit' or 'bank_transfer'
  
    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", payment_approved);
    formData.append("email", email);
    formData.append("password", password);
  
    // Set endpoint based on payment type
    let path = ""; // default fallback
    if (paymentType === "debit/credit") {
      path = "admin/send-alphapta-deibit-mail/";
    } else if (paymentType === "bank_transfer") {
      path = "admin/send-alphapta-bank-mail/";
    }
  
    mutation.mutate(
      {
        payload: formData,
        path: path,
      },
      {
        onSuccess: () => {
          toast.success("Approval updated successfully!");
          setShowModal(false);
          setFormState(null);
          // ✅ Refetch the voucher list to show updated status
          queryClient.invalidateQueries(["aplpha-pte-voucher-listings"]);
          
          // ✅ Re-run filter API if we're currently on a filtered view
          if (selectedFilter !== "Show All") {
            const filterTypeMap = {
              "Debit Credit": "debit/credit",
              "Bank Transfer": "bank transfer"
            };
            
            const apiFilterValue = filterTypeMap[selectedFilter];
            
            if (apiFilterValue) {
              const filterFormData = new FormData(); // Renamed to avoid conflict
              filterFormData.append("type", apiFilterValue);
  
              filterMutation.mutate(
                {
                  payload: filterFormData,
                  path: "admin/filter-alpha/",
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
          const errorMessage =
            error?.response?.data?.error || "Failed to update approval";
          toast.error(errorMessage);
          setShowModal(false);
        },
      }
    );
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
          path: "admin/filter-alpha/",
        },
        {
          onSuccess: (data) => {
            console.log("Filter API Response:", data);
            setFilteredData(data);
            toast.success(`Filtered by ${filterValue}`);
            queryClient.invalidateQueries(["aplpha-pte-voucher-listings"]);
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
  
 

  return (
    <div className="flex flex-col gap-2  w-full">
      {/* ------------------Table------------------ */}
      <AlphaPteDealTable
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

      {/* modal  */}
      {showModal && (
  <div className="fixed inset-0 flex items-center justify-center z-60 backdrop-blur-md bg-gray-800/30">
    <div className="relative bg-white p-6 rounded-lg w-[95%] lg:w-[40%] shadow-2xl max-h-[95vh] overflow-y-auto">

      {/* ❌ X Close Button */}
      <button
        onClick={() => setShowModal(false)}
        className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
      >
        &times;
      </button>

      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Hello <span className="font-bold">{formState.full_name} 👋</span>
      </h2>
      <p className="text-gray-600 mb-4">Thank you for your purchase!</p>

      <div className="text-sm mb-4">
        <p className="text-gray-700 font-medium">Order details:</p>
        <p>
          Order ID:{" "}
          <span className="text-blue-600 underline cursor-pointer">
            {formState?.order_id}
          </span>
        </p>
      </div>

      <div className="border rounded-lg p-4 mb-4">
        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-md" >
            <img src={alfa} alt="" 
            className="w-full h-full object-contain rounded-md"
            />
          </div>
          <div>
            <p className="font-semibold">{formState?.product_name}</p>
            <p className="text-sm text-gray-500">
              Qty: {formState?.product_quantity}
            </p>
            <p className="text-sm text-gray-700">
              Rs. {formState?.product_price}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <p>Total</p>
        <p className="text-xl font-bold">
          Rs. {formState?.product_quantity * formState?.product_price}
        </p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="font-semibold mb-2">Alfa PTE Account</p>
        <div className="mb-2">
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="enter username"
            className="w-full bg-white border border-gray-300 rounded px-3 py-2 mt-1 text-gray-700"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Password</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="enter password"
            className="w-full bg-white border border-gray-300 rounded px-3 py-2 mt-1 text-gray-700"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => handleApprove(false)}
          className="cursor-pointer px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
        >
          Close
        </button>
        <button
          onClick={() => handleApprove(true)}
          className="cursor-pointer px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
        >
          Send
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default AlphaPte;
