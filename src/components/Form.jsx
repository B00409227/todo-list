import React, { useState, useEffect } from 'react';

export default function Form(props) {
  const [name, setName] = useState("");
  const [addition, setAddition] = useState(false);

  useEffect(() => {
    if (addition) {
      console.log("useEffect detected addition");
      props.geoFindMe && props.geoFindMe();
      setAddition(false);
    }
  }, [addition, props.geoFindMe]);

  function handleSubmit(e) {
    e.preventDefault();
    if (name.trim()) {
      console.log("Submitting task:", name);
      props.addTask(name);
      setName("");
      setAddition(true);
    }
  }

  function handleChange(e) {
    setName(e.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="label-wrapper">
        <label htmlFor="new-todo-input" className="label__lg">
          What needs to be done?
        </label>
      </h2>

      <input
        type="text"
        id="new-todo-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
        value={name}
        onChange={handleChange}
      />
      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  );
}
