import React, { useState, useEffect } from "react";
import Select from "react-select";

export default function Step2(props) {
    const [writeFunctions, setWriteFunctions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [functionInputs, setFunctionInputs] = useState([]);
    const [selectedFunction, setSelectedFunction] = useState(null);

    useEffect(() => {
        if (props.contractFunctions.length > 0) {
            const filteredFunctions = props.contractFunctions.filter(
                (func) => func.functionType === "write"
            );
            setWriteFunctions(filteredFunctions.map((func) => func.name));
        }
    }, [props.contractFunctions]);

    const options = writeFunctions.map((name, index) => ({
        index: index,
        value: name,
        label: name,
    }));

    function handleSelect(selected) {
        setSelectedOption(selected);
        props.setTheInput("taskContractFunction", selected.value);

        const selectedFunction = props.contractFunctions.find(
            (func) => func.name === selected.value
        );
        setSelectedFunction(selectedFunction);
        setFunctionInputs([]); // reset the input values

        if (
            selectedFunction &&
            selectedFunction.paramName.some((str) => str.trim().length > 0)
        ) {
            const inputs = selectedFunction.paramName.map((name) => ({
                name,
                value: "",
            }));
            setFunctionInputs(inputs);
        }
    }

    function handleInput(event, index) {
        const { name, value } = event.target;
        const inputs = [...functionInputs];

        // Update the value of the input placeholder at the specified index
        inputs[index].value = value;
        setFunctionInputs(inputs);

        const inputValues = inputs.map((input) => input.value);
        props.setTheInput("taskContractFunctionInput", inputValues.join(","));
    }
    const [isChecked, setIsChecked] = useState(false);
    const [inputValue, setInputValue] = useState("");

    function handleCheckboxChange(event) {
        setIsChecked(event.target.checked);
    }

    function handleInputChange(event) {
        setInputValue(event.target.value);
        props.setTheInput("mintPrice", event.target.value);
    }

    return (
        <div>
            <Select
                className="selectclass"
                options={options}
                value={selectedOption}
                onChange={handleSelect}
            />
            <br />
            {selectedFunction && selectedFunction.paramName.length > 0 && (
                <form>
                    {functionInputs.map((input, index) => (
                        <div key={index}>
                            <label>{input.name}: </label>
                            <input
                                name={input.name}
                                onChange={(event) => handleInput(event, index)}
                                value={input.value}
                            />
                        </div>
                    ))}
                </form>
            )}
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                    />
                    This is a mint task
                </label>
                {isChecked && (
                    <div>
                        <div>
                            <b>İmportant İnfo:</b>
                            You should give mint price in the form of "Count *
                            mint price". İf you minting 2 NFTs and the mint
                            price is 0.1 , enter 0.2 below. Enter the value for
                            1 wallet. It doesn't matter if you use 1 wallet or
                            more wallet
                        </div>
                        <label>
                            Enter mint Price:
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
}
