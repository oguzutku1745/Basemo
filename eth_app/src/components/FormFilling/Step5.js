import React, { useState, useEffect } from "react";
import Select from "react-select";

export default function Step5(props) {
    const [selectedMethod, setselectedMethod] = useState("Read");
    const [readFunctions, setReadFunctions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    useEffect(() => {
        // Check if props.contractFunctions has data
        if (props.contractFunctions.length > 0) {
            const filteredFunctionNames = props.contractFunctions
                .filter((func) => func.functionType === "read")
                .map((func) => func.name);
            setReadFunctions(filteredFunctionNames);
        }
    }, [props.contractFunctions]);
    console.log(readFunctions);

    const options = readFunctions.map((name, index) => ({
        index: index,
        value: name,
        label: name,
    }));

    function handleSelect(selected) {
        props.setTheInput("eventListenerFunction", selected.value);
        setSelectedOption(selected);
    }

    function handleTargetInput(event) {
        const { value } = event.target;
        props.setTheInput("eventListenerInput", value);
    }

    const handleSelectChangeMethod = (event) => {
        setselectedMethod(event.target.value);
    };

    return (
        <div>
            <div>
                <h4>You have 2 options for listening the contract: </h4>
            </div>
            <div>
                <strong>1- Listen the Read Function results:</strong> This will
                match when a contract view function matches your parameters{" "}
            </div>
            <div>
                <strong>2- Listen the function call: </strong>This will match
                when a transaction is sent to the contract that matches your
                parameters
            </div>
            <br></br>
            <div>
                <label htmlFor="select">Select an option:</label>
                <select
                    id="select"
                    value={selectedMethod}
                    onChange={handleSelectChangeMethod}
                >
                    <option value="Read">
                        Listen the Read function results
                    </option>
                    <option value="option2">Listen the function call</option>
                </select>
            </div>
            <br></br>
            {selectedMethod === "Read" ? (
                <div>
                    Read Function
                    <Select
                        options={options}
                        value={selectedOption}
                        onChange={handleSelect}
                    />
                    <br />
                    <form>
                        Target Value for Read Function <br />
                        <input
                            placeholder="Put the target value"
                            name="eventListenerInput"
                            onChange={handleTargetInput}
                            value={props.setTheInput.eventListenerInput}
                        />
                    </form>
                </div>
            ) : (
                <div>deneme</div>
            )}
        </div>
    );
}
