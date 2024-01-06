import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import "../../css/Pages/default_pages/footer.css";

function Footer() {

  useEffect(() => {
    // scroll to top whenever page changes
    const links = document.querySelectorAll('.footer__pagelink--link');
    links.forEach((link) => link.addEventListener('click', () => window.scrollTo(0, 0)));
  }, [])

  return (
    <footer className="footer">
      <div className="footer__pagelink">
        <div className="holder">
          <Link to="/" className="footer__pagelink--link">About us</Link>
          <Link to="/contact-us" className="footer__pagelink--link">Contact us</Link>
        </div>

        <div className="holder">
          <Link to="/" className="footer__pagelink--link">Our Services</Link>
          <Link to='/terms-conditions' className="footer__pagelink--link">Terms & Conditions</Link>
        </div>

        <div className="holder">
          <Link to="/privacy" className="footer__pagelink--link">Privacy</Link>
          <Link to="/consultant" className="footer__pagelink--link">Hire Talent</Link>
        </div>
      </div>

      <div className="footer__socials">
        <div className="holder">
          <a href="https://instagram.com" target="__blank" className="footer__socials--link">
            <i className="uil uil-instagram"></i>
          </a>
          <a href="https://twitter.com/justfreshjobs" target="__blank" className="footer__socials--link">
            <i className="uil uil-twitter"></i>
          </a>
          <a href="https://www.youtube.com/@justfreshjobs" target="__blank" className="footer__socials--link">
            <i className="uil uil-youtube"></i>
          </a>
          <a href="https://in.linkedin.com/company/justfreshjobs" target="__blank" className="footer__socials--link">
            <i className="uil uil-linkedin-alt"></i>
          </a>
        </div>

        <div className="holder">
          <p className="copyright">&copy; Copyright {new Date().getFullYear()} JustFreshJobs</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
