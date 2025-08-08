import React, { useState } from 'react';
import Table from "../../Components/ReusableTable/Table";
import { edit, deleteimg } from '../../assets/index'; // Adjust path as needed
import { MdKeyboardArrowRight } from "react-icons/md";

import { fetchResults } from "../../Services/GetResults";

import Loader from "../../Components/Loader/Loader"

import FormatNumber from "../../Components/Formatter/Format";

const Transactions = () => {
  const {
    data: ResultsApi,
    isLoading,
    error,
  } = fetchResults("total-revenue", "/api/admin/total-revenue/");
 
  const {
    data: PayFastPaymentCount,
    isLoading: PayFastPaymentLoading,
    error: PayFastPaymentError,
  } = fetchResults("payfast-payment-count", "/api/admin/total-payment-count/");

  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [parentActiveTab, setParentActiveTab] = useState("all");
  const [activeCategoryTab, setActiveCategoryTab] = useState(0);

  const [formState, setFormState] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    discountedPrice: "",
    validityAfterPurchase: "",
    productImage: null,
  });

  // Process PayFast Payment Count data
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

  // Add this handler
  const handleAddNewProduct = (row) => {
    console.log(row);
    // Handle add new product logic
  };

  const columns = [
    { label: "Order ID", accessor: "orderId" },
    { label: "Voucher Name", accessor: "voucherName" },
    { label: "Quantity", accessor: "quantity" },
    { label: "Amount", accessor: "amount" },
    { label: "Date", accessor: "date" },
    { label: "Customer Name", accessor: "customerName" },
    { label: "Email/Phone Number", accessor: "emailPhone" },
    { label: "Payment Type", accessor: "paymentType" },
    { label: "Status", accessor: "status" },
  ];

  const data1 = [
    {
      orderId: "#53200002",
      voucherName: "CompTIA Voucher",
      quantity: "02",
      amount: "$60.76",
      date: "Jan 10, 2020 12:00PM",
      customerName: "Jacob Jones",
      emailPhone: "example@gmail.com +92 330 2456719",
      paymentType: "Bank Transfer",
      status: "Completed"
    },
    {
      orderId: "#53200002",
      voucherName: "CompTIA Voucher",
      quantity: "02",
      amount: "$60.76",
      date: "Jan 10, 2020 12:00PM",
      customerName: "Jacob Jones",
      emailPhone: "example@gmail.com +92 330 2456719",
      paymentType: "Credit/Debit Card",
      status: "Completed"
    },
    {
      orderId: "#53200002",
      voucherName: "CompTIA Voucher",
      quantity: "02",
      amount: "$60.76",
      date: "Jan 10, 2020 12:00PM",
      customerName: "Jacob Jones",
      emailPhone: "example@gmail.com +92 330 2456719",
      paymentType: "Credit/Debit Card",
      status: "Completed"
    },
    {
      orderId: "#53200002",
      voucherName: "CompTIA Voucher",
      quantity: "02",
      amount: "$60.76",
      date: "Jan 10, 2020 12:00PM",
      customerName: "Jacob Jones",
      emailPhone: "example@gmail.com +92 330 2456719",
      paymentType: "Credit/Debit Card",
      status: "Completed"
    },
    {
      orderId: "#53200002",
      voucherName: "CompTIA Voucher",
      quantity: "02",
      amount: "$60.76",
      date: "Jan 10, 2020 12:00PM",
      customerName: "Jacob Jones",
      emailPhone: "example@gmail.com +92 330 2456719",
      paymentType: "Credit/Debit Card",
      status: "Completed"
    },
    {
      orderId: "#53200003",
      voucherName: "CompTIA Voucher",
      quantity: "01",
      amount: "$30.38",
      date: "Jan 11, 2020 10:30AM",
      customerName: "Sarah Wilson",
      emailPhone: "sarah@gmail.com +92 330 1234567",
      paymentType: "Bank Transfer",
      status: "Pending"
    },
    {
      orderId: "#53200004",
      voucherName: "CompTIA Voucher",
      quantity: "03",
      amount: "$91.14",
      date: "Jan 12, 2020 02:15PM",
      customerName: "Mike Johnson",
      emailPhone: "mike@gmail.com +92 330 7654321",
      paymentType: "Credit/Debit Card",
      status: "Completed"
    }
  ];

  const toggle = { toggle: false };

  const toggleIcon = {
    status: (
      <label className="inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" />
        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"></div>
      </label>
    ),
  };

  const allOrdersData = data1;
  // Fixed case sensitivity issue
  const completedData = data1.filter(order => order.status.toLowerCase() === "completed");
  const pendingData = data1.filter(order => order.status.toLowerCase() === "pending");

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
  };

  const getCurrentData = () => {
    if (activeTab === "all") return allOrdersData;
    if (activeTab === "completed") return completedData;
    if (activeTab === "pending") return pendingData;
    return allOrdersData;
  };

  const optionalButtons = [
    { label: `All order (${allOrdersData.length})`, value: "all" },
    { label: `Completed (${completedData.length})`, value: "completed" },
    { label: `Pending (${pendingData.length})`, value: "pending" },
  ];

  const actions = { viewDetails: false, edit: false, delete: false };

  const icons = {
    viewDetails: <MdKeyboardArrowRight />,
    edit: <img src={edit} alt="edit" className="w-4 h-4" />,
    delete: <img src={deleteimg} alt="delete" className="w-4 h-4" />,
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

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="lato text-[#023337] text-lg font-bold">Transactions</div>
        
        {/* <div className="inline-flex bg-white border border-[#F0F1F3] p-2 rounded-md">
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
        </div> */}
      </div>

      {/* Stats Cards */}
      {isLoading && PayFastPaymentLoading ? (
        <Loader />
      ) : error && PayFastPaymentError ? (
        <div className="flex justify-center text-red-400 items-center h-20">
          Error Fetching Data
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
          {[
            {
              title: "Total Orders",
              value: FormatNumber(ResultsApi?.data?.total_orders ?? 0),
            },
            {
              title: "Total Revenue",
              value: `Rs. ${FormatNumber(ResultsApi?.data?.total_revenue ?? 0)}`,
            },
          ].map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm flex flex-col justify-between gap-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-gray-900 text-lg font-semibold">{card.title}</h3>
                </div>
              </div>
              <div className="">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-1">
                    <div className="flex flex-col gap-1">
                      <span className="text-4xl font-medium text-gray-900">
                        {card.value}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center">
                <button className="px-6 py-2 border border-blue-500 text-blue-500 rounded-full text-sm hover:bg-blue-50 transition-colors">
                  Details
                </button>
              </div>
            </div>
          ))}
 
          {/* PayFast Payment Status Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-900 text-lg font-semibold">PayFast Payment</h3>
              </div>
            </div>

            <div className="flex justify-between gap-6">
              {/* Completed Block */}
              <div className="flex flex-col gap-1 flex-1 border-r pr-4">
                <div className="text-sm text-green-900">Completed</div>
                <span className="text-2xl font-medium text-green-600">
                  Rs.{FormatNumber(completed.total_amount.toFixed(2))}
                </span>
                <span className="text-green-700 text-sm font-medium">
                  {completed.count} orders
                </span>
              </div>

              {/* Pending Block */}
              <div className="flex flex-col gap-1 flex-1 pl-4">
                <div className="text-sm text-yellow-600">Pending</div>
                <span className="text-2xl font-medium text-yellow-500">
                  Rs.{FormatNumber(pending.total_amount.toFixed(2))}
                </span>
                <span className="text-yellow-700 text-sm font-medium">
                  {pending.count} orders
                </span>
              </div>
            </div>

            <div className="flex justify-end items-center">
              <button className="px-6 py-2 border border-blue-500 text-blue-500 rounded-full text-sm hover:bg-blue-50 transition-colors">
                Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <Table
        columns={columns}
        data={getCurrentData()}
        actions={actions}
        icons={icons}
        borderRadius={true}
        download={false}
        search={true}
        pagination={true}
        optionalButtons={optionalButtons}
        onTabChange={handleTabChange}
        activeTab={activeTab}
        modal={false}
        modalTitle="Add New Product"
        isOpen="true"
        onAddNewProduct={handleAddNewProduct}
      />
    </div>
  );
};

export default Transactions;