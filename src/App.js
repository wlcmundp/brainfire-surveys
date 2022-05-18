import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import EditSurvey from "./pages/EditSurvey";
import CreateSurvey from "./pages/CreateSurvey";
import SurveysList from "./pages/SurveysList";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/admin">
          <Route exact path="/admin" />
          <Route exact path="surveys" element={<SurveysList />} />
          <Route exact path="add-new-survey" element={<CreateSurvey />} />
          <Route exact path="edit-survey" element={<EditSurvey />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
