import React, { useEffect } from "react";
import "../../../css/Pages/default_pages/searching/card.css";
import { useState } from "react";
import { api } from "../../../backend";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";


const DEFAULT_IMG = process.env.REACT_APP_COMPANY_DEFAULT_PROFILE;

const formatTitle = (title) => {
  const splited = title.toLowerCase().split(" ").join("-");
  console.log(splited.split("-"));
  let formated = "";
  for (let i of splited.split("-")) {
    if (i === "") {
      if (formated[formated.length-1] === "-") {
        continue;
      } else {
        formated += "-"
      }
    }
    else {
      formated += i + "-"
    }
  }

  return formated.slice(0, [formated.length-1]);
}


const getFormatedSalary = (campaign_type, details)  => {
  if (campaign_type === 0) {
    if (details?.stipend_type === 0) {
      return (details?.stipend_amount?.amt)?.toLocaleString("en-US");
    }
    else if (details?.stipend_type === 1) {
      const start = (details?.stipend_amount?.start)?.toLocaleString("en-US");
      const end = (details?.stipend_amount?.end)?.toLocaleString("en-US");
      return `${start} - ${end}`;
    } else {
      return "Unpaid";
    }
  } else {
    if (details?.ctc_type === 0) {
      return (Math.round(((details?.ctc?.amt || 0) / 100000) * 10)/10).toString() + " LPA";
    }
    else {
      const start = (Math.round(((details?.ctc?.start || 0) / 100000) * 10)/10).toString()
      const end = (Math.round(((details?.ctc?.end || 0) / 100000) * 10)/10).toString()
      return `${start} - ${end} LPA`;
    }
  }
}


const getFormatedLocation = (locations) => {
  if (!locations || locations.length === 0) {
    return "Anywhere"
  }

  let location_string = "";
  for (let location of locations) {
    location = location[0].toUpperCase() + location.slice(1, location.length)
    location_string += location + ", ";
  }

  return location_string.slice(0, location_string.length-2)
}


function timePassedSince(date) {
  // Convert the input date to milliseconds
  const inputDate = new Date(date).getTime();

  // Get the current date and time in milliseconds
  const currentDate = new Date().getTime();

  // Calculate the time difference in milliseconds
  const timeDiff = currentDate - inputDate;

  // Calculate the time components
  const seconds = Math.floor((timeDiff / 1000) % 60);
  const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
  const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  if (days > 0) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }
  if (hours > 0) {
    return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  }
  if (minutes > 0) {
    return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  }
  if (seconds > 0) {
    return `${seconds} sec${seconds === 1 ? "" : "s"} ago`;
  }

  return "";
}



function Card({ campaign }) {
  const navigate = useNavigate();
  const [company, setCompany] = useState({});
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    // getting company details
    const fetchCompany = async () => {
      try {
        const company = await api.get(`/register/company/short?comp_id=${campaign?.campaign?.company_id}`);
        setCompany(company.data.company);
      }
      catch (err) {
        if (err.response.status === 401 || err.response.status === 403) {
          localStorage.removeItem('session_id');
          localStorage.removeItem('session_type');
          navigate("/login");
        } else {
          alert(err.response.data.msg);
        }
      }
    }

    // scroll to top whenever page changes
    const btns = document.querySelectorAll(".foot-btn");
    btns.forEach( btn => 
      btn.addEventListener("click", () => window.scrollTo(0, 0))
    );

    fetchCompany();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (imageUrl === "" && company?.comp_logo) {
      fetch(process.env.REACT_APP_IMAGE_SERVER + company.comp_logo)
        .then(response => response.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
        }).catch(err => {
          setImageUrl(DEFAULT_IMG)
        });

      return () => {
        // Clean up the temporary URL
        URL.revokeObjectURL(imageUrl);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company]);

  return (
    <div className="card">
      <div className="card__head">
        <div className="card__head__info-banner">
          <i className="uil uil-arrow-up-right"></i>
          <span className="card__info-banner--text">{(campaign?.campaign?.campaign_type)?"Job":"Internship"}</span>
        </div>
      </div>

      <div className="card__company-info">
        <div className="card__company-info__text">
          <div className="card__company-info__text--post">{campaign?.campaign?.campaign_title}</div>
          <div className="card__company-info__text--comp-name">{company?.comp_name}</div>
        </div>

        <div className="card__company-info__logo">
          <img src={imageUrl || (
            DEFAULT_IMG + "?tr=h-50,w-50"
          )} alt="logo" />
        </div>
      </div>

      <div className="card__job-info">
        <div className="card__job-info__item experience">
          <i className="uil uil-bag-alt"></i>
          <span className="card__job-info__item--text">{campaign?.campaign?.min_experience} Yrs</span>
        </div>
        <div className="card__job-info__item pay">
          <i className="uil uil-rupee-sign"></i>
          <span className="card__job-info__item--text">
            {getFormatedSalary(campaign?.campaign?.campaign_type, campaign?.details)}
          </span>
        </div>
        <div className="card__job-info__item location">
          <i className="uil uil-location-point"></i>
          <span className="card__job-info__item--text">{getFormatedLocation(campaign?.campaign?.locations)}</span>
        </div>

        <div className="card__job-info__item role">
          <i className="uil uil-file-alt"></i>
          <span className="card__job-info__item--text">{campaign?.details?.responsibility} ...</span>
        </div>
      </div>

      <div className="card__tags">
        {
          (campaign?.campaign?.skills_required)?.map((skill, i) => 
            <React.Fragment key={uuidv4()}>
              <div className="card__tags--item">{skill}</div>
              {
                (i !== campaign?.campaign?.skills_required.length - 1) &&
                <span className="dot" />
              }
            </React.Fragment>
          )
        }
      </div>

      <div className="card__foot">
        <div className="card__foot--time">{timePassedSince(campaign?.campaign?.created_date)}</div>
        
        <div className="card__foot__buttons">
          <a
            href={`/campaign/${
              formatTitle(campaign?.campaign?.campaign_title) +
              "-" +
              campaign?.campaign?._id
            }/view`}
            target="__blank"
            className="card__foot__buttons--detail foot-btn"
          >
            Learn More
          </a>
          <a
            href={`/campaign/${
              campaign?.campaign?.campaign_title.toLowerCase().split(" ").join("-") +
              "-" +
              campaign?.campaign?._id
            }/apply`}
            target="__blank"
            className="card__foot__buttons--apply foot-btn"
          >
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
}

export default Card;
