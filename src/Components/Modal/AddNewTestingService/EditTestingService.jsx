import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputFields from "../../InputFields/InputFields";

import toast, { Toaster } from "react-hot-toast";
import { AddResultMutation} from "../../../Services/AddResultService"
const EditNewTestingService = ({
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

  console.log("formState in edit",formState)

  const mutation = AddResultMutation();
  const formik = useFormik({
    enableReinitialize: true, // ✅ Important for updating values on edit
    initialValues: {
      name: formState?.servicename , // Safely access serviceName
    },
    validationSchema: Yup.object({
      name: Yup.string().required(`${nameLabel} is required`),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
   
      // For edit mode, you might want to add an ID field to identify which record to update
      // If you have an ID in formState, add it to the formData
      if (formState?.id) {
        formData.append("id", formState.id);
      }

      mutation.mutate(
        {
          payload: formData,
          path: "admin/manage-testing-service/", // You might want to change this to an edit endpoint
          queryKey:"testing-services"
        },
        {
          onSuccess: (data) => {
            toast.success("Testing Service updated successfully!");
            formik.resetForm();
            setFormState(null); // Clear form state
            onClose();
          },
          onError: (error) => {
            toast.error("Failed to update Testing Service . Please try again.");
          },
        }
      );
    },
  });

  // // Optional: Sync formState with Formik changes
  // useEffect(() => {
  //   formik.setValues({
  //     name: formState?.serviceName || "",
  //   });
  // }, [formState]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);

  // Log current name value
  useEffect(() => {
    console.log("Formik name value:", formik.values.name);
  }, [formik.values.name]);

  if (!isOpen) return null;

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

        <form onSubmit={formik.handleSubmit} className="">
          {/* Name Field */}
          <InputFields
            label={nameLabel}
            placeholder="Enter Service Name"
            type="text"
            value={formik.values.name}
            error={formik.errors.name}
            touched={formik.touched.name}
            {...formik.getFieldProps("name")}
          />

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
              className="px-8 py-2 bg-[#4755E5] text-white rounded-full cursor-pointer"
              disabled={mutation.isPending} // Disable cancel button during loading
            >
              {mutation.isPending ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNewTestingService;