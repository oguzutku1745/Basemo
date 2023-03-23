import React from "react";
import FlapLogo from "./FlapLogo.png";
import BackGround from "./Gradient.png";
import { useTabContext } from "../pages/Tabcontext";
import { useLocation, useNavigate } from "react-router-dom";

const Header = ({
    wallet,
    handleRoute,
    onTabClick,
    handleTabClick,
    user_id,
    user_wallet,
}) => {
    const { activeTab, setActiveTab } = useTabContext();
    const location = useLocation();
    const navigate = useNavigate();

    const handleDashboardClick = (clickedTab) => {
        if (location.pathname === "/botpage") {
            setActiveTab(clickedTab);
        } else {
            handleTabClick();
            setActiveTab(clickedTab);
        }
    };

    const Box = ({ text }) => (
        <div
            style={{
                width: "516px",
                height: "50px",
                backgroundColor: "#0000004D",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                fontSize: "16px",
                borderRadius: "15px",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                BackGround: "rgba(0, 0, 0, 0.3)",
                border: "1.5px solid #FFFFFF",
                borderRadius: "40px",
                backdropFilter: "blur(300px)",
                color: "#ffffff",
            }}
            onClick={handleRoute}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#eee")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#0000004D")}
        >
            User: {text}
        </div>
    );

    return (
        <header
            style={{
                display: "flex",
                justifyContent: "space-between", // added this line
                alignItems: "center",
                padding: "20px",
                width: "100%",
                height: "191px",
                borderBottom: "3px solid #ffffff",
            }}
        >
            <div style={{ display: "flex", alignItems: "center" }}>
                <img
                    src={FlapLogo}
                    alt="logo"
                    style={{
                        width: "138px",
                        height: "115px",
                    }}
                />
                <div className="frame-header">
                    <div
                        className="frame-elements"
                        onClick={() => handleDashboardClick("dashboard")}
                        //onClick={() => setActiveTab("dashboard")}
                    >
                        Dashboard
                    </div>
                    <div
                        className="frame-elements"
                        onClick={() => handleDashboardClick("wallets")}
                    >
                        Wallets
                    </div>
                    <div
                        className="frame-elements"
                        onClick={() => handleDashboardClick("contract")}
                    >
                        Contract
                    </div>
                    <div
                        className="frame-elements"
                        onClick={() => handleDashboardClick("setUpMintTask")}
                    >
                        Set Up Mint Task
                    </div>
                </div>
            </div>
            <Box text={wallet} />
        </header>
    );
};

export default Header;
