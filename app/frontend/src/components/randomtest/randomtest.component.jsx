import React, { useState } from "react";

const Chchck = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div>
      <input
        type="checkbox"
        onChange={() => {
            console.log("changing");
          setIsChecked(!isChecked);
        }}
        checked={isChecked}
      />
    </div>
  );
};

export default Chchck;