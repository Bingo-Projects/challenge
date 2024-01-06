import React, { useEffect, useRef, useState } from "react";
import InputFields from "./InputFields";
import OtpFields from "./OtpFields";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import "../../../css/Pages/default_pages/forgot-pass/main.css";


// Jobseeker - Checking who the registering person is (Jobseeker or consultant)
function Main() {
  const navigate = useNavigate();

  // whether to show (Registering field) or (OTP field)
  const [showInputField, setShowInputField] = useState(true);
  // preserving the data - when going back from (OTP field) to (Registering field)
  const fieldData = useRef({email: "" });

  useEffect(() => {
    if (localStorage.getItem("session_id")) {
      navigate("/");
    }
    window.scrollTo(0, 0);
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="form-heading">
        <h1 className="form-heading--main">Forget Password</h1>
        <p className="form-heading--sub">Forgot your password? Don't worry get your account back with these simple steps</p>
      </div>

      <div className="form">
        {(showInputField) ? (
            <InputFields showInputForm={setShowInputField} fieldData={fieldData} />
          ) : (
          <OtpFields showInputForm={setShowInputField} email={fieldData.current.email} verify_id={fieldData.current.verify_id} />
        )}
      </div>
      <Footer />
    </>
  );
}

export default Main;
