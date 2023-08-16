import React, { useEffect } from "react";
import { useStateContext } from "../../utils/stateContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Nav = ({ children }) => {
  const { userData, setUserData, reminders, readings } = useStateContext();
  const navigate = useNavigate();

  // generate function to resolve useeffect navigate warning
  const navigateToReading = (function genFuncfunction(id) {
    return function navigateToReading(id) {
      navigate(`/records/readings/reading/${id}`);
    };
  })();

  // toast reminders
  useEffect(() => {
    const generateReminderToasts = function generateReminderToasts() {
      //clear all reminder toasts
      toast.dismiss();

      // toast all reminders for today and before
      // format date for date component yyyy-mm-dd
      const todayString = `${new Date().getFullYear()}-${(
        new Date().getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${new Date().getDate().toString().padStart(2, "0")}`;

      reminders?.forEach((reminder) => {
        if (reminder.date <= todayString) {
          let note = reminder.note;
          if (!note && readings && readings.length > 0) {
            note = readings?.filter(
              (r) => r.readingId === reminder.readingId
            )[0].question;
          }
          toast(
            <button
              type="button"
              className="reminder-toast"
              onClick={(e) => {
                e.preventDefault();
                navigateToReading(reminder.readingId);
              }}
            >
              🔔 {note}
            </button>,
            {
              toastId: reminder.readingId,
            }
          );
        }
      });
    };
    generateReminderToasts();
  }, [reminders, readings, navigateToReading]);

  const toggleNav = async function toggleNav() {
    setUserData({ ...userData, navExpanded: !userData.navExpanded });
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      credentials: "include",
      body: JSON.stringify({
        field: "navExpanded",
        value: !userData.navExpanded,
      }),
    };

    await fetch(`${process.env.REACT_APP_SERVER_URL}/auth`, requestOptions);
  };

  return (
    <div
      className={`nav-wrapper ${
        userData.navExpanded ? "expanded-nav" : "collapsed-nav"
      }`}
    >
      <div onClick={toggleNav}>
        <div className="nav">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/");
            }}
          >
            <div className="nav-list-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                strokeWidth={1.5}
                stroke={getComputedStyle(
                  document.documentElement
                ).getPropertyValue("--color-d")}
                fill="#00000000"
              >
                <path
                  fillRule="evenodd"
                  d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                  clipRule="evenodd"
                />
              </svg>
              <p>Home</p>
            </div>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/records/readings/reading");
            }}
          >
            <div className="nav-list-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                strokeWidth={1.5}
                stroke={getComputedStyle(
                  document.documentElement
                ).getPropertyValue("--color-d")}
                fill="#00000000"
              >
                <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.684a1 1 0 01.633.632l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.898l-2.051-.683a1 1 0 01-.633-.633L6.95 5.684zM13.949 13.684a1 1 0 00-1.898 0l-.184.551a1 1 0 01-.632.633l-.551.183a1 1 0 000 1.898l.551.183a1 1 0 01.633.633l.183.551a1 1 0 001.898 0l.184-.551a1 1 0 01.632-.633l.551-.183a1 1 0 000-1.898l-.551-.184a1 1 0 01-.633-.632l-.183-.551z" />
              </svg>
              <p>New</p>
            </div>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/records/readings");
            }}
          >
            <div className="nav-list-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                strokeWidth={1.5}
                stroke={getComputedStyle(
                  document.documentElement
                ).getPropertyValue("--color-d")}
                fill="#00000000"
              >
                <path
                  fillRule="evenodd"
                  d="M2 3.5A1.5 1.5 0 013.5 2h9A1.5 1.5 0 0114 3.5v11.75A2.75 2.75 0 0016.75 18h-12A2.75 2.75 0 012 15.25V3.5zm3.75 7a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zm0 3a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zM5 5.75A.75.75 0 015.75 5h4.5a.75.75 0 01.75.75v2.5a.75.75 0 01-.75.75h-4.5A.75.75 0 015 8.25v-2.5z"
                  clipRule="evenodd"
                />
                <path d="M16.5 6.5h-1v8.75a1.25 1.25 0 102.5 0V8a1.5 1.5 0 00-1.5-1.5z" />
              </svg>
              <p>Readings</p>
            </div>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/records/spreads");
            }}
          >
            <div className="nav-list-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                strokeWidth={1.5}
                stroke={getComputedStyle(
                  document.documentElement
                ).getPropertyValue("--color-d")}
                fill="#00000000"
              >
                <path
                  fillRule="evenodd"
                  d="M8.157 2.175a1.5 1.5 0 00-1.147 0l-4.084 1.69A1.5 1.5 0 002 5.251v10.877a1.5 1.5 0 002.074 1.386l3.51-1.453 4.26 1.763a1.5 1.5 0 001.146 0l4.083-1.69A1.5 1.5 0 0018 14.748V3.873a1.5 1.5 0 00-2.073-1.386l-3.51 1.452-4.26-1.763zM7.58 5a.75.75 0 01.75.75v6.5a.75.75 0 01-1.5 0v-6.5A.75.75 0 017.58 5zm5.59 2.75a.75.75 0 00-1.5 0v6.5a.75.75 0 001.5 0v-6.5z"
                  clipRule="evenodd"
                />
              </svg>
              <p>Spreads</p>
            </div>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/records/deck");
            }}
          >
            <div className="nav-list-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                strokeWidth={1.5}
                stroke={getComputedStyle(
                  document.documentElement
                ).getPropertyValue("--color-d")}
                fill="#00000000"
              >
                <path d="M3.196 12.87l-.825.483a.75.75 0 000 1.294l7.25 4.25a.75.75 0 00.758 0l7.25-4.25a.75.75 0 000-1.294l-.825-.484-5.666 3.322a2.25 2.25 0 01-2.276 0L3.196 12.87z" />
                <path d="M3.196 8.87l-.825.483a.75.75 0 000 1.294l7.25 4.25a.75.75 0 00.758 0l7.25-4.25a.75.75 0 000-1.294l-.825-.484-5.666 3.322a2.25 2.25 0 01-2.276 0L3.196 8.87z" />
                <path d="M10.38 1.103a.75.75 0 00-.76 0l-7.25 4.25a.75.75 0 000 1.294l7.25 4.25a.75.75 0 00.76 0l7.25-4.25a.75.75 0 000-1.294l-7.25-4.25z" />
              </svg>
              <p>Deck</p>
            </div>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/records/profile");
            }}
          >
            <div className="nav-list-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                strokeWidth={1.5}
                stroke={getComputedStyle(
                  document.documentElement
                ).getPropertyValue("--color-d")}
                fill="#00000000"
              >
                <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
              </svg>
              <p>Profile</p>
            </div>
          </button>
        </div>
      </div>
      {/* display page content */}
      <div className="main-content">{children}</div>
    </div>
  );
};

export default Nav;
