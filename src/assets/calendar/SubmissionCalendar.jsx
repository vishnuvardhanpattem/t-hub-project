// import React, { useState, useEffect } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import { collection, getDocs, query, where } from 'firebase/firestore';
// import { db } from '../config/firebase';
// import "../css/SubmissionCalendar.css"
// // Firebase setup

// const SubmissionCalendar = ({ currentUser }) => {
//   const [submissions, setSubmissions] = useState([]);
//   const [markedDates, setMarkedDates] = useState([]);

//   useEffect(() => {
//     const fetchSubmissions = async () => {
//       if (!currentUser) return;

//       const q = query(
//         collection(db, 'users'),
//         where('userId', '==', currentUser.uid)
//       );
//       const snapshot = await getDocs(q);
//       const submissionData = snapshot.docs.map(doc => doc.data());

//       // Extract submission dates from Firebase data
//       const submissionDates = submissionData.map(sub => new Date(sub.date));
//       setSubmissions(submissionDates);
//     };

//     fetchSubmissions();
//   }, [currentUser]);

//   const tileClassName = ({ date, view }) => {
//     if (submissions.find(submissionDate => submissionDate.getTime() === date.getTime())) {
//       return 'highlight'; // Add a special class to highlight submission dates
//     }
//   };

//   return (
//     <div className='calendar-container'>
//       <h2>Track Your Form Submissions</h2>
//       <Calendar
//         tileClassName={tileClassName}
//       />
//     </div>
//   );
// };

// export default SubmissionCalendar;


import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import "../css/SubmissionCalendar.css"; // Assuming you already have custom CSS

const SubmissionCalendar = ({ currentUser }) => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    console.log("currentUser Sc: ", currentUser);
    const fetchSubmissions = async () => {
      if (!currentUser) return;
      const emailKey = currentUser.email.replace(/[\.\#\[\]]/g, '_'); 
      const submissionsRef = collection(db, 'users-status', emailKey, 'submissions');
  
      try {
        const snapshot = await getDocs(submissionsRef);
        const submissionData = snapshot.docs.map(doc => doc.data());
        console.log("submissionData: ", submissionData);
  
        const submissionDates = submissionData.map(sub => sub.date);
        setSubmissions(submissionDates);
        console.log("Submission Dates: ", submissionDates);
      } catch (error) {
        console.error("Error fetching submissions: ", error);
      }
    };
  
    fetchSubmissions();
  }, [currentUser]);
  

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0]; 
      
      if (submissions.includes(dateString)) {
        return <span className="tick-mark">✔</span>; 
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    const dateString = date.toISOString().split('T')[0];

    if (submissions.includes(dateString)) {
      return 'highlight'; 
    }
  };

  return (
    <div className="calendar-container">
      <h2>Track Your Daily Submissions</h2>
      <Calendar
        tileContent={tileContent}
        tileClassName={tileClassName}
      />
    </div>
  );
};

export default SubmissionCalendar;
