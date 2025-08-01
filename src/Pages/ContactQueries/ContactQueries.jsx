

import React, { useState ,useEffect} from "react";
import Table from "../../Components/ReusableTable/Table";

import { edit, deleteimg, file } from "../../assets/index";

import { MdKeyboardArrowRight } from "react-icons/md";
import { FaReplyAll } from "react-icons/fa";

import ContactModal from "../../Components/Modal/Contact/ContactModal";
import { fetchResults } from "../../Services/GetResults";

const ContactQueries = () => {

  const {
    data: ResultsApi,
    isLoading,
    error,
    refetch
  } = fetchResults("get-contact-us", "/api/admin/get-contact-us/")

  const [transformedData1, setTransformedData1] = useState({ "Table Data1": [] });
 
const [iscomposeDealModalOpen,setcomposeDealModalOpen]=useState(false)
  const [currentPage, setCurrentPage] = useState(1);

  const [isDealModalOpen, setDealModalOpen] =
    useState(false);
  const [isEditDealModalOpen, setEditDealModalOpen] =
    useState(false);

  const [formState, setFormState] = useState({
    name: "",
  });
console.log("formState.name",formState)
  // Add this handler
  const handleAddNewProduct = (row) => {
    console.log(row);
    setcomposeDealModalOpen(true);
  };

  const transformResultsApiResponse = (apiResponse, currentPage, pageSize) => {
    const data = apiResponse || [];
  
 

    return data.map((item, index) => {
      const srNo = (currentPage - 1) * pageSize + index + 1;
  
      return {
        no: `${srNo}`,
        userName: item?.name || "-",
        email: item?.email || "-",
        phoneNumber: item?.phone_number || "N/A", // could be a file link
        message: item?.message || "N/A",
        date:item?.created_at,
        ...item,
      };
    });
  };
  
   // Effect to transform and store API data
   useEffect(() => {
    if (ResultsApi?.data) {
      const transformed = transformResultsApiResponse(
        ResultsApi.data,
        currentPage,
        10
      );
      setTransformedData1({ "Table Data1": transformed });
    }
  }, [ResultsApi, currentPage]);

  const columns = [
    { label: "No.", accessor: "no" },
    { label: "User Name", accessor: "userName" },
    { label: "Phone Number", accessor: "phoneNumber" },
    { label: "Email", accessor: "email" },
    { label: "Message", accessor: "message" },
    { label: "Date", accessor: "date" },
    // { label: "Actions", accessor: "actions" },
  ];
  
  const data1 = [
    {
      no: 1,
      userName: "M. Umer",
      phoneNumber: "0332-2665728",
      email: "xyz@gmail.com",
      message: "Hello, I want to buy..",
      date: "Jan 10, 2020 12:00 PM",
      actions: <span>Actions</span>, // Placeholder for actions (e.g., edit, delete icons)
    },
    {
      no: 2,
      userName: "John Doe",
      phoneNumber: "0332-1234567",
      email: "john@example.com",
      message: "Can I get more details?",
      date: "Jan 11, 2020 3:45 PM",
      actions: <span>Actions</span>,
    },
    {
      no: 3,
      userName: "Jane Smith",
      phoneNumber: "0332-9876543",
      email: "jane@example.com",
      message: "Interested in your product.",
      date: "Jan 12, 2020 9:15 AM",
      actions: <span>Actions</span>,
    },
    {
      no: 4,
      userName: "Alice Johnson",
      phoneNumber: "0332-5555555",
      email: "alice@example.com",
      message: "Need assistance.",
      date: "Jan 13, 2020 2:30 PM",
      actions: <span>Actions</span>,
    },
    {
      no: 5,
      userName: "Bob Brown",
      phoneNumber: "0332-7777777",
      email: "bob@example.com",
      message: "Placing an order.",
      date: "Jan 14, 2020 10:45 AM",
      actions: <span>Actions</span>,
    },
  ];
  const toggle = { toggle: false };

  const toggleIcon = {
    status: (
      <label className="inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" />
        <div className="relative w-11 h-6 bg-gray-200   rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"></div>
      </label>
    ),
  };

  const actions = { viewDetails: false, edit: true, delete: false };

  const icons = {
    viewDetails: <MdKeyboardArrowRight />,
    edit:  <FaReplyAll    className="w-5 h-5 text-[#023337]" />,
    delete: <img src={deleteimg} alt="delete" className="w-4 h-4" />,
  };

  return (
    <div className=" flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="lato text-[#023337] text-lg font-bold">
        Contact Queries
        </div>
      </div>

      {/* ------------------Table------------------ */}
      <Table
        columns={columns}
        data={transformedData1["Table Data1"]}
        actions={actions}
        icons={icons}
        borderRadius={true}
        download={false}
        search={true}
        pagination={true}
        // optionalButtons={optionalButtons}
        // onTabChange={handleTabChange}
        // activeTab={activeTab}
        modal={false}
        modalTitle="Add New Deal"
        // status={toggle}
        // toggleIcon={toggleIcon}
        isOpen="true"
        onAddNewProduct={handleAddNewProduct}
        openCompose={handleAddNewProduct}
        // setDeleteUser
        setOpenModal={setEditDealModalOpen}
        onEdit={setFormState}
        compose={true}
        Loading={isLoading}
        ErrorTableError={error}
      />

     
      {/* ------------------Edit Modal------------------  */}
      <ContactModal
        isOpen={isEditDealModalOpen}
        onClose={() => setEditDealModalOpen(false)}
        title="Contact "
        nameLabel="Exam Name"
        formState={formState}
        setFormState={setFormState}
        tablecompose={true}
      />

      <ContactModal
        isOpen={iscomposeDealModalOpen}
        onClose={() => setcomposeDealModalOpen(false)}
        title="Contact "
        nameLabel="Exam Name"
        formState={formState}
        setFormState={setFormState}
        tablecompose={false}
      />
    </div>
  );
};

export default ContactQueries;
