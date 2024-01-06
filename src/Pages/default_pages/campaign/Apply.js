import React, { useEffect } from "react";
import "../../../css/Pages/default_pages/campaign/apply.css";
import { api } from "../../../backend";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';


function Apply({ questions, hidePopup, applyTask=true, campaign_id, apiCampaignCall, application_id }) {
  const session_id = localStorage.getItem('session_id');
  const navigate = useNavigate();

  const fillText = async () => {
    if (!application_id) return;
    try {
      const api_data = await api.get(`/company/application?application_id=${application_id}&session_id=${session_id}`);
      // Cover Letter
      document.querySelector(".apply-question__answer.cover").value = api_data.data?.application?.cover_letter;

      const answers = document.querySelectorAll(".apply-question__answer.ans");
      for (let i=0; i<answers.length; i++) {
        answers[i].value = api_data.data?.application?.answers[i];
      }
    } catch (err) {
      if (err.response.status === 401 || err.response.status === 403) {
        localStorage.removeItem('session_id');
        localStorage.removeItem('session_type');
        navigate("/login");
      } else {
        alert(err.response.data.msg);
      }
    }
  }

  useEffect(() => {
    const popup = document.querySelector(".apply-popup");
    popup.addEventListener("click", (e) => {
      if (e.target.classList.contains("apply-popup")){
        hidePopup();
      }
    });

    fillText();
    document.body.classList.add("fixed");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkFieldLength = (e) => {
    const textArea = e.currentTarget;
    const textLimit = textArea.parentElement.querySelector(".text-stats");

    if (textArea.value.length > parseInt(textLimit.dataset.size)) {
      textArea.value = textArea.value.slice(0, parseInt(textLimit.dataset.size));
    }
    textLimit.querySelector("span").innerText = textArea.value.length;
  }


  const submitFunc = async (e) => {
    if (e.currentTarget.classList.contains("disabled")) {
      return
    }

    e.currentTarget.classList.add("disabled");

    const cover_letter = document.querySelector(".apply-question__answer.cover");
    if (!cover_letter.value) {
      cover_letter.focus();
      e.currentTarget?.classList.remove("disabled");
      return;
    }

    const answers = [];

    for (let ans of document.querySelectorAll(".apply-question__answer.ans")) {
      if (!ans.value) {
        ans.focus();
        e.currentTarget?.classList.remove("disabled");
        return;
      } else {
        answers.push(ans.value);
      }
    }

    try {
    if (applyTask) {
        await api.post(`/company/application?session_id=${session_id}`, {
          campaign_id,
          cover_letter: cover_letter.value,
          answers
        });
        await apiCampaignCall();
      } else {
        await api.put(`/company/application?session_id=${session_id}&application_id=${application_id}`, {
          cover_letter: cover_letter.value,
          answers
        });
      }
      e.currentTarget?.classList.remove("disabled");
      hidePopup();
    } catch (err) {
      if (err.response.status === 401 || err.response.status === 403) {
        localStorage.removeItem('session_id');
        localStorage.removeItem('session_type');
        navigate("/login");
      } else {
        alert(err.response.data.msg);
      }
      e.currentTarget?.classList.remove("disabled");
    }
  }

  return (
    <div className="apply-popup">
      <div className="apply-popup__box">
        <div className="apply-question coverletter">
          <h4 className="apply-question__title">Cover Letter</h4>
          <q className="apply-question__text">Why should you be hired for this role?</q>
          <textarea onInput={checkFieldLength} className="apply-question__answer cover" placeholder="Type your answer here..."></textarea>
          <p className="text-stats" data-size="1500"><span>0</span>/1500</p>
          <p className="error">This field is required</p>
        </div>

        {
          questions?.map((que, i) => (
            <div className="apply-question" key={uuidv4()}>
              <h4 className="apply-question__title">Question {i+1}</h4>
              <q className="apply-question__text">{que}</q>
              <textarea onInput={checkFieldLength} className="apply-question__answer ans" placeholder="Type your answer here..."></textarea>
              <p className="text-stats" data-size="300"><span>0</span>/300</p>
              <p className="error">This field is required</p>
            </div>
          ))
        }

        <div className="apply--submit">
            <button className="submit--btn" onClick={submitFunc}>
              {applyTask?"Submit":"Update"}
            </button>
            <button className="cancel--btn" onClick={() => hidePopup()}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default Apply