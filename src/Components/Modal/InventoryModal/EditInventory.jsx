// import React, { useState, useEffect } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import InputFields from "../../InputFields/InputFields";

// import toast, { Toaster } from "react-hot-toast";
// import { AddResultMutation} from "../../../Services/AddResultService"
// const EditInventory = ({
//   isOpen,
//   onClose,
//   title,
//   nameLabel,
//   formState,
//   setFormState,
// }) => {
//   // Enhanced scroll prevention effect
//   useEffect(() => {
//     if (isOpen) {
//       const scrollY = window.scrollY;
//       document.body.style.position = "fixed";
//       document.body.style.top = `-${scrollY}px`;
//       document.body.style.width = "100%";
//       document.body.style.overflow = "hidden";
//       document.documentElement.style.overflow = "hidden";
//       document.body.setAttribute("data-scroll-y", scrollY.toString());
//     } else {
//       const scrollY = document.body.getAttribute("data-scroll-y");
//       document.body.style.position = "";
//       document.body.style.top = "";
//       document.body.style.width = "";
//       document.body.style.overflow = "";
//       document.documentElement.style.overflow = "";
//       if (scrollY) {
//         window.scrollTo(0, parseInt(scrollY));
//         document.body.removeAttribute("data-scroll-y");
//       }
//     }

//     return () => {
//       document.body.style.position = "";
//       document.body.style.top = "";
//       document.body.style.width = "";
//       document.body.style.overflow = "";
//       document.documentElement.style.overflow = "";
//       const scrollY = document.body.getAttribute("data-scroll-y");
//       if (scrollY) {
//         window.scrollTo(0, parseInt(scrollY));
//         document.body.removeAttribute("data-scroll-y");
//       }
//     };
//   }, [isOpen]);

//   console.log("formState in edit",formState)

//   const mutation = AddResultMutation();
//   const formik = useFormik({
//     enableReinitialize: true, // ✅ Important for updating values on edit
//     initialValues: {
//       name: formState?.servicename , // Safely access serviceName
//     },
//     validationSchema: Yup.object({
//       name: Yup.string().required(`${nameLabel} is required`),
//     }),
//     onSubmit: (values) => {
//       const formData = new FormData();
//       formData.append("name", values.name);
   
//       // For edit mode, you might want to add an ID field to identify which record to update
//       // If you have an ID in formState, add it to the formData
//       if (formState?.id) {
//         formData.append("id", formState.id);
//       }

//       mutation.mutate(
//         {
//           payload: formData,
//           path: "admin/manage-testing-service/", // You might want to change this to an edit endpoint
//           queryKey:"testing-services"
//         },
//         {
//           onSuccess: (data) => {
//             toast.success("Testing Service updated successfully!");
//             formik.resetForm();
//             setFormState(null); // Clear form state
//             onClose();
//           },
//           onError: (error) => {
//             toast.error("Failed to update Testing Service . Please try again.");
//           },
//         }
//       );
//     },
//   });

//   // // Optional: Sync formState with Formik changes
//   // useEffect(() => {
//   //   formik.setValues({
//   //     name: formState?.serviceName || "",
//   //   });
//   // }, [formState]);

//   // Reset form when modal closes
//   useEffect(() => {
//     if (!isOpen) {
//       formik.resetForm();
//     }
//   }, [isOpen]);

//   // Log current name value
//   useEffect(() => {
//     console.log("Formik name value:", formik.values.name);
//   }, [formik.values.name]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center backdrop-blur-md bg-gray-800/30 justify-center z-50">
//       <div className="bg-white p-5 rounded-lg w-[95%] lg:w-1/2 2xl:w-[40%] shadow-2xl max-h-[95vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">{title}</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 cursor-pointer text-4xl"
//           >
//             ×
//           </button>
//         </div>

//         <form onSubmit={formik.handleSubmit} className="">
//           {/* Name Field */}
//           <InputFields
//             label={nameLabel}
//             placeholder="Enter Service Name"
//             type="text"
//             value={formik.values.name}
//             error={formik.errors.name}
//             touched={formik.touched.name}
//             {...formik.getFieldProps("name")}
//           />

//           {/* Buttons */}
//           <div className="flex justify-end mt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="mr-2 px-4 py-2 text-gray-600 border border-[#A4A5AB33] rounded-full hover:text-gray-800 cursor-pointer"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-8 py-2 bg-[#4755E5] text-white rounded-full cursor-pointer"
//             >
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditInventory




import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputFields from "../../InputFields/InputFields";
import { uploadButton, checkout } from "../../../assets/index";

