import React from 'react';
import "./../styles/Navbar.scss";
//import Treasury from './Treasury';
//import About from './About'
//import AddProject from './AddProject'
//import Contact from './Contact'


function Navbar(props) {

    return (
        <div className='navbar'>
            <h4>OMENS</h4>
            <nav>
                <div onClick={() => props.setToRender(props.About)}>ABOUT</div>
                <div onClick={() => props.setToRender(props.Proposals)}>PROPOSALS</div>
                <div onClick={() => props.setToRender(props.Project)}>ADD PROJECT</div>
                <div onClick={() => props.setToRender(props.Treasury)}>TREASURY</div>
                <div onClick={() => props.setToRender()}>CONTACT</div>
            </nav>
        </div>
    )

}

export default Navbar
