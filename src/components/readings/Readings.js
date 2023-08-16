import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../utils/stateContext";
import toast from "react-hot-toast";

const Readings = () => {
  const navigate = useNavigate();
  const { readings, setReadings, reminders, setReminders } = useStateContext();

  const [searchTerm, setSearchTerm] = useState("");

  // delete reading
  const handleDelete = async function handleDelete(readingId) {
    // delete reading
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      credentials: "include",
      body: JSON.stringify({
        id: readingId,
      }),
    };
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/reading`,
      requestOptions
    );
    const data = await response.json();
    if (data.message === "success") {
      setReadings(readings.filter((r) => r.readingId !== readingId));
      toast.success("Removed!");

      // delete related reminder if exists
      const requestOptionsReminder = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        credentials: "include",
        body: JSON.stringify({
          readingId: readingId,
        }),
      };
      await fetch(
        `${process.env.REACT_APP_SERVER_URL}/reminder`,
        requestOptionsReminder
      );
      setReminders(reminders.filter((r) => r.readingId !== readingId));
    } else {
      toast.error("Uh oh, please try again ");
    }
  };

  return (
    <div className="readings">
      <h1>Readings</h1>
      <input
        className="search-input"
        type="text"
        value={searchTerm}
        placeholder="Search"
        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
      />
      {readings?.length === 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            navigate("/records/readings/reading");
          }}
          className="readings-list-item-empty"
        >
          Nothing Here Yet
        </button>
      )}
      {readings
        ?.sort((r1, r2) => r1.date < r2.date)
        .filter((r) => {
          if (searchTerm === "") return true;
          else if (
            r.question.toLowerCase().includes(searchTerm) ||
            r.spread.replace("-", " ").includes(searchTerm) ||
            (r.notes && r.notes.toLowerCase().includes(searchTerm))
          )
            return true;
          else return false;
        })
        .map((reading) => (
          <div className="readings-list-item" key={reading.readingId}>
            <button
              onClick={() => {
                if (
                  !JSON.parse(localStorage.getItem("spreadData"))[
                    reading.spread
                  ]
                ) {
                  toast.error(`The ${reading.spread} layout doesn't exist`);
                } else {
                  navigate(`/records/readings/reading/${reading.readingId}`);
                }
              }}
            >
              <div>{reading.date}</div>
              <div>{reading.question}</div>
            </button>
            <div>
              <button
                className="readings-list-reminder"
                onClick={() => {
                  if (
                    !JSON.parse(localStorage.getItem("spreadData"))[
                      reading.spread
                    ]
                  ) {
                    toast.error(`The ${reading.spread} layout doesn't exist`);
                  } else {
                    navigate(`/records/readings/reading/${reading.readingId}`);
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={
                    !reminders?.filter((r) => r.readingId === reading.readingId)
                      .length > 0
                      ? getComputedStyle(
                          document.documentElement
                        ).getPropertyValue("--color-c")
                      : getComputedStyle(
                          document.documentElement
                        ).getPropertyValue("--color-highlight")
                  }
                >
                  <path d="M4.214 3.227a.75.75 0 00-1.156-.956 8.97 8.97 0 00-1.856 3.826.75.75 0 001.466.316 7.47 7.47 0 011.546-3.186zM16.942 2.271a.75.75 0 00-1.157.956 7.47 7.47 0 011.547 3.186.75.75 0 001.466-.316 8.971 8.971 0 00-1.856-3.826z" />
                  <path
                    fillRule="evenodd"
                    d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.94 32.94 0 003.256.508 3.5 3.5 0 006.972 0 32.933 32.933 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zm0 14.5a2 2 0 01-1.95-1.557 33.54 33.54 0 003.9 0A2 2 0 0110 16.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                className="remove-button"
                onClick={() => handleDelete(reading.readingId)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={getComputedStyle(
                    document.documentElement
                  ).getPropertyValue("--color-c")}
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Readings;
