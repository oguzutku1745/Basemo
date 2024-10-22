import React, { useState, useEffect } from "react";
import Select from "react-select";
import { v4 as uuidv4 } from "uuid";

export default function Step5(props) {
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
    /////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////
    // OPTION 2
    const [writeFunctions, setWriteFunctions] = useState([]);
    const [selectedOptionFunction, setSelectedOptionFunction] = useState(null);
    const [functionInputs, setFunctionInputs] = useState([]);
    const [selectedFunction, setSelectedFunction] = useState(null);

    useEffect(() => {
        if (props.contractFunctions.length > 0) {
            const filteredFunctions = props.contractFunctions.filter(
                (func) => func.functionType === "write"
            );
            setWriteFunctions(filteredFunctions.map((func) => func.name));
        }
        let taskid = uuidv4();
        taskid = taskid.replace(/-/g, "");

        props.setTheInput("taskID", taskid);
    }, [props.contractFunctions]);

    const optionsWrite = writeFunctions.map((name, index) => ({
        index: index,
        value: name,
        label: name,
    }));

    function handleChecked(event) {
        const { name, value, checked } = event.target;
        console.log(checked);
        const checkedValue = checked ? 1 : 0; // if checked is true, checkedValue will be 1, otherwise it will be 0
        props.setTheInput("eventListenerPending", checkedValue);
    }

    function handleSelectFunction(selected) {
        setSelectedOptionFunction(selected);
        props.setTheInput("eventListenerFunction", selected.value);

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
        props.setTheInput("eventListenerInput", inputValues.join(","));
    }

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
                    value={props.selectedMethod}
                    onChange={props.handleSelectChangeMethod}
                    defaultValue="Read"
                >
                    <option value="Read">
                        Listen the Read function results
                    </option>
                    <option value="Mempool">Listen the function call</option>
                    <option value="blockNumber">
                        Trigger with the block number
                    </option>
                </select>
            </div>
            <br></br>
            {props.selectedMethod === "Read" ? (
                <div>
                    Read Function
                    <Select
                        className="selectclass"
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
            ) : props.selectedMethod === "blockNumber" ? (
                <div>
                    <form>
                        Target Block number <br />
                        <input
                            placeholder="Put the target value"
                            name="eventListenerInput"
                            onChange={handleTargetInput}
                            value={props.setTheInput.eventListenerInput}
                        />
                    </form>
                </div>
            ) : (
                <div>
                    Write Function
                    <Select
                        className="selectclass"
                        options={optionsWrite}
                        value={selectedOptionFunction}
                        onChange={handleSelectFunction}
                    />
                    <br />
                    {selectedFunction && (
                        <form>
                            <input
                                type="checkbox"
                                id="eventListenerPending"
                                name="eventListenerPending"
                                checked={
                                    props.mintSectionInputs.eventListenerPending
                                }
                                onChange={handleChecked}
                            />
                            Select the box if you want to trigger the bot while
                            "Pending"
                            <br />
                        </form>
                    )}
                    {selectedFunction &&
                        selectedFunction.paramName.length > 0 && (
                            <form>
                                {functionInputs.map((input, index) => (
                                    <div key={index}>
                                        <label>{input.name}: </label>
                                        <input
                                            name={input.name}
                                            onChange={(event) =>
                                                handleInput(event, index)
                                            }
                                            value={input.value}
                                        />
                                    </div>
                                ))}
                            </form>
                        )}
                </div>
            )}
        </div>
    );
}
