import React, { useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "../../css/Pages/default_pages/navbar.css";
import { api } from "../../backend";
import { v4 as uuidv4 } from 'uuid';

const SITE_LOGO = process.env.REACT_APP_SITE_LOGO;

function Navbar() {
  const navigate = useNavigate();
  const session_id = localStorage.getItem("session_id");
  const session_type = localStorage.getItem("session_type");

  if (session_id && session_type !== "job_seeker") {
    navigate("/my-account");
  }


  // section (A) page links - about site
  const hamburger_pages = [
    { name: "Home", link: "/", visibility: "public" },
    { name: "internships", link: "/search/intern", visibility: "public" },
    { name: "jobs", link: "/search/job", visibility: "public" },
    { name: "hire telent", link: "/consultants", visibility: "not-login" },
    { name: "applied", link: "/applied", visibility: "logged" },
    { name: "contact us", link: "/contact-us", visibility: "not-login" }
  ];

  // section (B) page links - user login/register
  const hamburger_user = [
    { name: "profile", link: "/user/profile", visibility: "logged" },
    { name: "register - as job seeker", link: "/register", visibility: "not-login" },
    { name: "register - as company", link: "/register/company", visibility: "not-login" },
    { name: "login", link: "/login", visibility: "not-login" },
  ];
  
  // section (B) page links - user login/register
  const register_options = [
    { name: "As a jobseeker", link: "/register" },
    { name: "As a company", link: "/register/company" }
  ];

  useEffect(() => {
    if (session_id && session_type !== "job_seeker") {
      navigate("/my-account");
    }

    // hamburger - click functionality
    const hamburger = document.querySelector(".navbar__hamburger i");
    hamburger.addEventListener("click", () => {
      document.querySelector(".navbar__hamburger")?.classList?.add("active");
    });

    // on clicking back_screen - hide hamburger nav-menu
    const black_screen = document.querySelector(".black-screen");
    black_screen.addEventListener("click", () => {
      document.querySelector(".navbar__hamburger")?.classList?.remove("active");
    });

    // Scroll to top whenever page changes
    const navLinks = document.querySelectorAll(".navbar__links--link");
    navLinks.forEach((link) => link.addEventListener("click", () => window.scrollTo(0, 0)));

    // Scroll to top whenever nav-menu clicks
    const hamburgerLinks = document.querySelectorAll(".navbar__hamburger__menu--link");
    hamburgerLinks.forEach((link) => {
      link.addEventListener("click", () => {
        document.querySelector(".navbar__hamburger")?.classList?.toggle("active");
        window.scrollTo(0, 0);
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logoutFunction = async (e) => {
    const proceed = window.confirm("Are you sure you want to logout?");
    if (!proceed) {
      return;
    }

    if (e.currentTarget.classList?.contains("disabled")) {
      return;
    }

    e.currentTarget.classList?.add("disabled");

    try {
      await api.delete(`/logout?session_id=${session_id}`);
      localStorage.removeItem('session_id');
      localStorage.removeItem('session_type');
      navigate("/");
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('session_id');
        localStorage.removeItem('session_type');
        navigate("/login");
      } else {
        alert(err.response?.data?.msg);
      }
    }
  };

  return (
    <header className="navbar">
      <div className="holder">
        <span className="navbar__hamburger">
          <i className="uil uil-bars"></i>
          <div className="black-screen"></div>
          <div className="navbar__hamburger__menu">
            {hamburger_pages?.map((page) => {
              if (page?.visibility === "public") {
                return <Link to={page?.link} key={uuidv4()} className="navbar__hamburger__menu--link">{page?.name}</Link>
              }
              else if (page?.visibility === "not-login" && !(localStorage.getItem("session_id"))) {
                return <Link to={page?.link} key={uuidv4()} className="navbar__hamburger__menu--link">{page?.name}</Link>
              }
              else if (page?.visibility === "logged" && localStorage.getItem("session_id")) {
                return <Link to={page?.link} key={uuidv4()} className="navbar__hamburger__menu--link">{page?.name}</Link>
              }
              else {
                return ""
              }
            })}
            <hr />

            {hamburger_user?.map((page) => {
              if (page?.visibility === "public") {
                return <Link to={page?.link} key={uuidv4()} className="navbar__hamburger__menu--link">{page?.name}</Link>
              }
              else if (page.visibility === "not-login" && !(localStorage.getItem("session_id"))) {
                return <Link to={page?.link} key={uuidv4()} className="navbar__hamburger__menu--link">{page?.name}</Link>
              }
              else if (page.visibility === "logged" && localStorage.getItem("session_id")) {
                return <Link to={page?.link} key={uuidv4()} className="navbar__hamburger__menu--link">{page?.name}</Link>
              }
              else {
                return ""
              }
            })}
            { localStorage.getItem("session_id") && <button onClick={logoutFunction} className="navbar__hamburger__menu--link red">Logout</button> }
          </div>
        </span>

        <span className="navbar__logo">
          <Link to="/" onClick={() => window.scrollTo(0, 0)}>
            <img src={SITE_LOGO + "?tr=h-40"} alt="Logo" /> 
          </Link>
        </span>

        <span className="navbar__links">
          <Link to="/search/job" className="navbar__links--link job">Jobs</Link>
          <Link to="/search/intern" className="navbar__links--link internship">Internships</Link>
          {/* { !localStorage.getItem("session_id") && <Link to="/consultant" className="navbar__links--link">Consultants</Link> } */}
          { !localStorage.getItem("session_id") && <Link to="/consultants" className="navbar__links--link">Hire Talent</Link> }
          { !localStorage.getItem("session_id") && <Link to="/contact-us" className="navbar__links--link">Contact Us</Link> }
          { localStorage.getItem("session_id") && <Link to="/applied" className="navbar__links--link">Applied</Link> }
          { localStorage.getItem("session_id") && <Link to="/user/profile" className="navbar__links--link">Profile</Link> }
          { localStorage.getItem("session_id") && <button onClick={logoutFunction} className="navbar__links--link red">Logout</button> }
        </span>

        { !localStorage.getItem("session_id") && (
          <span className="navbar__buttons">
            <Link to="/login" onClick={() => window.scrollTo(0, 0)} className="navbar__buttons--login">Login</Link>
            <button className="navbar__buttons--register">
              <span>Register</span>
              <i className="uil uil-angle-down"></i>
              <div className="navbar__buttons--register-menu">
                {register_options?.map((option) => (
                  <Link
                    key={uuidv4()}
                    to={option?.link}
                    onClick={() => window.scrollTo(0, 0)}
                    className="navbar__buttons--register-option"
                  > {option?.name} </Link>
                ))}
              </div>
            </button>
          </span>
        )}
      </div>
    </header>
  );
}

export default Navbar;
