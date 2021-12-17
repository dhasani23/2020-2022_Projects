import React, { useState } from 'react';
import Modal from "react-modal";
import { Button } from '@material-ui/core';

const MyModal = ({b}) => {

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const setModalIsOpenToTrue = () => {
        setModalIsOpen(true)
    }

    const setModalIsOpenToFalse = () => {
        setModalIsOpen(false)
    }

    const customStyle = {
        content : {
            width: 750,
            height: 350,
            margin: "auto",
        }
    };

    return (
    <div>
        <br />
        <Button onClick={setModalIsOpenToTrue} style={{textTransform: 'lowercase'}} variant="outlined" size="small">description</Button>
        <Modal isOpen={modalIsOpen} style={customStyle} transparent={true}>
            <Button size="small" onClick={setModalIsOpenToFalse}>X</Button>
            <h4 style={{textAlign: "center"}}>Description of <i>{b.title}</i></h4>
            { typeof b.description != "undefined"
                ? <p style={{textAlign: "center"}}>{b.description}</p>
                : <p style={{textAlign: "center"}}><i>No description available</i></p>
            }
        </Modal>
    </div>
    );

};

export default MyModal;

