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
  { label: "Name", accessor: "name" },
  { label: "Price", accessor: "price" },
  { label: "Discount", accessor: "discount" },
  { label: "Description", accessor: "description" },
];

const data1 = [
  {
    no: 1,
    name: "Alfa PTE Portal Access 30 Days",
    price: "Rs. 60,000",
    discount: "Rs. 0.00",
    description: ["PTE Voucher (Eligibility for Academic, UKVI, Core)"],
  },
  {
    no: 2,
    name: "Alfa PTE Portal Access 60 Days",
    price: "Rs. 60,000",
    discount: "Rs. 0.00",
    description: ["PTE Voucher (Eligibility for Academic, UKVI, Core)"],
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
        isOpen={true}
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