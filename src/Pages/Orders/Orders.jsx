import React, { useState } from 'react';
import Table from "../../Components/ReusableTable/Table";
import { edit, deleteimg } from '../../assets/index'; // Adjust path as needed
import { MdKeyboardArrowRight } from "react-icons/md";

const OrderList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [parentActiveTab, setParentActiveTab] = useState("all");
  const [activeCategoryTab, setActiveCategoryTab] = useState(0); // New state for category tabs

  const [formState, setFormState] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    discountedPrice: "",
    validityAfterPurchase: "",
    productImage: null,
  });

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
    // { label: "Date", accessor: "date" },
    { label: "Customer Name", accessor: "customerName" },
    // { label: "Email/Phone Number", accessor: "emailPhone" },
    { label: "Payment Type", accessor: "paymentType" },
    
    
    
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
      status: "completed"
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
      status: "completed"
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
      status: "completed"
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
      status: "completed"
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
      status: "completed"
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
      status: "pending"
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
      status: "completed"
    }
  ];

  const toggle = { toggle: true };

  const toggleIcon = {
    status: (
      <label className="inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" />
        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"></div>
      </label>
    ),
  };

  const allOrdersData = data1;
  const completedData = data1.filter(order => order.status === "completed");
  const pendingData = data1.filter(order => order.status === "pending");

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
    { label: "Completed", value: "completed" },
    { label: `Pending (${pendingData.length})`, value: "pending" },
  ];

  const actions = { viewDetails: false, edit: true, delete: true };

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

  const categories = ['IT Vouchers (240)', 'SPMT', 'PTE Vouchers', 'APEUni', 'Alfa PTE', 'Our Deals'];

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        {/* Total Orders */}
        <div className="bg-white rounded-lg p-6 shadow-1dp-ambient relative">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold mb-2 lato text-[#23272E]">
                Total Orders
              </h2>
              <p className="text-3xl font-bold lato text-[#23272E]">1,240</p>
              <p className="text-sm text-gray-500 mt-1">Till Date</p>
            </div>
            <div className="flex items-center">
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* New Orders */}
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
            <div className="flex items-center">
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Completed Orders */}
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
            <div className="flex items-center">
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Pending Orders */}
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
            <div className="flex items-center">
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------Category Filter Buttons (Updated to match image)------------------ */}
      <div className="bg-gray-100 p-1 rounded-lg mb-3 w-full lg:w-[65%]">
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

      {/* ------------------Table------------------ */}
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
        status={toggle}
        toggleIcon={toggleIcon}
        isOpen="true"
        onAddNewProduct={handleAddNewProduct}
      />
    </div>
  );
};

export default OrderList;