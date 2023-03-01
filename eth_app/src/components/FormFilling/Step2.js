import React, { useState, useEffect } from "react";
import Select from "react-select";

export default function Step2(props) {
    const [writeFunctions, setWriteFunctions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    useEffect(() => {
        // Check if props.contractFunctions has data
        if (props.contractFunctions.length > 0) {
          const filteredFunctionNames = props.contractFunctions
            .filter((func) => func.functionType === "write")
            .map((func) => func.name);
          setWriteFunctions(filteredFunctionNames);
        }
      }, [props.contractFunctions]);
    console.log(writeFunctions);

    const options = writeFunctions.map((name, index) => ({
        index: index,
        value: name,
        label: name,
    }));

    function handleSelect(selected) {
        props.setTheInput("taskContractFunction", selected.value);
        setSelectedOption(selected);
    }

    function handleMintPrice(event) {
        const { value } = event.target;
        props.setTheInput("mintPrice", value);
    }

    return (
        <div>
            <Select
                options={options}
                value={selectedOption}
                onChange={handleSelect}
            />
            <br />
            <form>
                Mint Price <br />
                <input
                    placeholder="Put 0 if the mint is free"
                    name="mintPrice"
                    onChange={handleMintPrice}
                    value={props.setTheInput.mintPrice}
                />
            </form>
        </div>
    );
}
