// import React, { useState, useEffect } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import InputFields from "../../InputFields/InputFields";
// import { uploadButton } from "../../../assets/index";

// import { AddResultMutation } from "../../../Services/AddResultService";
// import { EditResultMutation } from "../../../Services/Editservice";
// import toast, { Toaster } from "react-hot-toast";
// import { fetchResults } from "../../../Services/GetResults";

// const EditProductListing = ({
//   isOpen,
//   onClose,
//   title,
//   nameLabel,
//   formState,
//   setFormState,
// }) => {
//   const mutation = EditResultMutation(["add-voucher"]);
//   // fetch CATEGORY
//   const {
//     data: categoriesApi,
//     isLoading: categoriesLoading,
//     error: categoriesError,
//   } = fetchResults("add-voucher", "/api/admin/get-product-category/");

//   const vendorOptions =
//     categoriesApi?.data?.map((item) => ({
//       label: item.name,
//       value: item.id, // Use ID for form submission
//       name: item.name, // Keep name for conditional logic
//     })) || [];

//   console.log("formState", formState);

//   // Helper function to get category name by ID
//   const getCategoryNameById = (categoryId) => {
//     const category = categoriesApi?.data?.find((item) => item.id === parseInt(categoryId));
//     return category ? category.name : "";
//   };

//   // Helper function to check if selected category should show type dropdown
//   const shouldShowTypeDropdown = (selectedVendorId) => {
//     const categoryName = getCategoryNameById(selectedVendorId);
//     return categoryName === "Scored Practice Mock Test";
//   };

//   // Helper function to check if selected category should show validity field
//   const shouldShowValidityField = (selectedVendorId) => {
//     const categoryName = getCategoryNameById(selectedVendorId);
//     return categoryName === "ape uni" || categoryName === "APE UNI";
//   };

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

//   // Formik Configuration
//   const formik = useFormik({
//     initialValues: {
//       voucherName: formState?.name || formState?.voucherName || "", // Voucher Name
//       vendor: formState?.category || "", // Vendor (should be ID)
//       description: formState?.description || "", // Description
//       validity: formState?.validity || "", // Validity
//       type: formState?.type || "", // Type
//       price: formState?.price || 0, // Price
//       status: formState?.status ? "true" : "false", // Convert boolean to string "true"/"false"
//       photo: null, // File upload field
//     },
//     enableReinitialize: true, // This allows the form to reinitialize when formState changes
//     validationSchema: Yup.object({
//       voucherName: Yup.string().required("Voucher Name is required"),
//       vendor: Yup.string().required("Vendor is required"),
//       description: Yup.string().required("Description is required"),
//       validity: Yup.string().when("vendor", {
//         is: (vendorId) => shouldShowValidityField(vendorId),
//         then: (schema) => schema.required("Validity is required"),
//         otherwise: (schema) => schema,
//       }),
//       type: Yup.string().when("vendor", {
//         is: (vendorId) => shouldShowTypeDropdown(vendorId),
//         then: (schema) => schema.required("Type is required"),
//         otherwise: (schema) => schema,
//       }),
//       price: Yup.number()
//         .typeError("Price must be a number")
//         .positive("Price must be positive")
//         .required("Price is required"),
//       status: Yup.string().required("Status is required"),
//     }),
//     onSubmit: (values) => {
//       const formData = new FormData();
//       formData.append("name", values.voucherName);
//       formData.append("category", values.vendor); // This will be the category ID
//       formData.append("price", values.price);
//       formData.append("description", values.description);
//       formData.append("status", values.status === "true" ? "true" : "false"); // Ensure correct value

//       // Only append validity if it should be shown for this category
//       if (shouldShowValidityField(values.vendor)) {
//         formData.append("validity", values.validity);
//       }

//       // Only append type if it should be shown for this category
//       if (shouldShowTypeDropdown(values.vendor)) {
//         formData.append("type", values.type);
//       }

