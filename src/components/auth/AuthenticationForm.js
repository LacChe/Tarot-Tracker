import React, { useEffect, useState } from "react";
import { useStateContext } from "../../utils/stateContext";
import { deckData } from "../../utils/rwsData.js";
import toast from "react-hot-toast";

const AuthenticationForm = () => {
  const { setUserData } = useStateContext();

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordConfirmationInput, setPasswordConfirmationInput] =
    useState("");
  const [nameInput, setNameInput] = useState("");

  const [hasAccount, setHasAccount] = useState(true);

  const [randCard1, setRandCard1] = useState();
  const [randCard2, setRandCard2] = useState();
  const [randCard3, setRandCard3] = useState();

  // get three distinct random cards
  useEffect(() => {
    let randNum1, randNum2, randNum3;
    randNum1 = Math.trunc(Math.random() * 78);
    do {
      randNum2 = Math.trunc(Math.random() * 78);
    } while (randNum2 === randNum1);
    do {
      randNum3 = Math.trunc(Math.random() * 78);
    } while (randNum3 === randNum2 || randNum3 === randNum1);

    setRandCard1(randNum1);
    setRandCard2(randNum2);
    setRandCard3(randNum3);
  }, []);

  // register
  const handleRegister = async function handleRegister(e) {
    e.preventDefault();
    // validate input
    let regularExpression =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!regularExpression.test(passwordInput)) {
      toast.error(
        "Password must be at least 8 characters long, contain at least one uppercase letter, lowercase letter, and number."
      );
      return;
    }
    regularExpression =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (!regularExpression.test(emailInput)) {
      toast.error("Please input a valid Email.");
      return;
    }
    if (!nameInput) {
      toast.error("Please enter a Name");
      return;
    }
    if (!emailInput) {
      toast.error("Please enter an Email");
      return;
    }
    if (!passwordInput) {
      toast.error("Please enter a Password");
      return;
    }
    if (!passwordConfirmationInput) {
      toast.error("Please Confirm your Password");
      return;
    }
    if (passwordConfirmationInput !== passwordInput) {
      toast.error("Passwords do not Match");
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      credentials: "include",
      body: JSON.stringify({
        email: emailInput,
        name: nameInput,
        password: passwordInput,
      }),
    };
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/auth/register`,
      requestOptions
    );
    const data = await response.json();
    if (data.message === "success") {
      toast.success("Registered!");
      setHasAccount(true);
      setEmailInput("");
      setNameInput("");
      setPasswordInput("");
      setPasswordConfirmationInput("");
    } else {
      toast.error("Uh oh, please try again");
    }
  };

  // login function
  const handleLogin = async function handleLogin(e) {
    e.preventDefault();
    // validate input
    const regularExpression =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (!regularExpression.test(emailInput)) {
      toast.error("Please input a valid Email.");
      return;
    }
    if (!emailInput) {
      toast.error("Please enter an Email");
      return;
    }
    if (!passwordInput) {
      toast.error("Please enter a Password");
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      credentials: "include",
      body: JSON.stringify({ email: emailInput, password: passwordInput }),
    };
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/auth/login`,
      requestOptions
    );
    const data = await response.json();
    if (data.error) {
    } else if (data.message === "restricted") {
      toast.error("Uh oh, please try again");
    } else if (data.message === "bad input") {
    } else {
      setUserData(data);
      setEmailInput("");
      setPasswordInput("");
      setPasswordConfirmationInput("");
      setNameInput("");
    }
  };

  // try session login on first load
  useEffect(() => {
    const initialLogin = async function initialLogin() {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        credentials: "include",
      };
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/auth/login`,
        requestOptions
      );
      const data = await response.json();
      if (data.error) {
      } else if (data.message === "restricted") {
        toast.error("Uh oh, please try again");
      } else if (data.message === "bad input") {
      } else {
        setUserData(data);
        setEmailInput("");
        setPasswordInput("");
        setPasswordConfirmationInput("");
        setNameInput("");
      }
    };

    initialLogin();
  }, [setUserData]);

  // login form
  const loginComp = function loginComp() {
    return (
      <form>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <div>
          <button type="button" onClick={() => setHasAccount((prev) => !prev)}>
            {hasAccount ? "No Account?" : "Already Signed Up?"}
          </button>
          <button type="submit" onClick={handleLogin}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke={getComputedStyle(
                document.documentElement
              ).getPropertyValue("--color-d")}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </form>
    );
  };

  // registration form
  const registerComp = function registerComp() {
    return (
      <form>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        ></input>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <label htmlFor="password-conf">Password Confirmation</label>
        <input
          id="password-conf"
          type="password"
          value={passwordConfirmationInput}
          onChange={(e) => setPasswordConfirmationInput(e.target.value)}
        />
        <div>
          <button type="button" onClick={() => setHasAccount((prev) => !prev)}>
            {hasAccount ? "No Account?" : "Already Signed Up?"}
          </button>
          <button type="button" onClick={handleRegister}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke={getComputedStyle(
                document.documentElement
              ).getPropertyValue("--color-d")}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="auth-form">
      <div className="auth-splash">
        <div
          className="auth-card-1"
          style={{
            backgroundImage: `url(${
              process.env.REACT_APP_SERVER_URL
            }/rws-deck-data/cards/${
              deckData.cards[randCard1 ? randCard1 : 0].img
            })`,
          }}
        ></div>
        <div
          className="auth-card-2"
          style={{
            backgroundImage: `url(${
              process.env.REACT_APP_SERVER_URL
            }/rws-deck-data/cards/${
              deckData.cards[randCard2 ? randCard2 : 0].img
            })`,
          }}
        ></div>
        <div
          className="auth-card-3"
          style={{
            backgroundImage: `url(${
              process.env.REACT_APP_SERVER_URL
            }/rws-deck-data/cards/${
              deckData.cards[randCard3 ? randCard3 : 0].img
            })`,
          }}
        ></div>
      </div>
      {hasAccount ? loginComp() : registerComp()}
    </div>
  );
};

export default AuthenticationForm;
