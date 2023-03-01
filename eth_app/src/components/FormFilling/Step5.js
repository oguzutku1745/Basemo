import React, {useState, useEffect} from "react";
import Select from "react-select";

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

return(
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
)    
}