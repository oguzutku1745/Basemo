import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Profilepage = () => {
    const { state } = useLocation();
    const [expiryDate, setExpiryDate] = useState();
    const [UserBlocknativeKey, setUserBlocknativeKey] = useState("");
    const [UserBlocknativeKeyServer, setUserBlocknativeKeyServer] =
        useState("");

    console.log(expiryDate);
    function handleChange(event) {
        setUserBlocknativeKey(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        sendUserKeyToDatabase({
            userBlocknativeKey: UserBlocknativeKey,
            user_id: state.user_id,
        });
    }

    const sendUserKeyToDatabase = (data) => {
        axios
            .post("http://localhost:3002/api/setuserblocknativekey", data)
            .then((response) => console.log("Success:", response))
            .catch((error) => console.error("Error:", error));
    };

    useEffect(() => {
        fetch(`/api/${state.user_wallet}`)
            .then((response) => response.json())
            .then((data) => {
                const expiryDate = new Date(data.expiry_date);
                setExpiryDate(expiryDate);
            });
        fetch(`/api/getuserblocknativekey?user_id=${state.user_id}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data[0].blocknative_key);
                setUserBlocknativeKeyServer(data[0].blocknative_key);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);
    console.log(state);
    return (
        <div>
            <Header wallet={state.user_wallet} />
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
    );
};

export default Profilepage;
