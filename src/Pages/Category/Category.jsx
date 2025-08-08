import React, { useState, useEffect } from "react";
import Table from "../../Components/ReusableTable/Table";

import { edit, deleteimg, file } from "../../assets/index";

import { MdKeyboardArrowRight } from "react-icons/md";
import AddVendor from "../../Components/Modal/ItVendor/addVendor";
import EditVendor from "../../Components/Modal/ItVendor/editVendor";
import AddVoucher from "../../Components/Modal/Voucher/addVoucher";
import EditVoucher from "../../Components/Modal/Voucher/editVoucher";

import { fetchResults } from "../../Services/GetResults";

import { useDeleteResultMutation } from "../../Services/DeleteResult";
import { AddResultMutation } from "../../Services/AddResultService";
import { toast } from "react-hot-toast";
import useDebouncing from "../../Components/Debouncing/Debouncing";
import { SearchResults } from "../../Services/Search";
import { EditResultMutation} from "../../Services/Editservice"

const Category = () => {
  // ------------------------vendor states---------------------
  const [currentPage, setCurrentPage] = useState(1);
  const [parentActiveTab, setparentActiveTab] = useState("Vendor");

  const [isAddVendorModalOpen, setAddVendorModalOpen] = useState(false);
  const [isEditVendorServiceModalOpen, setEditVendorServiceModalOpen] =
    useState(false);

  const [transformedData1, setTransformedData1] = useState({
    "Table Data1": [],
  });
  const [showModal, setShowModal] = useState(false);
  const [formState, setFormState] = useState(null);

  // ---------------------vouchor-------------------
  const [isAddVoucherModalOpen, setAddVoucherModalOpen] = useState(false);
  const [isEditVoucherServiceModalOpen, setEditVoucherServiceModalOpen] =
    useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [formStateVoucher, setFormStateVoucher] = useState(null);
 
  const [transformedData2, setTransformedData2] = useState({
    "Table Data2": [],
  });

  const columns = [
    {
      label: "No.",
      accessor: "no",
    },
    {
      label: "Category",
      accessor: "name",
    },
  ];


// fetch vendor
  const {
    data: ResultsApi,
    isLoading,
    error,
  } = fetchResults("add-vendors", "/api/admin/add-vendors/");

// -------------------search in vendor--------------------
const [searchTable1, setSearchTable1] = useState("")
  const debouncedSearchTable1 = useDebouncing(searchTable1, 2000)

  const { data: ResultSearch, isLoading: IsLoadingResultSearch } = 
  SearchResults("add-vendors", "/api/admin/match-vendorsnames/", debouncedSearchTable1);

  // -------------------toggle in vendor--------------------
  const mutate = EditResultMutation(["add-vendors"]);

  // FIXED: Improved toggle status handler (copied from working reference)
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
        path: `admin/update-voucher-status/`,
      }),
      {
        success: `Status changed to ${newStatus ? "Active" : "Inactive"}`,
        error: "Failed to update status",
      }
    );
  };

  // FIXED: Transformation function (corrected based on reference)
  const transformResultsApiResponse = (apiResponse, currentPage, pageSize) => {
    const data = apiResponse || [];
    console.log("data", data);
    
    return data?.map((item, index) => {
      const srNo = (currentPage - 1) * pageSize + index + 1;
      return {
        no: `${srNo}`, // Fixed: removed the undefined 'id' variable
        name: item?.name,
        ...item, // This ensures all other properties including 'id' and 'status' are included
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
    setAddVendorModalOpen(true);
  };

  // --------------------delete in vendor-------------------
  const { mutate: deleteResult } = useDeleteResultMutation(["add-vendors"]);
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
        path: "admin/add-vendors/",
      },
      {
        onSuccess: () => {
          toast.success("Vendor deleted successfully!");
          setShowModal(false);
          setFormState(null);
        },
        onError: (error) => {
          toast.error("Failed to delete Vendor:", error);
          setShowModal(false);
        },
      }
    );
  };


