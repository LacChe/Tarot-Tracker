import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { spreads } from "./spreadData.js";
import CryptoJS from "crypto-js";

const Context = createContext();

export const StateContext = ({ children }) => {
  const firedRef = useRef(0);

  const backImageLength = 11;

  // auth
  const [userData, setUserData] = useState();
  const setUserDataState = function setUserDataState(data) {
    setUserData(data);
    localStorage.setItem(
      "userData",
      CryptoJS.AES.encrypt(
        JSON.stringify(data),
        process.env.REACT_APP_ENCRYPT_SECRET
      )
    );
  };

  // cards
  const [keywordMeaningsData, setKeywordMeaningsData] = useState();
  const setKeywordMeaningsDataState = function setKeywordMeaningsDataState(
    data
  ) {
    setKeywordMeaningsData(data);
    localStorage.setItem(
      "keyWordsAndMeaningsData",
      CryptoJS.AES.encrypt(
        JSON.stringify(data),
        process.env.REACT_APP_ENCRYPT_SECRET
      )
    );
  };

  // readings
  const [readings, setReadings] = useState();
  const setReadingsState = function setReadingsState(data) {
    setReadings(data);
    localStorage.setItem(
      "readingsData",
      CryptoJS.AES.encrypt(
        JSON.stringify(data),
        process.env.REACT_APP_ENCRYPT_SECRET
      )
    );
  };

  // readings
  const [reminders, setReminders] = useState();
  const setRemindersState = function setRemindersState(data) {
    setReminders(data);
    localStorage.setItem(
      "remindersData",
      CryptoJS.AES.encrypt(
        JSON.stringify(data),
        process.env.REACT_APP_ENCRYPT_SECRET
      )
    );
  };

  // get users keyword and meaning data
  const getKeywordsAndMeanings = async function getKeywordsAndMeanings() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      credentials: "include",
    };
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/keywords`,
      requestOptions
    );
    const data = await response.json();
    if (data.message && data.message === "no session") return;
    setKeywordMeaningsData(data);
    localStorage.setItem(
      "keyWordsAndMeaningsData",
      CryptoJS.AES.encrypt(
        JSON.stringify(data),
        process.env.REACT_APP_ENCRYPT_SECRET
      )
    );
  };

  // get users readings data
  const getReadings = async function getReadings() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      credentials: "include",
    };
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/reading`,
      requestOptions
    );
    const data = await response.json();
    if (data.message && data.message === "no session") return;
    setReadings(data);
    localStorage.setItem(
      "readingsData",
      CryptoJS.AES.encrypt(
        JSON.stringify(data),
        process.env.REACT_APP_ENCRYPT_SECRET
      )
    );
  };

  // get users reminders data
  const getReminders = async function getReminders() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      credentials: "include",
    };
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/reminder`,
      requestOptions
    );
    const data = await response.json();
    if (data.message && data.message === "no session") return;
    setReminders(data);
    localStorage.setItem(
      "remindersData",
      CryptoJS.AES.encrypt(
        JSON.stringify(data),
        process.env.REACT_APP_ENCRYPT_SECRET
      )
    );
  };

  // init data from local storage on userData change, else get from db
  useEffect(() => {
    // init default spreadData to local storage
    if (!localStorage.getItem("spreadData")) {
      localStorage.setItem("spreadData", JSON.stringify(spreads));
    }

    // if user data exists
    if (firedRef.current < 2 && userData) {
      firedRef.current++;
      let cipherText;
      cipherText = localStorage.getItem("keyWordsAndMeaningsData");
      const keywordsAndMeaningsFromLocalStorage = cipherText
        ? JSON.parse(
            CryptoJS.AES.decrypt(
              cipherText,
              process.env.REACT_APP_ENCRYPT_SECRET
            ).toString(CryptoJS.enc.Utf8)
          )
        : null;
      if (!keywordsAndMeaningsFromLocalStorage) getKeywordsAndMeanings();
      else setKeywordMeaningsData(keywordsAndMeaningsFromLocalStorage);

      cipherText = localStorage.getItem("readingsData");
      const readingsFromLocalStorage = cipherText
        ? JSON.parse(
            CryptoJS.AES.decrypt(
              cipherText,
              process.env.REACT_APP_ENCRYPT_SECRET
            ).toString(CryptoJS.enc.Utf8)
          )
        : null;
      if (!readingsFromLocalStorage) getReadings();
      else setReadings(readingsFromLocalStorage);

      cipherText = localStorage.getItem("remindersData");
      const remindersFromLocalStorage = cipherText
        ? JSON.parse(
            CryptoJS.AES.decrypt(
              cipherText,
              process.env.REACT_APP_ENCRYPT_SECRET
            ).toString(CryptoJS.enc.Utf8)
          )
        : null;
      if (!readingsFromLocalStorage) getReminders();
      else setReminders(remindersFromLocalStorage);
    }
  }, [userData]);

  const sync = async function sync() {
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
    } else {
      setUserData(data);
    }
    getKeywordsAndMeanings();
    getReadings();
    getReminders();
  };

  return (
    <Context.Provider
      value={{
        backImageLength,
        sync,
        userData,
        setUserData: setUserDataState,
        keywordMeaningsData,
        setKeywordMeaningsData: setKeywordMeaningsDataState,
        readings,
        setReadings: setReadingsState,
        reminders,
        setReminders: setRemindersState,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
