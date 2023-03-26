import React from "react";
import gradient2 from "../../images/gradient2.png";
import flaplogo from "../../images//FlapLogo.png";
import FLAPNFT from "../../images/FLAPNFT-resized.png";
import { Link } from "react-router-dom";

const Homepage = () => {
    function handleJoinUsClick() {}

    function handleJoinDiscordClick() {
        window.open("https://discord.gg/cApSXjHV", "_blank");
    }

/*
<div className={"dashboard-dashboard-wrapper"}>
            <div className={"upper-menu"} >
                <img
                    className={"dashboard-flapnft-website-favicon-black"}
                    src={flaplogo}
                />
                <div className={"dashboard-frame-home"}>
                    <div className={"dashboard-text-wrapper"}> Home </div>
                </div>
                <div className={"dashboard-frame"}>
                    <div className={"dashboard-text-wrapper"}>
                        {" "}
                        Features{" "}
                    </div>
                </div>
                <div className={"dashboard-frame-6"}>
                    <div className={"dashboard-text-wrapper"}>FAQ's </div>
                </div>
                <Link to="/app">
                    <button className={"dashboard-rectangle"}>
                        LAUNCH APP
                    </button>
                </Link>
            </div>
                <img className={"dashboard-h-1"} src={FLAPNFT} />
                <button
                    className={"dashboard-group"}
                    onClick={handleJoinUsClick}
                >
                    {" "}
                    Join Us{" "}
                </button>
                <button
                    className={"dashboard-group-6"}
                    onClick={handleJoinDiscordClick}
                >
                    {" "}
                    Join Discord
                </button>
                <div className={"dashboard-rectangle-10"}> </div>
        </div>
        */

    return (
        <div className="dashboard-dashboard-wrapper">
            <div className="header-bar">
                <img
                    className={"dashboard-flapnft-website-favicon-black"}
                    src={flaplogo}
                />
                <div className="nav">
                    <div className="dashboard-text-wrapper"> Home </div>
                    <div className="dashboard-text-wrapper"> Features </div>
                    <div className="dashboard-text-wrapper">FAQ's </div>
                </div>
                <Link to="/app">
                    <button className="dashboard-rectangle">
                        LAUNCH APP
                    </button>
                </Link>
            </div>
            <div className="typo-positioner">
                <img className={"dashboard-h-1"} src={FLAPNFT} />
            </div>
            <div className="join-buttons">
                <button
                    className={"dashboard-group"}
                    onClick={handleJoinUsClick}
                >
                    {" "}
                    Join Us{" "}
                </button>
                <button
                    className={"dashboard-group-6"}
                    onClick={handleJoinDiscordClick}
                >
                    {" "}
                    Join Discord
                </button>
            </div>
            <div className="info-giver">
                <div className="dashboard-rectangle-10"> </div>
            </div>
        </div>
    );
};
export default Homepage;
