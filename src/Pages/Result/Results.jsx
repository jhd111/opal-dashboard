import React, { useState } from "react";
import Table from "../../Components/ReusableTable/Table";

import { edit, deleteimg, file } from "../../assets/index";

import { MdKeyboardArrowRight } from "react-icons/md";
import CreateResultModal from "../../Components/Modal/ResultModal/CreateResultModal";

const TableExample = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("ukvi");
  const [parentActiveTab, setparentActiveTab] = useState("all");
  const [isResultModalOpen, setResultIsModalOpen] = useState(false);

  const [formState, setFormState] = useState({
    name: "",
    examType: "",
    discount: "",
    status: "",
    testTakerId: "",
    registrationID: "",
    resultImage: null,
    studentImage: null,
    scoreObtained: "",
    instructorName: "",
    listening: "",
    reading: "",
    speaking: "",
    writing: "",
  });

  // Add this handler
  const handleAddNewProduct = (row) => {
    console.log(row);
    setResultIsModalOpen(true);
  };

  const columns = [
    { label: "No", accessor: "productName" },
    { label: "Test Taker ID", accessor: "purchasePrice" },
    { label: "Student Name", accessor: "sellingPrice" },
    { label: "Score", accessor: "unitsSold" },
    { label: "Registration ID", accessor: "quantity" },
  ];

  const data1 = [
    {
      productName: "Swinges",
      purchasePrice: "$12",
      sellingPrice: "$15",
      unitsSold: 55,
      quantity: 120,
    },
    {
      productName: "Gloves",
      purchasePrice: "$10",
      sellingPrice: "$17",
      unitsSold: 65,
      quantity: 150,
    },
    {
      productName: "Bogs",
      purchasePrice: "$5",
      sellingPrice: "$9",
      unitsSold: 25,
      quantity: 80,
    },
    {
      productName: "Injections",
      purchasePrice: "$20",
      sellingPrice: "$25",
      unitsSold: 35,
      quantity: 65,
    },
    {
      productName: "Drips",
      purchasePrice: "$15",
      sellingPrice: "$21",
      unitsSold: 66,
      quantity: 100,
    },
    {
      productName: "Beauty Boost IV",
      purchasePrice: "$25",
      sellingPrice: "$32",
      unitsSold: 88,
      quantity: 90,
    },
    {
      productName: "Athletic Recovery IV",
      purchasePrice: "$12",
      sellingPrice: "$15",
      unitsSold: 34,
      quantity: 167,
    },
    {
      productName: "Custom Hydration IV",
      purchasePrice: "$10",
      sellingPrice: "$16",
      unitsSold: 52,
      quantity: 134,
    },
    {
      productName: "Glutarphone shot",
      purchasePrice: "$6",
      sellingPrice: "$13",
      unitsSold: 62,
      quantity: 320,
    },
    {
      productName: "Zinc shot",
      purchasePrice: "$8",
      sellingPrice: "$16",
      unitsSold: 13,
      quantity: 250,
    },
  ];
  const toggle = { toggle: true };

  const toggleIcon = {
    status: (
      <label className="inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" />
        <div className="relative w-11 h-6 bg-gray-200   rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"></div>
      </label>
    ),
  };
  const ukviData = data1.slice(0, 5);
  const coreData = data1.slice(5, 10);

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
  };

  const getCurrentData = () => {
    return activeTab === "ukvi" ? ukviData : coreData;
  };

  const optionalButtons = [
    { label: "Pearson PTE UKVI (240)", value: "ukvi" },
    { label: "Pearson PTE Core", value: "core" },
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
    { label: "24 Hours", value: "24hours" },
  ];

  const onTabChange = (value) => {
    setparentActiveTab(value);
    // any other logic on click
  };
  return (
    <div className=" flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="lato text-[#023337] text-lg font-bold">Result List</div>

        {/* <div className="inline-flex bg-white border border-[#F0F1F3] p-2 rounded-md">
          {dateFilterButtons.map((button, index) => (
            <button
              key={index}
              onClick={() => onTabChange && onTabChange(button.value)}
              className={`px-3 py-1 text-sm lato font-medium rounded-md  transition-all
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

      {/* ------------------card------------------ */}
      <div className="bg-white w-[27%] rounded-lg p-6 shadow-1dp-ambient relative mb-3">
        <div className="flex justify-between items-center">
          {/* Left Section */}
          <div>
            <h2 className="text-lg font-bold mb-2 lato text-[#23272E]">
              Total Uploaded
            </h2>
            <p className="text-3xl font-bold lato text-[#23272E]">1,240</p>
          </div>

          {/* Right Section (Icon) */}
          <div className="flex items-center">
            <img
              src={file}
              color="#007bff"
              className="absolute bottom-2 right-5 w-9"
            />
          </div>
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
        filter={false}
        pagination={true}
        optionalButtons={optionalButtons}
        onTabChange={handleTabChange}
        activeTab={activeTab}
        modal={true}
        modalTitle="Add New Product"
        status={toggle}
        toggleIcon={toggleIcon}
        isOpen="true"
        onAddNewProduct={handleAddNewProduct}
      />

      {/* ------------------Modal------------------  */}
      <CreateResultModal
        isOpen={isResultModalOpen}
        onClose={() => setResultIsModalOpen(false)}
        title="Add New Result"
        nameLabel="Exam Name"
        examTypeLabel="Exam Type"
        scoreLabel="Score Obtained"
        instructorNameLabel="Instructor Name"
        testTakerIdLabel="Test Taker ID"
        registrationIdLabel="Registration ID"
        listeningLabel="Listening"
        readingLabel="Reading"
        speakingLabel="Speaking"
        writingLabel="Writing"
        statusLabel="Status"
        studentImageLabel="Student Image"
        resultImageLabel="Result Image"
        discountLabel="Discount"
        formState={formState}
        setFormState={setFormState}
      />
    </div>
  );
};

export default TableExample;
