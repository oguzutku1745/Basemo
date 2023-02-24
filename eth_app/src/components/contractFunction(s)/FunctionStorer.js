import React, { useState, useMemo } from "react";

export default function FunctionStorer(props) {
    const [userContractInputsChild, setUserContractInputsChild] = useState({
        functionName: `${props.name}`,
        functionParams: [],
        functionInputs: [],
    });

    function handleChange(event) {
        const { name, value } = event.target;
        const { index, nameoffunction, inputparam } = event.target.dataset;
        setUserContractInputsChild((prevFormData) => {
            const newFunctionInputs = [...prevFormData.functionInputs];
            const paramSetter = prevFormData.functionParams;
            newFunctionInputs[index] = value;
            paramSetter[index] = inputparam;

            props.handleChildStateChange({
                functionInputs: newFunctionInputs,
                functionName: nameoffunction,
                functionParams: paramSetter,
            });
            return {
                ...prevFormData,
                functionInputs: newFunctionInputs,
                functionName: nameoffunction,
                functionParams: paramSetter,
            };
        });
    }

    function handleButtonClick() {
        props.handleChildStateChange(userContractInputsChild);
        if (props.functionType === "read")
            props.sendTxn(userContractInputsChild);
        else props.sendWriteTxn(userContractInputsChild);
    }

    return (
        <div className="functionDisplay">
            <h4>{props.name}</h4>
            {props.paramName.length > 0 &&
                props.paramName.map((param, index) => (
                    <div key={index}>
                        {param}
                        <br />
                        {props.inputType[index] && (
                            <form>
                                <input
                                    data-nameoffunction={props.name} // change nameoffunction to data-nameoffunction
                                    data-inputparam={props.paramName[index]} // change inputparam to data-inputparam
                                    name="functionInputs"
                                    data-index={index}
                                    onChange={handleChange}
                                    value={
                                        userContractInputsChild.functionInputs[
                                            index
                                        ] || ""
                                    }
                                    placeholder={props.inputType[index]}
                                />
                            </form>
                        )}
                    </div>
                ))}
            <button className="buttons" onClick={handleButtonClick}>
                {props.functionType === "read" ? "read" : "write"}
            </button>
        </div>
    );
}
