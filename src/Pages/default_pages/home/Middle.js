import React from "react";
import "../../../css/Pages/default_pages/home/middle.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CompaniesCarousel from "../consultant-info/Companies";
import { Link } from "react-router-dom";

// Main Function
function Middle() {

  return (
    <section className="details">
      <div className="details__heading">
        <h1>Find your dream job now</h1>
        <p>5 lakh+ jobs for you to explore</p>
      </div>

      {/* <div className="details__searchbox">
        <ul className="container filters__choice__box">
          <i className="uil uil-search"></i>
          {categories?.map((cat) => (
            <li key={uuidv4()} className="filters__choice__box--field">
              {cat} <i onClick={() => removeCat(cat)} className="uil uil-multiply"></i>
            </li>
          ))}
          <input type="text" className="filters__choice__box--search category initial" placeholder="eg: Marketing" />
          <ChoiceSelection choices={catChoices} addToList={addCat} />
        </ul>
        <hr className="details__searchbox--divider" />
        <ul className="container filters__choice__box">
          <i className="uil uil-map-marker"></i>
          {locations.map((loc) => (
            <li key={uuidv4()} className="filters__choice__box--field">
              <span>{loc}</span> <i onClick={() => removeLoc(loc)} className="uil uil-multiply"></i>
            </li>
          ))}
          <input type="text" className="filters__choice__box--search location initial" placeholder="eg: Delhi" />
          <ChoiceSelection choices={locChoices} addToList={addLoc} />
        </ul>
        <Link to="/search" onClick={() => window.scrollTo(0, 0)}  className="details__searchbox--search">Search</Link>
      </div> */}

      <div className="home-btns">
        <Link
          to="/search/intern"
          onClick={() => window.scrollTo(0, 0)}
          className="home-btns__item intern"
        >
          Find Internships
        </Link>
        <Link
          to="/search/job"
          onClick={() => window.scrollTo(0, 0)}
          className="home-btns__item job"
        >
          Find Jobs
        </Link>
      </div>

      <CompaniesCarousel />
    </section>
  );
}

export default Middle;
