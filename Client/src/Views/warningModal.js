import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export const WarningModal = (props) => {
  const [show, setShow] = useState(false);
  const [isCheckValid, setIsCheckValid] = useState(false)
  const handleClose = () => {
    setShow(false)
    props.closeModal()
  };

  useEffect(() =>{
    setShow(props.show)
  }, [props.show])
  const CheckWarning = () =>{
    if(isCheckValid){
      props.handleDeleteUser()
      handleClose()
    }
  }

  return (
    <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props.message}<br/>
          <input onChange={(e) => setIsCheckValid(e.target.value === props.email)} style={{marginTop: "10px",width:"100%", border:"1px solid #D3D3D3"}}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleClose}>
            Chiudi
          </Button>
          <Button disabled={!isCheckValid} onClick={() => CheckWarning()} variant="warning">Ho capito</Button>
        </Modal.Footer>
      </Modal>
  )
}

export default WarningModal