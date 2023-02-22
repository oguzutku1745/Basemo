import React from "react";

export default function FunctionStorer(props) {

console.log(props)

return(
    <div 
    className="functionDisplay">
      {props.functionType === "read" ? (
        <div>
          <h2>READ</h2>
          <p>{props.name}</p>
          <form>
            <input placeholder="input" />
          </form>
        </div>
      ) : (
        <div>
          <h2>WRITE</h2>
          <p>{props.name}</p>
          <form>
            <input placeholder="input" />
          </form>
        </div>
      )}
    </div>
  );
}