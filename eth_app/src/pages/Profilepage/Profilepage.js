import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useLocation } from "react-router-dom";

const Profilepage = () => {
    const { state } = useLocation();
    const [expiryDate, setExpiryDate] = useState()
    console.log(expiryDate)
    useEffect(() => {
        fetch(`/api/${state.user_wallet}`)
            .then((response) => response.json())
            .then((data) => {
                const expiryDate = new Date(data.expiry_date);
                setExpiryDate(expiryDate)
            });

    }, [])
    console.log(state)
    return(
        <div>
            <Header wallet={state.user_wallet} />
            Hi! This is the profile page.
            <br />
            {expiryDate && (
      <p>
        Expiry date: {expiryDate.toLocaleDateString()}
      </p>
    )}
        </div>
    )
}

export default Profilepage;