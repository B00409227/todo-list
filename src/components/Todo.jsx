import React, { useEffect, useRef, useState } from "react";
import Popup from "reactjs-popup"; // W07 CAM
import "reactjs-popup/dist/index.css"; // W07 CAM
import Webcam from "react-webcam"; // W07 CAM
import { addPhoto, GetPhotoSrc } from "../db.jsx"; // W07 CAM

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}


// Main Todo Component ----
export default function Todo(props) {
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [photoSave, setPhotoSave] = useState(false);
  const [imgId, setImgId] = useState(null);

  const editFieldRef = useRef(null);
  const editButtonRef = useRef(null);

  const wasEditing = usePrevious(isEditing);

  useEffect(() => {
    if (photoSave) {
      console.log("useEffect detected photoSave");
      props.photoedTask && props.photoedTask(imgId);
      setPhotoSave(false);
    }
  }, [photoSave, props.photoedTask, imgId]);

  function handleChange(event) {
    setNewName(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (newName.trim()) {
      props.editTask(props.id, newName);
      setNewName("");
      setEditing(false);
    }
  }

  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="todo-label" htmlFor={props.id}>
          New name for {props.name}
        </label>
        <input
          id={props.id}
          className="todo-text"
          type="text"
          value={newName}
          onChange={handleChange}
          ref={editFieldRef}
        />
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn todo-cancel"
          onClick={() => setEditing(false)}
        >
          Cancel
          <span className="visually-hidden">renaming {props.name}</span>
        </button>
        <button type="submit" className="btn btn__primary todo-edit">
          Save
          <span className="visually-hidden">new name for {props.name}</span>
        </button>
      </div>
    </form>
  );

  const viewTemplate = (
    <div className="stack-small">
      <div className="c-cb">
        <input
          id={props.id}
          type="checkbox"
          defaultChecked={props.completed}
          onChange={() => props.toggleTaskCompleted(props.id)}
        />
        <label className="todo-label" htmlFor={props.id}>
          {props.name}
        </label>
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn"
          onClick={() => setEditing(true)}
          ref={editButtonRef}
        >
          Edit <span className="visually-hidden">{props.name}</span>
        </button>
        {/*W07 CAM - Popup Take Photo*/}
        <Popup
          trigger={
            <button type="button" className="btn">
              {" "}
              Take Photo{" "}
            </button>
          }
          modal
        >
          <div>
            <WebcamCapture id={props.id} photoedTask={props.photoedTask} setPhotoSave={setPhotoSave} setImgId={setImgId} />
          </div>
        </Popup>
        {/*W07 CAM - Popup View Photo*/}
        <Popup
          trigger={
            <button type="button" className="btn">
              {" "}
              View Photo{" "}
            </button>
          }
          modal
        >
          <div>
            <ViewPhoto id={props.id} alt={props.name} />
          </div>
        </Popup>
        <button
          type="button"
          className="btn btn__danger"
          onClick={() => props.deleteTask(props.id)}
        >
          Delete <span className="visually-hidden">{props.name}</span>
        </button>
      </div>
      {/* Simplified location display */}
      {props.location && props.location.latitude && props.location.longitude && (
        <div className="location-info">
          <p>Location: {props.location.latitude}, {props.location.longitude}</p>
        </div>
      )}
    </div>
  );

  useEffect(() => {
    if (!isEditing && wasEditing) {
      editButtonRef.current.focus();
    }
    if (isEditing) {
      editFieldRef.current.focus();
    }
  }, [wasEditing, isEditing]);

  return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>;
}

// W07 CAM - New Component WebcamCapture
//
function WebcamCapture(props) {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    addPhoto(props.id, imageSrc);
    props.setPhotoSave(true);
    props.setImgId(props.id);
  };

  return (
    <>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={300}
        height={300}
      />
      <button onClick={capture}>Capture photo</button>
      {imgSrc && <img src={imgSrc} alt="webcam" />}
    </>
  );
}

// W07 CAM - New Component ViewPhoto
//
const ViewPhoto = (props) => {
  const photoSrc = GetPhotoSrc(props.id);
  return (
    <>
      <div>
        <img src={photoSrc} alt={props.name} />
      </div>
    </>
  );
};