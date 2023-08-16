import React from "react";
import { Route, Routes } from "react-router-dom";

import {
  Nav,
  HomeWidget,
  Readings,
  Reading,
  Spreads,
  Spread,
  Deck,
  Card,
  Suit,
  Profile,
} from "./";

const ContentManager = () => {
  return (
    <div className="content-manager">
      <Routes>
        <Route path="/" element={<HomeWidget />} />
        <Route
          path="/records"
          element={
            <Nav>
              <Readings />
            </Nav>
          }
        />
        <Route
          path="/records/readings/reading/:readingId?"
          element={
            <Nav>
              <Reading />
            </Nav>
          }
        />
        <Route
          path="/records/readings"
          element={
            <Nav>
              <Readings />
            </Nav>
          }
        />
        <Route
          path="/records/spreads"
          element={
            <Nav>
              <Spreads />
            </Nav>
          }
        />
        <Route
          path="/records/spreads/:spread"
          element={
            <Nav>
              <Spread />
            </Nav>
          }
        />
        <Route
          path="/records/deck"
          element={
            <Nav>
              <Deck />
            </Nav>
          }
        />
        <Route
          path="/records/deck/:suit"
          element={
            <Nav>
              <Suit />
            </Nav>
          }
        />
        <Route
          path="/records/deck/:suitParam/:cardParam"
          element={
            <Nav>
              <Card />
            </Nav>
          }
        />
        <Route
          path="/records/profile"
          element={
            <Nav>
              <Profile />
            </Nav>
          }
        />
        <Route path="/*" element={<div>ERROR</div>} />
      </Routes>
    </div>
  );
};

export default ContentManager;
