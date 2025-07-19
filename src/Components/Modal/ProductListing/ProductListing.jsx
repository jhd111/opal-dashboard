import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputFields from "../../InputFields/InputFields";
import { uploadButton, checkout } from "../../../assets/index";

const ProductListing = ({
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
      productName: formState.productName || "",
      productDescription: formState.productDescription || "",
      productPrice: formState.productPrice || "",
      discountedPrice: formState.discountedPrice || "",
      validityAfterPurchase: formState.validityAfterPurchase || "",
      productImage: formState.productImage || null,
    },
    validationSchema: Yup.object({
      productName: Yup.string().required("Product Name is required"),
      productDescription: Yup.string().required("Product Description is required"),
      productPrice: Yup.number()
        .typeError("Product Price must be a number")
        .positive("Product Price must be positive")
        .required("Product Price is required"),
      discountedPrice: Yup.number()
        .typeError("Discounted Price must be a number")
        .positive("Discounted Price must be positive"),
      validityAfterPurchase: Yup.string(),
      productImage: Yup.mixed()
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
        <div className="bg-white p-6 rounded-lg w-[95%] lg:w-[800px] 2xl:w-[900px] shadow-2xl max-h-[95vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer text-4xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Basic Details and Pricing */}
              <div className="boxShadow p-5 rounded-md space-y-10 border-0">
                {/* Basic Details */}
                <div >
                  <h3 className="text-lg lato font-bold mb-4">Basic Details</h3>
                  <div className="flex flex-col gap-3">
                    {/* Product Name */}
                    <InputFields
                      label="Product Name"
                      placeholder="Enter Product Name"
                      type="text"
                      error={formik.errors.productName}
                      touched={formik.touched.productName}
                      {...formik.getFieldProps("productName")}
                    />
                    {/* Product Description */}
                    <InputFields
                      label="Product Description"
                      placeholder="Enter Product Description"
                      type="textarea"
                      rows={4}
                      error={formik.errors.productDescription}
                      touched={formik.touched.productDescription}
                      {...formik.getFieldProps("productDescription")}
                    />
                  </div>
                </div>

                {/* Pricing */}
                <div>
                  <h3 className="text-lg lato font-bold mb-4">Pricing</h3>
                  <div className="flex flex-col gap-3">
                    {/* Product Price */}
                    <InputFields
                      label="Product Price"
                      placeholder="Enter Product Price"
                      type="number"
                      error={formik.errors.productPrice}
                      touched={formik.touched.productPrice}
                      {...formik.getFieldProps("productPrice")}
                    />
                    {/* Discounted Price */}
                    <InputFields
                      label="Discounted Price (Optional)"
                      placeholder="Enter Discounted Price"
                      type="number"
                      error={formik.errors.discountedPrice}
                      touched={formik.touched.discountedPrice}
                      {...formik.getFieldProps("discountedPrice")}
                    />
                    {/* Validity After Purchase */}
                    <InputFields
                      label="Validity After Purchase (Optional)"
                      placeholder="Enter Validity After Purchase"
                      type="text"
                      error={formik.errors.validityAfterPurchase}
                      touched={formik.touched.validityAfterPurchase}
                      {...formik.getFieldProps("validityAfterPurchase")}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Upload Product Image */}
              <div className="boxShadow rounded-md p-5">
                <h3 className="text-lg font-medium mb-4">Upload Product Image</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center min-h-[200px] bg-gray-50">
                      {formik.values.productImage ? (
                        <img
                          src={URL.createObjectURL(formik.values.productImage)}
                          alt="Uploaded"
                          className="w-32 h-32 object-cover rounded-lg mb-4"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <span className="text-blue-500 text-sm font-medium">
                            Add Image
                          </span>
                        </div>
                      )}
                      <input
                        id="productImageUpload"
                        type="file"
                        accept="image/jpeg, image/png"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          formik.setFieldValue("productImage", file);
                          formik.setTouched({ productImage: true });
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      type="button"
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                      onClick={() => {
                        const input = document.getElementById("productImageUpload");
                        input.click();
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span>Browse</span>
                    </button>
                    {formik.values.productImage && (
                      <button
                        type="button"
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                        onClick={() => {
                          formik.setFieldValue("productImage", null);
                          formik.setTouched({ productImage: false });
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Replace</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Publish Product Button */}
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                className="px-8 py-3 bg-[#4755E5] text-white rounded-lg hover:bg-[#3a47d1] transition-colors font-medium"
              >
                Publish Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProductListing;