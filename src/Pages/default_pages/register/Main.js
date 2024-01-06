import React, { useEffect, useRef, useState } from "react";
import InputFields from "./InputFields";
import ImageBanner from "./ImageBanner";
import OtpFields from "./OtpFields";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";


// Jobseeker - Checking who the registering person is (Jobseeker or consultant)
function Main({jobSeeker=true}) {
  const navigate = useNavigate();

  // whether to show (Registering field) or (OTP field)
  const [showInputField, setShowInputField] = useState(true);
  // preserving the data - when going back from (OTP field) to (Registering field)
  const fieldData = useRef({name: "", mobile: "", email: "", pass: "", cpass: "", verify_id: ""});

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
        <h1 className="form-heading--main">Register Page <span>{jobSeeker?"(Jobseeker)":"(Company)"}</span></h1>
        <p className="form-heading--sub">Glad to see you, please fill the filleds below to register</p>
      </div>

      <div className="form">
        {(showInputField) ? (
            <InputFields showInputForm={setShowInputField} fieldData={fieldData} jobSeeker={jobSeeker} />
          ) : (
          <OtpFields showInputForm={setShowInputField} email={fieldData.current.email} verify_id={fieldData.current.verify_id} jobSeeker={jobSeeker} />
        )}
        {showInputField && <ImageBanner jobSeeker={jobSeeker} /> }
      </div>
      <Footer />
    </>
  );
}

export default Main;
