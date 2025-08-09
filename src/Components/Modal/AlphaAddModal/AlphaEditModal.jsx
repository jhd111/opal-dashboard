import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputFields from "../../InputFields/InputFields";
import { uploadButton, checkout } from "../../../assets/index";

import { fetchResults } from "../../../Services/GetResults";
import { EditResultMutation } from "../../../Services/Editservice";
import { AddResultMutation } from "../../../Services/AddResultService";
import { useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";

const AlphaEditModal = ({
  isOpen,
  onClose,
  title,
  nameLabel,
  formState,
  setFormState,
}) => {
  const mutation = EditResultMutation("alpha-crud");
  const queryClient = useQueryClient(); // Add this for manual invalidation

  console.log("formsataet", formState);

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
        voucher_files: formState.description || formState.description || "",
        expiry_date: formState.validity || formState.validity || "",
        price: formState.price,
        title: formState.title,
        photo: null, // Always start with null for new file uploads
        existing_image: formState.image, // Store existing image URL
      };
    } else {
      // Add mode - empty values
      return {
        product_name: "",
        voucher_files: "",
        expiry_date: "",
        price: "",
        title: "",
        photo: null,
        existing_image: "",
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
      price: Yup.number()
        .typeError("Price must be a number")
        .positive("Price must be a positive number")
        .required("Price is required"),
      title: Yup.string().required("Title is required"),
      // Photo is optional, so no required validation
      photo: Yup.mixed()
        .nullable()
        .test("fileType", "Only JPEG and PNG files are allowed", (value) => {
          if (!value) return true; // Allow null/empty values
          return ["image/jpeg", "image/png"].includes(value.type);
        })
        .test("fileSize", "File size must be less than 5MB", (value) => {
          if (!value) return true; // Allow null/empty values
          return value.size <= 5 * 1024 * 1024; // 5MB
        }),
    }),
    onSubmit: (values) => {
      const formData = new FormData();

      // Append form fields
      formData.append("name", values.product_name || "");
      formData.append("description", values.voucher_files || "");
      formData.append("validity", values.expiry_date || "");
      // formData.append("type", values.type || "");
      formData.append("price", values.price || "");
      formData.append("title", values.title);

      // Only append photo if a new file was selected
      if (values.photo) {
        formData.append("image", values.photo);
      }

      // If editing, append the ID
      if (isEditMode && formState.id) {
        formData.append("id", formState.id);
      }

      // Determine the API path based on mode
      const apiPath = isEditMode
        ? "admin/edit-inventory-by-admin/"
        : "admin/add-inventory-by-admin/";

      mutation.mutate(
        {
          payload: formData,
          path: "admin/alpha-crud/",
          queryKey: "alpha-crud",
        },
        {
          onSuccess: (data) => {
            console.log("Edit successful, invalidating cache...");

            // Force invalidate and refetch the inventory list
            queryClient.invalidateQueries(["alpha-crud"]);
            queryClient.refetchQueries(["alpha-crud"]);

            // Also try without array (in case fetchResults uses string format)
            queryClient.invalidateQueries("alpha-crud");
            queryClient.refetchQueries("alpha-crud");

            toast.success(
              `Alpha Pte ${isEditMode ? "updated" : "created"} successfully!`
            );
            formik.resetForm();
            onClose();
          },
          onError: (error) => {
            console.error("Edit error:", error);
            toast.error(
              `Failed to ${
                isEditMode ? "update" : "create"
              } inventory. Please try again.`
            );
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
              {isEditMode ? ` ${title}` : title}
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
              {/* Product Name Field */}
              <InputFields
                label="Product Name"
                placeholder="Enter Product Name"
                type="text"
                error={formik.errors.product_name}
                touched={formik.touched.product_name}
                {...formik.getFieldProps("product_name")}
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

              {/* Title Field */}
              <InputFields
                label="Title"
                placeholder="Enter Title"
                type="text"
                error={formik.errors.title}
                touched={formik.touched.title}
                {...formik.getFieldProps("title")}
              />

              {/* Voucher Files Field */}
              <InputFields
                label="Validity"
                placeholder="Enter validity"
                type="text"
                error={formik.errors.expiry_date}
                touched={formik.touched.expiry_date}
                {...formik.getFieldProps("expiry_date")}
              />

              {/* Description Field */}
              <InputFields
                label="Description"
                placeholder="Enter voucher description"
                textarea
                rows={4}
                error={formik.errors.voucher_files}
                touched={formik.touched.voucher_files}
                {...formik.getFieldProps("voucher_files")}
              />

              {/* Photo Upload Field - Optional */}

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Photo
                </label>
                <div
                  className={`w-full border-2 border-dashed rounded-md p-4 transition-colors ${
                    formik.touched.photo && formik.errors.photo
                      ? "border-red-500 bg-red-50"
                      : "border-[#4755E5] hover:border-[#3d4ed8] bg-gray-50"
                  }`}
                >
                  <div className="mt-4">
                    {!formik.values.photo && !formik.values.existing_image ? (
                      // Upload UI - Show when no photo AND no existing image
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
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              await formik.setFieldValue("photo", file);
                              await formik.setFieldTouched("photo", true);
                              formik.validateField("photo");
                            }
                          }}
                        />
                      </label>
                    ) : (
                      // Image preview - Show when there's either a new photo OR existing image
                      <div className="relative flex items-center justify-center">
                        <img
                          src={
                            formik.values.photo instanceof File
                              ? URL.createObjectURL(formik.values.photo)
                              : formik.values.existing_image // Use existing_image when no new photo
                          }
                          alt="Uploaded"
                          className="w-28 object-cover rounded-md"
                        />
                        <div className="absolute -top-2 right-36">
                          <div
                            onClick={() => {
                              formik.setFieldValue("photo", null);
                              formik.setFieldValue("existing_image", ""); // Clear existing image too
                              formik.setFieldError("photo", "");
                              // Reset the file input
                              const fileInput =
                                document.getElementById("photoUpload");
                              if (fileInput) fileInput.value = "";
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
                {formik.errors.photo && formik.touched.photo && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="mr-1">⚠</span>
                    {formik.errors.photo}
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-6 space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-full hover:text-gray-800 hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="px-8 py-2 bg-[#4755E5] text-white rounded-full hover:bg-[#3d4ed8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {formik.isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update Alfa Pte Voucher"
                  : "Updating"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AlphaEditModal;
