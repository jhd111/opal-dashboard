import React, { useState, useEffect } from "react";
import Table from "../../Components/ReusableTable/Table";

import { edit, deleteimg, file } from "../../assets/index";

import { MdKeyboardArrowRight } from "react-icons/md";
import ProductListing from "../../Components/Modal/ProductListing/ProductListing";
import EditProductListing from "../../Components/Modal/ProductListing/EditProductListing";

import AddVoucher from "../../Components/Modal/Voucher/addVoucher";
import EditVoucher from "../../Components/Modal/Voucher/editVoucher";

import { fetchResults } from "../../Services/GetResults";
import { useDeleteResultMutation } from "../../Services/DeleteResult";
import { AddResultMutation } from "../../Services/AddResultService";
import { toast } from "react-hot-toast";
import useDebouncing from "../../Components/Debouncing/Debouncing";
import { SearchResults } from "../../Services/Search";
import { EditResultMutation } from "../../Services/Editservice";

const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isTestingServiceModalOpen, setTestingServiceModalOpen] = useState(false);
  const [isEditTestingServiceModalOpen, setEditTestingServiceModalOpen] = useState(false);
  const [isAddVoucherModalOpen, setAddVoucherModalOpen] = useState(false);
  const [isEditVoucherServiceModalOpen, setEditVoucherServiceModalOpen] = useState(false);
  const [transformedData2, setTransformedData2] = useState({
    "Table Data2": [],
  });
  const [formState, setFormState] = useState(null);
  const [showModal1, setShowModal1] = useState(false);
  const [formStateVoucher, setFormStateVoucher] = useState(null);

  // Fetch voucher data
  const {
    data: voucherApi,
    isLoading: voucherLoading,
    error: voucherError,
  } = fetchResults("add-voucher", "/api/admin/vouchers-listing/");

  // Search functionality
  const [searchTable2, setSearchTable2] = useState("");
  const debouncedSearchTable2 = useDebouncing(searchTable2, 2000);

  const { data: voucherSearch, isLoading: IsLoadingvoucherSearch } = 
    SearchResults("add-voucher", "/api/admin/match-vouchersnames/", debouncedSearchTable2);

  // FIXED: Improved transformation function with better error handling
  const transformResultsApiResponse1 = (apiResponse, currentPage, pageSize) => {
    // Add null/undefined checks
    if (!apiResponse || !Array.isArray(apiResponse) || apiResponse.length === 0) {
      console.log("No API response data available");
      return [];
    }

    const data = apiResponse[0]?.products_detail || [];
    
    if (!Array.isArray(data) || data.length === 0) {
      console.log("No products_detail data available");
      return [];
    }

    console.log("Raw API data:", data); // Debug log

    return data.map((item, index) => {
      const srNo = (currentPage - 1) * pageSize + index + 1;
      
      const transformedItem = {
        no: `${srNo}`,
        voucherName: item?.name || "N/A",
        // FIXED: Map category_name from API to category for table display
        categoryname: item?.category_name || "No Category",
        price: item?.price ? `Rs. ${item.price}` : "N/A",
        type: item?.type ? item.type : "N/A",
        ...item, // Keep all original fields
      };
      
      console.log("Transformed item:", transformedItem); // Debug log
      return transformedItem;
    });
  };

  // Effect to transform and store API data (original data)
  useEffect(() => {
    console.log("Effect 1 - voucherApi:", voucherApi?.data); // Debug log
    if (debouncedSearchTable2 === "" && voucherApi?.data) {
      const transformed = transformResultsApiResponse1(
        voucherApi.data,
        currentPage,
        10
      );
      console.log("Setting original transformed data:", transformed); // Debug log
      setTransformedData2({ "Table Data2": transformed });
    }
  }, [voucherApi, debouncedSearchTable2, currentPage]);

  // Effect to transform and store search results
  useEffect(() => {
    console.log("Effect 2 - voucherSearch:", voucherSearch?.data); // Debug log
    if (debouncedSearchTable2 !== "" && voucherSearch?.data) {
      const transformed = transformResultsApiResponse1(
        voucherSearch.data,
        currentPage,
        10
      );
      console.log("Setting search transformed data:", transformed); // Debug log
      setTransformedData2({ "Table Data2": transformed });
    }
  }, [voucherSearch, debouncedSearchTable2, currentPage]);

  // Effect to reset to original data when search is cleared
  useEffect(() => {
    if (debouncedSearchTable2 === "" && voucherApi?.data) {
      const transformed = transformResultsApiResponse1(
        voucherApi.data,
        currentPage,
        10
      );
      console.log("Resetting to original data:", transformed); // Debug log
      setTransformedData2({ "Table Data2": transformed });
    }
  }, [debouncedSearchTable2, voucherApi, currentPage]);

  // Delete functionality
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

  // Toggle status functionality
  const mutatee = EditResultMutation(["add-voucher"]);

  const handleToggleStatus1 = (currentStatus, id) => {
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

  // Table configuration
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
      accessor: "categoryname", // This will now display the mapped category_name
    },
    {
      label: "Type",
      accessor: "type",
    },

    {
      label: "Price",
      accessor: "price",
    },
  ];

  const toggle = { toggle: true };

  const toggleIcon1 = {
    status: (row) => {
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

  // Debug: Log current transformed data
  console.log("Current transformedData2:", transformedData2);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="lato text-[#023337] text-lg font-bold">
          Products List
        </div>
      </div>

      {/* Table */}
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
        modalTitle="Add Product"
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
        Loading={voucherLoading}
        ErrorTableError={voucherError}
        isLoadingSearch={IsLoadingvoucherSearch}
      />

      {/* Delete Modal */}
      {showModal1 && (
        <div className="fixed inset-0 flex items-center backdrop-blur-md bg-gray-800/30 justify-center z-60">
          <div className="bg-white p-5 rounded-lg w-[95%] lg:w-[40%] 2xl:w-[40%] shadow-2xl max-h-[95vh] overflow-y-auto">
            <h2 className="text-lg text-center font-semibold text-gray-800 mb-4">
              Are you sure you want to Delete?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal1(false)}
                className="cursor-pointer px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteVoucher}
                className="cursor-pointer px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      <ProductListing
        isOpen={isAddVoucherModalOpen}
        onClose={() => setAddVoucherModalOpen(false)}
        title="Add Product"
        nameLabel="Exam Name"
        formState={formStateVoucher}
        setFormState={setFormStateVoucher}
      /> 

      {/* Edit Product Modal */}
      <EditProductListing
        isOpen={isEditVoucherServiceModalOpen}
        onClose={() => setEditVoucherServiceModalOpen(false)}
        title="Update Product"
        nameLabel="Exam Name"
        formState={formState}
        setFormState={setFormState}
      />
    </div>
  );
};

export default ProductList;