//-----------------------get voucher----------------------------
// fetch vendor
const {
  data: voucherApi,
  isLoading:voucherLoading,
  error:voucherError,
} = fetchResults("add-voucher", "/api/admin/add-it-voucher/");

// -------------------search in vendor--------------------
const [searchTable2, setSearchTable2] = useState("")
  const debouncedSearchTable2 = useDebouncing(searchTable2, 2000)

  const { data: voucherSearch, isLoading: IsLoadingvoucherSearch } = 
  SearchResults("add-voucher", "/api/admin/match-vouchersnames/", debouncedSearchTable2);


  // FIXED: Transformation function (corrected based on reference)
  const transformResultsApiResponse1 = (apiResponse, currentPage, pageSize) => {
    const data = apiResponse || [];
    console.log("data", data);
    
    return data?.map((item, index) => {
      const srNo = (currentPage - 1) * pageSize + index + 1;
      return {
        no: `${srNo}`, // Fixed: removed the undefined 'id' variable
        voucherName: item?.name,
        price:item?.price,
        // image:item?.image,
        // detail:item?.detail,
        vendorName:item?.category,
        ...item, // This ensures all other properties including 'id' and 'status' are included
      };
    });
  };
  // Effect to transform and store API data
  useEffect(() => {
    if (debouncedSearchTable2 === "" && voucherApi?.data) {
      const transformed = transformResultsApiResponse1(
        voucherApi.data,
        currentPage,
        10
      );
      setTransformedData2({ "Table Data2": transformed });
    }
  }, [voucherApi, debouncedSearchTable2, currentPage]);
  
  useEffect(() => {
    if (debouncedSearchTable2 !== "" && voucherSearch?.data) {
      const transformed = transformResultsApiResponse1(
        voucherSearch.data,
        currentPage,
        10
      );
      setTransformedData2({ "Table Data2": transformed });
    }
  }, [voucherSearch, debouncedSearchTable2, currentPage]);
  
  useEffect(() => {
    if (debouncedSearchTable2 === "") {
      // Reset to original data instead of removing the property
      if (voucherSearch?.data) {
        const transformed = transformResultsApiResponse1(
          voucherApi.data,
          currentPage,
          10
        );
        setTransformedData2({ "Table Data2": transformed });
      }
    }
  }, [debouncedSearchTable2, voucherApi, currentPage]);

  //  --------------------delete in vendor-------------------
  
   const { mutate: deleteVoucher } = useDeleteResultMutation(["add-voucher"]);
   const handleDeleteVoucher = () => {
     if (!formState?.id) {
       console.error("No item selected for deletion");
       return;
     }
 
     const id = formState.id;
     console.log("Deleting id:", id);
 
     deleteVoucher(
       {
         id: id,
         path: "admin/add-it-voucher/",
       },
       {
         onSuccess: () => {
           toast.success("voucher deleted successfully!");
           setShowModal1(false);
           setFormState(null);
         },
         onError: (error) => {
           toast.error("Failed to delete voucher:", error);
           setShowModal1(false);
         },
       }
     );
   };


  const handleAddNewVoucher = (row) => {
    console.log(row);
    setAddVoucherModalOpen(true);
  };

   // -------------------toggle in voucher--------------------
   const mutatee = EditResultMutation(["add-voucher"]);

   // FIXED: Improved toggle status handler (copied from working reference)
   const handleToggleStatus1 = (currentStatus, id) => {
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
       mutatee.mutateAsync({
         payload,
         path: `admin/update-it-voucher-status/`,
       }),
       {
         success: `Status changed to ${newStatus ? "Active" : "Inactive"}`,
         error: "Failed to update status",
       }
     );
   };
 

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
      label: "Category",
      accessor: "vendorName",
    },
    {
      label: "Price",
      accessor: "price",
    },
  ];

  

  const toggle = { toggle: true };

  // FIXED: Updated toggleIcon for Vendor
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
  // FIXED: Updated toggleIcon for voucher
  const toggleIcon1 = {
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
            onChange={() => handleToggleStatus1(row.status, row.id)}
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

  const dateFilterButtons = [
    { label: `Vendor(${(ResultsApi?.data?.length)})`, value: "Vendor" },
    { label: `Voucher(${(voucherApi?.data?.length)})`, value: "Voucher" },
    
  ];

  const onTabChange = (value) => {
    setparentActiveTab(value);
    // any other logic on click
  };

  return (
    <div className=" flex flex-col gap-2">
      {/* <div className="flex w-full lg:w-[23%] bg-white border border-[#F0F1F3] p-2 rounded-md">
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
      <div className="flex justify-between items-center">
        <div className="lato text-[#023337] text-lg font-bold">
          Category
        </div>
      </div>

      {/* ------------------Table------------------ */}
      {parentActiveTab === "Vendor" ? (
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
          modalTitle="Add Category"
          status={toggle}
          toggleIcon={toggleIcon}
          onToggle={handleToggleStatus}
          isOpen="true"
          onAddNewProduct={handleAddNewProduct}
          setOpenModal={setEditVendorServiceModalOpen}
          onEdit={setFormState}
          setDeleteModal={setShowModal}
          setDeleteUser={setFormState}
          setSearchTable={setSearchTable1}
          Loading={isLoading}
          isLoadingSearch={IsLoadingResultSearch}
        />
      ) : (
        <Table
          columns={columns1}
          data={transformedData2["Table Data2"]}
          actions={actions}
          icons={icons}
          borderRadius={true}
          download={false}
          search={true}
          pagination={true}
          modal={true}
          modalTitle="Add Voucher"
          status={toggle}
          toggleIcon={toggleIcon1}
          onToggle={handleToggleStatus1}
          isOpen="true"
          onAddNewProduct={handleAddNewVoucher}
          setOpenModal={setEditVoucherServiceModalOpen}
          onEdit={setFormState}
          setDeleteModal={setShowModal1}
          setDeleteUser={setFormState}
          setSearchTable={setSearchTable2}

          Loading={voucherLoading }
          ErrorTableError={voucherError}
          isLoadingSearch={IsLoadingvoucherSearch}
        />
      )}

      {/* ------------------ Vendor  ------------------ */}
      {/* ------------------Add Vendor Modal------------------  */}
      <AddVendor
        isOpen={isAddVendorModalOpen}
        onClose={() => setAddVendorModalOpen(false)}
        title="Add Category"
        nameLabel="Category"
        formState={formState}
        setFormState={setFormState}
        category={true}
      />

      {/* ------------------Edit Vendor Modal------------------  */}
      <EditVendor
        isOpen={isEditVendorServiceModalOpen}
        onClose={() => setEditVendorServiceModalOpen(false)}
        title="Update Category"
        nameLabel="Exam Name"
        formState={formState}
        setFormState={setFormState}
        category={true}
      />

      {/* ------------------Add Voucher Modal------------------  */}
      <AddVoucher
        isOpen={isAddVoucherModalOpen}
        onClose={() => setAddVoucherModalOpen(false)}
        title="Add Voucher"
        nameLabel="Exam Name"
        formState={formStateVoucher}
        setFormState={setFormStateVoucher}
      />

      <EditVoucher
        isOpen={isEditVoucherServiceModalOpen}
        onClose={() => setEditVoucherServiceModalOpen(false)}
        title="Update Voucher"
        nameLabel="Exam Name"
        formState={formState}
        setFormState={setFormState}
      />

      {/* vendor delete modal  */}
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

       {/* voucher delete modal  */}
       {showModal1 && (
        <div className="fixed inset-0 flex items-center backdrop-blur-md bg-gray-800/30 justify-center z-60">
          <div className="bg-white p-5 rounded-lg w-[95%] lg:w-[40%] 2xl:w-[40%] shadow-2xl max-h-[95vh] overflow-y-auto">
            <h2 className="text-lg text-center font-semibold text-gray-800 mb-4">
              Are you sure you want to Delete?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal1(false)}
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteVoucher}
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

export default Category;