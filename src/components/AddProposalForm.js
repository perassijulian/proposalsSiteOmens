import React from 'react';
import { ethers } from "ethers";

import Select from './Select'
import Addresses from './Addresses'

export default function Form(props) {

    const [formData, setFormData] = React.useState(
        {
            //do this with array
            description: "", 
            address1: "",
            address2: "",
            address3: "",
            address4: "",
            address5: "",
            address6: "",
            address7: "",
            address8: "",
            address9: "",
            address10: "",
            amountReceivers: 1,
            amountMoney: ""
        })
        
    async function setProposal() {
        const amount = ethers.utils.parseUnits(formData.amountMoney.toString(), 18);
        let newProp = props.proposalsLength + 1;
        const description = 'PROPOSAL ' + newProp + ": " + formData.description;
        const toAddress = props.tokenModule.address;
        const fromAddress = formData.address1;
        
        try {

            await props.voteModule.propose(
            description,
            [
                {
                // We're sending ourselves 0 ETH. Just sending our own token.
                nativeTokenValue: 0,
                transactionData: props.tokenModule.contract.interface.encodeFunctionData(
                    // We're doing a transfer from the treasury to our wallet.
                    "transfer",
                    [
                    fromAddress,
                    amount,
                    ]
                ),
        
                toAddress: toAddress,
                },
            ]
            );
        
            console.log(
            "✅ Successfully created proposal"
            );
        } catch (error) {
            console.error("failed to create proposal", error);
        }
    }    

        
    function handleChange(event) {
        const {name, value, type, checked} = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: type === "checkbox" ? checked : value
            }
        })
    }

    function handleSubmit(event) {
      event.preventDefault();

    // check that all addressess have 42characters
      for (let i=1; i<=formData.amountReceivers; i++) {
        let addressToCheck = `address${i}`;
        if (formData[addressToCheck].split("").length != 42) {
            alert("Your address must have 42 characters. Double check it")
            alert("Your address number "+i+" does not meet the requirement")
            return
        }
      }
      
      //cleaner when you go from higher to lower amount of receivers
      for (let i=(parseInt(formData.amountReceivers)+1); i<11; i++) {
        let addressToClean = `address${i}`;
        formData[addressToClean] = "";
      }

      //check that you put an amount
      if (formData.amountMoney<=0) {
          alert("You need to add an amount for the proposal")
          return
      }
      
      if (formData.description.split()<=20) {
          alert("Do not be lazy, you can describe better the project!")
          return
      }

      //setProposal();
      console.log("paso")
      //we need to clean the blank spaces. maybe just 1,4 and 5 are filled

     console.log('DATA: ',formData)
    }        
    
    let addressName = [];
    for (let i=0; i<formData.amountReceivers; i++) {
        addressName.push(`address${i+1}`)   
    }
    const addressesMapping = addressName.map( item=> {
        return <Addresses 
            handleChange={handleChange}
            name={item} 
            address={formData.value}
            //check this line 
        />
     })

    return(
        <div className="tabs--submit">
            <div>
            <h2>Submit proposal</h2>
            <br />
            <textarea 
                className='tabs--submit--textarea'
                value={formData.description}
                placeholder="Write the description for your project proposal."
                onChange={handleChange}
                name="description"
            />
            <br />
            <form onSubmit={handleSubmit} className='tabs--submit--form'>
                <div>
                    <span className="tabs--submit--span">
                        <p> It will transfer</p>
                        <input className="tabs--submit--span--input"
                            type="number"
                            placeholder="0.0"
                            name="amountMoney"
                            onChange={handleChange}
                            value={formData.amountMoney}
                        /> 
                        <p>OMN</p>
                    </span>
                    {formData.amountReceivers>1 && 
                    <span className="tabs--submit--span--accotation">
                        <p>That is,</p>
                        <div className='tabs--submit--span--division'>
                            {Math.round(formData.amountMoney/formData.amountReceivers)}
                        </div>
                        <p>OMN to EACH beneficiary</p> 
                    </span>}
                    <br />
                    {addressesMapping}   
                </div>
                <div>
                    <span className="tabs--submit--span">
                        <p> This proposal is to </p>
                        <Select 
                            amountReceivers={formData.amountReceivers}
                            display={[1,2,3,4,5,6,7,8,9,10]}
                            handleChange={handleChange}
                        />
                        {formData.amountReceivers === "1"
                            ? <p> beneficiary</p>
                            : <p> beneficiaries</p>
                        }
                    </span>
                    <div className='tabs--submit--button'>
                        <button>Submit proposal</button>
                    </div>
                </div>                
            </form>
            </div>
        </div>
    )
}