import React from 'react';
import {  Route, Routes } from 'react-router-dom';

import SurveyForm from './assets/SurveyForm';
import Signup from './assets/authentication/Signup.jsx';
import Signin from './assets/authentication/Signin.jsx';
import ProtectedRoute from './assets/authentication/ProtectedRoute.jsx';
import BehaviorAnalysis from './assets/BehaviorAnalysis.jsx';


const App = () => {
  return (
      <div className="App"> {/* Optional: Add Navbar for better navigation */}
        {/* <Routes>
          <Route path="/"  element={<SurveyForm />} />
          <Route path="/weekly-report" element={<WeeklyReport />} />
        </Routes> */}
        <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path='/behavior-analysis' element={<BehaviorAnalysis />} />
        <Route
          path="/survey"
          element={
            <ProtectedRoute>
              <SurveyForm />
            </ProtectedRoute>
          }
        />
      </Routes>
      </div>
  );
};

export default App;
