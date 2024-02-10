import React from "react";

import { NavLink } from "react-router-dom";

import "./Card.css"

const PreviewCard = ({item}) => {

    if(item.title) {

        return(

            <div className="Card">

                <div className="center">
    
                    <NavLink exact="true" to={`/recipes/${item.id}`}><h2>{item.title}</h2></NavLink>

                    <div className="image-circle">
                        <img src={item.image}/>
                    </div>

                </div>
    
            </div>
    
        )

    }

    else if(item.name) {

        return(

            <div className="Card">

                <div className="center">

                    <NavLink exact="true" to={`/ingredients/${item.id}`}><h2>{item.title}</h2></NavLink>

                    <div className="image-circle">
                        <img src={item.image}/>
                    </div>

                </div>
    
            </div>
    
        )

    }

}

export default PreviewCard