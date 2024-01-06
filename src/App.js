import { Routes, Route, useNavigate } from "react-router-dom";

//google anayltics
import ReactGA from "react-ga4";

// Default site pages
import Home from "./Pages/default_pages/home/Main";
import ConsultantsInfo from "./Pages/default_pages/consultant-info/Main";
import ContactUs from "./Pages/default_pages/contact-us/Main";
import Privacy from "./Pages/default_pages/privacy/Main";
import TermsCondition from "./Pages/default_pages/terms-condition/Main";
import Searching from "./Pages/default_pages/searching/Main";
import Campaign from "./Pages/default_pages/campaign/Main";
import Login from "./Pages/default_pages/login/Main";
import ForgotPass from "./Pages/default_pages/forgot-password/Main";
import Register from "./Pages/default_pages/register/Main";

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";



function NotFound() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <></>
}

function App() {
  const [cookieAccepted, setCookieAccepted] = useState(localStorage.getItem("cookie-accepted") || false);

  return (
    <>
      {!cookieAccepted && <div className="policy-cookie">
        We use cookies to improve your experience. By continuing to browse the site, you agree to our 
        <a href="/privacy" target="_blank">Privacy Policy</a>
        <button onClick={() => {
          localStorage.setItem("cookie-accepted", true);
          setCookieAccepted(true);
        }}>Accept</button>
      </div>
      }
      <div className="App">
        <Routes>
          {/* default site pages */}
          <Route path="/" element={
              <Home />
          } />

          <Route path="/consultants" element={              
              <ConsultantsInfo />
          } />

          <Route path="/contact-us" element={
              <ContactUs />
          } />

          <Route path="/privacy" element={
              <Privacy />
          } />

          <Route path="/terms-conditions" element={
              <TermsCondition />
          } />

          <Route path="/search" element={
              <Searching />
          } />

          <Route path="/search/job" element={
              <Searching key={1} work_type={"job"} />
          } />

          <Route path="/search/intern" element={
              <Searching key={2} work_type={"intern"} />
          } />

          <Route path="/campaign/:campaign_title/:action" element={<Campaign />} />

          <Route path="/login" element={
              <Login />
          } />

          <Route path="/forgot-pass" element={
              <ForgotPass />
          } />

          <Route path="/register" element={
              <Register />
          } />

          <Route path="/register/company" element={
              <Register key={2} jobSeeker={false} />
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
