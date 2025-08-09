import React, { useState,useEffect } from "react";
import Table from "../../Components/ReusableTable/Table";

import { edit, deleteimg, file } from "../../assets/index";

import { MdKeyboardArrowRight } from "react-icons/md";

import { fetchResults } from "../../Services/GetResults";
import { useDeleteResultMutation } from "../../Services/DeleteResult";
import Loader from "../../Components/Loader/Loader";
import { AddResultMutation} from "../../Services/AddResultService"
import { toast } from "react-hot-toast";
import useDebouncing from "../../Components/Debouncing/Debouncing"
import { SearchResults } from "../../Services/Search";
import EditInventory from "../../Components/Modal/InventoryModal/EditInventory";
import AddInventory from "../../Components/Modal/InventoryModal/AddInventory";
import AddAlpha from "../../Components/Modal/AlphaAddModal/AlphaAddModal";
import AlphaEditModal from "../../Components/Modal/AlphaAddModal/AlphaEditModal";


const Alpha = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const [isTestingServiceModalOpen, setTestingServiceModalOpen] =
    useState(false);
  const [isEditTestingServiceModalOpen, setEditTestingServiceModalOpen] =
    useState(false);
    const [transformedData1, setTransformedData1] = useState({ "Table Data1": [] });
    const [showModal, setShowModal] = useState(false);

  const [formState, setFormState] = useState({
    name: "",
  });
// fetch Services

  const {
    data: ResultsApi,
    isLoading,
    error,
  } = fetchResults("alpha-crud", "/api/admin/alpha-crud/")
  const [searchTable1, setSearchTable1] = useState("")
  const debouncedSearchTable1 = useDebouncing(searchTable1, 2000)
  const { data: ResultSearch, isLoading: IsLoadingResultSearch } = 
  SearchResults("alpha-crud", "/api/admin/match-alpha-name/", debouncedSearchTable1);

  const columns = [
    { label: "No.", accessor: "no" },
    { label: "Name", accessor: "serviceName" },
    { label: "Validity (days)", accessor: "expiryDate" },
    { label: "Title", accessor: "title" },
    { label: "Price(Rs)", accessor: "price" },
  ];
  
   // Transformation function
   const transformResultsApiResponse = (apiResponse, currentPage, pageSize) => {
    const data = apiResponse || [];
  
    return data.map((item, index) => {
      const srNo = (currentPage - 1) * pageSize + index + 1;
  
      return {
        no: `${srNo}`,
        serviceName: item?.name || "-",
        expiryDate: item?.validity || "-",
        title: item?.title || "N/A", // could be a file link
        price: item?.price || "N/A",
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
  
  useEffect(() => {
    if (ResultSearch?.data) {
      const transformed = transformResultsApiResponse(
        ResultSearch.data,
        currentPage,
        10
      );
      setTransformedData1({ "Table Data1": transformed });
    }
  }, [ResultSearch, currentPage]);

  useEffect(() => {
    if (debouncedSearchTable1 === "") {
      // Reset to original data instead of removing the property
      if (ResultsApi?.data) {
        const transformed = transformResultsApiResponse(
          ResultsApi.data,
          currentPage,
          10
        );
        setTransformedData1({ "Table Data1": transformed });
      }
    }
  }, [debouncedSearchTable1, ResultsApi, currentPage]);

  // Add this handler
  const handleAddNewProduct = (row) => {
    console.log(row);
    setTestingServiceModalOpen(true);
  };

 
// --------------------------delete result---------------------
const { mutate: deleteResult } = useDeleteResultMutation(["alpha-crud"]);

// FIXED: Properly handle the delete function
const handleDelete = () => {
  if (!formState?.id) {
    console.error("No item selected for deletion");
    return;
  }

  const id = formState.id;
  console.log("Deleting id:", id);

  deleteResult(
    {
      id: id,
      path: "admin/alpha-crud/",
    },
    {
      onSuccess: () => {
        toast.success(" Deleted successfully!");
        setShowModal(false);
        setFormState(null);
      },
      onError: (error) => {
        toast.error("Failed to delete:", error);
        setShowModal(false);
      },
    }
  );
};
  
// --------------------toggle api---------------

const mutate = AddResultMutation();

// FIXED: Improved toggle status handler
const handleToggleStatus = (currentStatus, id) => {
  // Handle different types of status values
  let isCurrentlyActive = false;
  
  if (typeof currentStatus === 'boolean') {
    isCurrentlyActive = currentStatus;
  } else if (typeof currentStatus === 'string') {
    isCurrentlyActive = currentStatus.toLowerCase() === 'true';
  } else if (typeof currentStatus === 'number') {
    isCurrentlyActive = currentStatus === 1;
  }
  
  const newStatus = !isCurrentlyActive;

  console.log("Current Status:", currentStatus, "Type:", typeof currentStatus);
  console.log("Is Currently Active:", isCurrentlyActive);
  console.log("New Status:", newStatus);

  // Try sending as JSON first
  const payload = {
    status: newStatus,
    id: id
  };

  toast.promise(
    mutate.mutateAsync({
      payload,
      path: `admin/update-alpha-status/`,
      queryKey:"alpha-crud"
    }),
    {
      success: `Status changed to ${newStatus ? "Active" : "Inactive"}`,
      error: "Failed to update status",
    }
  );
};
  const toggle = { toggle: true };

  const toggleIcon = {
    status: (row) => {
      // Determine if the status is active
      let isActive = false;
      if (typeof row.status === 'boolean') {
        isActive = row.status;
      } else if (typeof row.status === 'string') {
        isActive = row.status.toLowerCase() === 'true';
      } else if (typeof row.status === 'number') {
        isActive = row.status === 1;
      }

      return (
        <label className="inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={isActive}
            onChange={() => handleToggleStatus(row.status, row.id)}
          />
          <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"></div>
        </label>
      );
    },
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
          Alfa Pte
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
        modal={true}
        modalTitle="Add Alfa Pte Voucher"
        status={toggle}
        toggleIcon={toggleIcon}
        isOpen="true"
        onAddNewProduct={handleAddNewProduct}
        // setDeleteUser
        setOpenModal={setEditTestingServiceModalOpen}
        setDeleteModal={setShowModal}
        onEdit={setFormState}
        setDeleteUser={setFormState}
        Loading={isLoading}
        ErrorTableError={error}
        setSearchTable={setSearchTable1}
        isLoadingSearch={IsLoadingResultSearch}
      />

      {/* ------------------Add Modal------------------  */}
      <AddAlpha
        isOpen={isTestingServiceModalOpen}
        onClose={() => setTestingServiceModalOpen(false)}
        title="Add Alfa Pte Voucher"
        nameLabel="Exam Name"
        formState={formState}
        setFormState={setFormState}
      />
      {/* ------------------Edit Modal------------------  */}
      <AlphaEditModal
        isOpen={isEditTestingServiceModalOpen}
        onClose={() => setEditTestingServiceModalOpen(false)}
        title="Update Alfa Pte Voucher"
        nameLabel="Exam Name"
        formState={formState}
        setFormState={setFormState}
      />

{showModal && (
        <div className="fixed inset-0 flex items-center backdrop-blur-md bg-gray-800/30 justify-center z-60">
          <div className="bg-white p-5 rounded-lg w-[95%] lg:w-[40%] 2xl:w-[40%] shadow-2xl max-h-[95vh] overflow-y-auto">
            <h2 className="text-lg text-center font-semibold text-gray-800 mb-4">
              Are you sure you want to Delete?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
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

export default Alpha;
