import React from "react";

const LOGIN_IMG = process.env.REACT_APP_LOGIN_IMG;

function ImageBanner() {
  return (
    <div className="form__image-box small">
      <img src={
        LOGIN_IMG + "?tr=h-400"
      } alt="login-svg" />
    </div>
  );
}

export default ImageBanner;
