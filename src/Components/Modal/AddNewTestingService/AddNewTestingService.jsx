import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputFields from "../../InputFields/InputFields";
import { AddResultMutation} from "../../../Services/AddResultService"
import toast, { Toaster } from "react-hot-toast";
import Loader from "../../Loader/Loader"

const AddNewTestingService = ({
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

  const mutation = AddResultMutation();
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(`${nameLabel} is required`),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      
      if (values.resultImage) {
        formData.append("image", values.resultImage);
      }

      mutation.mutate(
        {
          payload: formData,
          path: "admin/create-testing-service/",
          queryKey: "testing-services", // 👈 Add this to enable refetch
        },
        {
          onSuccess: (data) => {
            toast.success("Service created successfully!");
            formik.resetForm(); // Reset form after successful submission
            onClose(); // Close modal on success
          },
          onError: (error) => {
            toast.error("Failed to create service. Please try again.");
          },
        }
      );
    },
  });

  useEffect(() => {
    if (!isOpen) {
    //   Reset Formik
      formik.resetForm();
    // //   Reset formState
    //   setFormState({ name: "" });
    }
  }, [isOpen,formState]);

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
            {/* Name Field */}
            <InputFields
              label={nameLabel}
              placeholder="Enter Student Name"
              type="text"
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
                {mutation.isPending ? "Adding..." : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddNewTestingService;