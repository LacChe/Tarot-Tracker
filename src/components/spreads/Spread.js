import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { partitionData, deckData } from "../../utils/rwsData.js";
import { Card } from "../";
import Popup from "reactjs-popup";
import { useStateContext } from "../../utils/stateContext.js";

// props used to display spread of a reading
// if no reading data then display spread information
const Spread = ({
  spreadFromReading,
  setCard, // set card of parent reading
  cardsInput, // cards from parent reading
  setReversal, // set parent reading's card to reversed
  reversedInput, // reversal data from parent reading
  showDetails,
}) => {
  const { spread: spreadParam } = useParams();
  let spread = spreadFromReading;
  // if parent reading isn't passed in, get spread name from router param
  if (!spread) spread = spreadParam;

  const { userData } = useStateContext();

  const [reversalData, setReversalData] = useState(reversedInput);
  const [cardsData, setCardsData] = useState(cardsInput);
  useEffect(() => {
    setCardsData(cardsInput); // update when cards from parent change
  }, [cardsInput]);
  const [spreadData, setSpreadData] = useState();
  const [spreadHTML, setSpreadHTML] = useState(); // generated jsx to display spread
  const [displayOrder, setDisplayOrder] = useState([]); // card render order based off user input
  const [modalDisplayedSuit, setModalDisplayedSuit] = useState("");

  // used to close modal
  const ref = useRef();
  const closeModal = () => ref.current.close();

  // initialize data when spread changes
  useEffect(() => {
    setSpreadData(JSON.parse(localStorage.getItem("spreadData"))[spread]);
    let order = [];
    for (
      let i = 0;
      i <
      JSON.parse(localStorage.getItem("spreadData"))[spread].positions.xPos
        .length;
      i++
    ) {
      order.push(i);
    }
    setDisplayOrder(order);
  }, [spread]);

  // regenerate spread display jsx on data change
  useEffect(() => {
    // set postion to a card when user chooses from modal
    const handleCardSelection = function handleCardSelection(e, index, number) {
      if (!spreadFromReading) return;
      e.preventDefault();
      setCard(index, number);
      setCardsData((prev) => prev.map((n, i) => (index === i ? number : n)));
      setModalDisplayedSuit("");
      closeModal();
    };

    // set a postion to reversed
    const handleReversal = function handleReversal(e, index) {
      if (!spreadFromReading) return;
      e.preventDefault();
      setReversal(index);
      setReversalData((prev) => prev.map((r, i) => (index === i ? !r : r)));
    };

    const toggleInfo = function toggleInfo(e) {
      if (!spreadFromReading) return;
      e.preventDefault();
    };

    // generate selection of cards in popup modal
    const generateCardSelectionModal = function generateCardSelectionModal(
      index
    ) {
      return (
        <div className="spread-card-selection-list">
          {Object.keys(partitionData).map((key) => (
            <div key={key} className={`spread-card-selection-suit`}>
              <button
                className="spread-card-selection-suit-toggle"
                onClick={() =>
                  setModalDisplayedSuit((prev) => (prev === key ? "" : key))
                }
              >
                {key === "major"
                  ? "Major Arcana"
                  : key[0].toUpperCase() + key.substring(1)}
              </button>
              {modalDisplayedSuit === key &&
                deckData.cards
                  .slice(
                    partitionData[key].index,
                    partitionData[key].index + partitionData[key].length
                  )
                  .map((card) => (
                    <button
                      onClick={(e) => handleCardSelection(e, index, card.index)}
                      className="spread-card-selection-card"
                      key={card.name}
                    >
                      {card.name}
                    </button>
                  ))}
            </div>
          ))}
        </div>
      );
    };

    // generate jsx to display card in proper positions, reversals, and tool buttons
    const generateSpreadHTML = function generateSpreadHTML() {
      if (!spreadData) return;
      const positions = spreadData.positions;

      let html = [];
      for (let i = 0; i < displayOrder.length; i++) {
        html.push(
          <div
            key={i}
            onMouseEnter={reorder}
            className={`${cardsData ? "" : "remove-pointer"}`}
          >
            <Popup
              ref={ref}
              modal
              disabled={!cardsData}
              trigger={
                <img
                  data-index={displayOrder[i]}
                  style={{
                    top: `${positions.yPos[displayOrder[i]]}%`,
                    left: `${positions.xPos[displayOrder[i]]}%`,
                    transform: `rotate(${
                      positions.rotations[displayOrder[i]] +
                      (reversalData && reversalData[displayOrder[i]] ? 180 : 0)
                    }deg)`,
                  }}
                  className="spread-card-image"
                  src={`${process.env.REACT_APP_SERVER_URL}/${
                    cardsData && cardsData[displayOrder[i]] !== -1
                      ? `rws-deck-data/cards/${
                          deckData.cards[cardsData[displayOrder[i]]].img
                        }`
                      : `cardBackgrounds/${userData.backImage}.jpg`
                  }`}
                  alt={`background`}
                />
              }
            >
              {cardsData && generateCardSelectionModal(displayOrder[i])}
            </Popup>
            <div
              className="spread-card-buttons"
              style={{
                top: `${positions.yPos[displayOrder[i]]}%`,
                left: `${positions.xPos[displayOrder[i]]}%`,
                transform:
                  positions.rotations[displayOrder[i]] === -80
                    ? `translate(-1.5rem, 1.2rem)`
                    : `translate(0, 0)`,
              }}
            >
              {spreadFromReading && !showDetails && (
                <Popup
                  disabled={
                    !spreadFromReading ||
                    !cardsData ||
                    cardsData[displayOrder[i]] === -1
                  }
                  modal
                  trigger={
                    <button
                      className="set-card"
                      type="button"
                      onClick={(e) => toggleInfo(e, displayOrder[i])}
                    >
                      <em>
                        <strong>i</strong>
                      </em>
                    </button>
                  }
                >
                  <div className="card-popup">
                    {deckData &&
                      cardsData &&
                      deckData.cards[cardsData[displayOrder[i]]] && (
                        <Card
                          suitFromReading={
                            deckData.cards[cardsData[displayOrder[i]]].suit ===
                            "Trump"
                              ? "major"
                              : deckData.cards[
                                  cardsData[displayOrder[i]]
                                ].suit.toLowerCase()
                          }
                          cardFromReading={
                            deckData.cards[cardsData[displayOrder[i]]].number -
                            (deckData.cards[cardsData[displayOrder[i]]].suit ===
                            "Trump"
                              ? 0
                              : 1)
                          }
                        />
                      )}
                  </div>
                </Popup>
              )}
              {spreadFromReading && !showDetails && (
                <button
                  className="set-reverse"
                  type="button"
                  onClick={(e) => handleReversal(e, displayOrder[i])}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill={getComputedStyle(
                      document.documentElement
                    ).getPropertyValue("--color-a")}
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 4.5c1.215 0 2.417.055 3.604.162a.68.68 0 01.615.597c.124 1.038.208 2.088.25 3.15l-1.689-1.69a.75.75 0 00-1.06 1.061l2.999 3a.75.75 0 001.06 0l3.001-3a.75.75 0 10-1.06-1.06l-1.748 1.747a41.31 41.31 0 00-.264-3.386 2.18 2.18 0 00-1.97-1.913 41.512 41.512 0 00-7.477 0 2.18 2.18 0 00-1.969 1.913 41.16 41.16 0 00-.16 1.61.75.75 0 101.495.12c.041-.52.093-1.038.154-1.552a.68.68 0 01.615-.597A40.012 40.012 0 0110 4.5zM5.281 9.22a.75.75 0 00-1.06 0l-3.001 3a.75.75 0 101.06 1.06l1.748-1.747c.042 1.141.13 2.27.264 3.386a2.18 2.18 0 001.97 1.913 41.533 41.533 0 007.477 0 2.18 2.18 0 001.969-1.913c.064-.534.117-1.071.16-1.61a.75.75 0 10-1.495-.12c-.041.52-.093 1.037-.154 1.552a.68.68 0 01-.615.597 40.013 40.013 0 01-7.208 0 .68.68 0 01-.615-.597 39.785 39.785 0 01-.25-3.15l1.689 1.69a.75.75 0 001.06-1.061l-2.999-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
              <Popup
                disabled={true} // disable view spread funcitonality
                // disabled={!spreadFromReading || showDetails}
                modal
                trigger={
                  <button
                    type="button"
                    onClick={(e) => e.preventDefault()}
                    className="spread-card-number"
                  >
                    {displayOrder[i] + 1}
                  </button>
                }
              >
                <div className="spread-popup">
                  <Spread
                    spreadFromReading={spreadFromReading}
                    showDetails={true}
                  />
                </div>
              </Popup>
            </div>
          </div>
        );
      }
      return html;
    };

    setSpreadHTML(generateSpreadHTML());
  }, [
    // regenerate spread display jsx when these change
    userData,
    spreadData,
    displayOrder,
    reversalData,
    cardsData,
    modalDisplayedSuit,
    spreadFromReading,
    setCard,
    setReversal,
    showDetails,
  ]);

  // reorder render order of cards on user input
  const reorder = function reorder(e) {
    if (!e.target.dataset.index) return;
    setDisplayOrder((prev) => [
      ...prev.filter((i) => i !== Number(e.target.dataset.index)),
      Number(e.target.dataset.index),
    ]);
  };

  return (
    <div className="spread">
      {(!spreadFromReading || showDetails) && (
        <div className="spread-title">
          <h1>{spreadData?.name}</h1>
        </div>
      )}
      <div
        className="spread-layout-container"
        style={{
          width: `${spreadData?.minWidth * 7}rem`,
          height: `${spreadData?.minHeight * 10}rem`,
        }}
      >
        <div className="spread-layout">{spreadHTML}</div>
      </div>
    </div>
  );
};

export default Spread;