//       // Add ID if editing (formState exists and has ID)
//       if (formState?.id) {
//         formData.append("id", formState.id);
//       }

//       // Only append image if a new photo is selected
//       if (values.photo) {
//         formData.append("image", values.photo);
//       }

//       const apiPath = formState?.id ? "admin/add-it-voucher/" : "admin/add-it-voucher/";
//       const successMessage = formState?.id ? "Voucher updated successfully!" : "Voucher created successfully!";

//       mutation.mutate(
//         {
//           payload: formData,
//           path: "admin/add-it-voucher/",
//         },
//         {
//           onSuccess: (data) => {
//             toast.success(successMessage);
//             formik.resetForm(); // Reset form after successful submission
//             onClose(); // Close modal on success
//           },
//           onError: (error) => {
//             toast.error("Failed to save Voucher. Please try again.");
//           },
//         }
//       );
//     },
//   });

//   // Reset type and validity when vendor changes
//   useEffect(() => {
//     if (formik.values.vendor) {
//       if (!shouldShowTypeDropdown(formik.values.vendor)) {
//         formik.setFieldValue("type", "");
//       }
//       if (!shouldShowValidityField(formik.values.vendor)) {
//         formik.setFieldValue("validity", "");
//       }
//     }
//   }, [formik.values.vendor]);

//   useEffect(() => {
//     if (!isOpen) {
//       formik.resetForm();
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <>
//       <div className="fixed inset-0 flex items-center backdrop-blur-md bg-gray-800/30 justify-center z-50">
//         <div className="bg-white p-5 rounded-lg w-[95%] lg:w-1/2 2xl:w-[40%] shadow-2xl max-h-[95vh] overflow-y-auto">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold">{title}</h2>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700 cursor-pointer text-4xl"
//             >
//               ×
//             </button>
//           </div>
//           <form onSubmit={formik.handleSubmit} className="">
//             {/* Voucher Name Field */}
//             <InputFields
//               label="Voucher Name"
//               placeholder="Enter Voucher Name"
//               type="text"
//               error={formik.errors.voucherName}
//               touched={formik.touched.voucherName}
//               {...formik.getFieldProps("voucherName")}
//             />

//             {/* Vendor Dropdown */}
//             <InputFields
//               label="Category"
//               placeholder="Select Category"
//               isSelect={true}
//               options={vendorOptions}
//               error={formik.errors.vendor}
//               touched={formik.touched.vendor}
//               {...formik.getFieldProps("vendor")}
//             />

//             {/* Description Field */}
//             <InputFields
//               label="Description"
//               placeholder="Enter Description"
//               type="textarea"
//               error={formik.errors.description}
//               touched={formik.touched.description}
//               {...formik.getFieldProps("description")}
//             />

//             {/* Validity Field - Show only for ape uni or APE UNI */}
//             {shouldShowValidityField(formik.values.vendor) && (
//               <InputFields
//                 label="Validity"
//                 placeholder="Enter Validity"
//                 type="text"
//                 error={formik.errors.validity}
//                 touched={formik.touched.validity}
//                 {...formik.getFieldProps("validity")}
//               />
//             )}

//             {/* Type Dropdown - Show only for Scored Practice Mock Test */}
//             {shouldShowTypeDropdown(formik.values.vendor) && (
//               <InputFields
//                 label="Type"
//                 placeholder="Select Type"
//                 isSelect={true}
//                 options={[
//                   { value: "Type A", label: "Type A" },
//                   { value: "Type B", label: "Type B" },
//                   { value: "Type C", label: "Type C" },
//                   { value: "Type D", label: "Type D" },
//                   { value: "Type E", label: "Type E" },
//                 ]}
//                 error={formik.errors.type}
//                 touched={formik.touched.type}
//                 {...formik.getFieldProps("type")}
//               />
//             )}

//             {/* Price Field */}
//             <InputFields
//               label="Price"
//               placeholder="Enter Price"
//               type="number"
//               error={formik.errors.price}
//               touched={formik.touched.price}
//               {...formik.getFieldProps("price")}
//             />

