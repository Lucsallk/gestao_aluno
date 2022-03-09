import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
function Navbar() {
  
    const [showLinks, setShowLinks] = useState(false);

    return (
    <div className="Navbar">
        <div className="leftSide">
            <div className="links">
                <Link exat to={"/"}><i class="fa-solid fa-house"></i></Link>
            </div>
        </div>
        <div className="rightSide">
            <div className="links" id={showLinks ? "hidden" : "" }>
                <Link exact to={"/"}>Home</Link>
                <Link to={"/Sobre"}>Sobre</Link>
                <Link to={"/FAQ"}>FAQ</Link>    
            </div>
            {/* Ativa/Desativa o menu mobile */}
            <button onClick={() => setShowLinks(!showLinks)}> <i class="fa-solid fa-bars"></i> </button>
        </div>
    </div>
  )
}

export default Navbar