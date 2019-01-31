import React from 'react';

const Switch = props => {
  return (
    <label className="bootstrap-switch">
      <input type="checkbox" {...props} />
      <span className="bootstrap-slider" />
    </label>
  );
};

export default Switch;
