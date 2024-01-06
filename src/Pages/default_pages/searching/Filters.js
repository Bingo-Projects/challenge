import React, { useEffect, useRef, useState } from "react";
import "../../../css/Pages/default_pages/searching/filters.css";
import { api } from "../../../backend";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";

const locations = JSON.parse(process.env.REACT_APP_LOCATION);

function getLocation(query) {
  const filtered = [];

  if (!query) {
    return filtered;
  }

  for(let location of locations) {
    if (location.toLowerCase().indexOf(query.toLowerCase()) === 0) {
      filtered.push(location);

      if (filtered.length === 5) {
        break;
      }
    }
  }

  return filtered;
}


// choice selection box
function ChoiceSelection({choices=[], addToList}) {
  const selectionBox = useRef(0);

  useEffect(() => {
    const results = selectionBox.current?.querySelectorAll(".result");
    results.forEach((result) => {
      result.addEventListener("click", () => {
        // if result is disabled, do nothing
        if (result.classList?.contains("disable")) return
        const name = result?.innerText;
        const searchBox = selectionBox.current?.parentElement?.querySelector(".filters__choice__box--search");
        addToList(name);
        searchBox.placeholder = "";
        searchBox.classList.remove("initial")
        searchBox.value = ""
        selectionBox.current?.classList?.remove("visible");
      })
    })
  }, [addToList])

  return (
    <div ref={selectionBox} className="filters__choice__box__selection">
      {choices.map((choice) => <li key={uuidv4()} className="result">{choice}</li>)}
    </div>
  )
}


