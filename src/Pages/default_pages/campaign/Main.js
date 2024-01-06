import Navbar from "../Navbar";
import Footer from "../Footer";
import { api } from "../../../backend";
import "../../../css/Pages/default_pages/campaign/main.css";
import Apply from "./Apply";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { Helmet } from "react-helmet";


const DEFAULT_IMG = process.env.REACT_APP_COMPANY_DEFAULT_PROFILE;


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
      return (details?.ctc?.amt)?.toLocaleString("en-US");
    }
    else {
      const start = (details?.ctc?.start)?.toLocaleString("en-US");
      const end = (details?.ctc?.end)?.toLocaleString("en-US");
      return `${start} - ${end}`;
    }
  }
}

const getStipendRelease = (stipend_release) => {
  if (stipend_release === 0) {
    return "Weekly"
  }
  else if (stipend_release === 1) {
    return "Monthly"
  }
  else {
    return "Lump-sum"
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

  return location_string?.slice(0, location_string.length-2)
}

function Main() {
  const navigate = useNavigate();
  const session_id = localStorage.getItem("session_id");
  const { campaign_title, action } = useParams();
  let campaign_id = campaign_title.split("-");
  campaign_id = campaign_id[campaign_id.length - 1];



  // API Data
  const [company, setCompany] = useState({});
  const [campaign, setCampaign] = useState({});
  const [imageUrl , setImageUrl] = useState("");

  const [popup, setPopup] = useState(false);
  const [application_present, setApplicationPresent] = useState(false);

  const hidePopup = () => {
    document.body.classList.remove("fixed");
    setPopup(false);

    const link = window.location.href.replace("apply", "view").split("/campaign")[1]
    navigate("/campaign" + link);
  }


  async function apiCampaignCall() {
    try {
      const campaign = await api.get(
        `/company/campaign/public?campaign_id=${campaign_id}&detailed=true` + (session_id?`&session_id=${session_id}`:"")
      );
      const company = await api.get(`/register/company/short?comp_id=${campaign.data?.campaign?.company_id}`);
      const profile = await api.get(`/profile/company/public?comp_id=${campaign.data?.campaign?.company_id}`);

      if (campaign.data?.exists) {
        setApplicationPresent(true);
      } else {
        setApplicationPresent(false);
      }

      setCampaign({
        campaign: campaign?.data?.campaign,
        details: campaign?.data?.details,
        application_id:  campaign?.data?.application_id
      });
      setCompany({...(company?.data?.company), ...(profile?.data?.company)});

      if (action === "apply") {
        applyFunction();
      }
    }
    catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('session_id');
        localStorage.removeItem('session_type');
        navigate("/login");
      } else {
        alert(err.response?.data?.msg);
      }
    }
  }

  const applyFunction = () => {
    if (!localStorage.getItem("session_id")) {
      navigate("/login");
    } else {
      setPopup(true);
    }
  }

  const deleteFunction = async (e) => {
    const proceed = window.confirm("Are you sure you want to delete this application?");
    if (!proceed) {
      return;
    }

    if (e.currentTarget.classList?.contains("disabled")) {
      return
    }

    e?.currentTarget?.classList?.add("disabled");
    try {
      await api.delete(`/company/application?session_id=${session_id}&application_id=${campaign?.application_id}`);
      await apiCampaignCall();
      e?.currentTarget?.classList?.remove("disabled");
    } catch (err) {
      if (parseInt(err.response?.status) === 401){
        localStorage.removeItem("session_id");
        navigate("/");
      } else {
        navigate("/");
      }
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    apiCampaignCall();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (imageUrl === "" && company?.comp_logo) {
      fetch(process.env.REACT_APP_IMAGE_SERVER + company.comp_logo)
        .then(response => response.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
        });

      return () => {
        // Clean up the temporary URL
        URL.revokeObjectURL(imageUrl);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company]);

  return (
    <>
      <Navbar />
      <Helmet>
                     skill =  {(campaign?.campaign?.skills_required?.map((skill) => ( skill)))};
                    <title>Top {campaign?.campaign?.campaign_title || "JustFreshJobs"} Jobs</title>
                    <meta name="keywords" content={ (campaign?.campaign?.skills_required?.map((skill) => ( skill))) + " Jobs"} />
                    <meta property="og:description" content={"Today's top 10 jobs in "+ company.comp_name + " in india on JustFreshJobs.com. top 5 Job Portal In India.latest "+[campaign?.campaign?.campaign_title || "JustFreshJobs"]+" jobs in "+company.comp_name+ " with " +(campaign?.campaign?.skills_required?.map((skill) => ( skill)))+ " skills.Job Openings In Multiple Locations, Latest Jobs in "+(campaign?.campaign?.skills_required?.map((skill) => ( skill)))} />
                    <meta charset="utf-8" />
                    <meta name="author" content="JustFreshJobs"></meta>

                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={(campaign?.campaign?.campaign_title || "JustFreshJobs")+" Jobs"} />
                    
                    <meta property="og:image" content={imageUrl} />
                    <meta property="og:url" content={window.location.href} />
                    </Helmet>
      { popup && (
        <Apply 
          questions={campaign?.details?.questions}
          hidePopup={hidePopup}
          applyTask={!application_present}
          campaign_id={campaign?.campaign?._id}
          apiCampaignCall={apiCampaignCall}
          application_id={campaign?.application_id}
        />
      )}

      <div className="campaign--public">
        <div className="campaign--public__company">
          {(campaign?.campaign?.campaign_type)?(
            <div className="campaign-type job">Job</div>
          ):(
            <div className="campaign-type">Internship</div>
          )}

          {/* Head */}
          <div className="campaign--public__company__head">
            <div className="section">
              <h1 className="campaign-name">{campaign?.campaign?.campaign_title}</h1>
              <h4 className="campaign-company">{company?.comp_name}</h4>
            </div>
            <div className="section">
              <img
                src={imageUrl || (
                  DEFAULT_IMG + "?tr=h-50,w-50"
                )}
                alt="Company Logo"
                className="campaign-company--logo"
              />
            </div>
          </div>

          {/* Body */}
          <div className="campaign--public__company__body">
            {((campaign?.details?.work_type) === 1) && (
              <div className="work-location">
                <i className="uil uil-house-user"></i>
                <p>Work From Home</p>
              </div>
            )}

            {/* Info Container */}
            <div className="campaign-info">
              <div className="info-box">
                <div className="info-box__heading">
                  <i className="uil uil-briefcase-alt"></i>
                  <p>Min Experience</p>
                </div>

                <div className="info-box__value">
                  <p>{campaign?.campaign?.min_experience} years</p>
                </div>
              </div>

              { (campaign?.details?.duration || campaign?.details?.probation) && (
                <div className="info-box">
                  <div className="info-box__heading">
                    <i className="uil uil-calender" />
                    <p>
                      {(campaign?.campaign?.campaign_type === 0)?"Duration":("Probation")}
                    </p>
                  </div>

                  <div className="info-box__value">
                    <p>
                      {(campaign?.campaign?.campaign_type === 0)?
                        (campaign?.details?.duration):(
                        (campaign?.details?.probation)
                          &&
                        ((campaign?.details?.probation_duration || "0") + " month(s)")
                      )}
                    </p>
                  </div>
                </div>
              )}

              <div className="info-box">
                <div className="info-box__heading">
                  <i className="uil uil-money-bill" />
                  <p>{(campaign?.campaign?.campaign_type === 0)?"Stipend":"CTC (Anually)"}</p>
                </div>

                <div className="info-box__value">
                  <i className="uil uil-rupee-sign" style={{ marginRight: "10px" }} />
                  <p>{getFormatedSalary(campaign?.campaign?.campaign_type, campaign?.details)}</p>
                </div>
              </div>

              { (((campaign?.campaign?.campaign_type) === 0) && ((campaign?.details?.stipend_type !== 2))) && (
                <div className="info-box">
                  <div className="info-box__heading">
                    <i className="uil uil-rocket" />
                    <p>Stipend Release</p>
                  </div>

                  <div className="info-box__value">
                    <p>{getStipendRelease(campaign?.details?.stipend_release)}</p>
                  </div>
                </div>
              )}

              <div className="info-box">
                <div className="info-box__heading">
                  <i className="uil uil-users-alt" />
                  <p>Openings</p>
                </div>

                <div className="info-box__value">
                  <p>{campaign?.campaign?.vacancies}</p>
                </div>
              </div>

              { (campaign?.details?.work_type !== 1) && (
                <div className="info-box">
                  <div className="info-box__heading">
                    <i className="uil uil-map-marker" />
                    <p>Location</p>
                  </div>

                  <div className="info-box__value">
                    <p>{getFormatedLocation(campaign?.campaign?.locations)}</p>
                  </div>
                </div>)
              }
            </div>

          </div>
        </div>

        <div className="campaign--public__details">
          

          <div className="campaign--work campaign-container">
            <h4 className="campaign-sub-heading">Work Responsibilities</h4>
            <p className="campaign-text">
              {(campaign?.details?.responsibility?.split("\n"))?.map((words) => (
                <React.Fragment key={uuidv4()}>
                  <span>{words}</span><br/>
                </React.Fragment>
              ))}
            </p>
          </div>

          { campaign?.details?.preference && <div className="campaign--work campaign-container">
            <h4 className="campaign-sub-heading">Preferences</h4>
            <p className="campaign-text">
              {(campaign?.details?.preference?.split("\n"))?.map((words) => (
                <React.Fragment key={uuidv4()}>
                  <span>{words}</span><br/>
                </React.Fragment>
              ))}
            </p>
          </div> }

          <div className="campaign--skill campaign-container">
            <h4 className="campaign-sub-heading">Skill(s) Required</h4>
            <div className="campaign-points__container">
              {(campaign?.campaign?.skills_required?.map((skill) => (
                <div className="campaign-point" key={uuidv4()}>
                  {skill}
                </div>
              )))}
            </div>
          </div>

          {campaign?.details?.perks?.length > 0 && <div className="campaign--perks campaign-container">
            <h4 className="campaign-sub-heading">Perks</h4>
            <div className="campaign-points__container">
              {(campaign?.details?.perks?.map((perk) => (
                <div className="campaign-point" key={uuidv4()}>
                  {perk}
                </div>
              )))}
            </div>
          </div> }
          { (company?.about && company?.website) && 
            <div className="company--about campaign-container">
              <h4 className="campaign-sub-heading">About {company?.comp_name}</h4>
              {(company?.website) && (
                <a href={company?.website} target="_blank" className="company-website" rel="noreferrer">
                  <span>Website</span>
                  <i className="uil uil-arrow-up-right"></i>
                </a>)
              }
              <p className="campaign-text">
                {(company?.about?.split("\n"))?.map((words) => (
                  <React.Fragment key={uuidv4()}>
                    <span className="text-break">{words}</span><br/>
                  </React.Fragment>
                ))}
              </p>
            </div>
          }
          {company?.address && <div className="campaign--perks campaign-container">
            <h4 className="campaign-sub-heading">Address</h4>
            <div className="campaign-points__container">
              {(company?.address.split("\n").map((word) => (
                <React.Fragment key={uuidv4()}>
                  <span>{word}</span><br/>
                </React.Fragment>
              )))}
            </div>
          </div> }

          <div className={`campaign--apply ${application_present?"":"singal"}`}>
            { application_present?(<>
                <button className="update--btn" onClick={() => setPopup(true)}>Update Application</button>
                <button className="delete--btn" onClick={deleteFunction}>Delete Application</button>
              </>):<button className="submit--btn" onClick={applyFunction}>Apply Now</button>}
          </div>
        </div>
      </div>
      <p className="disclaimer">We do not request any fees for job placements, internships, or any of our services. We disclaim responsibility for such occurrences and urge you to promptly report them to us.</p>
      <Footer />
    </>
  );
}

export default Main;
