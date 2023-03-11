import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useLocation } from "react-router-dom";

const Profilepage = () => {
    const { state } = useLocation();
    const [expiryDate, setExpiryDate] = useState();
    const [UserBlocknativeKey, setUserBlocknativeKey] = useState("");
    console.log(expiryDate);
    function handleChange(event) {
        setUserBlocknativeKey(event.target.value);
    }
    useEffect(() => {
        fetch(`/api/${state.user_wallet}`)
            .then((response) => response.json())
            .then((data) => {
                const expiryDate = new Date(data.expiry_date);
                setExpiryDate(expiryDate);
            });
    }, []);
    console.log(state);
    return (
        <div>
            <Header wallet={state.user_wallet} />
            Hi! This is the profile page.
            <br />
            {expiryDate && (
                <p>Expiry date: {expiryDate.toLocaleDateString()}</p>
            )}
            <div>
                <input
                    type="text"
                    value={UserBlocknativeKey}
                    onChange={handleChange}
                    placeholder="Enter your Blocknative Key"
                    style={{ width: `210px` }} // set the width using the style prop
                />
            </div>
        </div>
    );
};

export default Profilepage;
