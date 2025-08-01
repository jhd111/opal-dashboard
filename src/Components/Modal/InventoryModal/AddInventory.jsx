import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputFields from "../../InputFields/InputFields";
import { uploadButton, checkout } from "../../../assets/index";

import { fetchResults } from  "../../../Services/GetResults"
import { AddResultMutation } from "../../../Services/AddResultService";
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

  const mutation = AddResultMutation();

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

  // Formik Configuration
  const formik = useFormik({
    initialValues: {
      product_name: "",
      voucher_files: "",
      expiry_date: "",
      type: "",
    },
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

      mutation.mutate(
        {
          payload: formData,
          path: "admin/add-inventory-by-admin/",
          queryKey: "our-inventory",
        },
        {
          onSuccess: (data) => {
            toast.success("inventory created successfully!");
            formik.resetForm();
            onClose();
          },
          onError: (error) => {
            toast.error("Failed to create inventory. Please try again.");
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
              <InputFields
                label="Voucher Files"
                placeholder="Enter Voucher Files"
                type="text"
                error={formik.errors.voucher_files}
                touched={formik.touched.voucher_files}
                {...formik.getFieldProps("voucher_files")}
              />

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
                Publish Deal
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddInventory;