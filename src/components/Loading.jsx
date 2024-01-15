import React from "react";
import Styles from "./styles/Loading.module.css";

const Loading = () => {
  return (
    <div className={Styles.Overflow} id="preload">
      <div className={Styles.CircleLine}>
        <div className={Styles.CircleRed}>&nbsp;</div>
        <div className={Styles.CircleBlue}>&nbsp;</div>
        <div className={Styles.CircleGreen}>&nbsp;</div>
        <div className={Styles.CircleYellow}>&nbsp;</div>
      </div>
      <div className={Styles.Text}>Loading ...</div>
    </div>
  );
};

export default Loading;
