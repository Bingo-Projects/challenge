import React, { useEffect } from "react";
import "../../../css/Pages/default_pages/consultant-info/pricing.css";
import { prices } from "./database-temp";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';


// Individual Price Boxes
function PriceBox({heading, description, items, price, head_icon, informations }) {

  useEffect(() => {
    // scroll to top whenever page changes
    const links = document.querySelectorAll('.submit');
    links.forEach((link) => link.addEventListener('click', () => window.scrollTo(0, 0)));
  }, [])

  return (
    <div className="pricing__body__box">
      <div className="pricing__body__box--head">
        <h1 className="heading">
          <i className={head_icon}></i> {heading}
        </h1>
        <p className="description">{description}</p>
        <span className="price">
          <i className="uil uil-rupee-sign"></i> <h1>{price}</h1>
        </span>
      </div>

      <div className="pricing__body__box--body">
        <p className="description">
          This pack includes <i className="uil uil-corner-right-down"></i>
        </p>

        {items?.map((item) => (
          <span key={uuidv4()} className="item">
            <i className={item?.icon + " " + item?.color}></i> {item?.text}
          </span>
        ))}
      </div>

      <div className="pricing__body__box--foot">
        <Link to="/login" className="submit">Buy Now</Link>
        <ul className="information">
          {informations?.map((info) => <li key={uuidv4()} className="information--warning">{info}</li>)}
        </ul>
      </div>
    </div>
  );
}


// Main Function
function Pricing() {
  return (
    <section className="pricing" id="pricing">
      <div className="pricing__head">
        <h1 className="pricing__head--heading">Ready To Get Started?</h1>
        <p className="pricing__head--sub-heading">
          Choose the plan fit for your needs
        </p>
      </div>

      <div className="pricing__body">
        {prices?.map((price) => <PriceBox {...price} key={uuidv4()} />)}
      </div>
    </section>
  );
}

export default Pricing;
