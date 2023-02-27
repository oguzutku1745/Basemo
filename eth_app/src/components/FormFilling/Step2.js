import React from "react";
import Select from 'react-select'

export default function Step2(props) {
    console.log(props.contractFunctions)
    
    const options = [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'vanilla', label: 'Vanilla' }
    ]

return(
    <div>
        <Select options={options} />
    </div>
)    
}