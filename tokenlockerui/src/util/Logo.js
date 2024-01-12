// eslint-disable-next-line react/jsx-props-no-spreading
import React from "react";

const AppLogo = ({ height, width, title }) => {
  return (
    <div style={{
      width: "fit-content",
      height: "fit-content",
      padding: "0.5rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <svg
        width={width}
        height={height}
        id="Layer_1"
        dataname="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 264.84 223.78">

        <defs>
          <linearGradient
            id="linear-gradient"
            x1="89.1"
            y1="254.04"
            x2="89.1"
            y2="-17.27"
            gradientUnits="userSpaceOnUse">

            <stop offset="0" stopColor="#36a9e1" />
            <stop offset="0.44" stopColor="#326cb2" />
            <stop offset="0.81" stopColor="#2e3f90" />
            <stop offset="1" stopColor="#2d2e83" />
          </linearGradient>
        </defs>

        <path
          d="M81.35,6.2S83,75.55,74.93,95.28,48.73,137.76,14.5,140.5c-7.49,0-7.22,7.13-7.22,7.13v74s1.87,7.4,6.15,8.22,41.71-1.92,68.05-17.27S162.37,153.38,165,84.86,170.92,6.2,170.92,6.2Z"
          transform="translate(-7.28 -6.2)"
          style={{ fill: "url(#linear-gradient)" }} />

        <path
          d="M81.35,6.2,187,223.27s2.94,6.74,13.57,6.71,65.17,0,65.17,0,10.73-1.57,4.42-13.8-99.21-210-99.21-210Z"
          transform="translate(-7.28 -6.2)"
          style={{ fill: "#4577bb" }} />

      </svg>
      <div>{title}</div>
    </div>
  );
}

export default AppLogo;