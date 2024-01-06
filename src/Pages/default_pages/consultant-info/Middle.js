import React, { useEffect } from "react";
import "../../../css/Pages/default_pages/consultant-info/middle.css";
import { Link } from "react-router-dom";


// Information component - image and text
// "position" denotes the position of the image
function DetailsContainer({ position="right", heading, desc, img }) {
  let information = (
    <div className="middle__details__container--holder text">
      <h4>{heading}</h4>
      <p>{desc}</p>
    </div>
  );

  let img_html = (
    <div className="middle__details__container--holder img">
      <img src={img} alt="illustration" />
    </div>
  );

  return <div className="middle__details__container">
    {position==="left"?<>{information}{img_html}</>: <>{img_html}{information}</>}
  </div>;
}


// Main Function
function Middle() {

  useEffect(() => {
    // scroll to top whenever page changes
    const btn = document.querySelector('.middle__banner__info--register');
    btn.addEventListener('click', () => window.scrollTo(0, 0));
  }, [])

  return (
    <section className="middle">
      <div className="middle__banner">
        <div className="middle__banner__img">
          <img
            className="middle__banner__img--img"
            src="/assets/consultant_home.jpg"
            alt=""
          ></img>
        </div>

        <div className="middle__banner__info">
          <h1 className="middle__banner__info--heading">
            Recruite <span>Fresh</span> and Best <span>Telent</span> <br/> From <span>JustFreshJobs</span>
          </h1>
          <p className="middle__banner__info--sub-heading">
            Hire interns, freshers & experienced professionals.{" "}
            <span>For Absolutely FREE</span>
          </p>
          <Link to="/register/company" className="middle__banner__info--register">Join Now</Link>
        </div>
      </div>

      <div className="middle__details">
        <h2 className="middle__details--heading">Why Hire Online?</h2>
        <h2 className="middle__details--description">
        Hiring online offers a broader talent pool, increased efficiency, and greater flexibility in the recruitment process.
        </h2>

        <DetailsContainer heading={'Connect JobSeekers by JustFresJobs'} desc={"JustFreshJobs can help on connecting with jobseekers efficiently by embracing online hiring methods. Utilize popular job boards, social media platforms, and recruitment websites to reach a broader audience of potential candidates. Virtual interviews and assessments enable easy and timely interactions, fostering stronger connections with jobseekers and improving your company's chances of finding the perfect match for your openings."} img={'/assets/connect.svg'} position="left" />
        <DetailsContainer heading={'Grow Your Company By JustFresJobs'} desc={"Grow your company with help of JustFreshJobs by hiring online and tapping into a vast talent pool of potential candidates. Online recruitment expands your reach, attracting skilled individuals from various locations. Streamlined hiring processes and virtual interviews enhance efficiency, allowing you to quickly find the right candidates and foster business growth."} img={'/assets/growth.svg'} />
        <DetailsContainer heading={'Save Money by JustFresJobs'} desc={"Hiring online in JustFreshJobs.com can save your company money by accessing a wider talent pool without the need for costly travel or relocation expenses. Online job postings are often more affordable than traditional methods, and virtual interviews and assessments reduce expenses associated with in-person meetings. Streamlined processes also minimize time and resource expenditures."} img={'/assets/save_money.svg'} position="left" />
        <DetailsContainer heading={'Grow Talend People By JustFreshJobs'} desc={"JustFreshJobs job portals offer a wide array of options for both job seekers and employers. Job seekers can access diverse job opportunities across industries and locations, while employers gain access to a vast talent pool with varying skill sets and experiences. This broad range of choices ensures better matches between candidates and companies, enhancing the hiring process for all parties involved."} img={'/assets/wide_options.svg'} />
      </div>
    </section>
  );
}

export default Middle;
