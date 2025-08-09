import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputFields from "../../InputFields/InputFields";
import { uploadButton, checkout } from "../../../assets/index";

import { fetchResults } from  "../../../Services/GetResults"
import { AddResultMutation } from "../../../Services/AddResultService";
import toast, { Toaster } from "react-hot-toast";

const AddAlpha = ({
  isOpen,
  onClose,
  title,
  nameLabel,
  formState,
  setFormState,
}) => {

  const mutation = AddResultMutation();

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

  // Formik Configuration
  const formik = useFormik({
    initialValues: {
      product_name: "",
      voucher_files: "",
      expiry_date: "",
      price: "",
      title: "",
      photo: null
    },
    validationSchema: Yup.object({
      product_name: Yup.string().required("Product name is required"),
      voucher_files: Yup.string().required("Voucher files is required"),
      expiry_date: Yup.string().required("Expiry date is required"),
      price: Yup.number()
        .typeError("Price must be a number")
        .positive("Price must be a positive number")
        .required("Price is required"),
      title: Yup.string().required("Title is required"),
      photo: Yup.mixed()
        .required("Photo is required")
        .test("fileType", "Only JPEG and PNG files are allowed", (value) => {
          if (!value) return false;
          return ["image/jpeg", "image/png"].includes(value.type);
        })
        .test("fileSize", "File size must be less than 5MB", (value) => {
          if (!value) return false;
          return value.size <= 5 * 1024 * 1024; // 5MB
        })
    }),
    onSubmit: (values) => {
      const formData = new FormData();

      // Append form fields
      formData.append("name", values.product_name || "");
      formData.append("description", values.voucher_files || "");
      formData.append("validity", values.expiry_date || "");
      formData.append("price", values.price || "");
      formData.append("title", values.title || "");
      
      // Append photo if exists
      if (values.photo) {
        formData.append("image", values.photo);
      }

      mutation.mutate(
        {
          payload: formData,
          path: "admin/alpha-crud/",
          queryKey: "alpha-crud",
        },
        {
          onSuccess: (data) => {
            toast.success("Alpha Pte created successfully!");
            formik.resetForm();
            onClose();
          },
          onError: (error) => {
            toast.error("Failed to create Alpha Pte. Please try again.");
            formik.resetForm();
            onClose();
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

              {/* Expiry Date Field */}
              <InputFields
                label="Validty"
                placeholder="Enter validty"
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

              {/* Photo Upload Field */}
              {/* Photo Upload Field */}
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
                  {!formik.values.photo ? (
                    <label
                      htmlFor="photoUpload"
                      className="cursor-pointer flex flex-col items-center justify-center py-4"
                    >
                      <img src={uploadButton} className="w-16 h-16 mb-2" alt="Upload" />
                      <span className="text-[#111217] text-[14px] font-medium mb-1">
                        Drag & Drop or choose file to upload
                      </span>
                      <span className="text-[#A4A5AB] text-[12px]">
                        Supported formats: JPEG, PNG (Max: 5MB)
                      </span>
                      <input
                        id="photoUpload"
                        type="file"
                        accept="image/jpeg, image/png"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            // Set the field value first
                            await formik.setFieldValue("photo", file);
                            
                            // Mark field as touched
                            await formik.setFieldTouched("photo", true);
                            
                            // Validate the specific field to clear any errors
                            formik.validateField("photo");
                          }
                        }}
                      />
                    </label>
                  ) : (
                    <div className="relative flex items-center justify-center py-4">
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(formik.values.photo)}
                          alt="Uploaded"
                          className="w-32 h-32 object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            // Reset the file input first
                            const fileInput = document.getElementById("photoUpload");
                            if (fileInput) fileInput.value = "";
                            
                            // Clear formik values
                            await formik.setFieldValue("photo", null);
                            await formik.setFieldTouched("photo", true);
                            
                            // Validate to show the required error again
                            formik.validateField("photo");
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-[14px] font-bold transition-colors"
                        >
                          ×
                        </button>
                      </div>
                      <div className="ml-4 text-left">
                        <p className="text-sm font-medium text-gray-700">
                          {formik.values.photo.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(formik.values.photo.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  )}
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
                {formik.isSubmitting ? "Adding..." : "Add Alfa Pte Voucher"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddAlpha;