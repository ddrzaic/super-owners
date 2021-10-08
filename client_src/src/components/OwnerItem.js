
import React, {Component} from "react";
import { Link } from "react-router-dom";

class OwnerItem extends Component{
    constructor(props){
        super(props);
        this.state = {
            item:props.item
        }
    }
    render(){
        return(
            <li className="collection-item" id="owner-li">
                <Link id="owner-item" to={`/owners/${this.state.item.owner_id}`}>
                    {this.state.item.first_name} {this.state.item.last_name} 
                </Link>
            </li>
        )
    }
}

export default OwnerItem;