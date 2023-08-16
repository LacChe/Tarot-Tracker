import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { partitionData, deckData } from "../../utils/rwsData.js";
import { useStateContext } from "../../utils/stateContext.js";
import toast from "react-hot-toast";

const Card = ({ suitFromReading, cardFromReading }) => {
  const { suitParam, cardParam } = useParams();
  let suit = suitParam || suitFromReading;
  let card = cardParam || cardFromReading;

  const { keywordMeaningsData, setKeywordMeaningsData } = useStateContext();

  const [cardData, setCardData] = useState();
  const [newKeywordInput, setNewKeywordInput] = useState();
  const [newMeaningInput, setNewMeaningInput] = useState();
  const [newMeaningReversedInput, setNewMeaningReversedInput] = useState();

  // init card data on suit or card change
  useEffect(() => {
    setCardData(deckData?.cards[partitionData[suit].index + Number(card)]);
  }, [suit, card, setCardData]);

  // update users keyword and meaning data
  useEffect(() => {
    // post users keyword and meaning data to db
    const handleKeywordsAndMeaningChange =
      async function handleKeywordsAndMeaningChange() {
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          credentials: "include",
          body: JSON.stringify({
            keywords: keywordMeaningsData,
          }),
        };
        await fetch(
          `${process.env.REACT_APP_SERVER_URL}/keywords`,
          requestOptions
        );
      };
    handleKeywordsAndMeaningChange();
  }, [keywordMeaningsData]);

  // remove keyword/meaning from list
  const removeKeywordsAndMeaning = async function removeKeywordsAndMeaning(
    e,
    listName,
    dataIndex
  ) {
    e.preventDefault();
    const newArr = {
      keywords: keywordMeaningsData.keywords,
      meanings: keywordMeaningsData.meanings,
      meaningsReversed: keywordMeaningsData.meaningsReversed,
    };
    newArr[listName][partitionData[suit].index + Number(card)] = newArr[
      listName
    ][partitionData[suit].index + Number(card)].filter(
      (data, index) => index !== dataIndex
    );
    setKeywordMeaningsData(newArr);
    toast.success("Removed!");
  };

  // add keyword/meaning to list
  const addKeywordsAndMeaning = async function addKeywordsAndMeaning(
    e,
    listName,
    data
  ) {
    e.preventDefault();

    if (!data || !data.replace(/\s/g, "").length) {
      toast.error("Please enter something");
      return;
    }

    const newArr = {
      keywords: keywordMeaningsData.keywords,
      meanings: keywordMeaningsData.meanings,
      meaningsReversed: keywordMeaningsData.meaningsReversed,
    };
    newArr[listName][partitionData[suit].index + Number(card)].push(data);
    setKeywordMeaningsData(newArr);
    toast.success("Added!");
  };

  // generate jsx for card details
  const generateCardDetails = function generateCardDetails() {
    if (!cardData) return;
    // format for major arcana
    if (cardData.arcana === "Major Arcana")
      return (
        <div className="card-details">
          <div>
            <p>Fortune Telling</p>
            {cardData.fortune_telling.map((data) => (
              <p key={data}>{data}</p>
            ))}
          </div>
          {generateKeywordsAndMeanings()}
          <div>
            <p>Archetype</p>
            <p>{cardData.archetype}</p>
          </div>
          <div>
            <p>Hebrew Letter</p>
            <p>{cardData.hebrew_alphabet}</p>
          </div>
          <div>
            <p>Numerology</p>
            <p>{cardData.numerology}</p>
          </div>
          <div>
            <p>Elemental</p>
            <p>{cardData.elemental}</p>
          </div>
          <div>
            <p>Mythical Spiritual</p>
            <p>{cardData.mythical_spiritual}</p>
          </div>
          <div>
            <p>Questions</p>
            {cardData.questions_to_ask.map((data) => (
              <p key={data}>{data}</p>
            ))}
          </div>
        </div>
      );
    // format for court cards
    if (cardData.arcana === "Minor Arcana" && cardData.number > 10)
      return (
        <div className="card-details">
          <div>
            <p>Fortune Telling</p>
            {cardData.fortune_telling.map((data) => (
              <p key={data}>{data}</p>
            ))}
          </div>
          {generateKeywordsAndMeanings()}
          <div>
            <p>Elemental</p>
            <p>{cardData.elemental}</p>
          </div>
          <div>
            <p>Affirmation</p>
            <p>{cardData.affirmation}</p>
          </div>
          <div>
            <p>Questions</p>
            {cardData.questions_to_ask.map((data) => (
              <p key={data}>{data}</p>
            ))}
          </div>
        </div>
      );
    // format for number cards
    if (cardData.arcana === "Minor Arcana" && cardData.number <= 10)
      return (
        <div className="card-details">
          <div>
            <p>Fortune Telling</p>
            {cardData.fortune_telling.map((data) => (
              <p key={data}>{data}</p>
            ))}
          </div>
          {generateKeywordsAndMeanings()}
          <div>
            <p>Numerology</p>
            <p>{cardData.numerology}</p>
          </div>
          <div>
            <p>Astrology</p>
            <p>{cardData.astrology}</p>
          </div>
          <div>
            <p>Affirmation</p>
            <p>{cardData.affirmation}</p>
          </div>
          <div>
            <p>Questions</p>
            {cardData.questions_to_ask.map((data) => (
              <p key={data}>{data}</p>
            ))}
          </div>
        </div>
      );
  };

  const generateKeywordsAndMeanings = function generateKeywordsAndMeanings() {
    return (
      <>
        <div>
          <p>Keywords</p>
          {keywordMeaningsData?.keywords[
            partitionData[suit].index + Number(card)
          ]?.map((data, index) => (
            <div key={index}>
              <button
                className="remove-button"
                type="button"
                onClick={(e) => removeKeywordsAndMeaning(e, "keywords", index)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={getComputedStyle(
                    document.documentElement
                  ).getPropertyValue("--color-b")}
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <p>{data}</p>
            </div>
          ))}
          <div>
            <button
              type="button"
              onClick={(e) => {
                addKeywordsAndMeaning(e, "keywords", newKeywordInput);
                setNewKeywordInput("");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={getComputedStyle(
                  document.documentElement
                ).getPropertyValue("--color-b")}
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <input
              type="text"
              value={newKeywordInput || ""}
              placeholder={"Add"}
              onChange={(e) => setNewKeywordInput(e.target.value)}
            ></input>
          </div>
        </div>
        <div>
          <p>Meanings</p>
          {keywordMeaningsData?.meanings[
            partitionData[suit].index + Number(card)
          ]?.map((data, index) => (
            <div key={index}>
              <button
                className="remove-button"
                type="button"
                onClick={(e) => removeKeywordsAndMeaning(e, "meanings", index)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={getComputedStyle(
                    document.documentElement
                  ).getPropertyValue("--color-b")}
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <p>{data}</p>
            </div>
          ))}
          <div>
            <button
              type="button"
              onClick={(e) => {
                addKeywordsAndMeaning(e, "meanings", newMeaningInput);
                setNewMeaningInput("");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={getComputedStyle(
                  document.documentElement
                ).getPropertyValue("--color-b")}
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <input
              type="text"
              value={newMeaningInput || ""}
              placeholder={"Add"}
              onChange={(e) => setNewMeaningInput(e.target.value)}
            ></input>
          </div>
        </div>
        <div>
          <p>Meanings Reversed</p>
          {keywordMeaningsData?.meaningsReversed[
            partitionData[suit].index + Number(card)
          ]?.map((data, index) => (
            <div key={index}>
              <button
                className="remove-button"
                type="button"
                onClick={(e) =>
                  removeKeywordsAndMeaning(e, "meaningsReversed", index)
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  stroke={1.2}
                  fill={getComputedStyle(
                    document.documentElement
                  ).getPropertyValue("--color-b")}
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <p>{data}</p>
            </div>
          ))}
          <div>
            <button
              type="button"
              onClick={(e) => {
                addKeywordsAndMeaning(
                  e,
                  "meaningsReversed",
                  newMeaningReversedInput
                );
                setNewMeaningReversedInput("");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={getComputedStyle(
                  document.documentElement
                ).getPropertyValue("--color-b")}
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <input
              type="text"
              value={newMeaningReversedInput || ""}
              placeholder={"Add"}
              onChange={(e) => setNewMeaningReversedInput(e.target.value)}
            ></input>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="card">
      <h1>{cardData?.name}</h1>
      <img
        src={`${process.env.REACT_APP_SERVER_URL}/rws-deck-data/cards/${cardData?.img}`}
        alt={cardData?.img}
      />
      <div>{generateCardDetails()}</div>
    </div>
  );
};

export default Card;
