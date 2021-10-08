import React, {Component} from 'react';
import { Link } from "react-router-dom";

class Navbar extends Component{

    constructor(props){
        super(props);
        this.state = {
        }
    }

    handleLogout = (e) => {
       
        localStorage.removeItem("token");
        localStorage.removeItem("user_email");
        const event = new Event('userChanged');
        document.dispatchEvent(event);
        sessionStorage.clear();
    
      };

    render(){
            if(this.props.userEmail !=="" && this.props.userEmail !==undefined && this.props.userEmail !==null){
                return(
                    <div>
                        <nav id="navigation">
                            <div className="nav-wrapper" id="navigation">
                                <a href="/owners" className="center-align" style={{marginLeft:1+'em', fontSize:2 + 'em'}}><b>SuperOwners</b></a>
                                <ul className="right show-on-large">
                                    <li>
                                        <a href="/about">About</a>
                                    </li>
                                    <li>
                                        <ul id="dropdown1" className="dropdown-content">
                                            <p id="user_email">{this.props.userEmail}</p>
                                            <p><Link style={{color: 'black'}} to="/" onClick={this.handleLogout} id="logout-link">Logout</Link></p>
                                        </ul>
                                        <a className="dropdown-trigger" href="#!" data-target="dropdown1"><i className="fa fa-angle-down" style={{size:2 + 'px'}}></i></a>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                
                )
            }
            else{
                return(    
                    <div>              
                        <nav id="navigation">
                            <div className="nav-wrapper" id="navigation">
                                <a href="/owners" className="center-align" style={{marginLeft:1+'em', fontSize:2 + 'em'}}><b>SuperOwners</b></a>
                                <ul className="right show-on-large">
                                    <li><a href="/about">About</a></li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                )
            }
    }
}

export default Navbar;