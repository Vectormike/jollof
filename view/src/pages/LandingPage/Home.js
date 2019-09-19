import React from "react";
import "./Home.css";

import whiteBg from "../../assets/curvedWhitebg.svg";

export default function Home({ onPageChange }) {
  return (
    <div className="Home">
      <div className="btn-con">
        <button onClick={() => onPageChange("signin")} className="btn-white">
          Login
        </button>
        <button onClick={() => onPageChange("register")} className="btn-white">
          Register
        </button>
      </div>

      <img
        src={whiteBg}
        alt=""
        width="100%"
        height="100%"
        style={{ marginTop: "2%" }}
      />
    </div>
  );
}
