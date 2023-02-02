import React from "react";

const Header = ({ wallet }) => {
    const Box = ({ text }) => (
        <div
            style={{
                width: "400px",
                height: "50px",
                backgroundColor: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                fontSize: "16px",
                borderRadius: "15px",
            }}
        >
            {text}
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
