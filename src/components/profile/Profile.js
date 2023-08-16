import React, { useEffect, useRef, useState } from "react";
import { useStateContext } from "../../utils/stateContext";
import { useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";
import { toast } from "react-hot-toast";
import { partitionData, deckData } from "../../utils/rwsData.js";

const Profile = () => {
  const { userData, setUserData, sync, backImageLength } = useStateContext();
  const navigate = useNavigate();

  const ref = useRef();
  const closeModal = () => ref.current.close();

  const [userName, setUserName] = useState(userData.name);
  const [modalDisplayedSuit, setModalDisplayedSuit] = useState("");

  useEffect(() => {
    setUserName(userData.name);
  }, [userData]);

  // logout user session
  const handleLogout = async function handleLogout() {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      credentials: "include",
      body: JSON.stringify({ email: userData.email }),
    };
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/auth/logout`,
      requestOptions
    );
    const data = await response.json();
    if (data.error) {
    } else {
      /* handle logout */
      toast.dismiss();
      setUserData(null);
      localStorage.removeItem("userData");
      localStorage.removeItem("keyWordsAndMeaningsData");
      localStorage.removeItem("readingsData");
      localStorage.removeItem("remindersData");
      navigate("/");
    }
  };

  const backImageSelectionDisplay = function backImageSelectionDisplay() {
    let html = [];
    for (let i = 1; i <= backImageLength; i++) {
      html.push(
        <button
          key={i}
          className="profile-back-image-item"
          style={{
            backgroundImage: `url(${
              process.env.REACT_APP_SERVER_URL
            }/cardBackgrounds/${i.toString().padStart(2, "0")}.jpg)`,
          }}
          onClick={(e) => updateBackImage(e, i.toString().padStart(2, "0"))}
        />
      );
    }
    return html;
  };

  const updateBackImage = async function updateBackImage(e, backImageName) {
    e.preventDefault();
    closeModal();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      credentials: "include",
      body: JSON.stringify({
        field: "backImage",
        value: backImageName,
      }),
    };

    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/auth`,
      requestOptions
    );
    const data = await response.json();

    if (data.message === "success") {
      toast.success("Back Image Changed!");
      setUserData({ ...userData, backImage: backImageName });
    } else {
      toast.error("Uh oh, please try again");
    }
  };

  const profileImageSelectionDisplay = function profileImageSelectionDisplay() {
    let html = [];
    for (let i = 1; i <= backImageLength; i++) {
      html.push(
        <button
          key={i}
          className="profile-profile-image-item"
          style={{
            backgroundImage: `url(${
              process.env.REACT_APP_SERVER_URL
            }/profileImages/${i.toString().padStart(2, "0")}.jpg)`,
          }}
          onClick={(e) => updateProfileImage(e, i.toString().padStart(2, "0"))}
        />
      );
    }
    return html;
  };

  const updateProfileImage = async function updateProfileImage(
    e,
    profileImageName
  ) {
    e.preventDefault();
    closeModal();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      credentials: "include",
      body: JSON.stringify({
        field: "profileImage",
        value: profileImageName,
      }),
    };

    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/auth`,
      requestOptions
    );
    const data = await response.json();

    if (data.message === "success") {
      toast.success("Profile Image Changed!");
      setUserData({ ...userData, profileImage: profileImageName });
    } else {
      toast.error("Uh oh, please try again");
    }
  };

  const homeImageSelectionDisplay = function homeImageSelectionDisplay() {
    return (
      <div className="spread-card-selection-list">
        <button
          onClick={(e) => updateHomeImage(e, -1)}
          className="profile-card-selection-random"
        >
          Random
        </button>
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
                    onClick={(e) => updateHomeImage(e, card.index)}
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

  const updateHomeImage = async function updateHomeImage(e, homeImageName) {
    e.preventDefault();
    closeModal();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      credentials: "include",
      body: JSON.stringify({
        field: "homeImage",
        value: homeImageName,
      }),
    };

    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/auth`,
      requestOptions
    );
    const data = await response.json();

    if (data.message === "success") {
      toast.success("Home Image Changed!");
      setUserData({ ...userData, homeImage: homeImageName });
    } else {
      toast.error("Uh oh, please try again");
    }
  };

  const updateUserName = async function updateUserName(e) {
    e.preventDefault();
    closeModal();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      credentials: "include",
      body: JSON.stringify({
        field: "name",
        value: userName,
      }),
    };

    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/auth`,
      requestOptions
    );
    const data = await response.json();

    if (data.message === "success") {
      toast.success("Name Changed!");
      setUserData({ ...userData, name: userName });
    } else {
      toast.error("Uh oh, please try again");
    }
  };

  return (
    <div className="profile">
      <Popup
        ref={ref}
        modal
        trigger={
          <img
            className="profile-profile-image-button"
            src={`${process.env.REACT_APP_SERVER_URL}/profileImages/${userData?.profileImage}.jpg`}
            alt={`profile`}
          />
        }
      >
        <div className="profile-profile-image-popup">
          {profileImageSelectionDisplay()}
        </div>
      </Popup>
      <h1>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button
          id="profile-name-change-confirm"
          type="button"
          onClick={updateUserName}
        >
          &#10003;
        </button>
      </h1>
      <div>
        <p>Home Image</p>
        <Popup
          ref={ref}
          modal
          trigger={
            userData?.homeImage === -1 ? (
              <button className="profile-card-selection-button">Random</button>
            ) : (
              <img
                className="profile-back-image-button"
                src={`${process.env.REACT_APP_SERVER_URL}/rws-deck-data/cards/${
                  deckData.cards[userData?.homeImage].img
                }`}
                alt={`background`}
              />
            )
          }
        >
          {homeImageSelectionDisplay()}
        </Popup>
      </div>
      <div>
        <p>Card Back Image</p>
        <Popup
          ref={ref}
          modal
          trigger={
            <img
              className="profile-back-image-button"
              src={`${process.env.REACT_APP_SERVER_URL}/cardBackgrounds/${userData?.backImage}.jpg`}
              alt={`background`}
            />
          }
        >
          <div className="profile-back-image-popup">
            {backImageSelectionDisplay()}
          </div>
        </Popup>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          sync();
        }}
      >
        Sync
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleLogout();
        }}
      >
        Logout
      </button>
      <footer id="profile-footer">
        <p>
          RWS dataset modified from{" "}
          <a href="https://www.kaggle.com/datasets/lsind18/tarot-json">
            Daria Chemkaeva on Kaggle
          </a>
        </p>
        <p>
          Profile Images genertaed with{" "}
          <a href="https://magicstudio.com">Magic Studio AI</a>
        </p>
      </footer>
    </div>
  );
};

export default Profile;
