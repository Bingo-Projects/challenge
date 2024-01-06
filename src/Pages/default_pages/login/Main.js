import React, { useEffect } from "react";
import InputFields from "./InputFields";
import ImageBanner from "./ImageBanner";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";

function Main() {

  const navigate = useNavigate();

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
        <h1 className="form-heading--main">Login Page</h1>
        <p className="form-heading--sub">Welcome user, please fill the filleds below to login</p>
      </div>

      <div className="form">
        <InputFields />
        <ImageBanner />
      </div>
      <Footer />
    </>
  );
}

export default Main;
