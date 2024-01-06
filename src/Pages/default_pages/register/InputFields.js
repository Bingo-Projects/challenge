import React, { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha"
import {Link} from "react-router-dom";
import { api } from "../../../backend";

const LOADING_GIF = process.env.REACT_APP_LOADING_IMG;
const RECAPTCHA_KEY = process.env.REACT_APP_RECAPTCHA_CLIENT_KEY


// Validating input fields
const validateInputs = (captchaValue, job_seeker) => {
  // Email address validation
  const emailRegex = new RegExp("[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+(?:\\.[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?\\.)+[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?");

  // all fields of the form
  const error = document.querySelector(".error");
  const fullName = document.querySelector("#name");
  const comp_name = document.querySelector("#comp_name");
  const mobile = document.querySelector("#mobile");
  const email = document.querySelector("#email");
  const pass = document.querySelector("#pass");
  const c_pass = document.querySelector("#c-pass");

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

  if (!(fullName?.value)) {
    focusField(fullName, false, "Please enter your full name")
    return false;
  }
  else if(fullName?.value?.length > 25) {
    focusField(fullName, false, "Name can be 25 characters only")
    return false;
  }

  if (!job_seeker) {
    if (!(comp_name?.value)) {
      focusField(comp_name, false, "Please enter your company name")
      return false;
    }
    else if(comp_name?.value?.length > 60) {
      focusField(comp_name, false, "Company name can be 60 characters only")
      return false;
    }
  }

  if (!(mobile?.value)) {
    focusField(mobile, false, "Please enter your phone number")
    return false;
  } else {
    if (mobile?.value?.length !== 10) {
      focusField(mobile, false, "Invalid phone number");
      return false;
    }

    // checking if mobile number is valid
    for (let i=0; i<mobile?.value?.length; i++) {
      const ascii = mobile?.value?.charCodeAt(i);
      if ((ascii < 48) || (ascii > 57)) {
        focusField(mobile, false, "Invalid phone number");
        return false;
      }
    }
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

  if (!(pass?.value)) {
    focusField(pass, false, "Password is empty")
    return false;
  }
  else if(pass?.value?.length > 120) {
    focusField(pass, false, "Password can be 120 characters only")
    return false;
  }

  if (!(c_pass?.value)) {
    focusField(c_pass, true, "Confirm Password is empty")
    return false;
  }

  if (c_pass?.value !== pass?.value) {
    focusField(c_pass, true, "Password and Confirm Password do not match")
    return false;
  }

  if (!captchaValue) {
    error.innerHTML = "reCaptcha is required";
    error?.classList?.add("active");
    return false;
  }

  // Saving field data for future reference
  return {
    name: fullName?.value,
    mobile: mobile?.value,
    email: email?.value,
    pass: pass?.value,
    cpass: c_pass?.value,
    comp_name: comp_name?.value
  };
};


// Filling already present data - (got back from OTP section)
function fillFields(fieldData) {

  // Getting all fields from the form
  const fullName = document.querySelector("#name");
  const comp_name = document.querySelector("#comp_name");
  const mobile = document.querySelector("#mobile");
  const email = document.querySelector("#email");
  const pass = document.querySelector("#pass");
  const c_pass = document.querySelector("#c-pass");

  // func for activating field, and filling with values
  function activeField(inputElement, eye_option, value) {
    if (!inputElement) return;
    inputElement.value = value;
    const fieldParent = eye_option?(inputElement?.parentElement?.parentElement):(inputElement?.parentElement);
    inputElement?.classList?.add("fill");
    fieldParent?.classList?.add("active");
  }

  if (fieldData.name) {
    activeField(fullName, false, fieldData.name);
  }

  if (fieldData.comp_name) {
    activeField(comp_name, false, fieldData.comp_name);
  }

  if (fieldData.mobile) {
    activeField(mobile, false, fieldData.mobile);
  }

  if (fieldData.email) {
    activeField(email, false, fieldData.email);
  }

  if (fieldData.pass) {
    activeField(pass, false, fieldData.pass);
  }

  if (fieldData.cpass) {
    activeField(c_pass, true, fieldData.cpass);
  }
}


// Main Function
function InputFields({showInputForm, fieldData, jobSeeker}) {
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

    // Mobile Input Validation
    const mobileInput = document.getElementById("mobile");
    mobileInput?.addEventListener("keyup", () => {
      let filtered_value = "";
      for (let key of mobileInput.value) {
        const keyCode = key.charCodeAt(0);
        if (keyCode < 48 || keyCode > 57) {
          continue;
        }
        filtered_value += key;
      }
      mobileInput.value = filtered_value.slice(0, 10);
    });

    // Name Input Validation
    const nameInput = document.getElementById("name");
    nameInput?.addEventListener("keyup", () => {
      if (nameInput.value.length > 25) {
        nameInput.value = nameInput.value.slice(0, 25);
      }
    });

    // Company name Input Validation
    const comp_name_input = document.getElementById("comp_name");
    comp_name_input?.addEventListener("keyup", () => {
      if (comp_name_input.value.length > 60) {
        comp_name_input.value = comp_name_input.value.slice(0, 60);
      }
    });

    // Email Input Validation
    const emailInput = document.getElementById("email");
    emailInput?.addEventListener("keyup", () => {
      if (emailInput.value.length > 50) {
        emailInput.value = emailInput.value.slice(0, 50);
      }
    });


    const eyeIcon = document.querySelector(".icon");
    const aboveEyeInput = eyeIcon.parentElement.querySelector("input");

    // Eye icon click functionality
    eyeIcon?.addEventListener("click", () => {
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


    // Register button click functionality
    const registerBtn = document.querySelector(".button-div");
    registerBtn?.addEventListener("click", async () => {
      // if button is disabled, do nothing
      if (registerBtn.classList.contains("disabled")) return;

      // validate input fields
      const validated = validateInputs(captchaValue.current, jobSeeker);
      if (!validated) return;

      // API call
      setLoading(true);
      registerBtn.classList.add("disabled");

      const form_obj = (jobSeeker ? {
        "full_name": validated?.name,
        "email": validated?.email,
        "mobile": validated?.mobile,
        "password": validated?.pass,
        "recaptcha": captchaValue?.current
      }: {
        "comp_name": validated?.comp_name,
        "admin_name": validated?.name,
        "email": validated?.email,
        "mobile": validated?.mobile,
        "password": validated?.pass,
        "recaptcha": captchaValue?.current
      })

      try {
        const otp = await api.post(`/register/${jobSeeker?"job-seeker":"company"}`, form_obj);
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
  }, [])


  // Recaptcha when filled
  function captcha(value) {
    captchaValue.current = value
  }

  return (
    <div className="form__input-box margin-left">

      {!jobSeeker && (
        <div className="input-box__group company-name">
          <label htmlFor="comp_name">
            <i className="uil uil-building label-head-icon" />
            <span>Company Name</span>
          </label>
          <input type="text" id="comp_name" />
        </div>
      )}

      <div className="input-box__group name">
        <label htmlFor="name">
          <i className="uil uil-user-circle label-head-icon" />
          <span>{jobSeeker?"Full":"Admin"} Name</span>
        </label>
        <input type="text" id="name" />
      </div>

      <div className="input-box__group mobile">
        <label htmlFor="mobile">
          <i className="uil uil-mobile-android label-head-icon" />
          <span>Mobile Number</span>
        </label>
        <input type="text" id="mobile" />
      </div>

      <div className="input-box__group email">
        <label htmlFor="email">
          <i className="uil uil-envelope-alt label-head-icon" />
          <span>{jobSeeker?"":"Company"} Email</span>
        </label>
        <input type="email" id="email" />
      </div>

      <div className="input-box__group password">
        <label htmlFor="password">
          <i className="uil uil-key-skeleton label-head-icon" />
          <span>Password</span>
        </label>
        <input type="password" id="pass" />
      </div>

      <div className="input-box__group password">
        <label htmlFor="c-pass">
          <i className="uil uil-asterisk label-head-icon"></i>
          <span>Confirm Password</span>
        </label>

        <span>
          <input type="password" id="c-pass" />
          <i className="uil uil-eye icon"></i>
        </span>
      </div>

      <ReCAPTCHA sitekey={RECAPTCHA_KEY} onChange={captcha} className="recaptcha" />

      <div className="form__input-box__submit">
        <p className="error">There is some Error</p>
        <div className="button-div">
          <button type="submit">
            <span>
              {loading ? (<img src={LOADING_GIF + "?tr=h-30,w-30"} alt="loading" />) : "Register"}
            </span>
          </button>
        </div>
        <p className="submit-description">
          Already Registered?{" "}
          <Link to="/login" onClick={() => window.scrollTo(0, 0)}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default InputFields;
