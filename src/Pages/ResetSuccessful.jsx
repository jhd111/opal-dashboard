
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import login from "../assets/Login.png";
import opal_logo from "../assets/opal_logo.png";
import { useNavigate } from "react-router-dom";
import reset from "../assets/reset.png"

const ResetSuccessful = () => {

   const navigate=useNavigate()
      

      
      

  const handleSubmit = (values) => {
    console.log("Form Values", values);
    navigate("/")
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

          <div className="bg-white p-8 border border-[#D0D5DD] rounded-lg flex flex-col gap-3">
            <h2 className="text-2xl inter font-semibold mb-5 text-center ">
            Password Reset Successful!


            </h2>
            <p  className="text-center inter font-normal text-sm leading-5 tracking-normal text-[#667085]">
            Your password has been successfully reset. Please log in again to continue.
            </p>
            <div className="flex justify-center">
           <img src={reset} alt="" className="w-12 "/>
           </div>
            <div onClick={()=>{handleSubmit()}} className="bg-[#1849A9] cursor-pointer text-white p-2 rounded-md text-center inter font-semibold mt-3">
            Log In Now
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetSuccessful;
