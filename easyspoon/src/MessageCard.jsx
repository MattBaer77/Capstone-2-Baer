import React from "react";

import "./MessageCard.css"

const MessageCard = ({ className, message }) => {
    
    return (

        <div className={`MessageCard ${className || ""}`}>

            <p>Error! {"-" + JSON.stringify(message) || ""}</p>

        </div>

    );
};


export default MessageCard