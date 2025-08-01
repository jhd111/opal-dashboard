import React, { useState, useEffect } from "react";
import Table from "../../Components/ReusableTable/Table";
import { edit, deleteimg } from "../../assets/index"; // Adjust path as needed
import { MdKeyboardArrowRight } from "react-icons/md";

import { fetchResults } from "../../Services/GetResults";
import { SearchResults } from "../../Services/Search";
import useDebouncing from "../../Components/Debouncing/Debouncing";
import { SearchResultsByOrderId } from "../../Services/OrderSearch";

import { RxCross2 } from "react-icons/rx";
import { GrStatusGood } from "react-icons/gr";
import AlphaPteDealTable from "../../Components/ReusableTable/AlphaPteDealTable";

import { AddResultMutation } from "../../Services/AddResultService";
import { toast } from "react-hot-toast";

import { useQueryClient } from "@tanstack/react-query";
import { AddAddDealEmailMutation } from "../../Services/AddDealEmail";

const DealsListing = () => {
  // fetch it voucher
  const {
    data: ResultsApi,
    isLoading,
    error,
  } = fetchResults("deal-order-listing", "/api/admin/deal-order-listing/");

  // SearchApi
  const [searchTable1, setSearchTable1] = useState("");
  const debouncedSearchTable1 = useDebouncing(searchTable1, 2000);

  const { data: ResultSearch, isLoading: IsLoadingResultSearch } =
    SearchResultsByOrderId(
      "deal-order-listing",
      "/api/admin/get-deal-by-id/",
      debouncedSearchTable1
    );

  const mutation = AddAddDealEmailMutation(["deal-order-listing"]);
  const mutation1 = AddResultMutation();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [voucher, setVoucher] = useState();
  console.log(voucher)
  const [voucherStatus, setVoucherStatus] = useState(false);

  const [transformedData1, setTransformedData1] = useState({
    "Table Data1": [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [parentActiveTab, setParentActiveTab] = useState("all");
  const [activeCategoryTab, setActiveCategoryTab] = useState(0); // New state for category tabs

  const [formState, setFormState] = useState();

  console.log(formState);

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
      .filter((item) => item.order_id && item.product_name) // Filter out entries with missing order_id or product_name
      .map((item, index) => {
        const srNo = (currentPage - 1) * pageSize + index + 1;

        // Determine status based on payment type
        const status =
          item.type === "bank_transfer"
            ? item.payment_approved === true
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
          // contact: `${item.email || 'N/A'} / ${item.phone_number || 'N/A'}`,
          email: ` ${item.email || "N/A"}`,
          phone: item.phone_number || "N/A",
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
        // contact: `${item.email || 'N/A'} / ${item.phone_number || 'N/A'}`,
        email: ` ${item.email || "N/A"}`,
        phone: item.phone_number || "N/A",
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

  // const handleApprove = (payment_approved, aplha, voucher) => {
  //   if (!formState?.id) {
  //     console.error("No item selected for approval");
  //     return;
  //   }
  
  //   const id = formState.id;
  //   const paymentType = formState.type; // e.g., 'debit/credit' or 'bank_transfer'
  
  //   const formData = new FormData();
  
  //   // Append basic fields
  //   formData.append("id", id);
  //   formData.append("status", payment_approved);
  
  //   // ✅ Safely append vouchers as JSON string
  //   const vouchers = voucher?.[0]?.vouchers || {};
  //   formData.append("vouchers", JSON.stringify(vouchers));
  
  //   // ✅ Only append email/password if alpha is true
  //   if (aplha) {
  //     formData.append("email", email || "");
  //     formData.append("password", password || "");
  //   }
  
  //   // ✅ Choose correct path based on payment type
  //   let path = "";
  //   if (paymentType === "debit/credit") {
  //     path = "admin/debit-voucher-mail/";
  //   } else if (paymentType === "bank_transfer" || paymentType === "bank transfer") {
  //     path = "admin/deals-bank-email/";
  //   }
  
  //   // ✅ Make mutation call
  //   mutation.mutate(
  //     {
  //       payload: formData,
  //       path: path,
  //     },
  //     {
  //       onSuccess: () => {
  //         toast.success("Approval updated successfully!");
  //         setShowModal(false);
  //         setFormState(null);
  //         queryClient.invalidateQueries(["deal-order-listing"]);
  //       },
  //       onError: (error) => {
  //         const errorMessage =
  //           error?.response?.data?.error || "Failed to update approval";
  //         toast.error(errorMessage);
  //         setShowModal(false);
  //       },
  //     }
  //   );
  // };
  
 
  
  // Alternative: If your mutation function expects FormData but needs to send JSON
  
  const handleApprove = (payment_approved, aplha, voucher) => {
    if (!formState?.id) {
      console.error("No item selected for approval");
      return;
    }
  
    const id = formState.id;
    const paymentType = formState.type;
  
    // ✅ Extract vouchers correctly from the data structure
    let vouchers = {};
    
    if (voucher && voucher.length > 0) {
      const voucherData = voucher[0];
      
      // Check if vouchers property exists (nested structure)
      if (voucherData.vouchers) {
        vouchers = voucherData.vouchers;
      } else {
        // If no nested vouchers property, extract voucher key-value pairs directly
        const { id, email, password, ...voucherEntries } = voucherData;
        vouchers = voucherEntries;
      }
    }
  
    // ✅ Debug: Log what we extracted
    console.log("Extracted vouchers:", vouchers);
  
    const requestBody = {
      id: id,
      status: payment_approved,
      vouchers: vouchers
    };
  
    // ✅ Only add email/password if alpha is true
    if (aplha) {
      requestBody.email = email || "";
      requestBody.password = password || "";
    }
  
    let path = "";
    if (paymentType === "debit/credit") {
      path = "admin/debit-voucher-mail/";
    } else if (paymentType === "bank_transfer" || paymentType === "bank transfer") {
      path = "admin/deals-bank-email/";
    }
  
    // ✅ Debug: Log the exact payload being sent
    console.log("Request Body being sent:", JSON.stringify(requestBody, null, 2));
  
    mutation.mutate(
      {
        payload: requestBody,
        path: path,
      },
      {
        onSuccess: () => {
          toast.success("Approval updated successfully!");
          setShowModal(false);
          setFormState(null);
          queryClient.invalidateQueries(["deal-order-listing"]);
        },
        onError: (error) => {
          console.error("API Error:", error);
          const errorMessage =
            error?.response?.data?.error || "Failed to update approval";
          toast.error(errorMessage);
          setShowModal(false);
        },
      }
    );
  };

 
  const FetchDealVoucher = (voucherStatus) => {
    if (!formState?.id) {
      console.error("No item selected for approval");
      return;
    }

    const id = formState.id;
    const paymentType = formState.type; // assumed to be 'debit/credit' or 'bank_transfer'

    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", voucherStatus);
    // formData.append("email", email);
    // formData.append("password", password);

     // Set endpoint based on payment type
     let path = ""; // default fallback
     if (paymentType === "debit/credit") {
       path = "admin/deal-vouchers/";
     } else if (paymentType === "bank_transfer" || paymentType === "bank transfer") {
       path = "admin/deal-bank-approval/";
     }
   

    mutation1.mutate(
      {
        payload: formData,
        path: path,
        // path:"admin/deal-bank-email/"
      },
      {
        onSuccess: (data) => {
          toast.success("Vouchers fetched successfully!");
          setVoucher(data);

          // setFormState(null);
          // ✅ Refetch the voucher list to show updated status
          // queryClient.invalidateQueries(["aplpha-pte-voucher-listings"]);
        },
        onError: (error) => {
          const errorMessage =
            error?.response?.data?.error || "Failed to fetch Vouchers";
          toast.error(errorMessage);
          // setShowModal(false);
        },
      }
    );
  };

  useEffect(() => {
    if (showModal) {
      FetchDealVoucher(voucherStatus); // use the state value here
    }
  }, [showModal]);

  console.log("voucherStatus", voucherStatus);

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
        pagination={true}
        modal={false}
        Loading={isLoading || IsLoadingResultSearch}
        setSearchTable={setSearchTable1}
        setOpenModal={setShowModal}
        setDeleteModal={setShowModal}
        onEdit={setFormState}
        setDeleteUser={setFormState}
        editFalse={true}
        setVoucherStatus={setVoucherStatus}
      />

{showModal && (
  <div className="fixed inset-0 flex items-center backdrop-blur-md bg-gray-800/30 justify-center z-60">
    <div className="relative bg-white p-5 rounded-lg w-[95%] lg:w-[40%] 2xl:w-[40%] shadow-2xl max-h-[85vh] overflow-y-auto">
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

      {/* Display Success Message - Access first element of array */}
      {voucher?.[0]?.message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p className="text-sm">{voucher[0].message}</p>
        </div>
      )}

      {/* Display Vouchers Dynamically - Access first element of array */}
      {voucher?.[0]?.vouchers && Object.keys(voucher[0].vouchers).length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-3">Your Vouchers:</h3>
          {Object.entries(voucher[0].vouchers).map(([voucherName, voucherCode], index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg mb-2">
              <h4 className="font-semibold text-gray-800">{voucherName}</h4>
              <p className="text-sm text-gray-600 font-mono bg-white px-2 py-1 rounded mt-1 border">
                {voucherCode}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Display Alpha PTE Section - Only if status is true - Access first element of array */}
      {voucher?.[0]?.alpha_pte?.status === true && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <p className="font-semibold mb-2">
            {voucher[0].alpha_pte.data || "Alfa PTE Account"}
          </p>
          <div className="mb-2">
            <label className="text-sm text-gray-600">Email/Username</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter username"
              className="w-full bg-white border border-gray-300 rounded px-3 py-2 mt-1 text-gray-700"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-white border border-gray-300 rounded px-3 py-2 mt-1 text-gray-700"
            />
          </div>
        </div>
      )}

      {/* Action Buttons - Access first element of array */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => handleApprove(false, voucher?.[0]?.alpha_pte?.status,voucher)}
          className="cursor-pointer px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
        >
          Close
        </button>
        <button
          onClick={() => handleApprove(true, voucher?.[0]?.alpha_pte?.status, voucher)}
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

export default DealsListing;
