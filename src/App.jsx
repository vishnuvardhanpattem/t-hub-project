import React from 'react';
import {  Route, Routes } from 'react-router-dom';

import SurveyForm from './assets/SurveyForm';
import Signup from './assets/authentication/Signup.jsx';
import Signin from './assets/authentication/Signin.jsx';
import ProtectedRoute from './assets/authentication/ProtectedRoute.jsx';
import BehaviorAnalysis from './assets/BehaviorAnalysis.jsx';
import Logout from './assets/authentication/Logout.jsx';
import WeeklyReport from './assets/WeeklyReport.jsx';
import WeeklyReports from './assets/WeeklyReports.jsx';
import Navbar from './assets/navbar/Navbar.jsx';
import HomePage from './assets/navbar/HomePage.jsx';


const App = () => {
  return (
      <div className="App"> {/* Optional: Add Navbar for better navigation */}
        {/* <Routes>
          <Route path="/"  element={<SurveyForm />} />
          <Route path="/weekly-report" element={<WeeklyReport />} />
        </Routes> */}
        <Navbar />
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/behavior-analysis' element={<BehaviorAnalysis />} />
        <Route path='/weekly-reports' element={<WeeklyReports />} />
        <Route
          path="/survey"
          element={
            <ProtectedRoute>
              <SurveyForm />
            </ProtectedRoute>
          }
        />
        <Route path='/weekly-report' element={
          <ProtectedRoute>
          <WeeklyReport />
          </ProtectedRoute>
        } />
      </Routes>
      </div>
  );
};

export default App;
