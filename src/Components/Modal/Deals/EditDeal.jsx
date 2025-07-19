import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputFields from "../../InputFields/InputFields";
import {  checkout } from "../../../assets/index";

const EditDeals = ({
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

  // State for features
  const [features, setFeatures] = useState(formState.features || []);

  // Formik Configuration
  const formik = useFormik({
    initialValues: {
      name: formState.name || "",
      status: formState.status || "",
      price: formState.price || "",
      saving: formState.saving || "",
      checkoutImage: formState.checkoutImage || null,
      supplementaryImages: formState.supplementaryImages || Array(4).fill(null),
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      status: Yup.string().required("Status is required"),
      price: Yup.number()
        .typeError("Price must be a number")
        .positive("Price must be positive")
        .required("Price is required"),
      saving: Yup.number()
        .typeError("Saving must be a number")
        .positive("Saving must be positive")
        .required("Saving is required"),
      checkoutImage: Yup.mixed()
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
      supplementaryImages: Yup.array()
        .of(
          Yup.mixed()
            .nullable()
            .test(
              "fileFormat",
              "Only JPEG and PNG formats are supported.",
              (value) => !value || ["image/jpeg", "image/png"].includes(value?.type)
            )
            .test(
              "fileSize",
              "File size must not exceed 5 MB.",
              (value) => !value || (value && value.size / (1024 * 1024) <= 5)
            )
        )
        .min(0)
        .max(4),
    }),
    onSubmit: (values) => {
      console.log("Form values:", { ...values });
      handleSubmit(values);
    },
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
      setFeatures([]);
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
          <form onSubmit={formik.handleSubmit} className="grid grid-cols-2 gap-4">
            {/* Left Section */}
            <div className="border border-[#A4A5AB33] rounded-md p-4">
              {/* Name Field */}
              <InputFields
                label="Name"
                placeholder="Enter Deal Name"
                type="text"
                error={formik.errors.name}
                touched={formik.touched.name}
                {...formik.getFieldProps("name")}
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

              {/* Price Field */}
              <InputFields
                label="Price"
                placeholder="Enter Price"
                type="number"
                error={formik.errors.price}
                touched={formik.touched.price}
                {...formik.getFieldProps("price")}
              />

              {/* Saving Field */}
              <InputFields
                label="Saving"
                placeholder="Enter Saving Amount"
                type="number"
                error={formik.errors.saving}
                touched={formik.touched.saving}
                {...formik.getFieldProps("saving")}
              />

              {/* Features Field */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Features</label>
                <input
                  type="text"
                  placeholder="Enter Features"
                  className={`w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:border-blue-500 ${
                    formik.touched.features && formik.errors.features ? "border-red-500" : ""
                  }`}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const feature = e.target.value.trim();
                      if (feature && !features.includes(feature)) {
                        setFeatures([...features, feature]);
                        e.target.value = "";
                      }
                    }
                  }}
                />
                {formik.touched.features && formik.errors.features && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.features}</p>
                )}
                {features.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-[#E6F7FF] border border-[#4755E5] rounded-full px-3 py-1 text-sm flex items-center"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => {
                            const updatedFeatures = [...features];
                            updatedFeatures.splice(index, 1);
                            setFeatures(updatedFeatures);
                          }}
                          className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Most Popular Toggle */}
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formik.values.isPopular}
                    onChange={(e) =>
                      formik.setFieldValue("isPopular", e.target.checked)
                    }
                    className="mr-2"
                  />
                  <span className="text-xs lato">
                    Highlight this product as Most Popular
                  </span>
                </label>
              </div>
            </div>

            {/* Right Section */}
            <div className="border border-[#A4A5AB33] rounded-md p-4">
              <h3 className="text-lg font-medium mb-2">Upload Deal Image</h3>
              <p className="text-sm text-gray-500 mb-4">Checkout Image</p>

              {/* Checkout Image */}
              <div className="border-dotted border-[#4755E5] border-1 rounded-md p-4 flex flex-col items-center justify-center">
                {formik.values.checkoutImage ? (
                  <img
                    src={URL.createObjectURL(formik.values.checkoutImage)}
                    alt="Uploaded"
                    className="w-10 object-cover rounded-md"
                  />
                ) : (
                  <label
                    htmlFor="checkoutImageUpload"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    <img src={checkout} className="w-10" alt="Upload" />
                    <span className="text-green-500 text-center mt-1 text-[10px]">
                      Checkout Image
                    </span>
                    <input
                      id="checkoutImageUpload"
                      type="file"
                      accept="image/jpeg, image/png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        formik.setFieldValue("checkoutImage", file);
                        formik.setTouched({ checkoutImage: true });
                      }}
                    />
                  </label>
                )}
              </div>
              {formik.errors.checkoutImage && formik.touched.checkoutImage && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.checkoutImage}</p>
              )}

              {/* Supplementary Images */}
              <div className="mt-4">
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((index) => (
                    <div
                      key={index}
                      className={`border-dotted border-[#4755E5] border-1 rounded-md p-4 flex flex-col items-center justify-center ${
                        formik.touched.supplementaryImages &&
                        formik.errors.supplementaryImages
                          ? "border-red-500"
                          : ""
                      }`}
                    >
                      {formik.values.supplementaryImages[index - 1] ? (
                        <img
                          src={URL.createObjectURL(formik.values.supplementaryImages[index - 1])}
                          alt={`Uploaded ${index}`}
                          className="w-28 object-cover rounded-md"
                        />
                      ) : (
                        <label
                          htmlFor={`supplementaryImageUpload${index}`}
                          className="cursor-pointer flex flex-col items-center justify-center"
                        >
                          <img src={checkout} className="w-10" alt="Upload" />
                          <span className="text-green-500 text-center mt-1 text-[10px]">
                            Add Image
                          </span>
                          <input
                            id={`supplementaryImageUpload${index}`}
                            type="file"
                            accept="image/jpeg, image/png"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              const updatedImages = [...formik.values.supplementaryImages];
                              updatedImages[index - 1] = file;
                              formik.setFieldValue("supplementaryImages", updatedImages);
                              formik.setTouched({ supplementaryImages: true });
                            }}
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {formik.errors.supplementaryImages && formik.touched.supplementaryImages && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.supplementaryImages}</p>
              )}
            </div>
          </form>

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
        </div>
      </div>
    </>
  );
};

export default EditDeals;