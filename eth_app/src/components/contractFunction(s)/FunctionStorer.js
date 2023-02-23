import React, {useState} from "react";

export default function FunctionStorer(props) {
  const [userContractInputs, setUserContractInputs] = useState({
    functionName: "",
    functionParams: [],
    functionInputs: [],
  })
  console.log(userContractInputs)
  function handleChange(event) {
    const {name, value} = event.target
    const {index, nameoffunction, inputparam} = event.target.dataset
    setUserContractInputs((prevFormData) => {
      const newFunctionInputs = [...prevFormData.functionInputs];
      newFunctionInputs[index] = value;
  
      const newFunctionParams = [...prevFormData.functionParams];
      newFunctionParams[index] = inputparam;
  
      return {
        ...prevFormData,
        functionName: nameoffunction,
        functionParams: newFunctionParams,
        functionInputs: newFunctionInputs,
      };
    });
  }

  return (
    <div className="functionDisplay">
      <h4>{props.name}</h4>
      {props.paramName.length > 0 && props.paramName.map((param, index) => (
        <div key={index}>
          {param}<br />
          {props.inputType[index] && (
            <form>
              <input
                data-nameoffunction={props.name} // change nameoffunction to data-nameoffunction
                data-inputparam={props.paramName[index]} // change inputparam to data-inputparam
                name="functionInputs"
                data-index={index}
                onChange={handleChange} 
                value={userContractInputs.functionInputs[index] || ""}
                placeholder={props.inputType[index]}
              />
            </form>
          )}
        </div>
      ))}
      <button className="buttons">
        {props.functionType === "read" ? "read" : "write"}
      </button>
    </div>
  );
}