import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AddResultMutation } from "../../../Services/AddResultService";
import toast, { Toaster } from "react-hot-toast";

const ContactModal = ({
  isOpen,
  formState,
  setFormState,
  onClose,
  tablecompose,
}) => {
  const mutation = AddResultMutation();

  // Prevent background scroll
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
      to: tablecompose ? formState.email : "",
      // from: "",
      subject: "",
      message: "",
    },
    validationSchema: Yup.object({
      to: Yup.string().email("Invalid email").required("To is required"),
      // from: Yup.string().email("Invalid email").required("From is required"),
      subject: Yup.string().required("Subject is required"),
      message: Yup.string().required("Message is required"),
    }),
    onSubmit: (values) => {
      const formData = new FormData();

      // Append form fields
      formData.append("email", values.to || "");
      formData.append("message", values.message || "");
      formData.append("subject", values.subject || "");
      // formData.append("type", values.type || "");

      mutation.mutate(
        {
          payload: formData,
          path: "admin/get-contact-us/",
          queryKey: "get-contact-us",
        },
        {
          onSuccess: (data) => {
            toast.success("email Sent successfully!");
            formik.resetForm();
            onClose();
          },
          onError: (error) => {
            toast.error("Failed to Sent email. Please try again.");
          },
        }
      );
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center backdrop-blur-md bg-gray-800/30 justify-center z-50">
      <div className="bg-white p-5 rounded-lg w-[95%] lg:w-[55%] 2xl:w-[40%] shadow-2xl max-h-[95vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Compose Email</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* To */}
          <div>
            <label className="block font-medium text-sm">To</label>
            <input
              type="email"
              name="to"
              value={formik.values.to}
              placeholder="recipient@example.com"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              {...formik.getFieldProps("to")}
            />
            {formik.touched.to && formik.errors.to && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.to}</p>
            )}
          </div>

          {/* From */}
          {/* <div>
            <label className="block font-medium text-sm">From</label>
            <input
              type="email"
              name="from"
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              {...formik.getFieldProps("from")}
            />
            {formik.touched.from && formik.errors.from && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.from}</p>
            )}
          </div> */}

          {/* Subject */}
          <div>
            <label className="block font-medium text-sm">Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="Enter subject"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              {...formik.getFieldProps("subject")}
            />
            {formik.touched.subject && formik.errors.subject && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.subject}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block font-medium text-sm">Message</label>
            <textarea
              name="message"
              rows="6"
              placeholder="Type your message here..."
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 resize-none"
              {...formik.getFieldProps("message")}
            />
            {formik.touched.message && formik.errors.message && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-full hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
  type="submit"
  disabled={mutation.isLoading}
  className={` px-6 py-2 rounded-full text-white transition-colors ${
    mutation.isLoading
      ? "bg-blue-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
  }`}
>
  {mutation.isLoading ? "Sending..." : "Send"}
</button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
