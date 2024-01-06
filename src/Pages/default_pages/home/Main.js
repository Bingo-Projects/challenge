import React, { useEffect } from "react";
import Middle from "./Middle";
import Navbar from "../Navbar";
import Footer from "../Footer";

function Home() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  return (
    <>
    <Navbar />
      <div className="home-container">
        <Middle />
      </div>
      <Footer />
    </>
  );
}

export default Home;
