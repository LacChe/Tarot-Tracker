import React from "react";
import { useNavigate } from "react-router-dom";

const Spreads = () => {
  const navigate = useNavigate();

  // generate jsx to display list of spreads from spreadData file
  const generateSpreads = function generateSpreads() {
    return Object.keys(JSON.parse(localStorage.getItem("spreadData"))).map(
      (key) => (
        <div
          key={key}
          className="spread-item"
          onClick={() => navigate(`/records/spreads/${key}`)}
        >
          <p>{JSON.parse(localStorage.getItem("spreadData"))[key].name}</p>
        </div>
      )
    );
  };

  return (
    <div className="spreads">
      <h1>Spreads</h1>
      <div className="spreads-list">{generateSpreads()}</div>
    </div>
  );
};

export default Spreads;
