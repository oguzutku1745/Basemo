import React from "react";
import gradient2 from "/root/basemov2/Basemo/eth_app/src/components/gradient2.png";
import flaplogo from "/root/basemov2/Basemo/eth_app/src/components/FlapLogo.png";
import JoinUs from "/root/basemov2/Basemo/eth_app/src/components/JoinUs.png";
import JoinDiscord from "/root/basemov2/Basemo/eth_app/src/components/JoinDiscord.png";
import Rectangle from "/root/basemov2/Basemo/eth_app/src/components/Rectangle.svg";
import { Link } from "react-router-dom";

const Homepage = () => {
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
                    <Link to="/app" className={"dashboard-rectangle"}>
                        <div className={"dashboard-div"}>LAUNCH APP</div>
                    </Link>

                    <h1 className={"dashboard-h-1"}>FLAPNFT</h1>
                    <img className={"dashboard-group"} src={JoinUs} />
                    <img className={"dashboard-group-6"} src={JoinDiscord} />
                    <img
                        className={"dashboard-rectangle-10"}
                        src={Rectangle}
                    ></img>
                </div>
            </div>
        </div>
    );
};
export default Homepage;
