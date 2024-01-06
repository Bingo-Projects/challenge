import React, { useEffect, useRef, useState } from "react";
import "../../../css/Pages/default_pages/contact-us/box.css";
import ReCAPTCHA from "react-google-recaptcha";
import { api } from "../../../backend";

const RECAPTCHA_KEY = process.env.REACT_APP_RECAPTCHA_CLIENT_KEY


// Message Component
function Message({changeState, success}) {

  // scroll to top
  useEffect(() => window.scrollTo(0, 0), [])

  return <div className="success">
    {success?<h1>Message Send Successfully</h1>:<h1 className="red">Message Not Sent</h1>}
    {success?<p>Thanks for reaching out to us. We will soon get back to you (^_^)</p>:<p>Information provided is invalid, please fill carefully</p>}
    <img style={{"objectFit": success?"cover":"contain"}} src={`/assets/gifs/${success?"success":"wrong"}.gif`} alt="success" />
    <button onClick={() => changeState(false)}>Go Back</button>
  </div>
}


// Input Field Component
function BoxContent( {changeState} ) {
  // disabling button - if recaptcha not filled
  const [disabled, setDisabled] = useState(true);
  // holding recaptcha value
  const captchaValue = useRef(null);


  const contactAPI = async (email, msg, first_name, last_name, mobile) => {
    try {
      await api.post("/contact-us", {
        email, msg, first_name, last_name, recaptcha: captchaValue.current, mobile
      });
      changeState(true);
    } catch (err) {
      alert(err.response.data.msg);
    }
  }


  useEffect(() => {
    // Selecting all input fields
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
      const parent = input.parentElement;
      // activating the clicked field
      input.addEventListener("focus", () => parent.classList.add("active"));

      // marking clicked field which left empty with red
      input.addEventListener("focusout", () => {
        if (input.value === "") parent.classList.add("wrong");
        parent.classList.remove("active");
      });

      // when input is filled remove the red border
      input.addEventListener("keyup", () => {
        if (input.value !== "") {
          parent.classList.add("active");
          parent.classList.remove("wrong");
        } else {
          parent.classList.add("wrong");
        }
      });
    });
  }, []);


  // Submit functionality
  function submit() {

    // Getting all fields
    const first = document.querySelector("#first")?.value;
    const last = document.querySelector("#last")?.value;
    const email = document.querySelector("#email");
    const phone = document.querySelector("#phone")?.value;
    const msg = document.querySelector("#query")?.value;

    const error = document.querySelector("#error");

    // Email address validation
    const emailRegex = new RegExp("[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+(?:\\.[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?\\.)+[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?");

    // Validating input fields
    if (first && last && email?.value &&  phone && msg) {
      if (disabled) {
        error.innerHTML = "Please fill the recaptcha";
        return;
      }

      if (!(emailRegex.test(email?.value))) {
        error.innerHTML = "Please enter a valid email address";
        email.focus();
      }else {
        contactAPI(email.value, msg, first, last, phone);
      }
    }
  }


  // recaptcha when filled
  function captcha(value) {
    setDisabled(false);
    captchaValue.current = value
  }

  return (
    <form className="contact__box" onSubmit={(e) => { e.preventDefault(); submit() }}>
      <div className="contact__box--div">
        <span className="input-box">
          <i className="uil uil-user"></i>
          <input id="first" type="text" required placeholder="First Name" />
        </span>

        <span className="input-box">
          <i className="uil uil-user"></i>
          <input id="last" type="text" required placeholder="Last Name" />
        </span>
      </div>

      <span className="input-box fill">
        <i className="uil uil-envelopes"></i>
        <input id="email" type="email" required placeholder="Email Address" />
      </span>

      <span className="input-box fill">
        <i className="uil uil-mobile-android"></i>
        <input id="phone" type="text" required placeholder="Phone Number" />
      </span>

      <textarea id="query" className="input-box" required placeholder="Describe your query"></textarea>
      <ReCAPTCHA sitekey={RECAPTCHA_KEY} onChange={captcha} className="recaptcha"/>
      <p id="error"></p>
      <button type="submit">Send</button>
    </form>
  );
}


// Main Function
function Box() {
  // if submited then show message (success/failure)
  const [submited, setSubmited] = useState(false);
  // describes which message to display
  const showSuccess = useRef(false);

  // Showing message function
  function changeState(success) {
    if(!success) showSuccess.current = false;
    else showSuccess.current = true
    setSubmited((prv) => !prv);
  }

  return (
    <section className="contact">
      {(!submited)?<BoxContent changeState={changeState} />:<Message success={showSuccess.current} changeState={changeState} />}
      <div className="contact__img">
        <img src="/assets/contact_us.png" alt="" />
      </div>
    </section>
  );
}

export default Box;