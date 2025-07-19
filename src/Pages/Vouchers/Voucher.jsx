import React, { useState } from "react";
import Table from "../../Components/ReusableTable/Table";

import { edit, deleteimg, file } from "../../assets/index";

import { MdKeyboardArrowRight } from "react-icons/md";
import AddVendor from "../../Components/Modal/ItVendor/addVendor";
import EditVendor from "../../Components/Modal/ItVendor/editVendor";
import AddVoucher from "../../Components/Modal/Voucher/addVoucher";
import EditVoucher from "../../Components/Modal/Voucher/editVoucher";

const Voucher = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [parentActiveTab, setparentActiveTab] = useState("Voucher");

  const [isAddVendorModalOpen, setAddVendorModalOpen] =
    useState(false);
  const [isEditVendorServiceModalOpen, setEditVendorServiceModalOpen] =
    useState(false);

    const [isAddVoucherModalOpen, setAddVoucherModalOpen] =
    useState(false);
  const [isEditVoucherServiceModalOpen, setEditVoucherServiceModalOpen] =
    useState(false);

  const [formState, setFormState] = useState({
    name: "",
    status:"",
    image:null
  });
  console.log("formState.name", formState);
  // Add this handler
  const handleAddNewProduct = (row) => {
    console.log(row);
    setAddVendorModalOpen(true);
  };
  const handleAddNewVoucher = (row) => {
    console.log(row);
    setAddVoucherModalOpen(true);
  };

  const columns = [
    {
      label: "No.",
      accessor: "no",
    },
    {
      label: "Vendor Name",
      accessor: "vendorName",
    },
    {
      label: "No. of Active Vouchers",
      accessor: "activeVouchers",
    },
  ];

  const data1 = [
    {
      no: 1,
      vendorName: "AWS",
      activeVouchers: 13,
    },
    {
      no: 2,
      vendorName: "AWS",
      activeVouchers: 13,
    },
    {
      no: 3,
      vendorName: "AWS",
      activeVouchers: 13,
    },
    {
      no: 4,
      vendorName: "AWS",
      activeVouchers: 13,
    },
    {
      no: 5,
      vendorName: "AWS",
      activeVouchers: 13,
    },
    {
      no: 6,
      vendorName: "AWS",
      activeVouchers: 13,
      
    },
    {
      no: 7,
      vendorName: "AWS",
      activeVouchers: 13,
    },
    {
      no: 8,
      vendorName: "AWS",

      activeVouchers: 13,
    },
  ];

  const columns1 = [
    {
      label: "No.",
      accessor: "no",
    },
    {
      label: "Voucher Name",
      accessor: "voucherName",
    },
    {
      label: "Vendor Name",
      accessor: "vendorName",
    },
    {
      label: "Price",
      accessor: "price",
    },
   
  ];
  const data2 = [
    {
      no: 1,
      voucherName: "CompTIA Fundamentals ITF+",
      vendorName: "CompTIA",
      price: "Rs. 60,000",
      
    },
    {
      no: 1,
      voucherName: "CompTIA Fundamentals ITF+",
      vendorName: "CompTIA",
      price: "Rs. 60,000",
      
    },
    {
      no: 1,
      voucherName: "CompTIA Fundamentals ITF+",
      vendorName: "CompTIA",
      price: "Rs. 60,000",
      status: "Active",
    },
    {
      no: 1,
      voucherName: "AWS services",
      vendorName: "AWS",
      price: "Rs. 60,000",
      
    },
    {
      no: 1,
      voucherName: "CompTIA Fundamentals ITF+",
      vendorName: "CompTIA",
      price: "Rs. 60,000",
      
    },
    {
      no: 1,
      voucherName: "CompTIA Fundamentals ITF+",
      vendorName: "CompTIA",
      price: "Rs. 60,000",
      
    },
    {
      no: 1,
      voucherName: "CompTIA Fundamentals ITF+",
      vendorName: "CompTIA",
      price: "Rs. 60,000",
      
    },
    {
      no: 1,
      voucherName: "CompTIA Fundamentals ITF+",
      vendorName: "CompTIA",
      price: "Rs. 60,000",
      
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

  const actions = { viewDetails: false, edit: true, delete: true };

  const icons = {
    viewDetails: <MdKeyboardArrowRight />,
    edit: <img src={edit} alt="edit" className="w-4 h-4" />,
    delete: <img src={deleteimg} alt="delete" className="w-4 h-4" />,
  };

  const dateFilterButtons = [
    { label: "Voucher(240)", value: "Voucher" },
    { label: "Vendor(240)", value: "Vendor" },
  ];

  const onTabChange = (value) => {
    setparentActiveTab(value);
    // any other logic on click
  };

  return (
    <div className=" flex flex-col gap-2">
      <div className="flex w-full lg:w-[23%] bg-white border border-[#F0F1F3] p-2 rounded-md">
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
      </div>
      <div className="flex justify-between items-center">
        <div className="lato text-[#023337] text-lg font-bold">
          Vendors List
        </div>
      </div>

      {/* ------------------Table------------------ */}
      {/* ------------------Table------------------ */}
{parentActiveTab === "Voucher" ? (
  <Table
    columns={columns}
    data={data1}
    actions={actions}
    icons={icons}
    borderRadius={true}
    download={false}
    search={true}
    pagination={true}
    modal={true}
    modalTitle="Add New Vendors"
    status={toggle}
    toggleIcon={toggleIcon}
    isOpen="true"
    onAddNewProduct={handleAddNewProduct}
    setOpenModal={setAddVendorModalOpen}
    onEdit={setFormState}
  />
) : (
  <Table
    columns={columns1}
    data={data2}
    actions={actions}
    icons={icons}
    borderRadius={true}
    download={false}
    search={true}
    pagination={true}
    modal={true}
    modalTitle="Add Voucher"
    status={toggle}
    toggleIcon={toggleIcon}
    isOpen="true"
    onAddNewProduct={handleAddNewVoucher}
    setOpenModal={setEditVoucherServiceModalOpen}
    onEdit={setFormState}
  />
)}
          {/* ------------------ Vendor  ------------------ */}
      {/* ------------------Add Vendor Modal------------------  */}
     
      <AddVendor
        isOpen={isAddVendorModalOpen}
        onClose={() => setAddVendorModalOpen(false)}
        title="Add New Vendor"
        nameLabel="Vendor Name"
        formState={formState}
        setFormState={setFormState}
      />
      {/* ------------------Edit Vendor Modal------------------  */}
      <EditVendor
        isOpen={isEditVendorServiceModalOpen}
        onClose={() => setEditVendorServiceModalOpen(false)}
        title="Update Testing Service"
        nameLabel="Exam Name"
        formState={formState}
        setFormState={setFormState}
      />

      {/* ------------------Add Voucher Modal------------------  */}
      <AddVoucher
        isOpen={isAddVoucherModalOpen}
        onClose={() => setAddVoucherModalOpen(false)}
        title="Add Voucher"
        nameLabel="Exam Name"
        formState={formState}
        setFormState={setFormState}
      />

     

      <EditVoucher
        isOpen={isEditVoucherServiceModalOpen}
        onClose={() => setEditVoucherServiceModalOpen(false)}
        title="Update Voucher"
        nameLabel="Exam Name"
        formState={formState}
        setFormState={setFormState}
      />


    </div>
  );
};

export default Voucher;
