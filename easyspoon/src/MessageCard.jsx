import React from "react";

import "./MessageCard.css"

const MessageCard = ({ className, message }) => {
    
    return (

        <div className={`MessageCard ${className || ""}`}>

            <p>{message}</p>

        </div>

    );
};


export default MessageCard