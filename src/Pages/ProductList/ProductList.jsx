import React, { useState } from "react";
import Table from "../../Components/ReusableTable/Table";

import { edit, deleteimg, file } from "../../assets/index";

import { MdKeyboardArrowRight } from "react-icons/md";
import AddNewTestingService from "../../Components/Modal/AddNewTestingService/AddNewTestingService";
import EditNewTestingService from "../../Components/Modal/AddNewTestingService/EditTestingService";
import ProductListing from "../../Components/Modal/ProductListing/ProductListing";
import EditProductListing from "../../Components/Modal/ProductListing/EditProductListing";

const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const [isTestingServiceModalOpen, setTestingServiceModalOpen] =
    useState(false);
  const [isEditTestingServiceModalOpen, setEditTestingServiceModalOpen] =
    useState(false);

  const [formState, setFormState] = useState({
    name: "",
  });
console.log("formState.name",formState)
  // Add this handler
  const handleAddNewProduct = (row) => {
    console.log(row);
    setTestingServiceModalOpen(true);
  };

  const columns = [
    { label: "No.", accessor: "no" },
    { label: "Service Name", accessor: "serviceName" },
    // Remove the status column since we're using toggleIcon instead
  ];

  const data1 = [
    {
      no: 1,
      serviceName: "Abu Dhabi Department of Health",
      status: "active",
    },
    {
      no: 2,
      serviceName: "Dubai Healthcare City",
      status: "inactive",
    },
    {
      no: 3,
      serviceName: "Sharjah Medical District",
      status: "active",
    },
    {
      no: 4,
      serviceName: "Ras Al Khaimah Health Services",
      status: "active",
    },
    {
      no: 5,
      serviceName: "Ajman Health Authority",
      status: "inactive",
    },
    {
      no: 6,
      serviceName: "Fujairah Health Services",
      status: "active",
    },
    {
      no: 7,
      serviceName: "Umm Al Quwain Health Services",
      status: "active",
    },
    {
      no: 8,
      serviceName: "Al Ain Health Services",
      status: "inactive",
    },
    {
      no: 9,
      serviceName: "NMC Health",
      status: "active",
    },
    {
      no: 10,
      serviceName: "SEHA",
      status: "inactive",
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

  return (
    <div className=" flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="lato text-[#023337] text-lg font-bold">
        Products List
        </div>
      </div>

      {/* ------------------Table------------------ */}
      <Table
        columns={columns}
        data={data1}
        actions={actions}
        icons={icons}
        borderRadius={true}
        download={false}
        search={false}
        pagination={true}
        // optionalButtons={optionalButtons}
        // onTabChange={handleTabChange}
        // activeTab={activeTab}
        textStatus={true}  // Keep this false
        text="AlfaPTE Portal Access"
        modal={true}
        modalTitle="Add New "
        status={toggle}
        toggleIcon={toggleIcon}  // This will add the toggle column
        isOpen="true"
        onAddNewProduct={handleAddNewProduct}
        // setDeleteUser
        setOpenModal={setEditTestingServiceModalOpen}
        onEdit={setFormState}
      />

      {/* ------------------Add Modal------------------  */}
      <ProductListing
        isOpen={isTestingServiceModalOpen}
        onClose={() => setTestingServiceModalOpen(false)}
        title="Add New Product"
        nameLabel="Exam Name"
        formState={formState}
        setFormState={setFormState}
      />
      {/* ------------------Edit Modal------------------  */}
      <EditProductListing
        isOpen={isEditTestingServiceModalOpen}
        onClose={() => setEditTestingServiceModalOpen(false)}
        title="Update Product"
        nameLabel="Exam Name"
        formState={formState}
        setFormState={setFormState}
      />
    </div>
  );
};

export default ProductList;