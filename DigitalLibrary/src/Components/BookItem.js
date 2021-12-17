import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@material-ui/core';

const BookItem = ({b, searchResults, addAllDisabled}) => {

    const [disabled, setDisabled] = useState(false);
    
    const handleAddClicked = (b) => {
        console.log(b);
        axios.post("http://localhost:8080/add-book", {
            book: b["volumeInfo"]
        });
    }

    const checkDisabled = () => {
        if (addAllDisabled === true) {
            setDisabled(true);
        }
    }

    useEffect(() => {
        setDisabled(false);
        checkDisabled();
    },[searchResults, addAllDisabled]);

    return (
    <div>
        <Button disabled={disabled} variant="contained" color="primary" size="small" onClick={() => {handleAddClicked(b); setDisabled(true)}}>Add</Button>
    </div>
    );

};

export default BookItem;

