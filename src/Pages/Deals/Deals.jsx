import React, { useState ,useEffect} from "react";
import Table from "../../Components/ReusableTable/Table";

import { edit, deleteimg, file } from "../../assets/index";

import { MdKeyboardArrowRight } from "react-icons/md";

import Deals from "../../Components/Modal/Deals/Deals"
import EditDeals from "../../Components/Modal/Deals/EditDeal";

import { fetchResults } from "../../Services/GetResults";
import { useDeleteResultMutation } from "../../Services/DeleteResult";
import Loader from "../../Components/Loader/Loader";
import { EditResultMutation} from "../../Services/Editservice"
import { toast } from "react-hot-toast";
import useDebouncing from "../../Components/Debouncing/Debouncing"
import { SearchResults } from "../../Services/Search";

const Deal = () => {

   //----------------toggle status------------------
   const mutate = EditResultMutation(["our-deals"]);

  const [currentPage, setCurrentPage] = useState(1);

  const [isDealModalOpen, setDealModalOpen] = useState(false);
  const [isEditDealModalOpen, setEditDealModalOpen] = useState(false);

  const [formState, setFormState] = useState({
    name: "",
    status: false, // Add status to formState
  });

  const [showModal, setShowModal] = useState(false);

  const [transformedData1, setTransformedData1] = useState({ "Table Data1": [] });
  
  const columns = [
    { label: "No.", accessor: "SrNo" },
    { label: "Deal Name", accessor: "dealName" },
    { label: "Title", accessor: "title" },
    { label: "Price (Rs)", accessor: "price" },
    { label: "Discount (Rs)", accessor: "discount" },
    // { label: "Features", accessor: "features" },
  ];
  

  // -----------------------fetch deals-----------------------
  const {
    data: ResultsApi,
    isLoading,
    error,
  } = fetchResults("our-deals", "/api/admin/add-deals/"); 
    // -----------------------Search deals-----------------------

  const [searchTable1, setSearchTable1] = useState("")
  const debouncedSearchTable1 = useDebouncing(searchTable1, 2000)

  const { data: dealSearch, isLoading: IsLoadingDealSearch } = 
  SearchResults("our-deals", "/api/admin/match-name-in-ourdeal/", debouncedSearchTable1);


   // Transformation function
   const transformResultsApiResponse = (apiResponse, currentPage, pageSize) => {
    const data = apiResponse || [];
  
    return data.map((item, index) => {
      const srNo = (currentPage - 1) * pageSize + index + 1;
  
      return {
        SrNo: srNo,
        dealName: item?.name || "-",
        title: item?.title || "-",
        price: item?.price || "-",
        discount: item?.save_rs || "-",
        feature: item?.key_features || "-",
        ...item, // keep all other fields if needed (like images)
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
    if (dealSearch?.data) {
      const transformed = transformResultsApiResponse(
        dealSearch.data,
        currentPage,
        10
      );
      setTransformedData1({ "Table Data1": transformed });
    }
  }, [dealSearch, currentPage]);
  
 
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


  // --------------------------delete result---------------------
  const { mutate: deleteResult } = useDeleteResultMutation(["our-deals"]);

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
        path:"admin/add-deals/",
      },
      {
        onSuccess: () => {
          toast.success("Deal deleted successfully!");
          setShowModal(false);
          setFormState(null);
        },
        onError: (error) => {
          toast.error("Failed to delete Deal:", error);
          setShowModal(false);
        },
      }
    );
  };


  // Add this handler
  const handleAddNewProduct = (row) => {
    console.log(row);
    setDealModalOpen(true);
  };
  //----------------toggle status------------------


  // FIXED: Improved toggle status handler
  const handleToggleStatus = (currentStatus, id) => {
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
  
    // Convert boolean to capitalized string "True" or "False"
    const payload = {
      status: newStatus ? "True" : "False",
      id: id,
    };
  
    toast.promise(
      mutate.mutateAsync({
        payload,
        path: `admin/update-deal-status/`,
      }),
      {
        success: `Status changed to ${newStatus ? "Active" : "Inactive"}`,
        error: "Failed to update status",
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
          Deal List
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
        modal={true}
        modalTitle="Add New Deal"
        status={toggle}
        toggleIcon={toggleIcon}
        onToggle={handleToggleStatus}
        isOpen="true"
        onAddNewProduct={handleAddNewProduct}
        setOpenModal={setEditDealModalOpen}

        setSearchTable={setSearchTable1}
        setDeleteModal={setShowModal}
        onEdit={setFormState}
        setDeleteUser={setFormState}
        Loading={isLoading}
        searchError={IsLoadingDealSearch}
        ErrorTableError={error}
      />

      {/* ------------------Add Modal------------------  */}
      <Deals
        isOpen={isDealModalOpen}
        onClose={() => setDealModalOpen(false)}
        title="Add New Deal"
        nameLabel="Exam Name"
        formState={formState}
        setFormState={setFormState}
      />
      
      {/* ------------------Edit Modal------------------  */}
      <EditDeals
        isOpen={isEditDealModalOpen}
        onClose={() => setEditDealModalOpen(false)}
        title="Update Deal"
        nameLabel="Exam Name"
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
                className="cursor-pointer px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="cursor-pointer px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
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

export default Deal;