import React, { useState } from "react";

export default function Treasury(props) {
    // A fancy function to shorten someones wallet address, no need to show the whole thing. 
    const [canExec, setCanExec] = useState("");
    const [proposalSelected, setProposalSelected] = useState("");


    const shortenAddress = (str) => {
        return str.substring(0, 6) + "..." + str.substring(str.length - 4);
    };

    const optionDisplay = props.proposals.map((item) => {
        let showing = item.description.slice(0, 10)
        return(<option value={item.proposalId}>{showing}</option>)
    })


    async function handleSelectProposal(event){
        setProposalSelected(event.target.value.toString())
        const disp = await props.voteModule.get(event.target.value)
        console.log(disp)
        setCanExec(await props.voteModule.canExecute(event.target.value))
    }

    async function executeProposal(proposalSelected) {
        await props.voteModule.execute(proposalSelected);
    }

    return(
        <div>  
          <h2>Treasury</h2>
          <h4>TODO: total amonut available on treasury</h4>
          <h4>TODO: button to check if proposal is ready to execute</h4>
          <h4>TODO: button to execute proposal</h4>
          <h4>TBD: register of transfers?</h4>
          <div>
            <select
                className="execute--proposals" 
                onChange={handleSelectProposal}
            >
                <option value="">-- SELECT --</option>
                {optionDisplay}
            </select>
            <button 
                disabled={!canExec}
                onClick={executeProposal}
            >
            {canExec? "EXECUTE" : "CAN'T EXECUTE"}
            </button>
          </div>
          
        </div>
    )
}