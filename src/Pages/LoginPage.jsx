import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import login from "../assets/Login.png";
import opal_logo from "../assets/opal_logo.png";
import { NavLink,useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate=useNavigate()
  const initialValues = {
    email: "",
    password: "",
    rememberMe: false,
  };

  const validationSchema = Yup.object({
    // email: Yup.string().email("Invalid email address").required("Email is Required"),
    // password: Yup.string().required(" Password is Required"),
  });

  const handleSubmit = (values) => {
    console.log("Form Values", values);
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
      <div className="lg:w-1/2 w-full flex flex-col items-center justify-center p-6 bg-gray-50  h-screen overflow-y-auto">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={opal_logo} alt="Opal Institute Logo" className="h-12" />
          </div>

          <div className="bg-white p-8 border border-[#D0D5DD] rounded-lg ">
            <h2 className="text-2xl inter font-semibold mb-2 text-start">
              Sign in
            </h2>
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

                  <div>
                    <label
                      htmlFor="password"
                      className="block font-medium text-sm leading-5 tracking-normal text-[#344054] mb-1"
                    >
                      Password
                    </label>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      className="mt-1 h-10 w-full border border-[#D0D5DD] rounded-md p-2 text-sm shadow-custom-light"
                      placeholder="Enter your password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 mt-1 text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm ">
                    <label className="flex items-center text-[#7A7E9E]">
                      <Field
                        type="checkbox"
                        name="rememberMe"
                        className="mr-2"
                      />
                      Keep me logged in
                    </label>
                    <NavLink className="text-[#1849A9] inter font-medium"
                     to="/forgot-password"
                    >
                    Forgot password?

                    </NavLink>
                    
                  </div>

                  <button
                  onClick={()=>navigate("/dashboard")}
                    type="submit"
                    className="w-full bg-[#175CD3] inter text-white p-2 rounded-md mt-2 shadow-custom-light"
                  >
                    Sign in
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
