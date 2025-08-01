import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputFields from "../../InputFields/InputFields";
import { uploadButton } from "../../../assets/index";

import { EditResultMutation} from "../../../Services/Editservice"
import toast, { Toaster } from "react-hot-toast";
import { fetchResults } from  "../../../Services/GetResults"

const EditVoucher = ({
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
  } = fetchResults("add-voucher", "/api/admin/categories-list/");

  const vendorOptions =
    categoriesApi?.data?.map((item) => ({
      label: item.name,
      value: item.id,
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

  console.log("formState", formState);

  // Formik Configuration
  const formik = useFormik({
    enableReinitialize: true, // This is key - allows form to reinitialize when initialValues change
    initialValues: {
      voucherName: formState?.name || "", // Add fallback empty string
      vendor: formState?.category || "",
      description: formState?.detail || "",
      price: formState?.price || "",
      // status: formState?.status || "", // Make sure this field is populated
      photo: null,
    },
    validationSchema: Yup.object({
      voucherName: Yup.string().required("Voucher Name is required"),
      vendor: Yup.string().required("Vendor is required"),
      description: Yup.string().required("Description is required"),
      price: Yup.number()
        .typeError("Price must be a number")
        .positive("Price must be positive")
        .required("Price is required"),
      // status: Yup.string().required("Status is required"),
      // photo: Yup.mixed()
      //   .test(
      //     "fileFormat",
      //     "Only JPEG and PNG formats are supported.",
      //     (value) => !value || ["image/jpeg", "image/png"].includes(value?.type)
      //   )
      //   .test(
      //     "fileSize",
      //     "File size must not exceed 5 MB.",
      //     (value) => !value || (value && value.size / (1024 * 1024) <= 5)
      //   ),
    }),
    onSubmit: (values) => {
      console.log("🚀 FORMIK ONSUBMIT CALLED!");
      console.log("Form submitted with values:", values);
      console.log("FormState ID:", formState?.id);
      
      const formData = new FormData();
      formData.append("name", values.voucherName);
      formData.append("category", values.vendor);
      formData.append("price", values.price);
      formData.append("detail", values.description);

      if (values.photo) {
        formData.append("image", values.photo);
      }

      // For edit mode, you need to add an ID field to identify which record to update
      if (formState?.id) {
        formData.append("id", formState.id);
      }

      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      console.log("🚀 CALLING MUTATION...");
      mutation.mutate(
        {
          payload: formData,
          path: "admin/add-it-voucher/",
        },
        {
          onSuccess: (data) => {
           
            toast.success("Voucher updated successfully!");
            formik.resetForm();
            setFormState(null);
            onClose();
          },
          onError: (error) => {
            console.error("Update error:", error);
            toast.error("Failed to update Vendor. Please try again.");
          },
        }
      );
    },
  });

  // Display existing image if available
  const [existingImage, setExistingImage] = useState(null);

  useEffect(() => {
    if (formState?.image) {
      setExistingImage(formState.image);
    }
  }, [formState]);

  // Alternative approach: Manually set values when formState changes
  useEffect(() => {
    if (isOpen && formState) {
      formik.setValues({
        voucherName: formState?.name || "",
        vendor: formState?.category || "",
        description: formState?.detail || "",
        price: formState?.price || "",
        // status: formState?.status || "",
        photo: null,
      });
    }
  }, [isOpen, formState]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
      setExistingImage(null);
      setFormState(null);
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
              label="Vendor"
              placeholder="Select Vendor"
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

            {/* Price Field */}
            <InputFields
              label="Price"
              placeholder="Enter Price"
              type="number"
              error={formik.errors.price}
              touched={formik.touched.price}
              {...formik.getFieldProps("price")}
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

            {/* Upload Photo */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo</label>
              <div
                className={`w-full border-dotted border-[#4755E5] border-2 rounded-md p-6 ${
                  formik.touched.photo && formik.errors.photo ? "border-red-500" : ""
                }`}
              >
                {!formik.values.photo ? (
                  <label
                    htmlFor="photoUpload"
                    className="cursor-pointer flex flex-col items-center justify-center py-4"
                  >
                    {/* Show existing image inside the upload area */}
                    {existingImage && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2 text-center">Current Image:</p>
                        <div className="relative inline-block">
                          <img
                            src={existingImage}
                            alt="Current Voucher"
                            className="w-24 h-24 object-cover rounded-md border shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setExistingImage(null);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm cursor-pointer hover:bg-red-600 shadow-md"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <img src={uploadButton} className="w-16 h-16 mb-3" alt="Upload" />
                    <span className="text-[#111217] text-[14px] font-medium mb-1">
                      {existingImage ? "Choose new file to replace" : "Drag & Drop or choose file to upload"}
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
                        setExistingImage(null); // Hide existing image when new one is selected
                      }}
                    />
                  </label>
                ) : (
                  <div className="relative flex items-center justify-center py-4">
                    <img
                      src={URL.createObjectURL(formik.values.photo)}
                      alt="New Upload"
                      className="w-32 h-32 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        formik.setFieldValue("photo", null);
                        formik.setFieldError("photo", "");
                        // Restore existing image if available
                        if (formState?.image) {
                          setExistingImage(formState.image);
                        }
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm cursor-pointer hover:bg-red-600 shadow-md"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              {formik.errors.photo && formik.touched.photo && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.photo}</p>
              )}
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
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditVoucher;