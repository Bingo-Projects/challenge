import React, { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../../backend";

const LOADING_GIF = process.env.REACT_APP_LOADING_IMG;
const RECAPTCHA_KEY = process.env.REACT_APP_RECAPTCHA_CLIENT_KEY


// Validating input fields
const validateInputs = (captchaValue) => {
  // Email address validation
  const emailRegex = new RegExp("[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+(?:\\.[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?\\.)+[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?");

  // all fields of the form
  const email = document.getElementById("email");
  const pass = document.getElementById("password");
  const error = document.querySelector(".error");

  // Focus on field with error, and show error message
  function focusField(inputElement, eye_option, err_msg) {
    // if eye option is present, we need to move out 1 step more
    const fieldParent = eye_option?(inputElement?.parentElement.parentElement):(inputElement?.parentElement);
    inputElement?.classList.add("fill");
    fieldParent?.classList.add("active");
    inputElement?.focus();

    error.innerHTML = err_msg;
    error?.classList.add("active");
  }


  if (!(email?.value)) {
    focusField(email, false, "Email is required");
    return false;
  }

  if (!(emailRegex.test(email?.value))) {
    focusField(email, false, "Email is invalid");
    return false;
  }

  if (!(pass?.value)) {
    focusField(pass, true, "Password is required");
    return false;
  }

  if (!captchaValue) {
    error.innerHTML = "reCaptcha is required";
    error?.classList.add("active");
    return false;
  }

  error?.classList.remove("active");
  return true;
};


// Main Function
function InputFields() {
  const navigate = useNavigate();

  // Submit button loading animation
  const [loading, setLoading] = useState(false);
  // google recaptcha value
  const captchaValue = useRef(null);

  // Recaptcha when filled
  function captcha(value) {
    captchaValue.current = value
  }

  useEffect( () => {
    const inputBox = document.querySelectorAll(".input-box__group");
    inputBox.forEach((input) => {
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


    const eyeIcon = document.querySelector(".icon");
    const aboveEyeInput = eyeIcon.parentElement.querySelector("input");

    // Eye icon click functionality
    eyeIcon.addEventListener("click", () => {
      if (eyeIcon.classList.contains("uil-eye")) {
        // if input is hidden
        eyeIcon.classList.remove("uil-eye");
        eyeIcon.classList.add("uil-eye-slash");
        aboveEyeInput.setAttribute("type", "text")
      } else {
        // if input is visible
        eyeIcon.classList.remove("uil-eye-slash");
        eyeIcon.classList.add("uil-eye");
        aboveEyeInput.setAttribute("type", "password")
      }
    });


    // Login button click functionality
    const loginBtn = document.querySelector(".button-div");
    loginBtn.addEventListener("click", async () => {
      // if button is disabled, do nothing
      if (loginBtn.classList.contains("disabled")) return;

      // validate input fields
      const validation = validateInputs(captchaValue.current);
      if (!validation) return;

      // API call
      setLoading(true);
      loginBtn.classList.add("disabled");

      try {
        const api_call = await api.post("/login", {
          email: document.getElementById("email")?.value,
          password: document.getElementById("password")?.value,
          recaptcha: captchaValue.current
        });

        localStorage.setItem("session_id", api_call.data.session_id);
        localStorage.setItem("session_type", api_call.data.session_type);
        navigate("/");
      } catch (err) {
        setLoading(false);
        const error = document.querySelector(".error");
        error.innerHTML = err.response.data.msg;
        loginBtn.classList.remove("disabled");
        error?.classList.add("active");
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="form__input-box margin-left">
      <div className="input-box__group email">
        <label htmlFor="email">
          <i className="uil uil-envelope-alt label-head-icon" /> Email
        </label>
        <input type="email" id="email" />
      </div>

      <div className="input-box__group password">
        <label htmlFor="password">
          <i className="uil uil-key-skeleton label-head-icon" /> Password
        </label>

        <span>
          <input type="password" id="password" />
          <i className="uil uil-eye icon"></i>
        </span>
      </div>

      <ReCAPTCHA sitekey={RECAPTCHA_KEY} onChange={captcha} className="recaptcha" />

      <div className="form__input-box__submit">
        <p className="error">There is some Error</p>
        <div className="button-div">
          <button type="submit">
            <span>
              {loading ? (<img src={LOADING_GIF + "?tr=h-30,w-30"} alt="loading" />) : "Login"}
            </span>
          </button>
        </div>
        <p className="submit-description">
          Forgot Your Password?{" "}
          <Link to="/forgot-pass" onClick={() => window.scrollTo(0, 0)}>Reset</Link>
        </p>
        <p className="submit-description">
          New Here?{" "}
          <Link to="/register" onClick={() => window.scrollTo(0, 0)}>Register</Link>
        </p>
      </div>
    </div>
  );
}

export default InputFields;
