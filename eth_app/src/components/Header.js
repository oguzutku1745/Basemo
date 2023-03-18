import React from "react";
import SnapLogo from "./SnapLogo.png";

const Header = ({ wallet, handleRoute }) => {
    const Box = ({ text }) => (
        <div
            style={{
                width: "450px",
                height: "50px",
                backgroundColor: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                fontSize: "16px",
                borderRadius: "15px",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
            }}
            onClick={handleRoute}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#eee")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
        >
            User: {text}
        </div>
    );

    return (
        <header
            style={{
                background: "linear-gradient(to right, white, purple)",
                display: "flex",
                justifyContent: "right",
                padding: "20px",
            }}
        >
            <img
                src={SnapLogo}
                alt="logo"
                style={{
                    height: "50px",
                    marginRight: "auto", // add this to push the box to the right
                }}
            />
            <Box text={wallet} />
        </header>
    );
};

export default Header;
