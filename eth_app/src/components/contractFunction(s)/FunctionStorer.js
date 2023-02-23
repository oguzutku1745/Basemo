import React from "react";

export default function FunctionStorer(props) {

return(
    <div 
    className="functionDisplay">
      <h4>{props.name}</h4>
      <p>{props.paramName}</p>
      {props.inputType && <input 
      placeholder={props.inputType}
      />}
      <button className="buttons" >{props.functionType === "read" ? "read" : "write"}</button>
    </div>
  );
}