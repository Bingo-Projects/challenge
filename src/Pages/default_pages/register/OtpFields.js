import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { api } from '../../../backend';
import { v4 as uuidv4 } from 'uuid';


const LOADING_GIF = process.env.REACT_APP_LOADING_IMG;
const SUCCESS_GIF = process.env.REACT_APP_SUCCESS_GIF;
const WAITING_GIF = process.env.REACT_APP_WAITING_GIF;


// Success message component
function SuccessMessage({jobSeeker}) {

  // Message for consultant
  const consultant_msg = [
    "Your application has been submited.",
    "Now it will be verified by admin, and once it is verified your account will be created.",
    "Thanks for your patience... (^_^)"
  ]

  // Message for jobSeeker
  const jobseeker_msg = [
    "Thanks for registering with us...",
    "Please continue with your account"
  ]

  // which message to show
  const showMsg = jobSeeker?jobseeker_msg:consultant_msg;

  return (
    <>
      <h4 className="otp_heading">{jobSeeker?"Registration Completed":"Pending Admin Approval"}</h4>
      {showMsg?.map((msg) => <p key={uuidv4()} className="otp_description">{msg}</p>)}

      <img src={
        (jobSeeker?SUCCESS_GIF:WAITING_GIF) + ("?tr=h-300")
      } alt="waiting-gif" className='success-img' />

      <div className="form__input-box__submit">
        <Link className="button-div" to={"/"} onClick={() => window.scrollTo(0, 0)}>
          <button type="submit">
            <span>{jobSeeker?"Let's Go":"Okey"}</span>
          </button>
        </Link>
      </div>
    </>
  );
}


// OTP verification component
function InputField({showInputForm, showMsg, verify_id, jobSeeker, email}) {
  // Button loading animation
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const error = document.querySelector(".error");

    // When submit button is clicked
    const verifyBtn = document.querySelector(".button-div.verify");
    verifyBtn.addEventListener("click", async () => {
      // if the button is disabled, do nothing
      if (verifyBtn.classList.contains("disabled")) return;

      const otp = document.querySelector(".otp_input");
      // validating submited OTP
      if (!(otp?.value) || (otp?.value.length < 4) || (otp?.value.length > 4)) {
        error.innerHTML = "Please enter a valid otp";
        error.classList.add("active");
        otp?.focus();
      }else{
        error.classList.remove("active");
        setLoading(true);
        verifyBtn.classList.add("disabled");

        // API call for OTP checking
        try {
          const api_call = await api.put(`/verify/${jobSeeker?"job-seeker":"company"}?verify_id=${verify_id}&verify_otp=${otp?.value}`);
          if (jobSeeker) {
            localStorage.setItem("session_id", api_call.data.session_id);
            localStorage.setItem("session_type", "job_seeker");
          }
          showMsg(true);
        } catch (err) {
          error.innerHTML = err.response.data.msg;
          error.classList.add("active");
          verifyBtn.classList.remove("disabled");
          setLoading(false);
        }

        // removing all timeouts
        let id = window.setTimeout(function() {}, 0);
        while (id--) {
          window.clearTimeout(id);
        }

        setTimeout(() => {
          const error = document.querySelector(".error");
          error?.classList.remove("active");
        }, 5000);
      }
    });

    // go back - onclick functionality
    const backBtn = document.querySelector(".button-div.back");
    backBtn.addEventListener("click", () => {
      showInputForm(true);
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showInputForm, showMsg]);

  const resendOtp = async (e) => {
    const resendBtn = document.querySelector(".submit-description button");
    if (resendBtn.classList.contains("disable")) {
      return;
    }

    resendBtn.classList.add("disable");
    setLoading(true);

    try {
      await api.put(`/verify/${jobSeeker?"job-seeker":"company"}/resend?verify_id=${verify_id}`);
      const error = document.querySelector(".error");
      error.innerHTML = "OTP resend successfully";
      error?.classList.add("active");
      resendBtn.classList.remove("disable");
      setLoading(false);
    } catch (err) {
      const error = document.querySelector(".error");
      error.innerHTML = err.response.data.msg;
      error?.classList.add("active");
      resendBtn.classList.remove("disable");
      setLoading(false);
    }

    setTimeout(() => {
      const error = document.querySelector(".error");
      error?.classList.remove("active");
    }, 5000);
  }

  return (
    <>
      <h4 className="otp_heading">OTP Verification</h4>
      <p className="otp_description">4 digit OTP has been sent to your email</p>
      <p className="otp_email">{email}</p>

      <input type="number" placeholder='XXXX' className='otp_input' />

      <div className="form__input-box__submit">
        <p className="error">There is some Error</p>
        <div className="button-div verify">
          <button type="submit">
            <span>
              {loading ? (<img src={LOADING_GIF + "?tr=h-30,w-30"} alt="loading" />) : "Verify"}
            </span>
          </button>
        </div>

        <div className="button-div back">
          <button type="submit">
            <span>Go Back</span>
          </button>
        </div>

        <p className="submit-description">
          Did not Receive?{" "}
          <button onClick={(e) => resendOtp(e)}>Resend</button>
        </p>
      </div>
    </>
  )
}


// Main Function
function OtpFields( {showInputForm, jobSeeker, verify_id, email} ) {
  // whether to show (OTP input) or (Success Message)
  const [showMsg, setShowMsg] = useState(false);

  return (
    <div className="form__input-box otp" >
      {showMsg? 
        (<SuccessMessage jobSeeker={jobSeeker} />):
        (<InputField showInputForm={showInputForm} email={email} jobSeeker={jobSeeker} showMsg={setShowMsg} verify_id={verify_id} />)
      }
    </div>
  )
}

export default OtpFields;