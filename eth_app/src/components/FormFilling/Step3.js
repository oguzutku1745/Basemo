import React, { useState } from "react";
import Select from "react-select";

export default function Step3(props) {
    const [selectedOption, setSelectedOption] = useState(null);

    const options = props.mint_wallets.map((wallet, index) => ({
        index: index,
        value: wallet,
        label: wallet,
    }));

    const handleSelect = (selected) => {
        const selectedIndex = options.findIndex(
            (option) => option.value === selected.value
        );
        setSelectedOption(selected);
        props.setTheInput("mintWallet", selected.value);
        props.setTheInput("mintPrivateKey", props.private_keys[selectedIndex]);
    };

    return (
        <div>
            <Select
                options={options}
                value={selectedOption}
                onChange={handleSelect}
            />
        </div>
    );
}