//             {/* Status Dropdown */}
//             <InputFields
//               label="Status"
//               placeholder="Select status"
//               isSelect={true}
//               options={[
//                 { value: "true", label: "Active" },
//                 { value: "false", label: "Inactive" },
//               ]}
//               error={formik.errors.status}
//               touched={formik.touched.status}
//               value={formik.values.status} // Explicitly set value
//               onChange={(e) => formik.setFieldValue("status", e.target.value)}
//               onBlur={formik.handleBlur}
//               name="status"
//             />

//             {/* Upload Photo */}
//             <div className="mt-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Upload Photo
//               </label>
//               <div
//                 className={`w-full border-dotted border-[#4755E5] border-1 rounded-md mt-2 mb-2 p-4 ${
//                   formik.touched.photo && formik.errors.photo
//                     ? "border-red-500"
//                     : ""
//                 }`}
//               >
//                 {!formik.values.photo && !formState?.image_url ? (
//                   <label
//                     htmlFor="photoUpload"
//                     className="cursor-pointer flex flex-col items-center justify-center"
//                   >
//                     <img src={uploadButton} className="w-28" alt="Upload" />
//                     <span className="text-[#111217] text-[14px]">
//                       Drag & Drop or choose file to upload
//                     </span>
//                     <span className="text-[#A4A5AB] text-[12px]">
//                       Supported formats: JPEG, PNG
//                     </span>
//                     <input
//                       id="photoUpload"
//                       type="file"
//                       accept="image/jpeg, image/png"
//                       className="hidden"
//                       onChange={(e) => {
//                         const file = e.target.files[0];
//                         formik.setFieldValue("photo", file);
//                         formik.setTouched({ photo: true });
//                       }}
//                     />
//                   </label>
//                 ) : (
//                   <div className="relative flex items-center justify-center">
//                     <img
//                       src={
//                         formik.values.photo
//                           ? URL.createObjectURL(formik.values.photo)
//                           : formState?.image_url
//                       }
//                       alt="Uploaded"
//                       className="w-28 object-cover rounded-md"
//                     />
//                     <div className="absolute -top-2 right-36">
//                       <div
//                         onClick={() => {
//                           formik.setFieldValue("photo", null);
//                           formik.setFieldError("photo", "");
//                         }}
//                         className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[12px] cursor-pointer"
//                       >
//                         x
//                       </div>
//                     </div>
//                     {/* Show file input to change image */}
//                     <div className="absolute bottom-0 right-36">
//                       <label
//                         htmlFor="photoUpload"
//                         className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-[12px] cursor-pointer"
//                       >
//                         ✓
//                       </label>
//                       <input
//                         id="photoUpload"
//                         type="file"
//                         accept="image/jpeg, image/png"
//                         className="hidden"
//                         onChange={(e) => {
//                           const file = e.target.files[0];
//                           formik.setFieldValue("photo", file);
//                           formik.setTouched({ photo: true });
//                         }}
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>
//               {formik.errors.photo && formik.touched.photo && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {formik.errors.photo}
//                 </p>
//               )}
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-end mt-4">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="mr-2 px-4 py-2 text-gray-600 border border-[#A4A5AB33] rounded-full hover:text-gray-800 cursor-pointer"
//                 disabled={mutation.isPending}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-8 py-2 bg-[#4755E5] text-white rounded-full cursor-pointer"
//                 disabled={mutation.isPending}
//               >
//                 {mutation.isPending ? "Updating..." : "Update Product"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default EditProductListing;


import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputFields from "../../InputFields/InputFields";
import { uploadButton } from "../../../assets/index";

import { AddResultMutation } from "../../../Services/AddResultService";
import { EditResultMutation } from "../../../Services/Editservice";
import toast, { Toaster } from "react-hot-toast";
import { fetchResults } from "../../../Services/GetResults";

const EditProductListing = ({
  isOpen,
  onClose,
  title,
  nameLabel,
  formState,
  setFormState,
}) => {
  const mutation = EditResultMutation(["add-voucher"]);
  // fetch CATEGORY
  const {
    data: categoriesApi,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = fetchResults("add-voucher", "/api/admin/get-product-category/");

  const vendorOptions =
    categoriesApi?.data?.map((item) => ({
      label: item.name,
      value: item.id, // Use ID for form submission
      name: item.name, // Keep name for conditional logic
    })) || [];

  console.log("formState", formState);

  // Helper function to get category name by ID
  const getCategoryNameById = (categoryId) => {
    const category = categoriesApi?.data?.find((item) => item.id === parseInt(categoryId));
    return category ? category.name : "";
  };

  // Helper function to check if selected category should show type dropdown
  const shouldShowTypeDropdown = (selectedVendorId) => {
    const categoryName = getCategoryNameById(selectedVendorId);
    return categoryName === "Scored Practice Mock Test";
  };

  // Helper function to check if selected category should show validity field
  const shouldShowValidityField = (selectedVendorId) => {
    const categoryName = getCategoryNameById(selectedVendorId);
    return categoryName === "ape uni" || categoryName === "APE UNI";
  };

  // **NEW: Helper function to check if selected category should show country pricing**
  const shouldShowCountryPricing = (selectedVendorId) => {
    const categoryName = getCategoryNameById(selectedVendorId);
    return categoryName === "Pearson PTE Voucher";
  };

  // **NEW: Helper function to parse existing country pricing data**
  const parseCountryPricingData = (formState) => {
    if (formState?.country_pricing) {
      const countryPricing = typeof formState.country_pricing === 'string' 
        ? JSON.parse(formState.country_pricing) 
        : formState.country_pricing;
      
      const selectedCountries = Object.keys(countryPricing);
      return {
        selectedCountries,
        pakistanPrice: countryPricing.pakistan ? countryPricing.pakistan.toString() : "",
        ukPrice: countryPricing.uk ? countryPricing.uk.toString() : "",
      };
    }
    return {
      selectedCountries: [],
      pakistanPrice: "",
      ukPrice: "",
    };
  };

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

  // **UPDATED: Parse country pricing data for initial values**
  const countryPricingData = parseCountryPricingData(formState);

  // Formik Configuration
  const formik = useFormik({
    initialValues: {
      voucherName: formState?.name || formState?.voucherName || "", // Voucher Name
      vendor: formState?.category || "", // Vendor (should be ID)
      description: formState?.description || "", // Description
      validity: formState?.validity || "", // Validity
      type: formState?.type || "", // Type
      price: formState?.price || 0, // Price
      status: formState?.status ? "true" : "false", // Convert boolean to string "true"/"false"
      photo: null, // File upload field
      // **NEW: Country pricing fields**
      selectedCountries: countryPricingData.selectedCountries, // Array to store selected countries
      pakistanPrice: countryPricingData.pakistanPrice, // Price for Pakistan
      ukPrice: countryPricingData.ukPrice, // Price for UK
    },
    enableReinitialize: true, // This allows the form to reinitialize when formState changes
    validationSchema: Yup.object({
      voucherName: Yup.string().required("Voucher Name is required"),
      vendor: Yup.string().required("Vendor is required"),
      description: Yup.string().required("Description is required"),
      validity: Yup.string().when("vendor", {
        is: (vendorId) => shouldShowValidityField(vendorId),
        then: (schema) => schema.required("Validity is required"),
        otherwise: (schema) => schema,
      }),
      type: Yup.string().when("vendor", {
        is: (vendorId) => shouldShowTypeDropdown(vendorId),
        then: (schema) => schema.required("Type is required"),
        otherwise: (schema) => schema,
      }),
      price: Yup.number().when("vendor", {
        is: (vendorId) => !shouldShowCountryPricing(vendorId),
        then: (schema) => schema
          .typeError("Price must be a number")
          .positive("Price must be positive")
          .required("Price is required"),
        otherwise: (schema) => schema,
      }),
      // **NEW: Country pricing validations**
      selectedCountries: Yup.array().when("vendor", {
        is: (vendorId) => shouldShowCountryPricing(vendorId),
        then: (schema) => schema.min(1, "At least one country must be selected"),
        otherwise: (schema) => schema,
      }),
      pakistanPrice: Yup.string().when(["vendor", "selectedCountries"], {
        is: (vendorId, selectedCountries) => 
          shouldShowCountryPricing(vendorId) && selectedCountries?.includes("pakistan"),
        then: (schema) => schema
          .required("Pakistan price is required")
          .test("is-positive", "Price must be positive", (value) => 
            value && parseFloat(value) > 0
          ),
        otherwise: (schema) => schema,
      }),
      ukPrice: Yup.string().when(["vendor", "selectedCountries"], {
        is: (vendorId, selectedCountries) => 
          shouldShowCountryPricing(vendorId) && selectedCountries?.includes("uk"),
        then: (schema) => schema
          .required("UK price is required")
          .test("is-positive", "Price must be positive", (value) => 
            value && parseFloat(value) > 0
          ),
        otherwise: (schema) => schema,
      }),
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("name", values.voucherName);
      formData.append("category", values.vendor); // This will be the category ID
      formData.append("description", values.description);
      formData.append("status", values.status === "true" ? "true" : "false"); // Ensure correct value

      // **UPDATED: Price handling for country pricing vs regular price**
      if (shouldShowCountryPricing(values.vendor)) {
        // Build country_pricing object
        const countryPricing = {};
        if (values.selectedCountries.includes("pakistan") && values.pakistanPrice) {
          countryPricing.pakistan = parseFloat(values.pakistanPrice);
        }
        if (values.selectedCountries.includes("uk") && values.ukPrice) {
          countryPricing.uk = parseFloat(values.ukPrice);
        }
        formData.append("country_pricing", JSON.stringify(countryPricing));
        formData.append("price", values.price);
      } else {
        formData.append("price", values.price);
      }

      // Only append validity if it should be shown for this category
      if (shouldShowValidityField(values.vendor)) {
        formData.append("validity", values.validity);
      }

      // Only append type if it should be shown for this category
      if (shouldShowTypeDropdown(values.vendor)) {
        formData.append("type", values.type);
      }

      // Add ID if editing (formState exists and has ID)
      if (formState?.id) {
        formData.append("id", formState.id);
      }

      // Only append image if a new photo is selected
      if (values.photo) {
        formData.append("image", values.photo);
      }

      const apiPath = formState?.id ? "admin/add-it-voucher/" : "admin/add-it-voucher/";
      const successMessage = formState?.id ? "Voucher updated successfully!" : "Voucher created successfully!";

      mutation.mutate(
        {
          payload: formData,
          path: "admin/add-it-voucher/",
        },
        {
          onSuccess: (data) => {
            toast.success(successMessage);
            formik.resetForm(); // Reset form after successful submission
            onClose(); // Close modal on success
          },
          onError: (error) => {
            toast.error("Failed to save Voucher. Please try again.");
          },
        }
      );
    },
  });

  // **UPDATED: Reset fields when vendor changes**
  useEffect(() => {
    if (formik.values.vendor) {
      if (!shouldShowTypeDropdown(formik.values.vendor)) {
        formik.setFieldValue("type", "");
      }
      if (!shouldShowValidityField(formik.values.vendor)) {
        formik.setFieldValue("validity", "");
      }
      // **NEW: Reset country pricing fields when vendor changes**
      if (!shouldShowCountryPricing(formik.values.vendor)) {
        formik.setFieldValue("selectedCountries", []);
        formik.setFieldValue("pakistanPrice", "");
        formik.setFieldValue("ukPrice", "");
      } else {
        // When switching to country pricing, preserve existing country data if available
        if (formState?.country_pricing && !formik.values.selectedCountries.length) {
          const existingData = parseCountryPricingData(formState);
          formik.setFieldValue("selectedCountries", existingData.selectedCountries);
          formik.setFieldValue("pakistanPrice", existingData.pakistanPrice);
          formik.setFieldValue("ukPrice", existingData.ukPrice);
        }
      }
    }
  }, [formik.values.vendor]);

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);

  // **NEW: Handle country selection change**
  const handleCountryChange = (country) => {
    const currentCountries = formik.values.selectedCountries;
    let updatedCountries;
    
    if (currentCountries.includes(country)) {
      // Remove country
      updatedCountries = currentCountries.filter(c => c !== country);
      // Clear price for removed country
      if (country === "pakistan") {
        formik.setFieldValue("pakistanPrice", "");
      } else if (country === "uk") {
        formik.setFieldValue("ukPrice", "");
      }
    } else {
      // Add country
      updatedCountries = [...currentCountries, country];
    }
    
    formik.setFieldValue("selectedCountries", updatedCountries);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center backdrop-blur-md bg-gray-800/30 justify-center z-50">
        <div className="bg-white p-5 rounded-lg w-[95%] lg:w-1/2 2xl:w-[40%] shadow-2xl max-h-[95vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer text-4xl"
            >
              ×
            </button>
          </div>
          <form onSubmit={formik.handleSubmit} className="">
            {/* Voucher Name Field */}
            <InputFields
              label="Voucher Name"
              placeholder="Enter Voucher Name"
              type="text"
              error={formik.errors.voucherName}
              touched={formik.touched.voucherName}
              {...formik.getFieldProps("voucherName")}
            />

            {/* Vendor Dropdown */}
            <InputFields
              label="Category"
              placeholder="Select Category"
              isSelect={true}
              options={vendorOptions}
              error={formik.errors.vendor}
              touched={formik.touched.vendor}
              {...formik.getFieldProps("vendor")}
            />

            {/* Description Field */}
            <InputFields
              label="Description"
              placeholder="Enter Description"
              type="textarea"
              error={formik.errors.description}
              touched={formik.touched.description}
              {...formik.getFieldProps("description")}
            />

            {/* Validity Field - Show only for ape uni or APE UNI */}
            {shouldShowValidityField(formik.values.vendor) && (
              <InputFields
                label="Validity"
                placeholder="Enter Validity"
                type="text"
                error={formik.errors.validity}
                touched={formik.touched.validity}
                {...formik.getFieldProps("validity")}
              />
            )}

            {/* Type Dropdown - Show only for Scored Practice Mock Test */}
            {shouldShowTypeDropdown(formik.values.vendor) && (
              <InputFields
                label="Type"
                placeholder="Select Type"
                isSelect={true}
                options={[
                  { value: "Type A", label: "Type A" },
                  { value: "Type B", label: "Type B" },
                  { value: "Type C", label: "Type C" },
                  { value: "Type D", label: "Type D" },
                  { value: "Type E", label: "Type E" },
                ]}
                error={formik.errors.type}
                touched={formik.touched.type}
                {...formik.getFieldProps("type")}
              />
            )}

            {/* **NEW: Country Selection and Pricing - Show only for Pearson PTE Voucher** */}
            {shouldShowCountryPricing(formik.values.vendor) && (
              <div className="mt-4">
                {/* Country Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Countries
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formik.values.selectedCountries.includes("pakistan")}
                        onChange={() => handleCountryChange("pakistan")}
                        className="mr-2"
                      />
                      Pakistan
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formik.values.selectedCountries.includes("uk")}
                        onChange={() => handleCountryChange("uk")}
                        className="mr-2"
                      />
                      UK
                    </label>
                  </div>
                  {formik.errors.selectedCountries && formik.touched.selectedCountries && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.selectedCountries}
                    </p>
                  )}
                </div>

                {/* Pakistan Price Field */}
                {formik.values.selectedCountries.includes("pakistan") && (
                  <InputFields
                    label="Pakistan Price"
                    placeholder="Enter Pakistan Price"
                    type="number"
                    step="0.01"
                    error={formik.errors.pakistanPrice}
                    touched={formik.touched.pakistanPrice}
                    {...formik.getFieldProps("pakistanPrice")}
                  />
                )}

                {/* UK Price Field */}
                {formik.values.selectedCountries.includes("uk") && (
                  <InputFields
                    label="UK Price"
                    placeholder="Enter UK Price"
                    type="number"
                    step="0.01"
                    error={formik.errors.ukPrice}
                    touched={formik.touched.ukPrice}
                    {...formik.getFieldProps("ukPrice")}
                  />
                )}
              </div>
            )}

            {/* **UPDATED: Regular Price Field - Show only when NOT using country pricing** */}
            {/* {!shouldShowCountryPricing(formik.values.vendor) && ( */}
              <InputFields
                label="Price"
                placeholder="Enter Price"
                type="number"
                error={formik.errors.price}
                touched={formik.touched.price}
                {...formik.getFieldProps("price")}
              />
            {/* )} */}

            {/* Status Dropdown */}
            <InputFields
              label="Status"
              placeholder="Select status"
              isSelect={true}
              options={[
                { value: "true", label: "Active" },
                { value: "false", label: "Inactive" },
              ]}
              error={formik.errors.status}
              touched={formik.touched.status}
              value={formik.values.status} // Explicitly set value
              onChange={(e) => formik.setFieldValue("status", e.target.value)}
              onBlur={formik.handleBlur}
              name="status"
            />

            {/* Upload Photo */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Upload Photo
              </label>
              <div
                className={`w-full border-dotted border-[#4755E5] border-1 rounded-md mt-2 mb-2 p-4 ${
                  formik.touched.photo && formik.errors.photo
                    ? "border-red-500"
                    : ""
                }`}
              >
                {!formik.values.photo && !formState?.image_url ? (
                  <label
                    htmlFor="photoUpload"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    <img src={uploadButton} className="w-28" alt="Upload" />
                    <span className="text-[#111217] text-[14px]">
                      Drag & Drop or choose file to upload
                    </span>
                    <span className="text-[#A4A5AB] text-[12px]">
                      Supported formats: JPEG, PNG
                    </span>
                    <input
                      id="photoUpload"
                      type="file"
                      accept="image/jpeg, image/png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        formik.setFieldValue("photo", file);
                        formik.setTouched({ photo: true });
                      }}
                    />
                  </label>
                ) : (
                  <div className="relative flex items-center justify-center">
                    <img
                      src={
                        formik.values.photo
                          ? URL.createObjectURL(formik.values.photo)
                          : formState?.image_url
                      }
                      alt="Uploaded"
                      className="w-28 object-cover rounded-md"
                    />
                    <div className="absolute -top-2 right-36">
                      <div
                        onClick={() => {
                          formik.setFieldValue("photo", null);
                          formik.setFieldError("photo", "");
                        }}
                        className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[12px] cursor-pointer"
                      >
                        x
                      </div>
                    </div>
                    {/* Show file input to change image */}
                    <div className="absolute bottom-0 right-36">
                      <label
                        htmlFor="photoUpload"
                        className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-[12px] cursor-pointer"
                      >
                        ✓
                      </label>
                      <input
                        id="photoUpload"
                        type="file"
                        accept="image/jpeg, image/png"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          formik.setFieldValue("photo", file);
                          formik.setTouched({ photo: true });
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              {formik.errors.photo && formik.touched.photo && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.photo}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={onClose}
                className="mr-2 px-4 py-2 text-gray-600 border border-[#A4A5AB33] rounded-full hover:text-gray-800 cursor-pointer"
                disabled={mutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-2 bg-[#4755E5] text-white rounded-full cursor-pointer"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Updating..." : "Update Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProductListing;