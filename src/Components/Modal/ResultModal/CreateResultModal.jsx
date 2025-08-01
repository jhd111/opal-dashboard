import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PiGreaterThanLight } from "react-icons/pi";
import { uploadButton } from "../../../assets/index"
import InputFields from "../../InputFields/InputFields";
import { AddResultMutation} from "../../../Services/AddResultService"
import toast, { Toaster } from "react-hot-toast";

const CreateResultModal = ({
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
      examType: "",
      testTakerId: "",
      registrationID: "",
      scoreObtained: "",
      instructorName: "",
      listening: "",
      reading: "",
      speaking: "",
      writing: "",
      status: "",
      studentImage: null,
      resultImage: null,
    },
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
      // studentImage: Yup.mixed()
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
      resultImage: Yup.mixed()
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
      if (values.resultImage) {
        formData.append("image", values.resultImage);
      }

      mutation.mutate(
        {
          payload: formData,
          path: "admin/add-results/",
          queryKey: "our-results", // 👈 Add this to enable refetch
        },
        {
          onSuccess: (data) => {
            toast.success("Result submitted successfully!");
            formik.resetForm(); // Reset form after successful submission
            onClose(); // Close modal on success
          },
          onError: (error) => {
            toast.error("Failed to submit result. Please try again.");
          },
        }
      );
    },
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
      setFormState({
        name: "",
        examType: "",
        testTakerId: "",
        registrationID: "",
        scoreObtained: "",
        instructorName: "",
        listening: "",
        reading: "",
        speaking: "",
        writing: "",
        status: "",
        // studentImage: null,
        resultImage: null,
      });
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
              {/* Exam Name */}
              <InputFields
                label={nameLabel}
                placeholder="Enter Student Name"
                type="text"
                error={formik.errors.name}
                touched={formik.touched.name}
                {...formik.getFieldProps("name")}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldTouched("name", true);
                  formik.validateField("name");
                }}
              />
              {/* Exam Type */}
              <InputFields
                label={examTypeLabel}
                placeholder="Enter Exam Type"
                type="text"
                error={formik.errors.examType}
                touched={formik.touched.examType}
                {...formik.getFieldProps("examType")}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldTouched("examType", true);
                  formik.validateField("examType");
                }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Test Taker ID */}
              <InputFields
                label={testTakerIdLabel}
                placeholder="Enter Test Taker ID"
                type="text"
                error={formik.errors.testTakerId}
                touched={formik.touched.testTakerId}
                {...formik.getFieldProps("testTakerId")}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldTouched("testTakerId", true);
                  formik.validateField("testTakerId");
                }}
              />
              {/* Registration ID */}
              <InputFields
                label={registrationIdLabel}
                placeholder="Enter Registration ID"
                type="text"
                error={formik.errors.registrationID}
                touched={formik.touched.registrationID}
                {...formik.getFieldProps("registrationID")}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldTouched("registrationID", true);
                  formik.validateField("registrationID");
                }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Score Obtained */}
              <InputFields
                label={scoreLabel}
                placeholder="Enter Score Obtained"
                type="number"
                error={formik.errors.scoreObtained}
                touched={formik.touched.scoreObtained}
                {...formik.getFieldProps("scoreObtained")}
                onChange={(e) => {
                  const value = e.target.value;
                  formik.setFieldValue("scoreObtained", value === "" ? "" : Number(value));
                  formik.setFieldTouched("scoreObtained", true);
                  formik.validateField("scoreObtained");
                }}
              />
              {/* Instructor Name */}
              <InputFields
                label={instructorNameLabel}
                placeholder="Enter Instructor Name"
                type="text"
                error={formik.errors.instructorName}
                touched={formik.touched.instructorName}
                {...formik.getFieldProps("instructorName")}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldTouched("instructorName", true);
                  formik.validateField("instructorName");
                }}
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {/* Listening */}
              <InputFields
                label={listeningLabel}
                placeholder="Enter Listening Score"
                type="number"
                error={formik.errors.listening}
                touched={formik.touched.listening}
                {...formik.getFieldProps("listening")}
                onChange={(e) => {
                  const value = e.target.value;
                  formik.setFieldValue("listening", value === "" ? "" : Number(value));
                  formik.setFieldTouched("listening", true);
                  formik.validateField("listening");
                }}
              />
              {/* Reading */}
              <InputFields
                label={readingLabel}
                placeholder="Enter Reading Score"
                type="number"
                error={formik.errors.reading}
                touched={formik.touched.reading}
                {...formik.getFieldProps("reading")}
                onChange={(e) => {
                  const value = e.target.value;
                  formik.setFieldValue("reading", value === "" ? "" : Number(value));
                  formik.setFieldTouched("reading", true);
                  formik.validateField("reading");
                }}
              />
              {/* Speaking */}
              <InputFields
                label={speakingLabel}
                placeholder="Enter Speaking Score"
                type="number"
                error={formik.errors.speaking}
                touched={formik.touched.speaking}
                {...formik.getFieldProps("speaking")}
                onChange={(e) => {
                  const value = e.target.value;
                  formik.setFieldValue("speaking", value === "" ? "" : Number(value));
                  formik.setFieldTouched("speaking", true);
                  formik.validateField("speaking");
                }}
              />
              {/* Writing */}
              <InputFields
                label={writingLabel}
                placeholder="Enter Writing Score"
                type="number"
                error={formik.errors.writing}
                touched={formik.touched.writing}
                {...formik.getFieldProps("writing")}
                onChange={(e) => {
                  const value = e.target.value;
                  formik.setFieldValue("writing", value === "" ? "" : Number(value));
                  formik.setFieldTouched("writing", true);
                  formik.validateField("writing");
                }}
              />
            </div>
            {/* Status */}
            <InputFields
              label={statusLabel}
              isSelect={true}
              placeholder="Select status"
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ]}
              error={formik.errors.status}
              touched={formik.touched.status}
              {...formik.getFieldProps("status")}
              onChange={(e) => {
                formik.handleChange(e);
                formik.setFieldTouched("status", true);
                formik.validateField("status");
              }}
            />
            {/* File Uploads */}
            <div className="grid grid-cols-2 gap-4">
              {/* Student Image Upload */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700">
                  {studentImageLabel}
                </label>
                <div
                  className={`w-full border-dotted border-[#4755E5] border-1 rounded-md mt-2 mb-2 p-4 ${
                    formik.touched.studentImage && formik.errors.studentImage
                      ? "border-red-500"
                      : ""
                  }`}
                >
                  {!formik.values.studentImage ? (
                    <label
                      htmlFor="studentImageUpload"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      <img src={uploadButton} className="w-24" alt="Upload" />
                      <span className="text-[#111217] text-[14px]">
                        Drag & Drop or choose file to upload
                      </span>
                      <span className="text-[#A4A5AB] text-[12px]">
                        Supported formats: JPEG, PNG
                      </span>
                      <input
                        id="studentImageUpload"
                        type="file"
                        accept="image/jpeg, image/png"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          formik.setFieldValue("studentImage", file);
                          formik.setFieldTouched("studentImage", true);
                          formik.validateField("studentImage");
                        }}
                      />
                    </label>
                  ) : (
                    <div className="relative flex items-center justify-center">
                      <img
                        src={URL.createObjectURL(formik.values.studentImage)}
                        alt="Uploaded"
                        className="w-24 object-contain rounded-md"
                      />
                      <div className="absolute -top-2 right-16">
                        <div
                          onClick={() => {
                            formik.setFieldValue("studentImage", null);
                            formik.setFieldTouched("studentImage", true);
                            formik.validateField("studentImage");
                          }}
                          className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[12px] cursor-pointer"
                        >
                          x
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {formik.touched.studentImage && formik.errors.studentImage && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.studentImage}
                  </p>
                )}
              </div> */}
              {/* Result Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {resultImageLabel}
                </label>
                <div
                  className={`w-full border-dotted border-[#4755E5] border-1 rounded-md mt-2 mb-2 p-4 ${
                    (formik.touched.resultImage || formik.submitCount > 0) &&
                    formik.errors.resultImage
                      ? "border-red-500"
                      : ""
                  }`}
                >
                  {!formik.values.resultImage ? (
                    <label
                      htmlFor="resultImageUpload"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      <img src={uploadButton} className="w-24" alt="Upload" />
                      <span className="text-[#111217] text-[14px]">
                        Drag & Drop or choose file to upload
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
                        }}
                      />
                    </label>
                  ) : (
                    <div className="relative flex items-center justify-center">
                      <img
                        src={URL.createObjectURL(formik.values.resultImage)}
                        alt="Uploaded"
                        className="w-24 object-contain rounded-md"
                      />
                      <div className="absolute -top-2 right-16">
                        <div
                          onClick={() => {
                            formik.setFieldValue("resultImage", null);
                            formik.setFieldTouched("resultImage", true);
                            formik.validateField("resultImage");
                          }}
                          className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[12px] cursor-pointer"
                        >
                          x
                        </div>
                      </div>
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

export default CreateResultModal;