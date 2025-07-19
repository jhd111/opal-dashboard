import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputFields from "../../InputFields/InputFields";
import { uploadButton } from "../../../assets/index";

const AddVoucher = ({
  isOpen,
  onClose,
  title,
  nameLabel,
  formState,
  setFormState,
}) => {
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
      voucherName: "", // Voucher Name
      vendor: "",       // Vendor
      description: "",  // Description
      price: "",        // Price
      status: "",       // Status
      photo: null,      // File upload field
    },
    validationSchema: Yup.object({
      voucherName: Yup.string().required("Voucher Name is required"),
      vendor: Yup.string().required("Vendor is required"),
      description: Yup.string().required("Description is required"),
      price: Yup.number()
        .typeError("Price must be a number")
        .positive("Price must be positive")
        .required("Price is required"),
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
    }),
    onSubmit: (values) => {
      console.log("Form values:", { ...values });
      handleSubmit(values);
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
              options={[
                { value: "CompTIA", label: "CompTIA" },
                { value: "AWS", label: "AWS" },
                // Add more vendors as needed
              ]}
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
            <InputFields
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
            />

            {/* Upload Photo */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Upload Photo</label>
              <div
                className={`w-full border-dotted border-[#4755E5] border-1 rounded-md mt-2 mb-2 p-4 ${
                  formik.touched.photo && formik.errors.photo ? "border-red-500" : ""
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
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddVoucher;