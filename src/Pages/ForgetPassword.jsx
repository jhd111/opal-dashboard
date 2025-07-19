import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import login from "../assets/Login.png";
import opal_logo from "../assets/opal_logo.png";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {

    const navigate=useNavigate()

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is Required"),
    // password: Yup.string().required(" Password is Required"),
  });

  const handleSubmit = (values) => {
    console.log("Form Values", values);
    navigate("/otp-verification")
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Image */}
      <div className="lg:w-1/2 hidden md:block h-screen">
        <img
          src={login}
          alt="Opal Institute"
          className="object-cover w-full h-screen "
        />
      </div>

      {/* Right Side */}
      <div className="lg:w-1/2 w-full flex flex-col items-center justify-center  p-12 bg-gray-50 h-screen overflow-y-auto">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={opal_logo} alt="Opal Institute Logo" className="h-12" />
          </div>

          <div className="bg-white p-8 border border-[#D0D5DD] rounded-lg  flex flex-col gap-3">
            <h2 className="text-2xl inter font-semibold mb-2 text-start">
              Forgot Password
            </h2>
            <p className="inter font-normal text-[14px] leading-[22px] tracking-normal text-[#667085]">
              Please provide your email so that we can send you an OTP to reset
              your password
            </p>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {() => (
                <Form className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block font-medium text-sm leading-5 tracking-normal text-[#344054] mb-1"
                    >
                      Email address
                    </label>

                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className="mt-1 h-10 w-full border border-[#D0D5DD] rounded-md p-2 text-sm shadow-custom-light"
                      placeholder="example@email.com"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 mt-1 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#175CD3] inter text-white p-2 rounded-md mt-2 shadow-custom-light"
                  >
                    Send OTP
                  </button>
                </Form>
              )}
            </Formik>
            <div className="text-[#1849A9] text-center inter font-semibold">
              Back To Login
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
