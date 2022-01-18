//when you put X addresses and then change to Y < X the ones that you don't see remain
//saved. I think that this behaviour is ok, but the thing is that if you put Z > Y
//you see a blank placeholder and should be the addressess that you put before

import React from 'react';

export default function Addresses(props) {
    return(
            <input
                className='tabs--submit--address'
                type="text"
                placeholder="Address to transfer"
                name={props.name}
                onChange={props.handleChange}
                value={props.value}
                //check this line
            />
    )
}