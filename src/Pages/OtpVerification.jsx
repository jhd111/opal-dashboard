import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import login from "../assets/Login.png";
import opal_logo from "../assets/opal_logo.png";
import Base_url from "../Base_url/Baseurl"
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const OtpVerification = () => {
  const otpLength = 4 ;
  const [otp, setOtp] = useState(new Array(otpLength).fill(""));
  const inputsRef = useRef([]);

  const navigate=useNavigate()

  // Handle typing in each input
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Only numbers
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value[0];
    setOtp(newOtp);

    // Move focus to next input
    if (index < otpLength - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, otpLength).split("");
    const newOtp = [...otp];

    pasteData.forEach((char, idx) => {
      if (idx < otpLength) {
        newOtp[idx] = char;
        if (inputsRef.current[idx]) {
          inputsRef.current[idx].value = char;
        }
      }
    });

    setOtp(newOtp);
    const nextIndex = pasteData.length >= otpLength ? otpLength - 1 : pasteData.length;
    inputsRef.current[nextIndex]?.focus();
  };

  const email=localStorage.getItem("email")

  const handleSubmit = async () => {

    try {
      const response = await axios.post(
        `${Base_url}/api/admin/verify-otp/`,
        { 
          email:email,
          otp: String(otp).replace(/,/g, '') 
        }
      );

      if (response.status === 200) {
        const data = response.data;

        // Save token and remember flag
       

        toast.success("OTP Verified successfully");

        setTimeout(() => {
          navigate("/reset-password");
        }, 1000);
      }
      else{
        toast.error(" Otp not verified");
      }
    } catch (error) {
      toast.error("Otp not verified." );
    } 
  };

// handle resend 
const handleResent = async () => {
  try {
    const response = await axios.post(
      `${Base_url}/api/admin/forgot-password/`,

      {
        email: email,
        
      }
    );

    if (response.status === 200) {
      const data = response.data;

      // Save token and remember flag
     

      toast.success("OTP sent successfully")

    
    }
    else{
      toast.error(" Please try again.");
    }
  } catch (error) {
    toast.error(" Please try again.", );
  } 
};



  return (
    <div className="flex flex-col lg:flex-row h-screen">
   
      {/* Left Image */}
      <div className="lg:w-1/2 hidden md:block h-screen">
        <img
          src={login}
          alt="Opal Institute"
          className="object-cover w-full h-screen"
        />
      </div>

      {/* Right Side */}
      <div className="lg:w-1/2 w-full flex flex-col items-center justify-center p-12 bg-gray-50 h-screen overflow-y-auto">
        <div className="max-w-md w-full">
          <div className="flex justify-center mb-6">
            <img src={opal_logo} alt="Opal Institute Logo" className="h-12" />
          </div>

          <div className="bg-white p-8 border border-[#D0D5DD] rounded-lg flex flex-col gap-3">
            <h2 className="text-2xl inter font-semibold mb-2 text-start">
              OTP Verification
            </h2>
            <p className="inter font-normal text-[14px] leading-[22px] tracking-normal text-[#667085]">
              We have sent an OTP to your email. Please type your OTP to reset your password.
            </p>

            <div className="flex gap-2 justify-center mt-4" onPaste={handlePaste}>
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  ref={(el) => (inputsRef.current[index] = el)}
                  onChange={(e) => handleChange(e, index)}
                  className="w-12 h-12 border border-[#D0D5DD] rounded-md text-center text-lg shadow-custom-light"
                />
              ))}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-[#175CD3] inter text-white p-2 rounded-md mt-4 shadow-custom-light"
            >
              Verify Now
            </button>

            <p className="text-center text-sm text-[#667085] mt-4">
              Didn’t receive code? <span onClick={handleResent} className="text-[#1849A9] font-medium cursor-pointer">Resend</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