import { fetchResults } from  "../../../Services/GetResults"
import { EditResultMutation } from "../../../Services/Editservice";
import { AddResultMutation } from "../../../Services/AddResultService";
import { useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";

const AddInventory = ({
  isOpen,
  onClose,
  title,
  nameLabel,
  formState,
  setFormState,
}) => {

  
  const {
    data: Products,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = fetchResults("add-voucher", "/api/admin/get-all-vouchers-names/");

  const mutation = EditResultMutation("our-inventory");
  const queryClient = useQueryClient(); // Add this for manual invalidation

  const ProductOptions =
    Products?.data?.map((item) => ({
      label: item.name,
      value: item.name,
    })) || [];

  // Type options A to E
  const TypeOptions = [
    { label: "Type A", value: "Type A" },
    { label: "Type B", value: "Type B" },
    { label: "Type C", value: "Type C" },
    { label: "Type D", value: "Type D" },
    { label: "Type E", value: "Type E" },
  ];

  // Enhanced scroll prevention effect
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.setAttribute("data-scroll-y", scrollY.toString());
    } else {
      const scrollY = document.body.getAttribute("data-scroll-y");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY));
        document.body.removeAttribute("data-scroll-y");
      }
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      const scrollY = document.body.getAttribute("data-scroll-y");
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY));
        document.body.removeAttribute("data-scroll-y");
      }
    };
  }, [isOpen]);

  // Function to get initial values based on whether it's edit mode or not
  const getInitialValues = () => {
    if (formState && Object.keys(formState).length > 0) {
      // Edit mode - populate with existing data
      return {
        product_name: formState.product_name || formState.serviceName || "",
        voucher_files: formState.voucher_files || formState.voucherFile || "",
        expiry_date: formState.expiry_date || formState.expiryDate || "",
        type: formState.type || "",
      };
    } else {
      // Add mode - empty values
      return {
        product_name: "",
        voucher_files: "",
        expiry_date: "",
        type: "",
      };
    }
  };

  // Determine if it's edit mode
  const isEditMode = formState && Object.keys(formState).length > 0;

  // Formik Configuration
  const formik = useFormik({
    initialValues: getInitialValues(),
    enableReinitialize: true, // This allows the form to reinitialize when formState changes
    validationSchema: Yup.object({
      product_name: Yup.string().required("Product name is required"),
      voucher_files: Yup.string().required("Voucher files is required"),
      expiry_date: Yup.string().required("Expiry date is required"),
      // type is not compulsory, so no validation required
    }),
    onSubmit: (values) => {
      const formData = new FormData();

      // Append form fields
      formData.append("product_name", values.product_name || "");
      formData.append("voucher_files", values.voucher_files || "");
      formData.append("expiry_date", values.expiry_date || "");
      formData.append("type", values.type || "");

      // If editing, append the ID
      if (isEditMode && formState.id) {
        formData.append("id", formState.id);
      }

      // Determine the API path based on mode
      const apiPath = isEditMode 
        ? "admin/edit-inventory-by-admin/" 
        : "admin/add-inventory-by-admin/";

      // Use the correct mutation based on mode
      // const mutation = isEditMode ? editMutation : addMutation;

      mutation.mutate(
        {
          payload: formData,
          path: "admin/add-inventory-by-admin/", // Since you said both use same endpoint
          queryKey: "our-inventory",
        },
        {
          onSuccess: (data) => {
            console.log("Edit successful, invalidating cache...");
            
            // Force invalidate and refetch the inventory list
            queryClient.invalidateQueries(["our-inventory"]);
            queryClient.refetchQueries(["our-inventory"]);
            
            // Also try without array (in case fetchResults uses string format)
            queryClient.invalidateQueries("our-inventory");
            queryClient.refetchQueries("our-inventory");
            
            toast.success(`Inventory updated successfully!`);
            formik.resetForm();
            onClose();
          },
          onError: (error) => {
            console.error('Edit error:', error);
            toast.error(`Failed to update inventory. Please try again.`);
          },
        }
      );
    },
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);

  // Update form values when formState changes
  useEffect(() => {
    if (isOpen && formState) {
      formik.setValues(getInitialValues());
    }
  }, [formState, isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center backdrop-blur-md bg-gray-800/30 justify-center z-50">
        <div className="bg-white p-5 rounded-lg w-[95%] lg:w-[55%] 2xl:w-[40%] shadow-2xl max-h-[95vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {isEditMode ? `Edit ${title}` : title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer text-4xl"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="border border-[#A4A5AB33] rounded-md p-4">
              
              {/* Product Name Dropdown */}
              <InputFields
                label="Product Name"
                placeholder="Select Product"
                isSelect={true}
                options={ProductOptions}
                error={formik.errors.product_name}
                touched={formik.touched.product_name}
                {...formik.getFieldProps("product_name")}
              />

              {/* Voucher Files Text Field */}
              {/* <InputFields
                label="Voucher Files"
                placeholder="Enter Voucher Files"
                type="text"
                error={formik.errors.voucher_files}
                touched={formik.touched.voucher_files}
                {...formik.getFieldProps("voucher_files")}
              /> */}

<div className="relative w-full">
  {/* Label */}
  <label
    htmlFor="voucher_files"
    className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-600"
  >
    Voucher Files
  </label>

  {/* Textarea */}
  <textarea
    id="voucher_files"
    className={`border p-2 w-full rounded outline-none mb-2 ${
      formik.touched.voucher_files && formik.errors.voucher_files
        ? "border-red-500"
        : "border-gray-300"
    }`}
    placeholder="Enter Voucher Files"
    value={formik.values.voucher_files}
    onChange={(e) => {
      let formattedValue = e.target.value.replace(/,\s*/g, ",\n");
      formik.setFieldValue("voucher_files", formattedValue);
    }}
  />

  {/* Error message */}
  {formik.touched.voucher_files && formik.errors.voucher_files && (
    <div className="text-red-500 text-xs mb-3">{formik.errors.voucher_files}</div>
  )}
</div>


              {/* Expiry Date Text Field */}
              <InputFields
                label="Expiry Date"
                placeholder="Enter Expiry Date"
                type="date"
                error={formik.errors.expiry_date}
                touched={formik.touched.expiry_date}
                {...formik.getFieldProps("expiry_date")}
              />

              {/* Type Dropdown (Not Compulsory) */}
              <InputFields
                label="Type (Optional)"
                placeholder="Select Type"
                isSelect={true}
                options={TypeOptions}
                error={formik.errors.type}
                touched={formik.touched.type}
                {...formik.getFieldProps("type")}
              />

            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={onClose}
                className="mr-2 px-4 py-2 text-gray-600 border border-[#A4A5AB33] rounded-full hover:text-gray-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-2 bg-[#4755E5] text-white rounded-full cursor-pointer"
              >
                {isEditMode ? 'Update Inventory' : 'Updating'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddInventory;