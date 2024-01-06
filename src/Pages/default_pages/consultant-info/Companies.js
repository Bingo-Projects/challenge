import React from "react";
import "../../../css/Pages/default_pages/consultant-info/companies.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { v4 as uuidv4 } from 'uuid';


// Slider Options
const sliderOptions = {
  dots: false,
  infinite: true,
  speed: 800,
  autoplay: true,
};


// Slider - Company Logos
const LOGOS = [
  "/assets/logos/allskilltechnologies.png",
  "/assets/logos/azantaInfotech.png",
  "/assets/logos/dedicarse.png",
  "/assets/logos/elite_technologies.png",
  "/assets/logos/megahalo.png",
  "/assets/logos/phank_creation_group.png",
]


// Main Slider Component
function Companies() {

  let result = 6;
  const width = window.innerWidth;

  // Checking how many logos to show in one slide
  if (width <= 340) {
    result = 1;
  } else if (width <= 500) {
    result = 1;
  } else if (width <= 800) {
    result = 2;
  } else if (width <= 1200) {
    result = 3;
  } else if (width <= 1250) {
    result = 4;
  } else if (width > 1250) {
    result = 5;
  }


  return <section className="companies-carousel">
    <h1 className="companies-carousel--heading">Our Clients</h1>
    <p className="companies-carousel--description">Jobs listed from various companies by their recruiters across India</p>
    <Slider {...sliderOptions} slidesToShow={result} slidesToScroll={result} className="campanies-carousel--companies">
      {LOGOS?.map((logo) => (
        <div key={uuidv4()} className="campanies-carousel--companies-logo">
          <img src={logo} alt="option" />
        </div>
      ))}
    </Slider>
  </section>;
}

export default Companies;
