import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputFields from "../../InputFields/InputFields";
import { uploadButton } from "../../../assets/index";

import { EditResultMutation} from "../../../Services/Editservice"
import toast, { Toaster } from "react-hot-toast";

const EditVendor = ({
  isOpen,
  onClose,
  title,
  nameLabel,
  formState,
  setFormState,
  category,
}) => {
  console.log("EditVendor formState:", formState);
  const mutation = EditResultMutation(["add-vendors"]);

  console.log("Mutation state:", {
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess
  });
  
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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: formState?.name || '',
      // status: String(formState?.is_it_voucher ?? ''),
      photo: formState?.voucher_image || null,
      description:formState?.description,
      price :formState?.price
    },
    validationSchema: Yup.object({
      name: Yup.string().required(`${nameLabel} is required`),
      // status: Yup.string().required("Status is required"),
      // photo: Yup.mixed()
      //   .test(
      //     "fileFormat",
      //     "Only JPEG and PNG formats are supported.",
      //     (value) =>
      //       !value || ["image/jpeg", "image/png"].includes(value?.type)
      //   )
      //   .test(
      //     "fileSize",
      //     "File size must not exceed 5 MB.",
      //     (value) => !value || value.size / (1024 * 1024) <= 5
      //   ),
    }),
    onSubmit: (values) => {
      console.log("🚀 FORMIK ONSUBMIT CALLED!");
      console.log("Form submitted with values:", values);
      console.log("FormState ID:", formState?.id);
      
      const formData = new FormData();
      formData.append("name", values.name);
      // formData.append("is_it_voucher",true);
      formData.append("is_it_voucher", category ? false : true);
      
      // Only append image if a new file is selected (File object)
      if (values.photo && values.photo instanceof File) {
        formData.append("voucher_image", values.photo); // Changed from voucher_image to image
      }
      if (category && values.description)
      {
         formData.append('description',values.description)
      }
      if(category&& values.price){
        formData.append("price", values.price);
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
          path: "admin/add-vendors/", // Full path since we removed /api from service
        },
        {
          onSuccess: (data) => {
            console.log("Update success:", data);
            toast.success("Vendor updated successfully!");
            formik.resetForm();
            setFormState(null); // Clear form state
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

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);

  // Early return if modal is not open OR formState is null/undefined
  if (!isOpen || !formState) {
    console.log("Modal not rendering - isOpen:", isOpen, "formState:", formState);
    return null;
  }

  const existingImage =
    typeof formState.voucher_image === "string" ? formState.voucher_image : null;

  return (
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
        <form onSubmit={(e) => {
          console.log("Form onSubmit triggered");
          e.preventDefault();
          formik.handleSubmit(e);
        }}>
          {/* Name Field */}
          <InputFields
            label={nameLabel}
            placeholder="Enter Name"
            type="text"
            error={formik.errors.name}
            touched={formik.touched.name}
            {...formik.getFieldProps("name")}
          />
     {/* price Field */}
     {category &&
             <InputFields
              label="Price"
              placeholder="Enter Price"
              type="text"
              error={formik.errors.price}
              touched={formik.touched.price}
              {...formik.getFieldProps("price")}
            />
     }
          {/* description Field */}

          {category &&
             <InputFields
              label="description"
              placeholder="Enter description"
              type="text"
              error={formik.errors.description}
              touched={formik.touched.description}
              {...formik.getFieldProps("description")}
            />
             }

          {/* Status Dropdown */}
          {/* <InputFields
            label="IT Voucher"
            placeholder="Select IT Voucher"
            isSelect={true}
            options={[
              { value: "true", label: "Active" },
              { value: "false", label: "Inactive" },
            ]}
            error={formik.errors.status}
            touched={formik.touched.status}
            {...formik.getFieldProps("status")}
          /> */}

          {/* Upload Photo */}
          {/* {!category && ( */}
          <div className="mt-4">
            {!formik.values.photo ? (
              // Upload UI
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
                    formik.values.photo instanceof File
                      ? URL.createObjectURL(formik.values.photo)
                      : formik.values.photo
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
              </div>
            )}
          </div>
          {/* )} */}

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
              disabled={mutation.isLoading}
              onClick={(e) => {
                console.log("Update button clicked");
                console.log("Form is valid:", formik.isValid);
                console.log("Form errors:", formik.errors);
                console.log("Form values:", formik.values);
              }}
              className="px-8 py-2 bg-[#4755E5] text-white rounded-full cursor-pointer disabled:opacity-50"
            >
              {mutation.isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVendor;