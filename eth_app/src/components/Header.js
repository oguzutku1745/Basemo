import React from "react";

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
                background: "linear-gradient(to right, #ffd89b, #19547b)",
                display: "flex",
                justifyContent: "right",
                padding: "20px",
            }}
        >
            <Box text={wallet} />
        </header>
    );
};

export default Header;
