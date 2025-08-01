import React, { useState, useEffect } from "react";
import Table from "../../Components/ReusableTable/Table";

import { edit, deleteimg, file } from "../../assets/index";

import { MdKeyboardArrowRight } from "react-icons/md";
import CreateResultModal from "../../Components/Modal/ResultModal/CreateResultModal";
import EditResultmodal from "../../Components/Modal/ResultModal/EditResultmodal";
import { fetchResults } from "../../Services/GetResults";
import { useDeleteResultMutation } from "../../Services/DeleteResult";
import Loader from "../../Components/Loader/Loader";
import { EditResultMutation} from "../../Services/Editservice"
import { toast } from "react-hot-toast";
import useDebouncing from "../../Components/Debouncing/Debouncing"
import { SearchResults } from "../../Services/Search";

const TableExample = () => {
  const {
    data: ResultsApi,
    isLoading,
    error,
  } = fetchResults("our-results", "/api/admin/add-results/");
  const {
    data: TotalResults,
    isLoading: TotalResultsLoading,
    error: TotalResultsError,
  } = fetchResults("total-results", "/api/admin/total-results/");
 
  // SearchApi 
  const [searchTable1, setSearchTable1] = useState("")
  const debouncedSearchTable1 = useDebouncing(searchTable1, 2000)

  const { data: ResultSearch, isLoading: IsLoadingResultSearch } = 
  SearchResults("results", "/api/admin/search-name-in-results/", debouncedSearchTable1);



  const [transformedData1, setTransformedData1] = useState({ "Table Data1": [] });

  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("ukvi");
  const [parentActiveTab, setparentActiveTab] = useState("all");
  const [isResultModalOpen, setResultIsModalOpen] = useState(false);
  const [isEditResultModalOpen, setEditResultIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [formState, setFormState] = useState(null);

  


const mutate = EditResultMutation(["our-results"]);

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
      path: `admin/add-results/`,
    }),
    {
      success: `Status changed to ${newStatus ? "Active" : "Inactive"}`,
      error: "Failed to update status",
    }
  );
};


 

  // Transformation function
  const transformResultsApiResponse = (apiResponse, currentPage, pageSize) => {
    const data = apiResponse || [];
  
    return data.map((item, index) => {
      const srNo = (currentPage - 1) * pageSize + index + 1;
  
      return {
        id: `#${srNo}`,
        test_taker_id: item?.test_taker_id || "-",
        student_name: item?.student_name || "-",
        score_obtained: item?.score_obtained ?? "-",
        registration_id: item?.registration_id || "-",
        ...item,
      };
    });
  };
  
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
    setResultIsModalOpen(true);
  };

  const columns = [
    { label: "No", accessor: "id" },
    { label: "Test Taker ID", accessor: "test_taker_id" },
    { label: "Student Name", accessor: "student_name" },
    { label: "Score", accessor: "score_obtained" },
    { label: "Registration ID", accessor: "registration_id" },
  ];

  // --------------------------delete result---------------------
  const { mutate: deleteResult } = useDeleteResultMutation(["our-results"]);

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
        path: "admin/add-results/",
      },
      {
        onSuccess: () => {
          toast.success("Result deleted successfully!");
          setShowModal(false);
          setFormState(null);
        },
        onError: (error) => {
          toast.error("Failed to delete result:", error);
          setShowModal(false);
        },
      }
    );
  };

  const toggle = { toggle: true };

  // FIXED: Updated toggleIcon to be a function that handles the actual toggle
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

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
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

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="lato text-[#023337] text-lg font-bold">Result List</div>
      </div>

      {/* ------------------card------------------ */}
      {TotalResultsLoading ? (
        <Loader />
      ) : TotalResultsError ? (
        <div>Error Fetching Results</div>
      ) : (
        <div className="bg-white w-[27%] rounded-lg p-6 shadow-1dp-ambient relative mb-3">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold mb-2 lato text-[#23272E]">
                Total Uploaded
              </h2>
              <p className="text-3xl font-bold lato text-[#23272E]">
                {TotalResults?.data?.total_results}
              </p>
            </div>
            <div className="flex items-center">
              <img
                src={file}
                color="#007bff"
                className="absolute bottom-2 right-5 w-9"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* ------------------Table------------------ */}
      <Table
        columns={columns}
        data={transformedData1["Table Data1"]}
        actions={actions}
        icons={icons}
        borderRadius={true}
        download={false}
        search={true}
        filter={false}
        pagination={true}
        modal={true}
        modalTitle="Add New Result"
        status={toggle}
        toggleIcon={toggleIcon}
        onToggle={handleToggleStatus}
        isOpen="true"
        onAddNewProduct={handleAddNewProduct}
        setOpenModal={setEditResultIsModalOpen}
        setDeleteModal={setShowModal}
        onEdit={setFormState}
        setDeleteUser={setFormState}
        Loading={isLoading}
        ErrorTableError={error}
        setSearchTable={setSearchTable1}
        isLoadingSearch={TotalResultsLoading}
      />

      {/* ------------------Modal------------------ */}
      <CreateResultModal
        isOpen={isResultModalOpen}
        onClose={() => setResultIsModalOpen(false)}
        title="Add New Result"
        nameLabel="Student Name"
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

      <EditResultmodal
        isOpen={isEditResultModalOpen}
        onClose={() => setEditResultIsModalOpen(false)}
        title="Update Result"
        nameLabel="Student Name"
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

      {/* delete modal  */}
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

export default TableExample;