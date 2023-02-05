import React, { useCallback, useState } from "react";
import { ethers } from "ethers";

import MainInput from "../CoreComps/coreInput";

// probably we need to change value={toAddress} to address={toAddress}

/**
  ~ What it does? ~

  Displays an address input with QR scan option

  ~ How can I use? ~

  <AddressInput
    autoFocus
    ensProvider={mainnetProvider}
    placeholder="Enter address"
    value={toAddress}
    onChange={setToAddress}
  />

  ~ Features ~

  - Provide placeholder="Enter address" value for the input
  - Value of the address input is stored in value={toAddress}
  - Control input change by onChange={setToAddress}
                          or onChange={address => { setToAddress(address);}}
**/
export default function AddressInput(props) {
    const { onChange } = props;
    const [value, setValue] = useState(props.value);

    const currentValue =
        typeof props.value !== "undefined" ? props.value : value;

    const updateAddress = useCallback(
        async (newValue) => {
            if (typeof newValue !== "undefined") {
                let address = newValue;
                setValue(address);
                if (typeof onChange === "function") {
                    onChange(address);
                }
            }
        },
        [onChange]
    );

    return (
        <>
            <MainInput
                name={props.name ?? "0xAddress"}
                autoComplete="off"
                autoFocus={props.autoFocus}
                placeholder={props.placeholder ? props.placeholder : ""}
                value={currentValue}
                addonAfter={
                    <div
                        style={{ marginTop: 4, cursor: "pointer" }}
                        onClick={() => {}}
                    ></div>
                }
                onChange={(e) => {
                    updateAddress(e.target.value);
                }}
            />
        </>
    );
}
