import React from "react";

export default function FunctionStorer(props) {

console.log(props.function)
return(
    <div 
    className="functionDisplay">
        {props.function}
        <form>
            <input
            placeholder="input" />
        </form>
    </div>
)
}