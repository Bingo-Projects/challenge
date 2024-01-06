import React, { useEffect } from "react";
import Box from "./Box";
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
        <Box />
      </div>
      <Footer />
    </>
  );
}

export default Main;
