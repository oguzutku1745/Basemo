import React from "react";
import gradient2 from "/root/basemov2/Basemo/eth_app/src/components/gradient2.png";
import flaplogo from "/root/basemov2/Basemo/eth_app/src/components/FlapLogo.png";

import Rectangle from "/root/basemov2/Basemo/eth_app/src/components/Rectangle.svg";
import FLAPNFT from "/root/basemov2/Basemo/eth_app/src/components/FLAPNFT.png";
import { Link } from "react-router-dom";

const Homepage = () => {
    function handleJoinUsClick() {}

    function handleJoinDiscordClick() {
        window.open("https://discord.gg/cApSXjHV", "_blank");
    }

    return (
        <div className={"dashboard-dashboard-wrapper"}>
            <div className={"dashboard-dashboard"}>
                <div
                    className={"dashboard-overlap"}
                    style={{ backgroundImage: gradient2 }}
                >
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
            </div>
        </div>
    );
};
export default Homepage;
