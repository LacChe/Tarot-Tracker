import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { partitionData, deckData } from "../../utils/rwsData.js";

const Suit = () => {
  const { suit } = useParams();
  const [suitData, setSuitData] = useState([]);

  const navigate = useNavigate();

  // init data on suit change
  useEffect(() => {
    setSuitData(
      deckData?.cards.slice(
        partitionData[suit].index,
        partitionData[suit].index + partitionData[suit].length
      )
    );
  }, [suit]);

  return (
    <div className="suit">
      <h1>{suit[0].toUpperCase() + suit.substring(1)}</h1>
      <div className="deck">
        {suitData?.map((data, index) => {
          const degree = Math.random() * 10 - 5;
          return (
            <div key={data.number}>
              <img
                style={{
                  transition: "all 0.1s ease-in-out",
                  transform: `rotate(${degree}deg)`,
                }}
                src={`${process.env.REACT_APP_SERVER_URL}/rws-deck-data/cards/${data.img}`}
                alt={data.img}
                onClick={() => {
                  navigate(`/records/deck/${suit}/${index}`);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Suit;
