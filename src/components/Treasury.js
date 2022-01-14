import React from "react";

export default function Treasury(props) {
    // A fancy function to shorten someones wallet address, no need to show the whole thing. 
    const shortenAddress = (str) => {
        return str.substring(0, 6) + "..." + str.substring(str.length - 4);
    };

    return(
        <div>  
          <p>Treasury</p>
          <h4>TODO: total amonut available on treasury</h4>
          <h4>TODO: button to check if proposal is ready to execute</h4>
          <h4>TODO: button to execute proposal</h4>
          <h4>TBD: register of transfers?</h4>
        </div>
    )
}