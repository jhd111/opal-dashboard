import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputFields from "../../InputFields/InputFields";
import { uploadButton, checkout } from "../../../assets/index";

import { fetchResults } from "../../../Services/GetResults";
import { EditResultMutation } from "../../../Services/Editservice";
import toast, { Toaster } from "react-hot-toast";

const EditDeals = ({
  isOpen,
  onClose,
  title,
  nameLabel,
  formState,
  setFormState,
  dealData, // The deal data to edit
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

  const mutation = EditResultMutation();

  const ProductOptions =
    Products?.data?.map((item) => ({
      label: item.name,
      value: item.name,
    })) || [];

  const AlphaOptions =
    Alpha?.data?.map((item) => ({
      label: item.name,
      value: item.name,
    })) || [];

  console.log("formState in edit detail:", formState);
  console.log("dealData in edit detail:", dealData);

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

  // State to track original images for comparison
  const [originalImages, setOriginalImages] = useState({
    main_image: null,
    image_1: null,
    image_2: null,
    image_3: null,
    image_4: null,
  });

  // Formik Configuration
  const formik = useFormik({
    initialValues: {
      name: "",
      title: "",
      price: "",
      products: [],
      alpha_pte: "",
      save_rs: "",
      main_image: null,
      image_1: null,
      image_2: null,
      image_3: null,
      image_4: null,
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
      main_image: Yup.mixed()
        .test(
          "fileFormat",
          "Only JPEG and PNG formats are supported.",
          (value) => !value || value instanceof File ? !value || ["image/jpeg", "image/png"].includes(value?.type) : true
        )
        .test(
          "fileSize",
          "File size must not exceed 5 MB.",
          (value) => !value || value instanceof File ? !value || (value && value.size / (1024 * 1024) <= 5) : true
        ),
      image_1: Yup.mixed()
        .nullable()
        .test(
          "fileFormat",
          "Only JPEG and PNG formats are supported.",
          (value) => !value || value instanceof File ? !value || ["image/jpeg", "image/png"].includes(value?.type) : true
        )
        .test(
          "fileSize",
          "File size must not exceed 5 MB.",
          (value) => !value || value instanceof File ? !value || (value && value.size / (1024 * 1024) <= 5) : true
        ),
      image_2: Yup.mixed()
        .nullable()
        .test(
          "fileFormat",
          "Only JPEG and PNG formats are supported.",
          (value) => !value || value instanceof File ? !value || ["image/jpeg", "image/png"].includes(value?.type) : true
        )
        .test(
          "fileSize",
          "File size must not exceed 5 MB.",
          (value) => !value || value instanceof File ? !value || (value && value.size / (1024 * 1024) <= 5) : true
        ),
      image_3: Yup.mixed()
        .nullable()
        .test(
          "fileFormat",
          "Only JPEG and PNG formats are supported.",
          (value) => !value || value instanceof File ? !value || ["image/jpeg", "image/png"].includes(value?.type) : true
        )
        .test(
          "fileSize",
          "File size must not exceed 5 MB.",
          (value) => !value || value instanceof File ? !value || (value && value.size / (1024 * 1024) <= 5) : true
        ),
      image_4: Yup.mixed()
        .nullable()
        .test(
          "fileFormat",
          "Only JPEG and PNG formats are supported.",
          (value) => !value || value instanceof File ? !value || ["image/jpeg", "image/png"].includes(value?.type) : true
        )
        .test(
          "fileSize",
          "File size must not exceed 5 MB.",
          (value) => !value || value instanceof File ? !value || (value && value.size / (1024 * 1024) <= 5) : true
        ),
    }),
    onSubmit: (values) => {
      const formData = new FormData();

      // Simple fields
      formData.append("id",formState?.id)
      formData.append("name", values.name || "");
      formData.append("title", values.title || "");
      formData.append("price", values.price || "");
      formData.append("alpha_pte", values.alpha_pte || "");
      formData.append("save_rs", values.save_rs || "");

      // Append multiple or single products
      formData.append("products", (values.products || []).join(","));

      // Always treat key_features as array and join with comma
      formData.append("key_features", (keyFeatures || []).join(","));

      // Image fields - only append if they are changed (File objects or removed)
      if (values.main_image instanceof File || values.main_image !== originalImages.main_image) {
        if (values.main_image instanceof File) {
          formData.append("main_image", values.main_image);
        } else if (values.main_image === null && originalImages.main_image !== null) {
          formData.append("main_image", ""); // Send empty to remove image
        }
      }
      
      if (values.image_1 instanceof File || values.image_1 !== originalImages.image_1) {
        if (values.image_1 instanceof File) {
          formData.append("image_1", values.image_1);
        } else if (values.image_1 === null && originalImages.image_1 !== null) {
          formData.append("image_1", "");
        }
      }
      
      if (values.image_2 instanceof File || values.image_2 !== originalImages.image_2) {
        if (values.image_2 instanceof File) {
          formData.append("image_2", values.image_2);
        } else if (values.image_2 === null && originalImages.image_2 !== null) {
          formData.append("image_2", "");
        }
      }
      
      if (values.image_3 instanceof File || values.image_3 !== originalImages.image_3) {
        if (values.image_3 instanceof File) {
          formData.append("image_3", values.image_3);
        } else if (values.image_3 === null && originalImages.image_3 !== null) {
          formData.append("image_3", "");
        }
      }
      
      if (values.image_4 instanceof File || values.image_4 !== originalImages.image_4) {
        if (values.image_4 instanceof File) {
          formData.append("image_4", values.image_4);
        } else if (values.image_4 === null && originalImages.image_4 !== null) {
          formData.append("image_4", "");
        }
      }

      mutation.mutate(
        {
          payload: formData,
          path: "admin/add-deals/",
          queryKey: "our-deals",
        },
        {
          onSuccess: (data) => {
            toast.success("Deal updated successfully!");
            onClose();
          },
          onError: (error) => {
            toast.error("Failed to update deal. Please try again.");
          },
        }
      );
    },
  });

  // Populate form with existing deal data when modal opens
  useEffect(() => {
    if (isOpen && (formState || dealData)) {
      const data = formState || dealData;
      
      // Parse products if it's a string
      let productsArray = [];
      if (typeof data.products === 'string') {
        productsArray = data.products.split(',').filter(p => p.trim());
      } else if (Array.isArray(data.products)) {
        productsArray = data.products;
      }

      // Parse key features if it's a string  
      let featuresArray = [];
      if (typeof data.key_features === 'string') {
        featuresArray = data.key_features.split(',').filter(f => f.trim());
      } else if (Array.isArray(data.key_features)) {
        featuresArray = data.key_features;
      }

      // Store original images for comparison
      const originalImagesData = {
        main_image: data.main_image || null,
        image_1: data.image_1 || null,
        image_2: data.image_2 || null,
        image_3: data.image_3 || null,
        image_4: data.image_4 || null,
      };
      setOriginalImages(originalImagesData);

      // Set form values - handle different field names from your data structure
      formik.setValues({
        
        name: data.name || data.dealName || "",
        title: data.title || "",
        price: data.price || "",
        products: productsArray,
        alpha_pte: data.alpha_pte || "",
        save_rs: data.save_rs || data.discount || "", // Handle both save_rs and discount
        main_image: data.main_image || null,
        image_1: data.image_1 || null,
        image_2: data.image_2 || null,
        image_3: data.image_3 || null,
        image_4: data.image_4 || null,
        isPopular: data.isPopular || false,
      });

      setKeyFeatures(featuresArray);
    }
  }, [isOpen, formState, dealData]);

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
      setKeyFeatures([]);
      setOriginalImages({
        main_image: null,
        image_1: null,
        image_2: null,
        image_3: null,
        image_4: null,
      });
    }
  }, [isOpen]);

  // Function to remove selected product by name
  const removeSelectedProduct = (productNameToRemove) => {
    const updatedProducts = formik.values.products.filter(name => name !== productNameToRemove);
    formik.setFieldValue("products", updatedProducts);
  };

  // Function to render image with ability to remove or replace
  const renderImageField = (fieldName, label, currentValue) => {
    const hasExistingImage = currentValue && !(currentValue instanceof File);
    const hasNewImage = currentValue instanceof File;

    return (
      <div className={`border-dotted border-[#4755E5] border-1 rounded-md p-4 flex flex-col items-center justify-center ${
        formik.touched[fieldName] && formik.errors[fieldName] ? "border-red-500" : ""
      }`}>
        {hasNewImage || hasExistingImage ? (
          <div className="relative flex items-center justify-center">
            <img
              src={
                hasNewImage
                  ? URL.createObjectURL(currentValue)
                  : currentValue
              }
              alt={label}
              className="w-16 h-16 object-cover rounded-md"
            />
            <div className="absolute -top-2 -right-2">
              <div
                onClick={() => {
                  formik.setFieldValue(fieldName, null);
                  formik.setFieldError(fieldName, "");
                }}
                className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[12px] cursor-pointer"
              >
                ×
              </div>
            </div>
          </div>
        ) : (
          <label htmlFor={`${fieldName}Upload`} className="cursor-pointer flex flex-col items-center justify-center">
            <img src={checkout} className="w-8" alt="Upload" />
            <span className="text-green-500 text-center mt-1 text-[8px]">{label}</span>
            <input
              id={`${fieldName}Upload`}
              type="file"
              accept="image/jpeg, image/png"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                formik.setFieldValue(fieldName, file);
                formik.setTouched({ [fieldName]: true });
              }}
            />
          </label>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center backdrop-blur-md bg-gray-800/30 justify-center z-50">
        <div className="bg-white p-5 rounded-lg w-[95%] lg:w-[55%] 2xl:w-[40%] shadow-2xl max-h-[95vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title || "Edit Deal"}</h2>
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
                label="Description"
                placeholder="Enter Deal Description"
                type="text"
                error={formik.errors.title}
                touched={formik.touched.title}
                {...formik.getFieldProps("title")}
              />

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
                      valuesToSet = selectedValues;
                    } else if (selectedValues && selectedValues.target) {
                      const value = selectedValues.target.value;
                      if (Array.isArray(value)) {
                        valuesToSet = value;
                      } else if (value) {
                        valuesToSet = [value];
                      }
                    } else if (selectedValues) {
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
                  <div className="relative flex items-center justify-center">
                    <img
                      src={
                        formik.values.main_image instanceof File
                          ? URL.createObjectURL(formik.values.main_image)
                          : formik.values.main_image
                      }
                      alt="Main Image"
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="absolute -top-2 -right-2">
                      <div
                        onClick={() => {
                          formik.setFieldValue("main_image", null);
                          formik.setFieldError("main_image", "");
                        }}
                        className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[12px] cursor-pointer"
                      >
                        ×
                      </div>
                    </div>
                  </div>
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
                {renderImageField("image_1", "Image 1", formik.values.image_1)}
                {renderImageField("image_2", "Image 2", formik.values.image_2)}
                {renderImageField("image_3", "Image 3", formik.values.image_3)}
                {renderImageField("image_4", "Image 4", formik.values.image_4)}
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
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={formik.handleSubmit}
              className="px-8 py-2 bg-[#4755E5] text-white rounded-full cursor-pointer"
               disabled={mutation.isPending}
            >
              {mutation.isPending ? "Updating..." : "Update Deal"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditDeals;