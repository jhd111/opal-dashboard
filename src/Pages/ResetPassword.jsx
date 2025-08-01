
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import login from "../assets/Login.png";
import opal_logo from "../assets/opal_logo.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Base_url from "../Base_url/Baseurl"
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
const ResetPassword = () => {

  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate=useNavigate()
    const initialValues = {
        password: "",
        confirmPassword: "",
      };
      

      const validationSchema = Yup.object({
        password: Yup.string().required("Password is Required"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password"), null], "Passwords must match")
          .required("Confirm Password is Required"),
      });

      const email=localStorage.getItem("email")
      
      const handleSubmit = async (values, { setSubmitting }) => {
        try {
          const response = await axios.post(
            `${Base_url}/api/admin/confirm-password/`,
    
            {
              email:email,
              new_password: values.password,
              confirm_password:values.confirmPassword
              
            }
          );
    
          if (response.status === 200) {
            const data = response.data;

            // Save token and remember flag
           
    
            toast.success("Password reset successfully", {
              position: "top-center",
              duration: 3000,
            });
    
            setTimeout(() => {
              navigate("/reset-successful")
            }, 1000);
          }
          else{
            toast.error(" Please try again.",
            {
              position: "top-center",
              duration: 3000,
            }
          );
          }
        } catch (error) {
          toast.error(" Please try again.",
            {
              position: "top-center",
              duration: 3000,
            }
          );
        } finally {
          setSubmitting(false);
        }
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
            <h2 className="text-2xl inter font-semibold mb-5 text-start ">
            Reset Your Password

            </h2>
            <p  className="inter font-normal text-sm leading-5 tracking-normal text-[#667085]">
                Type your new password to continue.</p>
                <Formik
  initialValues={initialValues}
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
>
  {() => (
    <Form className="space-y-4">
      {/* Password */}
      <div className="relative">
        <label
          htmlFor="password"
          className="block font-medium text-sm leading-5 tracking-normal text-[#344054] mb-1 mt-4"
        >
          Password
        </label>

        <Field
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
          className="mt-1 h-10 w-full border border-[#D0D5DD] rounded-md p-2 text-sm shadow-custom-light pr-10"
          placeholder="Password"
        />
        <button
          type="button"
          className="absolute top-10 right-3 text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
        <ErrorMessage
          name="password"
          component="div"
          className="text-red-500 mt-1 text-xs"
        />
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <label
          htmlFor="confirmPassword"
          className="block font-medium text-sm leading-5 tracking-normal text-[#344054] mb-1"
        >
          Confirm Password
        </label>
        <Field
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          id="confirmPassword"
          className="mt-1 h-10 w-full border border-[#D0D5DD] rounded-md p-2 text-sm shadow-custom-light pr-10"
          placeholder="Confirm Password"
        />
        <button
          type="button"
          className="absolute top-10 right-3 text-gray-500"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
        <ErrorMessage
          name="confirmPassword"
          component="div"
          className="text-red-500 mt-1 text-xs"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#175CD3] inter text-white p-2 rounded-md mt-2 shadow-custom-light"
      >
        Save Password
      </button>
    </Form>
  )}
</Formik>

            <div onClick={()=>navigate("/")} className="text-[#1849A9] text-center inter font-semibold mt-3">
              Back To Login
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
