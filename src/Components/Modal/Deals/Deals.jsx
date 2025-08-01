import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputFields from "../../InputFields/InputFields";
import { uploadButton, checkout } from "../../../assets/index";

import { fetchResults } from  "../../../Services/GetResults"
import { AddResultMutation } from "../../../Services/AddResultService";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../../Loader/Loader"

const Deals = ({
  isOpen,
  onClose,
  title,
  nameLabel,
  formState,
  setFormState,
}) => {

  // fetch CATEGORY
  const {
    data: Products,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = fetchResults("add-voucher", "/api/admin/get-all-vouchers-names/");

  const {
    data: Alpha,
   
  } = fetchResults("add-voucher", "/api/admin/get-all-Aplha-Pte-names/");

   const mutation = AddResultMutation();

  const ProductOptions =
  Products?.data?.map((item) => ({
    label: item.name,
    value: item.name, // Use name as value instead of ID
  })) || [];
  
  const AlphaOptions =
  Alpha?.data?.map((item) => ({
    label: item.name,
    value: item.name, // Use name as value instead of ID
  })) || [];

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

  // State for key features
  const [keyFeatures, setKeyFeatures] = useState([]);

  // Formik Configuration
  const formik = useFormik({
    initialValues: {
      name: "",
      title: "",
      price: "",
      products: [], // Array of product names for multiple selection
      alpha_pte: "",
      save_rs: "",
      // key_features: [], // Will be managed by keyFeatures state
      main_image: null,
      image_1: null,
      image_2: null,
      image_3: null,
      image_4: null,
      // status: "",
      isPopular: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      title: Yup.string().required("Title is required"),
      products: Yup.array().min(1, "At least one product must be selected"),
      price: Yup.number()
        .typeError("Price must be a number")
        .positive("Price must be positive")
        .required("Price is required"),
      save_rs: Yup.number()
        .typeError("Save Rs must be a number")
        .positive("Save Rs must be positive")
        .required("Save Rs is required"),
      // status: Yup.string().required("Status is required"),
      main_image: Yup.mixed()
        .test(
          "fileFormat",
          "Only JPEG and PNG formats are supported.",
          (value) => !value || ["image/jpeg", "image/png"].includes(value?.type)
        )
        .test(
          "fileSize",
          "File size must not exceed 5 MB.",
          (value) => !value || (value && value.size / (1024 * 1024) <= 5)
        ),
      image_1: Yup.mixed()
        .nullable()
        .test(
          "fileFormat",
          "Only JPEG and PNG formats are supported.",
          (value) => !value || ["image/jpeg", "image/png"].includes(value?.type)
        )
        .test(
          "fileSize",
          "File size must not exceed 5 MB.",
          (value) => !value || (value && value.size / (1024 * 1024) <= 5)
        ),
      image_2: Yup.mixed()
        .nullable()
        .test(
          "fileFormat",
          "Only JPEG and PNG formats are supported.",
          (value) => !value || ["image/jpeg", "image/png"].includes(value?.type)
        )
        .test(
          "fileSize",
          "File size must not exceed 5 MB.",
          (value) => !value || (value && value.size / (1024 * 1024) <= 5)
        ),
      image_3: Yup.mixed()
        .nullable()
        .test(
          "fileFormat",
          "Only JPEG and PNG formats are supported.",
          (value) => !value || ["image/jpeg", "image/png"].includes(value?.type)
        )
        .test(
          "fileSize",
          "File size must not exceed 5 MB.",
          (value) => !value || (value && value.size / (1024 * 1024) <= 5)
        ),
      image_4: Yup.mixed()
        .nullable()
        .test(
          "fileFormat",
          "Only JPEG and PNG formats are supported.",
          (value) => !value || ["image/jpeg", "image/png"].includes(value?.type)
        )
        .test(
          "fileSize",
          "File size must not exceed 5 MB.",
          (value) => !value || (value && value.size / (1024 * 1024) <= 5)
        ),
    }),
    onSubmit: (values) => {
      const formData = new FormData();

// Simple fields
formData.append("name", values.name || "");
formData.append("title", values.title || "");
formData.append("price", values.price || "");
formData.append("alpha_pte", values.alpha_pte || "");
formData.append("save_rs", values.save_rs || "");

// Append multiple or single products
formData.append("products", (values.products || []).join(","));

// Always treat key_features as array and join with comma
formData.append("key_features", (keyFeatures || []).join(","));

// Image fields
if (values.main_image) formData.append("main_image", values.main_image);
if (values.image_1) formData.append("image_1", values.image_1);
if (values.image_2) formData.append("image_2", values.image_2);
if (values.image_3) formData.append("image_3", values.image_3);
if (values.image_4) formData.append("image_4", values.image_4);

      mutation.mutate(
        {
          payload: formData,
          path: "admin/add-deals/",
          queryKey: "our-deals", // 👈 Add this to enable refetch
        },
        {
          onSuccess: (data) => {
            toast.success("Deal created successfully!");
            formik.resetForm(); // Reset form after successful submission
            onClose(); // Close modal on success
          },
          onError: (error) => {
            toast.error("Deal to create Vendor. Please try again.");
          },
        }
      );
    },
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
      setKeyFeatures([]);
    }
  }, [isOpen]);

  // Function to remove selected product by name
  const removeSelectedProduct = (productNameToRemove) => {
    const updatedProducts = formik.values.products.filter(name => name !== productNameToRemove);
    formik.setFieldValue("products", updatedProducts);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center backdrop-blur-md bg-gray-800/30 justify-center z-50">
        <div className="bg-white p-5 rounded-lg w-[95%] lg:w-[55%] 2xl:w-[40%] shadow-2xl max-h-[95vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer text-4xl"
            >
              ×
            </button>
          </div>
          <form onSubmit={formik.handleSubmit} className="grid grid-cols-2 gap-4">
            {/* Left Section */}
            <div className="border border-[#A4A5AB33] rounded-md p-4">
              {/* Name Field */}
              <InputFields
                label="Name"
                placeholder="Enter Deal Name"
                type="text"
                error={formik.errors.name}
                touched={formik.touched.name}
                {...formik.getFieldProps("name")}
              />

              {/* Title Field */}
              <InputFields
                label="Title"
                placeholder="Enter Deal Title"
                type="text"
                error={formik.errors.title}
                touched={formik.touched.title}
                {...formik.getFieldProps("title")}
              />
              
              {/* Products Multi-Select Dropdown */}
              {/* // Replace your Products Multi-Select Dropdown section with this: */}

{/* Products Multi-Select Dropdown */}
<div className="mb-4">
  <InputFields
    label="Products"
    placeholder="Select Products"
    isSelect={true}
    isMultiSelect={true}
    options={ProductOptions}
    error={formik.errors.products}
    touched={formik.touched.products}
    value={formik.values.products}
    onChange={(selectedValues) => {
      console.log("Selected values from InputFields:", selectedValues);
      console.log("Type of selectedValues:", typeof selectedValues);
      console.log("Is array:", Array.isArray(selectedValues));
      
      // Fix: Ensure we're working with an array of values, not the event object
      let valuesToSet = [];
      
      if (Array.isArray(selectedValues)) {
        // If it's already an array, use it directly
        valuesToSet = selectedValues;
      } else if (selectedValues && selectedValues.target) {
        // If it's an event object, extract the value
        const value = selectedValues.target.value;
        if (Array.isArray(value)) {
          valuesToSet = value;
        } else if (value) {
          // If it's a single value, convert to array
          valuesToSet = [value];
        }
      } else if (selectedValues) {
        // If it's a single value, convert to array
        valuesToSet = Array.isArray(selectedValues) ? selectedValues : [selectedValues];
      }
      
      console.log("Values to set:", valuesToSet);
      formik.setFieldValue("products", valuesToSet);
    }}
    name="products"
  />
  
  
  
  {/* Show selected products */}
  {Array.isArray(formik.values.products) && formik.values.products.length > 0 && (
    <div className="mt-2 flex flex-wrap gap-2">
      {formik.values.products.map((productName, index) => (
        <span
          key={`${productName}-${index}`}
          className="bg-[#3651BF0A] border border-[#3651BF] rounded-full px-3 py-1 text-sm flex items-center"
        >
          {productName}
          <button
            type="button"
            onClick={() => removeSelectedProduct(productName)}
            className="ml-2 text-[#000000] hover:text-red-700 cursor-pointer"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  )}
</div>

              {/* Alpha PTE Field */}
              <InputFields
                label="Alpha PTE"
                placeholder="Select Alpha PTE"
                isSelect={true}
                options={AlphaOptions}
                error={formik.errors.alpha_pte}
                touched={formik.touched.alpha_pte}
                {...formik.getFieldProps("alpha_pte")}
              />    

              {/* Price Field */}
              <InputFields
                label="Price"
                placeholder="Enter Price"
                type="number"
                error={formik.errors.price}
                touched={formik.touched.price}
                {...formik.getFieldProps("price")}
              />

              {/* Save Rs Field */}
              <InputFields
                label="Save Rs"
                placeholder="Enter Save Amount"
                type="number"
                error={formik.errors.save_rs}
                touched={formik.touched.save_rs}
                {...formik.getFieldProps("save_rs")}
              />

              {/* Status Dropdown */}
              {/* <InputFields
                label="Status"
                placeholder="Select status"
                isSelect={true}
                options={[
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inactive" },
                ]}
                error={formik.errors.status}
                touched={formik.touched.status}
                {...formik.getFieldProps("status")}
              /> */}

              {/* Key Features Field */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Key Features</label>
                <input
                  type="text"
                  placeholder="Enter Key Features"
                  className={`w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:border-blue-500`}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const feature = e.target.value.trim();
                      if (feature && !keyFeatures.includes(feature)) {
                        setKeyFeatures([...keyFeatures, feature]);
                        e.target.value = "";
                      }
                    }
                  }}
                />
                {keyFeatures.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {keyFeatures.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-[#E6F7FF] border border-[#4755E5] rounded-full px-3 py-1 text-sm flex items-center"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => {
                            const updatedFeatures = [...keyFeatures];
                            updatedFeatures.splice(index, 1);
                            setKeyFeatures(updatedFeatures);
                          }}
                          className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Most Popular Toggle */}
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formik.values.isPopular}
                    onChange={(e) =>
                      formik.setFieldValue("isPopular", e.target.checked)
                    }
                    className="mr-2"
                  />
                  <span className="text-xs lato">
                    Highlight this product as Most Popular
                  </span>
                </label>
              </div>
            </div>

            {/* Right Section */}
            <div className="border border-[#A4A5AB33] rounded-md p-4">
              <h3 className="text-lg font-medium mb-2">Upload Deal Images</h3>
              <p className="text-sm text-gray-500 mb-4">Main Image</p>

              {/* Main Image */}
              <div className="border-dotted border-[#4755E5] border-1 rounded-md p-4 flex flex-col items-center justify-center mb-4">
                {formik.values.main_image ? (
                  <img
                    src={URL.createObjectURL(formik.values.main_image)}
                    alt="Main Image"
                    className="w-20 h-20 object-cover rounded-md"
                  />
                ) : (
                  <label
                    htmlFor="mainImageUpload"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    <img src={checkout} className="w-10" alt="Upload" />
                    <span className="text-green-500 text-center mt-1 text-[10px]">
                      Main Image
                    </span>
                    <input
                      id="mainImageUpload"
                      type="file"
                      accept="image/jpeg, image/png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        formik.setFieldValue("main_image", file);
                        formik.setTouched({ main_image: true });
                      }}
                    />
                  </label>
                )}
              </div>
              {formik.errors.main_image && formik.touched.main_image && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.main_image}</p>
              )}

              {/* Additional Images */}
              <p className="text-sm text-gray-500 mb-2">Additional Images</p>
              <div className="grid grid-cols-2 gap-2">
                
                {/* Image 1 */}
                <div className={`border-dotted border-[#4755E5] border-1 rounded-md p-4 flex flex-col items-center justify-center ${
                  formik.touched.image_1 && formik.errors.image_1 ? "border-red-500" : ""
                }`}>
                  {formik.values.image_1 ? (
                    <img
                      src={URL.createObjectURL(formik.values.image_1)}
                      alt="Image 1"
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <label htmlFor="imageUpload1" className="cursor-pointer flex flex-col items-center justify-center">
                      <img src={checkout} className="w-8" alt="Upload" />
                      <span className="text-green-500 text-center mt-1 text-[8px]">Image 1</span>
                      <input
                        id="imageUpload1"
                        type="file"
                        accept="image/jpeg, image/png"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          formik.setFieldValue("image_1", file);
                          formik.setTouched({ image_1: true });
                        }}
                      />
                    </label>
                  )}
                </div>

                {/* Image 2 */}
                <div className={`border-dotted border-[#4755E5] border-1 rounded-md p-4 flex flex-col items-center justify-center ${
                  formik.touched.image_2 && formik.errors.image_2 ? "border-red-500" : ""
                }`}>
                  {formik.values.image_2 ? (
                    <img
                      src={URL.createObjectURL(formik.values.image_2)}
                      alt="Image 2"
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <label htmlFor="imageUpload2" className="cursor-pointer flex flex-col items-center justify-center">
                      <img src={checkout} className="w-8" alt="Upload" />
                      <span className="text-green-500 text-center mt-1 text-[8px]">Image 2</span>
                      <input
                        id="imageUpload2"
                        type="file"
                        accept="image/jpeg, image/png"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          formik.setFieldValue("image_2", file);
                          formik.setTouched({ image_2: true });
                        }}
                      />
                    </label>
                  )}
                </div>

                {/* Image 3 */}
                <div className={`border-dotted border-[#4755E5] border-1 rounded-md p-4 flex flex-col items-center justify-center ${
                  formik.touched.image_3 && formik.errors.image_3 ? "border-red-500" : ""
                }`}>
                  {formik.values.image_3 ? (
                    <img
                      src={URL.createObjectURL(formik.values.image_3)}
                      alt="Image 3"
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <label htmlFor="imageUpload3" className="cursor-pointer flex flex-col items-center justify-center">
                      <img src={checkout} className="w-8" alt="Upload" />
                      <span className="text-green-500 text-center mt-1 text-[8px]">Image 3</span>
                      <input
                        id="imageUpload3"
                        type="file"
                        accept="image/jpeg, image/png"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          formik.setFieldValue("image_3", file);
                          formik.setTouched({ image_3: true });
                        }}
                      />
                    </label>
                  )}
                </div>

                {/* Image 4 */}
                <div className={`border-dotted border-[#4755E5] border-1 rounded-md p-4 flex flex-col items-center justify-center ${
                  formik.touched.image_4 && formik.errors.image_4 ? "border-red-500" : ""
                }`}>
                  {formik.values.image_4 ? (
                    <img
                      src={URL.createObjectURL(formik.values.image_4)}
                      alt="Image 4"
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <label htmlFor="imageUpload4" className="cursor-pointer flex flex-col items-center justify-center">
                      <img src={checkout} className="w-8" alt="Upload" />
                      <span className="text-green-500 text-center mt-1 text-[8px]">Image 4</span>
                      <input
                        id="imageUpload4"
                        type="file"
                        accept="image/jpeg, image/png"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          formik.setFieldValue("image_4", file);
                          formik.setTouched({ image_4: true });
                        }}
                      />
                    </label>
                  )}
                </div>

              </div>
              
              {/* Individual Error messages for each image */}
              {formik.errors.image_1 && formik.touched.image_1 && (
                <p className="text-red-500 text-sm mt-1">Image 1: {formik.errors.image_1}</p>
              )}
              {formik.errors.image_2 && formik.touched.image_2 && (
                <p className="text-red-500 text-sm mt-1">Image 2: {formik.errors.image_2}</p>
              )}
              {formik.errors.image_3 && formik.touched.image_3 && (
                <p className="text-red-500 text-sm mt-1">Image 3: {formik.errors.image_3}</p>
              )}
              {formik.errors.image_4 && formik.touched.image_4 && (
                <p className="text-red-500 text-sm mt-1">Image 4: {formik.errors.image_4}</p>
              )}
            </div>
          </form>

          {/* Buttons */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-gray-600 border border-[#A4A5AB33] rounded-full hover:text-gray-800 cursor-pointer"
              disabled={mutation.isPending} // Disable cancel button during loading
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={formik.handleSubmit}
              className="px-8 py-2 bg-[#4755E5] text-white rounded-full cursor-pointer"
              disabled={mutation.isPending} // Disable cancel button during loading
            >
              {mutation.isPending ?"Publishing" : "Publish Deal"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Deals;