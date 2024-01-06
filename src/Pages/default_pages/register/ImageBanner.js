import React from "react";
const REGISTER_USER_IMG = process.env.REACT_APP_REGISTER_USER_IMG;
const REGISTER_COMP_IMG = process.env.REACT_APP_REGISTER_COMP_IMG;

function ImageBanner({jobSeeker}) {
  return (
    <div className="form__image-box long">
      <img
        src={(jobSeeker ? REGISTER_USER_IMG : REGISTER_COMP_IMG) + "?tr=h-600,w-600"}
        alt="login-svg"
      />
    </div>
  );
}

export default ImageBanner;
