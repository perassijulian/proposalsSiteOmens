import React from 'react';
import { ethers } from 'ethers';

export default function ProposalRender(props) {
  return(
    <>
      {props.proposalToRender.map((proposal, index) => (
        <div key={proposal.proposalId} className="card">
          <h5>{proposal.description}</h5>
          
          {props.ableToVote && 
          <div>
            {proposal.votes.map((vote) => (
              <div key={vote.type}>
                <input
                  type="radio"
                  id={proposal.proposalId + "-" + vote.type}
                  name={proposal.proposalId}
                  value={vote.type}
                  //default the "abstain" vote to chedked
                  defaultChecked={vote.type === 2}
                />
                <label htmlFor={proposal.proposalId + "-" + vote.type}>
                  {vote.label}
                </label>
              </div>
            ))}
          </div>}
          
          {!props.ableToVote && 
          <div>
            {proposal.votes.map((vote) => (
              <p>
                {vote.label}: {ethers.utils.formatUnits(vote.count.toString(),18)}
              </p>
            ))}
          </div>}
          

        </div>
      ))}
    </>
  )
}