import React from 'react';

export default function Form(props) {

    const optionDisplay = props.display.map((item) => {
        return(<option value={item}>{item}</option>)
    })
    
    return(
        <select
            className="amount-beneficiaries" 
            id="amountReceivers" 
            value={props.amountReceivers}
            name="amountReceivers"
            onChange={props.handleChange}
        >
            {optionDisplay}
        </select>
    )
}

//MAKE THIS RECICLABLE GIVING AS PROPS AN ARRAY AND LOOPING IT THROUGH ARRAY.LENGTH
//ITS BEING USED IN THE SELECTION OF NR OF BENEFICIARIES AND ON THE PROPOSALS