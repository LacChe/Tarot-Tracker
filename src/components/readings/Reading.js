import React, { useEffect, useRef, useState } from "react";
import { useStateContext } from "../../utils/stateContext";
import { Spread } from "../";
import Popup from "reactjs-popup";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

const Reading = () => {
  const navigate = useNavigate();
  const { readingId } = useParams();
  const { userData, readings, setReadings, reminders, setReminders } =
    useStateContext();

  const [saved, setSaved] = useState(readingId); // is current reading info saved
  const [questionInput, setQuestionInput] = useState();
  const [spreadInput, setSpreadInput] = useState();
  const [cardsInput, setCardsInput] = useState();
  const [reversedInput, setReversedInput] = useState();
  // format date for date component yyyy-mm-dd
  const todayString = `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${new Date().getDate().toString().padStart(2, "0")}`;
  const [dateInput, setDateInput] = useState(todayString);
  const [notesInput, setNotesInput] = useState();
  const [reminderInput, setReminderInput] = useState({
    date: "",
    note: "",
    set: false,
  });

  // used to close popup
  const ref = useRef();
  const closeModal = () => ref.current.close();

  // get data from db on reading change
  useEffect(() => {
    // clear inputs
    setQuestionInput();
    setSpreadInput("celtic-cross");
    setCardsInput([-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
    setReversedInput([
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
    setDateInput(todayString);
    setNotesInput();
    setReminderInput({
      date: "",
      note: "",
      set: false,
    });

    if (readingId) {
      // get reminder data stateContext list
      const getReminder = async function getReminder() {
        const reminder = reminders?.filter((r) => r.readingId === readingId)[0];
        if (reminder) {
          setReminderInput({
            date: reminder.date,
            note: reminder.note,
            set: true,
          });
        }
      };

      // get reading data stateContext list
      const getReading = async function getReading() {
        const reading = readings?.filter((r) => r.readingId === readingId)[0];
        if (reading) {
          setQuestionInput(reading.question);
          setSpreadInput(reading.spread);
          setCardsInput(reading.cards);
          setReversedInput(reading.reversals);
          setDateInput(reading.date);
          setNotesInput(reading.notes);
        }
      };

      getReading();
      getReminder();
    }
  }, [readingId, readings, reminders, todayString]);

  // save reading to db
  const handleSave = async function handleSave(e) {
    e.preventDefault();
    // validate input
    if (!dateInput) {
      toast.error("Please input a Date");
      return;
    }
    if (!questionInput) {
      toast.error("Please input a Question");
      return;
    }

    const newId = uuidv4();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      credentials: "include",
      body: JSON.stringify({
        readingId: readingId || newId,
        userId: userData.id,
        question: questionInput,
        spread: spreadInput,
        cards: cardsInput,
        reversals: reversedInput,
        date: dateInput,
        notes: notesInput,
      }),
    };
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/reading`,
      requestOptions
    );
    const data = await response.json();
    if (data.message === "success") {
      toast.success("Saved!");
      setSaved(true);
      setReadings([
        ...readings.filter((r) => r.readingId !== readingId),
        {
          readingId: readingId || newId,
          userId: userData.id,
          question: questionInput,
          spread: spreadInput,
          cards: cardsInput,
          reversals: reversedInput,
          date: dateInput,
          notes: notesInput,
        },
      ]);
      if (!readingId) navigate(`/records/readings/reading/${newId}`);
    } else {
      toast.error("Uh oh, please try again");
    }
  };

  // delete reminder from db
  const handleClearReminder = async function handleClearReminder(e) {
    e.preventDefault();
    if (!reminderInput.set) {
      return;
    }
    closeModal();
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      credentials: "include",
      body: JSON.stringify({
        readingId: readingId,
      }),
    };
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/reminder`,
      requestOptions
    );
    const data = await response.json();
    if (data.message === "success") {
      toast.success("Reminder Cleared!");
      setReminderInput({
        date: "",
        note: "",
        set: false,
      });
      setReminders(reminders.filter((r) => r.readingId !== readingId));
    } else {
      toast.error("Uh oh, please try again");
    }
  };

  // save reminder to db
  const handleSetReminder = async function handleSetReminder(e) {
    e.preventDefault();
    if (!readingId) {
      toast.error("Please save the Reading first");
      return;
    }
    if (!reminderInput.date) {
      toast.error("Please input a Date");
      return;
    }
    closeModal();

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      credentials: "include",
      body: JSON.stringify({
        readingId: readingId,
        userId: userData.id,
        date: reminderInput.date,
        note: reminderInput.note,
      }),
    };
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/reminder/?readingId=${readingId}`,
      requestOptions
    );
    const data = await response.json();
    if (data.message === "success") {
      toast.success("Reminder Set!");
      setReminderInput({ ...reminderInput, set: true });
      setReminders([
        ...reminders?.filter((r) => r.readingId !== readingId),
        { ...reminderInput, set: true, readingId },
      ]);
    } else {
      toast.error("Uh oh, please try again");
    }
  };

  // generate jsx selection list of spreads from file
  const genSpreadList = function genSpreadList() {
    return Object.keys(JSON.parse(localStorage.getItem("spreadData"))).map(
      (key) => (
        <option value={key} key={key}>
          {JSON.parse(localStorage.getItem("spreadData"))[key].name}
        </option>
      )
    );
  };

  // generate jsx for popup modal to set reminder
  const generateReminderForm = function generateReminderForm() {
    return (
      <form className="reminder-form">
        <input
          id="date"
          type="date"
          value={reminderInput.date}
          onChange={(e) =>
            setReminderInput({ ...reminderInput, date: e.target.value })
          }
        />
        <input
          id="reminderMessage"
          type="text"
          value={reminderInput.note || ""}
          placeholder="note"
          onChange={(e) =>
            setReminderInput({ ...reminderInput, note: e.target.value })
          }
        />
        <div>
          <button type="button" onClick={handleClearReminder}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={getComputedStyle(document.documentElement).getPropertyValue(
                "--color-a"
              )}
            >
              <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM20.57 16.476c-.223.082-.448.161-.674.238L7.319 4.137A6.75 6.75 0 0118.75 9v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206z" />
              <path
                fillRule="evenodd"
                d="M5.25 9c0-.184.007-.366.022-.546l10.384 10.384a3.751 3.751 0 01-7.396-1.119 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button type="button" onClick={handleSetReminder}>
            Set Reminder
          </button>
        </div>
      </form>
    );
  };

  // reinit data on spread change
  const handleSpreadChange = function handleSpreadChange(e) {
    setSpreadInput(e.target.value);
    // set reversals to false
    setReversedInput(
      new Array(
        JSON.parse(localStorage.getItem("spreadData"))[
          e.target.value
        ].positions.xPos.length
      ).fill(false)
    );
    setCardsInput(
      new Array(
        JSON.parse(localStorage.getItem("spreadData"))[
          e.target.value
        ].positions.xPos.length
      ).fill(-1)
    );
  };

  // card setting function to pass to child spread component
  const setCard = function setCard(index, cardIndex) {
    setCardsInput((prev) => prev.map((n, i) => (index === i ? cardIndex : n)));
  };

  // reversal toggle function to pass to child spread component
  const setReversal = function setReversal(index) {
    setReversedInput((prev) => prev.map((r, i) => (index === i ? !r : r)));
  };

  return (
    <div className="reading">
      <form className="reading-form">
        <input
          id="date"
          type="date"
          value={dateInput}
          onChange={(e) => {
            setSaved(false);
            setDateInput(e.target.value);
          }}
        />
        <select
          name="spread"
          id="spread"
          value={spreadInput}
          onChange={(e) => {
            setSaved(false);
            handleSpreadChange(e);
          }}
        >
          {genSpreadList()}
        </select>
        {spreadInput && (
          <Spread
            spreadFromReading={spreadInput}
            setCard={setCard}
            cardsInput={cardsInput}
            setReversal={setReversal}
            reversedInput={reversedInput}
          />
        )}
        <textarea
          id="notes"
          placeholder="notes"
          value={notesInput || ""}
          onChange={(e) => {
            setSaved(false);
            setNotesInput(e.target.value);
          }}
        />
        <div className="reading-title">
          <div>
            <button type="button" className="save-button" onClick={handleSave}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={
                  saved
                    ? getComputedStyle(
                        document.documentElement
                      ).getPropertyValue("--color-highlight")
                    : getComputedStyle(
                        document.documentElement
                      ).getPropertyValue("--color-b")
                }
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {/* reminder popup */}
            <Popup
              ref={ref}
              modal
              trigger={
                <button
                  type="button"
                  onClick={(e) => e.preventDefault()}
                  className="reading-form-reminder"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={
                      !reminderInput.set
                        ? getComputedStyle(
                            document.documentElement
                          ).getPropertyValue("--color-b")
                        : getComputedStyle(
                            document.documentElement
                          ).getPropertyValue("--color-highlight")
                    }
                  >
                    <path d="M5.85 3.5a.75.75 0 00-1.117-1 9.719 9.719 0 00-2.348 4.876.75.75 0 001.479.248A8.219 8.219 0 015.85 3.5zM19.267 2.5a.75.75 0 10-1.118 1 8.22 8.22 0 011.987 4.124.75.75 0 001.48-.248A9.72 9.72 0 0019.266 2.5z" />
                    <path
                      fillRule="evenodd"
                      d="M12 2.25A6.75 6.75 0 005.25 9v.75a8.217 8.217 0 01-2.119 5.52.75.75 0 00.298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 107.48 0 24.583 24.583 0 004.83-1.244.75.75 0 00.298-1.205 8.217 8.217 0 01-2.118-5.52V9A6.75 6.75 0 0012 2.25zM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 004.496 0l.002.1a2.25 2.25 0 11-4.5 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              }
            >
              {generateReminderForm()}
            </Popup>
            <input
              id="question"
              type="text"
              value={questionInput || ""}
              placeholder="Question"
              onChange={(e) => {
                setSaved(false);
                setQuestionInput(e.target.value);
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Reading;
