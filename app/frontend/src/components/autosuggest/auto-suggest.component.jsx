import React from 'react';

const AutoSuggest = (props) =>{
    return(
        <input type='search' onChange={(event)=>console.log(event.target.value)} placeholder='search'/>
    )
}

export default AutoSuggest;