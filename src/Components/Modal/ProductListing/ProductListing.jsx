import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputFields from "../../InputFields/InputFields";
import { uploadButton } from "../../../assets/index";

import { AddResultMutation } from "../../../Services/AddResultService";
import toast, { Toaster } from "react-hot-toast";
import { fetchResults } from  "../../../Services/GetResults"

const AddVoucher = ({
  isOpen,
  onClose,
  title,
  nameLabel,
  formState,
  setFormState,
}) => {
  const mutation = AddResultMutation();
  
  // State for managing country pricing entries
  const [countryPricingEntries, setCountryPricingEntries] = useState([
    { country: "", price: "" }
  ]);

// Countries list for dropdown
const countries = [
  { value: "af", label: "Afghanistan" },
  { value: "al", label: "Albania" },
  { value: "dz", label: "Algeria" },
  { value: "ad", label: "Andorra" },
  { value: "ao", label: "Angola" },
  { value: "ag", label: "Antigua and Barbuda" },
  { value: "ar", label: "Argentina" },
  { value: "am", label: "Armenia" },
  { value: "au", label: "Australia" },
  { value: "at", label: "Austria" },
  { value: "az", label: "Azerbaijan" },
  { value: "bs", label: "Bahamas" },
  { value: "bh", label: "Bahrain" },
  { value: "bd", label: "Bangladesh" },
  { value: "bb", label: "Barbados" },
  { value: "by", label: "Belarus" },
  { value: "be", label: "Belgium" },
  { value: "bz", label: "Belize" },
  { value: "bj", label: "Benin" },
  { value: "bt", label: "Bhutan" },
  { value: "bo", label: "Bolivia" },
  { value: "ba", label: "Bosnia and Herzegovina" },
  { value: "bw", label: "Botswana" },
  { value: "br", label: "Brazil" },
  { value: "bn", label: "Brunei" },
  { value: "bg", label: "Bulgaria" },
  { value: "bf", label: "Burkina Faso" },
  { value: "bi", label: "Burundi" },
  { value: "cv", label: "Cabo Verde" },
  { value: "kh", label: "Cambodia" },
  { value: "cm", label: "Cameroon" },
  { value: "ca", label: "Canada" },
  { value: "cf", label: "Central African Republic" },
  { value: "td", label: "Chad" },
  { value: "cl", label: "Chile" },
  { value: "cn", label: "China" },
  { value: "co", label: "Colombia" },
  { value: "km", label: "Comoros" },
  { value: "cg", label: "Congo" },
  { value: "cd", label: "Democratic Republic of the Congo" },
  { value: "cr", label: "Costa Rica" },
  { value: "hr", label: "Croatia" },
  { value: "cu", label: "Cuba" },
  { value: "cy", label: "Cyprus" },
  { value: "cz", label: "Czechia" },
  { value: "dk", label: "Denmark" },
  { value: "dj", label: "Djibouti" },
  { value: "dm", label: "Dominica" },
  { value: "do", label: "Dominican Republic" },
  { value: "ec", label: "Ecuador" },
  { value: "eg", label: "Egypt" },
  { value: "sv", label: "El Salvador" },
  { value: "gq", label: "Equatorial Guinea" },
  { value: "er", label: "Eritrea" },
  { value: "ee", label: "Estonia" },
  { value: "sz", label: "Eswatini" },
  { value: "et", label: "Ethiopia" },
  { value: "fj", label: "Fiji" },
  { value: "fi", label: "Finland" },
  { value: "fr", label: "France" },
  { value: "ga", label: "Gabon" },
  { value: "gm", label: "Gambia" },
  { value: "ge", label: "Georgia" },
  { value: "de", label: "Germany" },
  { value: "gh", label: "Ghana" },
  { value: "gr", label: "Greece" },
  { value: "gd", label: "Grenada" },
  { value: "gt", label: "Guatemala" },
  { value: "gn", label: "Guinea" },
  { value: "gw", label: "Guinea-Bissau" },
  { value: "gy", label: "Guyana" },
  { value: "ht", label: "Haiti" },
  { value: "hn", label: "Honduras" },
  { value: "hu", label: "Hungary" },
  { value: "is", label: "Iceland" },
  { value: "in", label: "India" },
  { value: "id", label: "Indonesia" },
  { value: "ir", label: "Iran" },
  { value: "iq", label: "Iraq" },
  { value: "ie", label: "Ireland" },
  { value: "il", label: "Israel" },
  { value: "it", label: "Italy" },
  { value: "jm", label: "Jamaica" },
  { value: "jp", label: "Japan" },
  { value: "jo", label: "Jordan" },
  { value: "kz", label: "Kazakhstan" },
  { value: "ke", label: "Kenya" },
  { value: "ki", label: "Kiribati" },
  { value: "kw", label: "Kuwait" },
  { value: "kg", label: "Kyrgyzstan" },
  { value: "la", label: "Laos" },
  { value: "lv", label: "Latvia" },
  { value: "lb", label: "Lebanon" },
  { value: "ls", label: "Lesotho" },
  { value: "lr", label: "Liberia" },
  { value: "ly", label: "Libya" },
  { value: "li", label: "Liechtenstein" },
  { value: "lt", label: "Lithuania" },
  { value: "lu", label: "Luxembourg" },
  { value: "mg", label: "Madagascar" },
  { value: "mw", label: "Malawi" },
  { value: "my", label: "Malaysia" },
  { value: "mv", label: "Maldives" },
  { value: "ml", label: "Mali" },
  { value: "mt", label: "Malta" },
  { value: "mh", label: "Marshall Islands" },
  { value: "mr", label: "Mauritania" },
  { value: "mu", label: "Mauritius" },
  { value: "mx", label: "Mexico" },
  { value: "fm", label: "Micronesia" },
  { value: "md", label: "Moldova" },
  { value: "mc", label: "Monaco" },
  { value: "mn", label: "Mongolia" },
  { value: "me", label: "Montenegro" },
  { value: "ma", label: "Morocco" },
  { value: "mz", label: "Mozambique" },
  { value: "mm", label: "Myanmar" },
  { value: "na", label: "Namibia" },
  { value: "nr", label: "Nauru" },
  { value: "np", label: "Nepal" },
  { value: "nl", label: "Netherlands" },
  { value: "nz", label: "New Zealand" },
  { value: "ni", label: "Nicaragua" },
  { value: "ne", label: "Niger" },
  { value: "ng", label: "Nigeria" },
  { value: "kp", label: "North Korea" },
  { value: "mk", label: "North Macedonia" },
  { value: "no", label: "Norway" },
  { value: "om", label: "Oman" },
  { value: "pk", label: "Pakistan" },
  { value: "ps", label: "Palestine State" },
  { value: "pa", label: "Panama" },
  { value: "pg", label: "Papua New Guinea" },
  { value: "py", label: "Paraguay" },
  { value: "pe", label: "Peru" },
  { value: "ph", label: "Philippines" },
  { value: "pl", label: "Poland" },
  { value: "pt", label: "Portugal" },
  { value: "qa", label: "Qatar" },
  { value: "ro", label: "Romania" },
  { value: "ru", label: "Russia" },
  { value: "rw", label: "Rwanda" },
  { value: "kn", label: "Saint Kitts and Nevis" },
  { value: "lc", label: "Saint Lucia" },
  { value: "vc", label: "Saint Vincent and the Grenadines" },
  { value: "ws", label: "Samoa" },
  { value: "sm", label: "San Marino" },
  { value: "st", label: "Sao Tome and Principe" },
  { value: "sa", label: "Saudi Arabia" },
  { value: "sn", label: "Senegal" },
  { value: "rs", label: "Serbia" },
  { value: "sc", label: "Seychelles" },
  { value: "sl", label: "Sierra Leone" },
  { value: "sg", label: "Singapore" },
  { value: "sk", label: "Slovakia" },
  { value: "si", label: "Slovenia" },
  { value: "sb", label: "Solomon Islands" },
  { value: "so", label: "Somalia" },
  { value: "za", label: "South Africa" },
  { value: "kr", label: "South Korea" },
  { value: "ss", label: "South Sudan" },
  { value: "es", label: "Spain" },
  { value: "lk", label: "Sri Lanka" },
  { value: "sd", label: "Sudan" },
  { value: "sr", label: "Suriname" },
  { value: "se", label: "Sweden" },
  { value: "ch", label: "Switzerland" },
  { value: "sy", label: "Syria" },
  { value: "tj", label: "Tajikistan" },
  { value: "tz", label: "Tanzania" },
  { value: "th", label: "Thailand" },
  { value: "tl", label: "Timor-Leste" },
  { value: "tg", label: "Togo" },
  { value: "to", label: "Tonga" },
  { value: "tt", label: "Trinidad and Tobago" },
  { value: "tn", label: "Tunisia" },
  { value: "tr", label: "Turkey" },
  { value: "tm", label: "Turkmenistan" },
  { value: "tv", label: "Tuvalu" },
  { value: "ug", label: "Uganda" },
  { value: "ua", label: "Ukraine" },
  { value: "ae", label: "United Arab Emirates" },
  { value: "gb", label: "United Kingdom" },
  { value: "us", label: "United States" },
  { value: "uy", label: "Uruguay" },
  { value: "uz", label: "Uzbekistan" },
  { value: "vu", label: "Vanuatu" },
  { value: "va", label: "Vatican City" },
  { value: "ve", label: "Venezuela" },
  { value: "vn", label: "Vietnam" },
  { value: "ye", label: "Yemen" },
  { value: "zm", label: "Zambia" },
  { value: "zw", label: "Zimbabwe" }
];



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

  console.log("vendorOptions",vendorOptions)

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

  // Helper function to check if selected category is Alpha Pte
  const shouldShowAlphaPteFields = (selectedVendorId) => {
    const categoryName = getCategoryNameById(selectedVendorId);
    return categoryName === "Alpha Pte";
  };

  // Helper function to check if selected category is Pearson Pte Voucher
  const shouldShowPearsonPteFields = (selectedVendorId) => {
    const categoryName = getCategoryNameById(selectedVendorId);
    return categoryName === "Pearson PTE Voucher" || categoryName === "Pearson Pte Voucher";
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

  // Function to add new country pricing entry
  const addCountryPricingEntry = () => {
    setCountryPricingEntries([...countryPricingEntries, { country: "", price: "" }]);
  };

  // Function to remove country pricing entry
  const removeCountryPricingEntry = (index) => {
    if (countryPricingEntries.length > 1) {
      const updatedEntries = countryPricingEntries.filter((_, i) => i !== index);
      setCountryPricingEntries(updatedEntries);
    }
  };

  // Function to update country pricing entry
  const updateCountryPricingEntry = (index, field, value) => {
    const updatedEntries = [...countryPricingEntries];
    updatedEntries[index][field] = value;
    setCountryPricingEntries(updatedEntries);
  };

  // Formik Configuration
  const formik = useFormik({
    initialValues: {
      voucherName: "", // Voucher Name
      vendor: "", // Vendor
      description: "", // Description
      validity: "", // Validity
      type: "", // Type
      price: 0, // Price
      status: "", // Status
      photo: null, // File upload field
      // Alpha Pte fields
      alphaPteTitle: "",
      alphaPteValidity: "",
    },
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
        is: (vendorId) => !shouldShowPearsonPteFields(vendorId),
        then: (schema) => schema
          .typeError("Price must be a number")
          .positive("Price must be positive")
          .required("Price is required"),
        otherwise: (schema) => schema.typeError("Price must be a number"),
      }),
      status: Yup.string().required("Status is required"),
      photo: Yup.mixed()
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
      // Alpha Pte validations
      alphaPteTitle: Yup.string().when("vendor", {
        is: (vendorId) => shouldShowAlphaPteFields(vendorId),
        then: (schema) => schema.required("Title is required"),
        otherwise: (schema) => schema,
      }),
      alphaPteValidity: Yup.string().when("vendor", {
        is: (vendorId) => shouldShowAlphaPteFields(vendorId),
        then: (schema) => schema.required("Validity is required"),
        otherwise: (schema) => schema,
      }),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("name", values.voucherName);
      formData.append("category", values.vendor);
      formData.append("description", values.description);
      formData.append("status", values.status);
      
      // Handle different category-specific fields
      if (shouldShowValidityField(values.vendor)) {
        formData.append("validity", values.validity);
      }
      
      if (shouldShowTypeDropdown(values.vendor)) {
        formData.append("type", values.type);
      }

      // Alpha Pte fields
      if (shouldShowAlphaPteFields(values.vendor)) {
        formData.append("title", values.alphaPteTitle);
        formData.append("validity", values.alphaPteValidity);
        formData.append("price", values.price);
      }

      // Pearson Pte Voucher fields
      if (shouldShowPearsonPteFields(values.vendor)) {
        // Build country_pricing object
        const countryPricing = {};
        countryPricingEntries.forEach(entry => {
          if (entry.country && entry.price) {
            countryPricing[entry.country] = parseFloat(entry.price);
          }
        });
        
        if (Object.keys(countryPricing).length > 0) {
          formData.append("country_pricing", JSON.stringify(countryPricing));
        }
        formData.append("price", values.price);
      } else {
        // For non-Pearson categories, append regular price
        // if (!shouldShowAlphaPteFields(values.vendor)) {
          formData.append("price", values.price);
        // }
      }

      if (values.photo) {
        formData.append("image", values.photo);
      }

      mutation.mutate(
        {
          payload: formData,
          path: "admin/add-it-voucher/",
          queryKey: "add-voucher",
        },
        {
          onSuccess: (data) => {
            toast.success("Vendor created successfully!");
            formik.resetForm();
            setCountryPricingEntries([{ country: "", price: "" }]);
            onClose();
          },
          onError: (error) => {
            toast.error("Failed to create Vendor. Please try again.");
          },
        }
      );
    },
  });

  // Reset fields when vendor changes
  useEffect(() => {
    if (formik.values.vendor) {
      if (!shouldShowTypeDropdown(formik.values.vendor)) {
        formik.setFieldValue("type", "");
      }
      if (!shouldShowValidityField(formik.values.vendor)) {
        formik.setFieldValue("validity", "");
      }
      if (!shouldShowAlphaPteFields(formik.values.vendor)) {
        formik.setFieldValue("alphaPteTitle", "");
        formik.setFieldValue("alphaPteValidity", "");
      }
      if (shouldShowPearsonPteFields(formik.values.vendor)) {
        formik.setFieldValue("price", "");
        setCountryPricingEntries([{ country: "", price: "" }]);
      }
    }
  }, [formik.values.vendor]);

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
      setCountryPricingEntries([{ country: "", price: "" }]);
    }
  }, [isOpen]);

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

            {/* Alpha Pte Title Field */}
            {shouldShowAlphaPteFields(formik.values.vendor) && (
              <InputFields
                label="Title"
                placeholder="Enter Title"
                type="text"
                error={formik.errors.alphaPteTitle}
                touched={formik.touched.alphaPteTitle}
                {...formik.getFieldProps("alphaPteTitle")}
              />
            )}

            {/* Alpha Pte Validity Field */}
            {shouldShowAlphaPteFields(formik.values.vendor) && (
              <InputFields
                label="Validity"
                placeholder="Enter Validity"
                type="text"
                error={formik.errors.alphaPteValidity}
                touched={formik.touched.alphaPteValidity}
                {...formik.getFieldProps("alphaPteValidity")}
              />
            )}

            {/* Existing Validity Field - Show only for ape uni or APE UNI */}
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

            {/* Pearson Pte Voucher Country Pricing */}
            {shouldShowPearsonPteFields(formik.values.vendor) && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country Pricing
                </label>
                {countryPricingEntries.map((entry, index) => (
                  <div key={index} className="flex items-end gap-2 mb-3">
                    <div className="flex-1">
                      <InputFields
                        label={index === 0 ? "Country" : ""}
                        placeholder="Select Country"
                        isSelect={true}
                        options={countries}
                        value={entry.country}
                        onChange={(e) => updateCountryPricingEntry(index, "country", e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <InputFields
                        label={index === 0 ? "Price" : ""}
                        placeholder="Enter Price"
                        type="number"
                        value={entry.price}
                        onChange={(e) => updateCountryPricingEntry(index, "price", e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={addCountryPricingEntry}
                        className="bg-[#4755E5] text-white rounded-full w-8 h-8 flex justify-center text-lg hover:bg-[#3d4ed8] transition-colors"
                      >
                        +
                      </button>
                      {countryPricingEntries.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCountryPricingEntry(index)}
                          className="bg-red-500 text-white rounded-full w-8 h-8 flex  justify-center text-lg hover:bg-red-600 transition-colors"
                        >
                          -
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Regular Price Field - Show for non-Pearson categories */}
            {/* {!shouldShowPearsonPteFields(formik.values.vendor) && ( */}
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
              {...formik.getFieldProps("status")}
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
                {!formik.values.photo ? (
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
                      src={URL.createObjectURL(formik.values.photo)}
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
                  </div>
                )}
              </div>
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
                 {mutation.isPending ?"Adding..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddVoucher;