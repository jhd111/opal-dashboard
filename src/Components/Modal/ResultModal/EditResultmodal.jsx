import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PiGreaterThanLight } from "react-icons/pi";
import { uploadButton } from "../../../assets/index";
import InputFields from "../../InputFields/InputFields";

import toast, { Toaster } from "react-hot-toast";
import { EditResultMutation} from "../../../Services/Editservice"

const EditResultmodal = ({
  isOpen,
  onClose,
  title,
  nameLabel,
  examTypeLabel,
  testTakerIdLabel,
  registrationIdLabel,
  scoreLabel,
  instructorNameLabel,
  listeningLabel,
  readingLabel,
  speakingLabel,
  writingLabel,
  statusLabel,
  studentImageLabel,
  resultImageLabel,
  formState,
  setFormState,
}) => {

  console.log("formState", formState);
  
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

  const mutation = EditResultMutation(["our-results"]);
  
  const formik = useFormik({
    initialValues: {
      name: formState?.student_name || "",
      examType: formState?.test_type || "",
      testTakerId: formState?.test_taker_id || "",
      registrationID: formState?.registration_id || "",
      scoreObtained: formState?.score_obtained || "",
      instructorName: formState?.instructor || "",
      listening: formState?.listening || "",
      reading: formState?.reading || "",
      speaking: formState?.speaking || "",
      writing: formState?.writing || "",
      status: "Active", // Default status
      studentImage: null,
      resultImage: null,
    },
    enableReinitialize: true, // This allows form to reinitialize when formState changes
    validationSchema: Yup.object({
      name: Yup.string().required("Student Name is required"),
      examType: Yup.string().required("Exam Type is required"),
      testTakerId: Yup.string().required("Test Taker ID is required"),
      registrationID: Yup.string().required("Registration ID is required"),
      scoreObtained: Yup.number()
        .typeError("Score Obtained must be a number")
        .required("Score Obtained is required"),
      instructorName: Yup.string().required("Instructor Name is required"),
      listening: Yup.number()
        .typeError("Listening score must be a number")
        .required("Listening score is required"),
      reading: Yup.number()
        .typeError("Reading score must be a number")
        .required("Reading score is required"),
      speaking: Yup.number()
        .typeError("Speaking score must be a number")
        .required("Speaking score is required"),
      writing: Yup.number()
        .typeError("Writing score must be a number")
        .required("Writing score is required"),
      status: Yup.string().required("Status is required"),
    //   resultImage: Yup.mixed()
    //     .test(
    //       "fileFormat",
    //       "Only JPEG and PNG formats are supported.",
    //       (value) => !value || ["image/jpeg", "image/png"].includes(value?.type)
    //     )
    //     .test(
    //       "fileSize",
    //       "File size must not exceed 5 MB.",
    //       (value) => !value || (value && value.size / (1024 * 1024) <= 5)
    //     ),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("student_name", values.name);
      formData.append("test_type", values.examType);
      formData.append("score_obtained", values.scoreObtained);
      formData.append("test_taker_id", values.testTakerId);
      formData.append("registration_id", values.registrationID);
      formData.append("instructor", values.instructorName);
      formData.append("listening", values.listening);
      formData.append("reading", values.reading);
      formData.append("speaking", values.speaking);
      formData.append("writing", values.writing);
      formData.append("overall_score", values.scoreObtained);
      
      // Only append image if a new file is selected
      if (values.resultImage) {
        formData.append("image", values.resultImage);
      }

      // For edit mode, you might want to add an ID field to identify which record to update
      // If you have an ID in formState, add it to the formData
      if (formState?.id) {
        formData.append("id", formState.id);
      }

      mutation.mutate(
        {
          payload: formData,
          path: "admin/add-results/", // You might want to change this to an edit endpoint
        },
        {
          onSuccess: (data) => {
            toast.success("Result updated successfully!");
            formik.resetForm();
            setFormState(null); // Clear form state
            onClose();
          },
          onError: (error) => {
            toast.error("Failed to update result. Please try again.");
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
          <form onSubmit={formik.handleSubmit} className="">
            {/* Two-column layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Student Name */}
              <InputFields
                label={nameLabel}
                placeholder="Enter Student Name"
                type="text"
                value={formik.values.name}
                error={formik.errors.name}
                touched={formik.touched.name}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldTouched("name", true);
                  formik.validateField("name");
                }}
                name="name"
              />
              {/* Exam Type */}
              <InputFields
                label={examTypeLabel}
                placeholder="Enter Exam Type"
                type="text"
                value={formik.values.examType}
                error={formik.errors.examType}
                touched={formik.touched.examType}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldTouched("examType", true);
                  formik.validateField("examType");
                }}
                name="examType"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Test Taker ID */}
              <InputFields
                label={testTakerIdLabel}
                placeholder="Enter Test Taker ID"
                type="text"
                value={formik.values.testTakerId}
                error={formik.errors.testTakerId}
                touched={formik.touched.testTakerId}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldTouched("testTakerId", true);
                  formik.validateField("testTakerId");
                }}
                name="testTakerId"
              />
              {/* Registration ID */}
              <InputFields
                label={registrationIdLabel}
                placeholder="Enter Registration ID"
                type="text"
                value={formik.values.registrationID}
                error={formik.errors.registrationID}
                touched={formik.touched.registrationID}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldTouched("registrationID", true);
                  formik.validateField("registrationID");
                }}
                name="registrationID"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Score Obtained */}
              <InputFields
                label={scoreLabel}
                placeholder="Enter Score Obtained"
                type="number"
                value={formik.values.scoreObtained}
                error={formik.errors.scoreObtained}
                touched={formik.touched.scoreObtained}
                onChange={(e) => {
                  const value = e.target.value;
                  formik.setFieldValue("scoreObtained", value === "" ? "" : Number(value));
                  formik.setFieldTouched("scoreObtained", true);
                  formik.validateField("scoreObtained");
                }}
                name="scoreObtained"
              />
              {/* Instructor Name */}
              <InputFields
                label={instructorNameLabel}
                placeholder="Enter Instructor Name"
                type="text"
                value={formik.values.instructorName}
                error={formik.errors.instructorName}
                touched={formik.touched.instructorName}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldTouched("instructorName", true);
                  formik.validateField("instructorName");
                }}
                name="instructorName"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {/* Listening */}
              <InputFields
                label={listeningLabel}
                placeholder="Enter Listening Score"
                type="number"
                value={formik.values.listening}
                error={formik.errors.listening}
                touched={formik.touched.listening}
                onChange={(e) => {
                  const value = e.target.value;
                  formik.setFieldValue("listening", value === "" ? "" : Number(value));
                  formik.setFieldTouched("listening", true);
                  formik.validateField("listening");
                }}
                name="listening"
              />
              {/* Reading */}
              <InputFields
                label={readingLabel}
                placeholder="Enter Reading Score"
                type="number"
                value={formik.values.reading}
                error={formik.errors.reading}
                touched={formik.touched.reading}
                onChange={(e) => {
                  const value = e.target.value;
                  formik.setFieldValue("reading", value === "" ? "" : Number(value));
                  formik.setFieldTouched("reading", true);
                  formik.validateField("reading");
                }}
                name="reading"
              />
              {/* Speaking */}
              <InputFields
                label={speakingLabel}
                placeholder="Enter Speaking Score"
                type="number"
                value={formik.values.speaking}
                error={formik.errors.speaking}
                touched={formik.touched.speaking}
                onChange={(e) => {
                  const value = e.target.value;
                  formik.setFieldValue("speaking", value === "" ? "" : Number(value));
                  formik.setFieldTouched("speaking", true);
                  formik.validateField("speaking");
                }}
                name="speaking"
              />
              {/* Writing */}
              <InputFields
                label={writingLabel}
                placeholder="Enter Writing Score"
                type="number"
                value={formik.values.writing}
                error={formik.errors.writing}
                touched={formik.touched.writing}
                onChange={(e) => {
                  const value = e.target.value;
                  formik.setFieldValue("writing", value === "" ? "" : Number(value));
                  formik.setFieldTouched("writing", true);
                  formik.validateField("writing");
                }}
                name="writing"
              />
            </div>
            {/* Status */}
            <InputFields
              label={statusLabel}
              isSelect={true}
              placeholder="Select status"
              value={formik.values.status}
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ]}
              error={formik.errors.status}
              touched={formik.touched.status}
              onChange={(e) => {
                formik.handleChange(e);
                formik.setFieldTouched("status", true);
                formik.validateField("status");
              }}
              name="status"
            />
            {/* File Uploads */}
            <div className="grid grid-cols-1 gap-4">
              {/* Result Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {resultImageLabel}
                </label>
                
                <div
                  className={`w-full border-dotted border-[#4755E5] border-2 rounded-md p-6 ${
                    (formik.touched.resultImage || formik.submitCount > 0) &&
                    formik.errors.resultImage
                      ? "border-red-500"
                      : ""
                  }`}
                >
                  {!formik.values.resultImage ? (
                    <label
                      htmlFor="resultImageUpload"
                      className="cursor-pointer flex flex-col items-center justify-center py-4"
                    >
                      {/* Show existing image inside the upload area */}
                      {existingImage && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2 text-center">Current Image:</p>
                          <div className="relative inline-block">
                            <img
                              src={existingImage}
                              alt="Current Result"
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
                        id="resultImageUpload"
                        type="file"
                        accept="image/jpeg, image/png"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          formik.setFieldValue("resultImage", file);
                          formik.setFieldTouched("resultImage", true);
                          formik.validateField("resultImage");
                          setExistingImage(null); // Hide existing image when new one is selected
                        }}
                      />
                    </label>
                  ) : (
                    <div className="relative flex items-center justify-center py-4">
                      <img
                        src={URL.createObjectURL(formik.values.resultImage)}
                        alt="New Upload"
                        className="w-32 h-32 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          formik.setFieldValue("resultImage", null);
                          formik.setFieldTouched("resultImage", true);
                          formik.validateField("resultImage");
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
                {(formik.touched.resultImage || formik.submitCount > 0) &&
                  formik.errors.resultImage && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.resultImage}
                    </p>
                  )}
              </div>
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
                disabled={mutation.isLoading}
                className="px-8 py-2 bg-[#4755E5] text-white rounded-full cursor-pointer hover:bg-[#3644CC] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mutation.isLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditResultmodal;