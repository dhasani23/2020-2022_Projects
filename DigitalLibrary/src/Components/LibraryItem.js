import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@material-ui/core';

const LibraryItem = ({b, removeAllDisabled}) => {

    const [disabled, setDisabled] = useState(false);

    const handleRemoveClicked = (b) => {
        axios.delete("http://localhost:8080/delete/" + b.firestoreID);
    }

    const checkDisabled = () => {
        if (removeAllDisabled === true) {
            setDisabled(true);
        }
    }

    useEffect(() => {
        setDisabled(false);
        checkDisabled();
    },[removeAllDisabled]);

    return (
    <div>
        <Button disabled={disabled} variant="contained" color="secondary" size="small" onClick={() => {handleRemoveClicked(b); setDisabled(true)}}>Remove</Button>
    </div>
    );

};

export default LibraryItem;

