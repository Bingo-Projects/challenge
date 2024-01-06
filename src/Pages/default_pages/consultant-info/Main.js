import React, { useEffect } from "react";
import Middle from "./Middle";
import Pricing from "./Pricing";
import Companies from "./Companies";
import Navbar from "../Navbar";
import Footer from "../Footer";

function Main() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <div className="consultant-container">
        <Middle />
        <Pricing />
        <Companies />
      </div>
      <Footer />
    </>
  );
}

export default Main;
