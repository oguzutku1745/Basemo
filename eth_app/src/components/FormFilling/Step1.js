import React from "react";

export default function Step1(props) {
    const handleInputChange = (event) => {
        const { name, value } = event.target;

        props.setTheInput(name, value);
    };

    return (
        <div>
            <div>
                <form>
                    Task Name <br />
                    <input
                        name="taskName"
                        placeholder="Preferrably Collection Name"
                        onChange={handleInputChange}
                        value={props.setTheInput.taskName}
                    />
                    <br /> <br />
                    Contract Address <br />
                    <input
                        name="taskContract"
                        placeholder="Contract of the collection"
                        onChange={handleInputChange}
                        value={props.setTheInput.taskContract}
                    />
                </form>
            </div>
        </div>
    );
}
