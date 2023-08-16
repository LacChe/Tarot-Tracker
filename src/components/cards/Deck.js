import React from "react";
import { useNavigate } from "react-router-dom";

const Cards = () => {
  const navigate = useNavigate();
  return (
    <div className="suit-selection">
      <img
        style={{
          transition: "all 0.1s ease-in-out",
          transform: "rotate(5deg)",
        }}
        src={`${process.env.REACT_APP_SERVER_URL}/rws-deck-data/cards/w01.jpg`}
        alt="w01.jpg"
        onClick={(e) => {
          e.stopPropagation();
          navigate("/records/deck/wands");
        }}
      />
      <img
        style={{
          transition: "all 0.1s ease-in-out",
        }}
        src={`${process.env.REACT_APP_SERVER_URL}/rws-deck-data/cards/m00.jpg`}
        alt="m00.jpg"
        onClick={(e) => {
          e.stopPropagation();
          navigate("/records/deck/major");
        }}
      />
      <img
        style={{
          transition: "all 0.1s ease-in-out",
          transform: "rotate(-5deg)",
        }}
        src={`${process.env.REACT_APP_SERVER_URL}/rws-deck-data/cards/c01.jpg`}
        alt="c01.jpg"
        onClick={(e) => {
          e.stopPropagation();
          navigate("/records/deck/cups");
        }}
      />
      <img
        style={{
          transition: "all 0.1s ease-in-out",
          transform: "rotate(-5deg)",
        }}
        src={`${process.env.REACT_APP_SERVER_URL}/rws-deck-data/cards/s01.jpg`}
        alt="s01.jpg"
        onClick={(e) => {
          e.stopPropagation();
          navigate("/records/deck/swords");
        }}
      />
      <img
        style={{
          transition: "all 0.1s ease-in-out",
          transform: "rotate(5deg)",
        }}
        src={`${process.env.REACT_APP_SERVER_URL}/rws-deck-data/cards/p01.jpg`}
        alt="p01.jpg"
        onClick={(e) => {
          e.stopPropagation();
          navigate("/records/deck/pentacles");
        }}
      />
    </div>
  );
};

export default Cards;
