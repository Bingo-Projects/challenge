import React, { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha"
import {Link} from "react-router-dom";
import { api } from "../../../backend";

const LOADING_GIF = process.env.REACT_APP_LOADING_IMG;
const RECAPTCHA_KEY = process.env.REACT_APP_RECAPTCHA_CLIENT_KEY


// Validating input fields
const validateInputs = (captchaValue) => {
  // Email address validation
  const emailRegex = new RegExp("[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+(?:\\.[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?\\.)+[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?");

  // all fields of the form
  const error = document.querySelector(".error");
  const email = document.querySelector("#email");

  // Focus on field with error, and show error message
  function focusField(inputElement, eye_option, err_msg) {
    if (!inputElement) return;
    // if eye option is present, we need to move out 1 step more
    const fieldParent = eye_option?(inputElement?.parentElement?.parentElement):(inputElement?.parentElement);
    inputElement?.classList.add("fill");
    fieldParent?.classList.add("active");
    inputElement?.focus();

    error.innerHTML = err_msg;
    error?.classList.add("active");
  }

  if (!(email?.value)) {
    focusField(email, false, "Please enter your email address")
    return false;
  }
  else if (email?.value?.length > 50){
    focusField(email, false, "Email can be 50 characters only")
    return false;
  }

  if (!(emailRegex?.test(email?.value))) {
    focusField(email, false, "Invalid email address")
    return false;
  }

  if (!captchaValue) {
    error.innerHTML = "reCaptcha is required";
    error?.classList?.add("active");
    return false;
  }

  // Saving field data for future reference
  return {
    email: email?.value,
  };
};


// Filling already present data - (got back from OTP section)
function fillFields(fieldData) {

  // Getting all fields from the form
  const email = document.querySelector("#email");

  // func for activating field, and filling with values
  function activeField(inputElement, eye_option, value) {
    if (!inputElement) return;
    inputElement.value = value;
    const fieldParent = eye_option?(inputElement?.parentElement?.parentElement):(inputElement?.parentElement);
    inputElement?.classList?.add("fill");
    fieldParent?.classList?.add("active");
  }

  if (fieldData.email) {
    activeField(email, false, fieldData.email);
  }
}


// Main Function
function InputFields({showInputForm, fieldData }) {
  // Submit button loading animation
  const [loading, setLoading] = useState(false);
  // google recaptcha value
  const captchaValue = useRef(null);

  useEffect( () => {
    // fill already present data, if any
    fillFields(fieldData.current);

    // selecting all fields from the form
    const inputBox = document.querySelectorAll(".input-box__group");
    inputBox?.forEach((input) => {
      // individual field input box
      const grpInput = input.querySelector("input");

      // on click activate field
      input.addEventListener("click", () => {
        input.classList.add("active")
        grpInput.classList.add("fill");
        grpInput.focus();
      });

      // on focus out deactivate field
      input.addEventListener("focusout", () => {
        if (grpInput.value.length === 0) {
          input.classList.remove("active")
          grpInput.classList.remove("fill");
          grpInput.blur();
        }
      });

      grpInput.addEventListener("focus", () => {
        input.classList.add("active")
        grpInput.classList.add("fill");
        grpInput.focus();
      });
    });

    // Email Input Validation
    const emailInput = document.getElementById("email");
    emailInput?.addEventListener("keyup", () => {
      if (emailInput.value.length > 50) {
        emailInput.value = emailInput.value.slice(0, 50);
      }
    });


    // Register button click functionality
    const registerBtn = document.querySelector(".button-div");
    registerBtn?.addEventListener("click", async () => {
      // if button is disabled, do nothing
      if (registerBtn.classList.contains("disabled")) return;

      // validate input fields
      const validated = validateInputs(captchaValue.current);
      if (!validated) return;

      // API call
      setLoading(true);
      registerBtn.classList.add("disabled");

      try {
        const otp = await api.get(`/verify/forgot-pass?email=${emailInput.value}&recaptcha=${captchaValue.current}`);
        fieldData.current = { ...(validated), verify_id: otp.data.verify_id };
        showInputForm(false);
      } catch (err) {
        setLoading(false);
        const error = document.querySelector(".error");
        error.innerHTML = err.response.data.msg;
        registerBtn.classList.remove("disabled");
        error?.classList.add("active");
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Recaptcha when filled
  function captcha(value) {
    captchaValue.current = value
  }

  return (
    <div className="form__input-box margin-left">

      <div className="input-box__group email">
        <label htmlFor="email">
          <i className="uil uil-envelope-alt label-head-icon" />
          <span>Email</span>
        </label>
        <input type="email" id="email" />
      </div>

      <ReCAPTCHA sitekey={RECAPTCHA_KEY} onChange={captcha} className="recaptcha" />

      <div className="form__input-box__submit">
        <p className="error">There is some Error</p>
        <div className="button-div">
          <button type="submit">
            <span>
              {loading ? (<img src={LOADING_GIF + "?tr=h-30,w-30"} alt="loading" />) : "Find"}
            </span>
          </button>
        </div>
        <p className="submit-description">
          Here by mistake?{" "}
          <Link to="/login" onClick={() => window.scrollTo(0, 0)}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default InputFields;