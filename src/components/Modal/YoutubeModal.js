import React from 'react'
import {useSelector} from 'react-redux'
import Modal from 'react-bootstrap/Modal'
import ReactPlayer from 'react-player'
import './YoutubeModal.css'

const YoutubePlayerModal = (props) => {
  //Dispatches
  const url = useSelector(state => state.modalURL)
  const title = useSelector(state => state.modalTitle)

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header style={{backgroundColor: '#000' }} closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          style={{ color: "#fff", fontWeight: "bold"}}
        >
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#000000" }}>
        <ReactPlayer
          url={url}
          playing
          width="100%"
          controls={true}
        ></ReactPlayer>
      </Modal.Body>
    </Modal>
  )
}

export default YoutubePlayerModal