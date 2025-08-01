import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import login from "../assets/Login.png";
import opal_logo from "../assets/opal_logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Base_url from "../Base_url/Baseurl"
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Check for token + rememberMe on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const rememberMe = localStorage.getItem("rememberMe");
    if (token && rememberMe === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const initialValues = {
    username: "",
    password: "",
    rememberMe: false,
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(
        `${Base_url}/api/admin/login/`,
        {
          username: values.username,
          password: values.password,
        }
      );

      if (response.status === 200) {
        const data = response.data;

        // Save token and remember flag
        localStorage.setItem("email",data?.user?.email)
        localStorage.setItem("token", data?.access_token);
        localStorage.setItem('id',data?.user?.id)
        if (values.rememberMe) {
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberMe");
        }

        toast.success("Login successful!");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
  
      <div className="lg:w-1/2 hidden md:block h-screen">
        <img src={login} alt="Opal Institute" className="object-cover w-full h-screen" />
      </div>

      <div className="lg:w-1/2 w-full flex flex-col items-center justify-center p-6 bg-gray-50 h-screen overflow-y-auto">
        <div className="max-w-md w-full">
          <div className="flex justify-center mb-6">
            <img src={opal_logo} alt="Opal Institute Logo" className="h-12" />
          </div>

          <div className="bg-white p-8 border border-[#D0D5DD] rounded-lg">
            <h2 className="text-2xl inter font-semibold mb-2 text-start">Sign in</h2>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, values }) => (
                <Form className="space-y-4">
                  {/* Username Field */}
                  <div>
                    <label
                      htmlFor="username"
                      className="block font-medium text-sm text-[#344054] mb-1"
                    >
                      Username
                    </label>
                    <Field
                      type="text"
                      name="username"
                      id="username"
                      className="mt-1 h-10 w-full border border-[#D0D5DD] rounded-md p-2 text-sm shadow-custom-light"
                      placeholder="Enter your username"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="text-red-500 mt-1 text-xs"
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block font-medium text-sm text-[#344054] mb-1"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Field
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        className="mt-1 h-10 w-full border border-[#D0D5DD] rounded-md p-2 text-sm shadow-custom-light pr-10"
                        placeholder="Enter your password"
                      />
                      <span
                        className="absolute right-3 top-3 cursor-pointer text-gray-500"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 mt-1 text-xs"
                    />
                  </div>

                  {/* Remember Me + Forgot Password */}
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center text-[#7A7E9E]">
                      <Field type="checkbox" name="rememberMe" className="mr-2" />
                      Keep me logged in
                    </label>
                    <NavLink className="text-[#1849A9] inter font-medium" to="/forgot-password">
                      Forgot password?
                    </NavLink>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer w-full bg-[#175CD3] inter text-white p-2 rounded-md mt-2 shadow-custom-light disabled:opacity-50"
                  >
                    {isSubmitting ? "Signing in..." : "Sign in"}
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