function Filters({ work_type = null, setCampaigns }) {
  const navigate = useNavigate();

  // Variables for searching
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  const [catChoices, setCatChoices] = useState([]);
  const [locChoices, setLocChoices] = useState([]);


  // Adding category to list for filtering
  const addCat = (name) => {
    if (categories.length > 4) {
      alert("Only 5 skills are allowed");
      return;
    }

    for(let skill of categories) {
      if (skill === name) {
        return;
      }
    }

    if (categories.length === 0) {
      const input = document.querySelector(".filters__choice__box--search.category");
      input.placeholder = "";
      input?.classList?.remove('initial');
    }

    setCategories([...categories, name])
  }


  const removeCat = (name) => {
    const newCategories = categories.filter(cat => cat !== name);
    setCategories(newCategories);

    if (newCategories.length === 0) {
      const input = document.querySelector(".filters__choice__box--search.category");
      input.placeholder = "eg: Marketing";
      input?.classList?.add('initial');
    }
  }

  // Adding location to list for filtering
  const addLoc = (name) => {
    if (locations.length > 2) {
      alert("Only 3 locations are allowed");
      return;
    }

    for(let location of locations) {
      if (location === name) {
        return;
      }
    }

    if (locations.length === 0) {
      const input = document.querySelector(".filters__choice__box--search.location");
      input.placeholder = "";
      input?.classList?.remove('initial');
    }

    setLocations([...locations, name])
  }

  const removeLoc = (name) => {
    const newLocations = locations.filter(loc => loc !== name);
    setLocations(newLocations);

    if (newLocations.length === 0) {
      const input = document.querySelector(".filters__choice__box--search.location");
      input.placeholder = "eg: Delhi";
      input?.classList?.add('initial');
    }
  }


  useEffect(() => {

    // search boxes (location/category) - onclick functionality
    const choiceBoxes = document.querySelectorAll(".filters__choice__box");
    choiceBoxes.forEach((box) => {
      // search box - search input 
      const searchInput = box.querySelector(".filters__choice__box--search");

      // on search box click
      box.addEventListener("click", (e) => {
        const clickedTag = e.target.tagName?.toLowerCase();
        if (clickedTag !== 'i') {
          searchInput?.focus();
          box.classList?.add("active");
        }
      });

      // on search box focus out
      box.addEventListener("focusout", () => {
        box.classList?.remove("active")
        searchInput.value = "";
      });
    });

    // Checking if clicked on choice selection box
    const body = document.querySelector('body');
    body.addEventListener("click", (e) => {
      const selectionBox = document.querySelectorAll('.filters__choice__box__selection.visible');
      // if not then remove the focus from search box
      if (!e.target.classList.contains("result")) {
        selectionBox.forEach((box) => box?.classList?.remove("visible"))
      }
    });

    // show choice selection box, when user types on searchbox
    const catChoiceBox = document.querySelector(".filters__choice__box--search.category");
    const catSelectionBox = catChoiceBox.parentElement.querySelector('.filters__choice__box__selection');
    catChoiceBox.addEventListener("input", () => {
      const highestTimeoutId = setTimeout(() => {}, 2000);
      for (var i = 0 ; i < highestTimeoutId ; i++) {
          clearTimeout(i); 
      }

      setTimeout(async () => {
        const keyword = catChoiceBox?.value;
        if (keyword) {
          try {
            const skills = await api.get(`/site-info/skills/search?keyword=${keyword}`)
            setCatChoices(skills?.data?.skills);
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
      }, 1000);
      catSelectionBox?.classList?.add('visible');
    });


    // Location Choice Selection Box
    const locChoiceBox = document.querySelector(".filters__choice__box--search.location");
    const locSelectionBox = locChoiceBox?.parentElement?.querySelector('.filters__choice__box__selection');
    locChoiceBox.addEventListener("input", () => {
      setLocChoices(getLocation(locChoiceBox?.value));
      locSelectionBox.classList.add('visible');
    });

    // mobile-filter - close button
    const closeBtn = document.querySelector(".filters .close-icon");
    closeBtn.addEventListener("click", () => {
      const searchContainer = document.querySelector(".searching-container");
      searchContainer?.classList?.remove("disable-scroll");
      const filters = document.querySelector(".filters");
      filters?.classList?.remove('active');
    });


    // Search button
    const searchButton = document.querySelector(".filters .filters__search button");
    searchButton.addEventListener("click", (e) => {
      if (e.currentTarget.classList?.contains("disabled")) {
        return;
      }

      e.currentTarget.classList?.add("disabled");

      let workType = null;
      if (document.getElementById("work-home")?.checked){
        workType = 1
      }

      let campaignType = null;
      if (document.querySelector(".filters__choice__checkbox #internship")?.checked) {
        campaignType = 0;
      } else if (document.querySelector(".filters__choice__checkbox #job")?.checked) {
        campaignType = 1;
      }

      let experience = {};
      const exp_element = document.querySelector(".filters__range.experience");
      const min_exp = parseInt(exp_element.querySelector("input.min")?.value);
      const max_exp = parseInt(exp_element.querySelector("input.max")?.value);
      if (min_exp || min_exp === 0) {
        experience.min = min_exp;
      }

      if (max_exp || max_exp === 0) {
        experience.max = max_exp;
      }


      let salary = {};
      const salary_element = document.querySelector(".filters__range.salary");
      const min_salary = parseInt(salary_element?.querySelector("input.min")?.value);
      // const max_salary = parseInt(salary_element.querySelector("input.max").value);
      if (min_salary || min_salary === 0) {
        salary.min = min_salary;
      }

      salary.max = null;

      const search = async () => {
        const categories = [];

        for (let i of document.querySelectorAll(".filters__choice.category .filters__choice__box--field")) {
          categories.push(i.innerText)
        }

        const locations = [];
        for (let i of document.querySelectorAll(".filters__choice.location .filters__choice__box--field")) {
          locations.push(i.innerText)
        }

        setCampaigns({
          work_type: workType,
          campaign_type: campaignType,
          skills: categories,
          locations: locations,
          experience,
          salary
        });
        window.scrollTo(0, 0);
        document.querySelector(".filters__search .disabled")?.classList?.remove("disabled");
      }

      search();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="filters">
      <h4 className="filters__heading">
        <i className="uil uil-filter"></i> Filters
        <i className="uil uil-multiply close-icon"></i>
      </h4>
      <div className="filters__choice category">
        <p className="filters__choice--heading">Skills</p>
        <ul className="filters__choice__box">
          {categories?.map((cat) => (
            <li key={uuidv4()} className="filters__choice__box--field">
              {cat} <i onClick={() => removeCat(cat)} className="uil uil-multiply"></i>
            </li>
          ))}
          <input type="text" className="filters__choice__box--search category initial" placeholder="eg: Marketing" />
          <ChoiceSelection choices={catChoices} addToList={addCat} />
        </ul>
      </div>

      <div className="filters__choice location">
        <p className="filters__choice--heading">Location</p>
        <ul className="filters__choice__box">
          {locations.map((loc) => (
            <li key={uuidv4()} className="filters__choice__box--field">
              <span>{loc}</span> <i onClick={() => removeLoc(loc)} className="uil uil-multiply"></i>
            </li>
          ))}
          <input type="text" className="filters__choice__box--search location initial" placeholder="eg: Delhi" />
          <ChoiceSelection choices={locChoices} addToList={addLoc} />
        </ul>
        

        <div className="filters__choice__checkbox first">
          <input type="checkbox" id="work-home" />
          <label htmlFor="work-home">Work From Home</label>
        </div>
      </div>

      <div className="filters__choice margin-top">
        <p className="filters__choice--heading">Campaign Type</p>

        <div className="filters__choice__checkbox">
          <input type="radio" name="salary" id="job" defaultChecked={ work_type==="job"?true:false } />
          <label htmlFor="job">Job</label>
        </div>

        <div className="filters__choice__checkbox first">
          <input type="radio" name="salary" id="internship" defaultChecked={ work_type==="intern"?true:false } />
          <label htmlFor="internship">Internship</label>
        </div>



        <div className="filters__choice__checkbox">
          <input type="radio" name="salary" id="both" />
          <label htmlFor="both">Both</label>
        </div>
      </div>


      <div className="filters__range experience">
        <p className="filters__range--heading">Experience <span>(Yrs)</span></p>
        <div className="filter--wrapper">
          <div className="filters__range__box min">
            <p className="filters__range__box--title">Min: </p>
            <input type="number" className="filters__range__box--input min" />
          </div>

          <div className="filters__range__box max">
            <p className="filters__range__box--title">Max: </p>
            <input type="number" className="filters__range__box--input max" />
          </div>
        </div>
      </div>

      <div className="filters__range margin-top salary">
        <p className="filters__range--heading">Monthly Salary <span>(₹)</span></p>
        <div className="filter--wrapper">
          <div className="filters__range__box min">
            <p className="filters__range__box--title">Min: </p>
            <input type="number" className="filters__range__box--input min" />
          </div>
        </div>
      </div>

      <div className="filters__search">
        <button type="submit"><i className="uil uil-search" />Search</button>
      </div>
    </div>
  );
}

export default Filters;
