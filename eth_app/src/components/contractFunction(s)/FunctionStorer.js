import React, {useState} from "react";

export default function FunctionStorer(props) {
  const [userContractInputs, setUserContractInputs] = useState({
    functionName: "",
    functionParams: [],
    functionInputs: [],
})

function handleChange(event) {
  console.log(event.target)
  const {name, value} = event.target
  setUserContractInputs(prevFormData => {
      return {
          ...prevFormData,
          [name]: value
      }
  })
}
return (
  <div className="functionDisplay">
    <h4>{props.name}</h4>
    {props.paramName.length >0 && props.paramName.map((param, index) => (
      <div key={index}>
        {param}<br />
        {props.inputType[index] && (
          <form>
          <input
          nameoffunction={props.name}
          inputparam={props.paramName[index]}
          name="functionInputs"
          onChange={handleChange} 
          value={userContractInputs.functionInputs}
          placeholder={props.inputType[index]} />
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
