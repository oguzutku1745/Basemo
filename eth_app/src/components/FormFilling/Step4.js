//////////// GAS STEP
import React, { useState, useEffect } from "react";

import GasComponent from "../NetworkGas";

export default function Step4(props) {
    const handleInputChange = (event) => {
        const { name, value } = event.target;

        props.setTheInput(name, value);
    };

    return (
        <div>
            <GasComponent />
            <br></br>
            <br></br>
            <form>
                Desired Gas:
                <br></br>
                <input
                    name="selectedGasPrice"
                    placeholder="Enter your desired gas"
                    onChange={handleInputChange}
                    value={props.setTheInput.selectedGasPrice}
                />
            </form>
        </div>
    );
}
