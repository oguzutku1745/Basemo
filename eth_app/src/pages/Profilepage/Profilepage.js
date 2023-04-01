import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";


const Profilepage = () => {
    const location = useLocation();
    const { user_id, user_wallet } = location.state || { user_id: null, user_wallet: null, setActiveTab: null };
    const [expiryDate, setExpiryDate] = useState();
    const [UserBlocknativeKey, setUserBlocknativeKey] = useState("");
    const [UserBlocknativeKeyServer, setUserBlocknativeKeyServer] = useState("");
    //const { activeTab, setActiveTab } = useTabContext();
    const navigate = useNavigate();
    console.log(expiryDate);
    function handleChange(event) {
        setUserBlocknativeKey(event.target.value);
    }

    const handleTabClick = () => {
        navigate("/botpage", { state: { user_id, user_wallet} });
      };
      
      

    function handleSubmit(event) {
        event.preventDefault();
        sendUserKeyToDatabase({
            userBlocknativeKey: UserBlocknativeKey,
            user_id: user_id,
        });
    }

    const sendUserKeyToDatabase = (data) => {
        axios
            .post("http://localhost:3002/api/setuserblocknativekey", data)
            .then((response) => console.log("Success:", response))
            .catch((error) => console.error("Error:", error));
    };

    useEffect(() => {
        fetch(`/api/${user_wallet}`)
            .then((response) => response.json())
            .then((data) => {
                const expiryDate = new Date(data.expiry_date);
                setExpiryDate(expiryDate);
            });
        fetch(`/api/getuserblocknativekey?user_id=${user_id}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data[0].blocknative_key);
                setUserBlocknativeKeyServer(data[0].blocknative_key);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);
    console.log();
    return (
        <div className="dashboard-botpage-wrapper">
            <Header handleTabClick={handleTabClick} user_id={user_id} wallet={user_wallet}  />
            <div className="profile-setter">
            Hi! This is the profile page.
            {expiryDate && (
                <p>Your expiry date: {expiryDate.toLocaleDateString()}</p>
            )}
            {UserBlocknativeKeyServer && (
                <p>You Blocknative Key: {UserBlocknativeKeyServer}</p>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        value={UserBlocknativeKey}
                        onChange={handleChange}
                        placeholder="Enter your Blocknative Key"
                        style={{ width: `210px` }} // set the width using the style prop
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            </div>
        </div>
    );
};

export default Profilepage;
