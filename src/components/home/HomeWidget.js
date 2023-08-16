import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deckData } from "../../utils/rwsData.js";
import { useStateContext } from "../../utils/stateContext.js";

const HomeWidget = () => {
  const { userData } = useStateContext();
  const navigate = useNavigate();

  const randCard = Math.trunc(Math.random() * 78);
  const [cardNumber] = useState(
    userData.homeImage === -1 ? randCard : userData.homeImage
  );

  const navigateToCard = function navigateToCard() {
    let suit =
      deckData.cards[
        userData.homeImage === -1 ? randCard : userData.homeImage
      ].suit.toLowerCase();
    let index =
      deckData.cards[userData.homeImage === -1 ? randCard : userData.homeImage]
        .number;
    if (suit === "trump") suit = "major";
    else index--;
    navigate(`/records/deck/${suit}/${index}`);
  };

  return (
    <div className="home-widget">
      <div>
        <div
          onClick={() => navigate("/records/readings/reading")}
          className="home-widget-new"
        >
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke={getComputedStyle(
                document.documentElement
              ).getPropertyValue("--color-highlight")}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
              />
            </svg>
          </button>
          <div
            onClick={(e) => {
              e.stopPropagation();
              navigate("/records");
            }}
            className="home-widget-records"
          >
            <button>Records</button>
          </div>
        </div>
        <div
          className="home-widget-image"
          onClick={navigateToCard}
          style={{
            backgroundImage: `url(${
              process.env.REACT_APP_SERVER_URL
            }/rws-deck-data/cards/${
              cardNumber ? deckData.cards[cardNumber].img : "m01.jpg"
            })`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default HomeWidget;
