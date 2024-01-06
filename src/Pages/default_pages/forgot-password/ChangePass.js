import React, { useEffect, useRef, useState } from "react";
import { api } from "../../../backend";

const LOADING_GIF = process.env.REACT_APP_LOADING_IMG;


// Validating input fields
const validateInputs = () => {
  // all fields of the form
  const error = document.querySelector(".error");
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

  if (!(pass?.value)) {
    focusField(pass, false, "Password is empty")
    return false;
  }
  else if(pass?.value > 120) {
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

  // Saving field data for future reference
  return {
    pass: pass?.value,
    cpass: c_pass?.value,
  };
};


// Main Function
function InputFields({verify_id, setShowMsg}) {
  // Submit button loading animation
  const [loading, setLoading] = useState(false);
  // google recaptcha value
  const captchaValue = useRef(null);

  useEffect( () => {
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
      const validated = validateInputs(captchaValue.current);
      if (!validated) return;

      // API call
      setLoading(true);
      registerBtn.classList.add("disabled");

      try {
        const api_call = await api.put(`/verify/forgot-pass/change?verify_id=${verify_id}`, {
          password: document.getElementById("pass").value,
        });
        localStorage.setItem("session_id", api_call.data.session_id);
        localStorage.setItem("session_type", api_call.data.session_type);
        setShowMsg(true);
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

  return (
    <div className="form__input-box margin-left">
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

      <div className="form__input-box__submit">
        <p className="error">There is some Error</p>
        <div className="button-div">
          <button type="submit">
            <span>
              {loading ? (<img src={LOADING_GIF + "?tr=h-30,w-30"} alt="loading" />) : "Change Password"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default InputFields;