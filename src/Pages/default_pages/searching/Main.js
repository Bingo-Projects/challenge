import React, { useEffect, useState } from "react";
import Filters from "./Filters";
import Card from "./Card";
import "../../../css/Pages/default_pages/searching/main.css";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { api } from "../../../backend";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";

const LOADING_GIF = process.env.REACT_APP_LOADING_IMG;
const NOTHING_FOUND = process.env.REACT_APP_SEARCH_NOTHING_FOUND;

const Page_Size = 10;
let filters = {};
let Page_Number = 0;

function Main({ work_type=null}) {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const size = window.innerWidth;

  const populateCampaigns = async (set_filters) => {
    Page_Number += 1;

    if (set_filters) {
      filters = set_filters;
      Page_Number = 1;
    }

    setLoading(true);
    setLoadMore(false);

    try {

      const api_call = await api.post(`/company/campaign/search?page_num=${Page_Number}&page_size=${Page_Size}`, {
        ...(set_filters || filters)
      });


      setLoading(false);
      const campaigns_length = api_call?.data?.campaigns.length;
      if (( campaigns_length === 0) || (campaigns_length < Page_Size)) {
        setLoadMore(false);
      } else {
        setLoadMore(true);
      }

      if (set_filters) {
        setCampaigns([...(api_call?.data?.campaigns)]);
      } else {
        setCampaigns([...(campaigns), ...(api_call?.data?.campaigns)]);
      }

      document.querySelector(".close-icon").click()
    }
    catch (err) {
      setLoading(false);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('session_id');
        localStorage.removeItem('session_type');
        navigate("/login");
      } else {
        alert(err.response?.data?.msg);
      }
    }
  }

  useEffect(() => {
    // when mobile-filter button is clicked
    const mobFilterBtn = document.querySelector(".filters-mob");
    mobFilterBtn?.addEventListener("click", () => {
      // show main filter - which was hidden
      const mainFilters = document.querySelector(".filters");
      mainFilters.classList.add("active");

      // freeze scrolling when filter window is active
      const searchContainer = document.querySelector(".searching-container");
      searchContainer.classList.add("disable-scroll");
    });

    const jobNavLink = document.querySelector(".navbar__links--link.job");
    const internshipNavLink = document.querySelector(".navbar__links--link.internship");

    jobNavLink.addEventListener("click", () => {
      populateCampaigns({ campaign_type: 1 });
    });

    internshipNavLink.addEventListener("click", () => {
      populateCampaigns({ campaign_type: 0 });
    });

    window.scrollTo(0, 0);
    populateCampaigns({ campaign_type: (work_type === "intern")?0:1 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />
      <div className="searching-container">
        <Filters work_type={work_type} setCampaigns={populateCampaigns} />

        <div className="filters-mob">
          <h4 className="filters__heading">
            <i className="uil uil-filter"></i> Filters
          </h4>
        </div>

        <div className={`cards-container ${loading?"disable":""}`}>
          {campaigns?.map((campaign) =>
            <Card key={uuidv4()} campaign={campaign} />
          )}

          { !loading && campaigns.length === 0 && (
            <div className="nothing-found">
              <img src={
                NOTHING_FOUND + ((size <= 1210)?'?tr=h-190,w-190':'?tr=h-290,w-290')
              } alt="nothing-found" />
              <h1>Nothing found</h1>
            </div>
          )}

          {loading && (
            <div className="loading-gif">
              <img src={
                LOADING_GIF + "?tr=w-60,h-60"
              } alt="" />
            </div>
          )}

          {loadMore && (
            <button className="load-more--btn" onClick={() => populateCampaigns()}>
              Load More
            </button>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Main;
