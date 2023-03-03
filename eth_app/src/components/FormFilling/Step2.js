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
  
    if (selectedFunction && selectedFunction.paramName.some(str => str.trim().length > 0)) {
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

  return (
    <div>
      <Select options={options} value={selectedOption} onChange={handleSelect} />
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
    </div>
  );
}