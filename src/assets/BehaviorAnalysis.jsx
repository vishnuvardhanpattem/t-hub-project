// import React, { useEffect, useState } from 'react';
// import "./css/BehaviorAnalysis.css"
// import { getAffirmation } from './openaiService.jsx';


// const BehaviorAnalysis = ({ surveyData }) => {

//   const [affirmation, setAffirmation] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAffirmation = async () => {
//       try {
//         const affirmationText = await getAffirmation(surveyData.feeling);
//         setAffirmation(affirmationText);
//       } catch (error) {
//         setAffirmation('Something went wrong, but keep your head up!');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAffirmation();
//   }, []);
//   // Function to analyze the survey data and return a behavior prediction
//   const analyzeBehavior = () => {
//     const { diet, exercise, feeling, sleep, stress } = surveyData;

//     let prediction = 'Overall behavior: ';

//     if (feeling === 'stressed' && sleep < 5 && stress >= 5) {
//       prediction += 'You seem very stressed and may need immediate mental relief. Try to relax and prioritize better sleep.';
//     } else if (feeling === 'neutral' && exercise === 'none' && diet !== 'healthy') {
//       prediction += 'You may benefit from incorporating more exercise and improving your diet. This will help in reducing stress levels.';
//     } else if (feeling === 'happy' && diet === 'balanced' && exercise !== 'none') {
//       prediction += 'You are in a good mental state! Keep maintaining your balanced diet and active lifestyle.';
//     } else if (feeling === 'sad' && diet === 'unhealthy' && sleep < 4) {
//       prediction += 'You seem to be struggling with both physical and mental health. Consider improving your diet and sleep habits.';
//     } else {
//       prediction += 'You have a mixed set of habits. Try to focus on balanced diet, good sleep, and regular exercise for mental well-being.';
//     }

//     return prediction;
//   };

//   const behaviorPrediction = analyzeBehavior();

//    // Text-to-Speech functionality
//    const speakAffirmation = () => {
//     if ('speechSynthesis' in window && affirmation) {
//       const speech = new SpeechSynthesisUtterance(affirmation);
//       speech.lang = 'en-US'; // You can set other languages if needed
//       window.speechSynthesis.speak(speech);
//     }
//   };

//   return (
//     <>
//       <div className={`${surveyData.feeling === 'happy' ? "behavior-healthy" : "behavior-analysis"}`}>
//         <h1>Your Behavior Analysis</h1>
//         <p>{behaviorPrediction}</p>
//         <h2>You need to believe in Yourself</h2>
//        {
//           loading ? <p>Loading...</p> : <p>{affirmation}</p>
//        }
//        <button className='behavior-analysis-btn' onClick={speakAffirmation}>🔊 Listen</button>
//       </div>
//     </>
//   );
// };

// export default BehaviorAnalysis;



import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./css/BehaviorAnalysis.css";
import { getAffirmation } from './openaiService.jsx';
import SubmissionCalendar from './calendar/SubmissionCalendar.jsx';
import { auth } from './config/firebase.jsx';
import { onAuthStateChanged } from 'firebase/auth';

const BehaviorAnalysis = () => {
  const location = useLocation();
  const surveyData = location.state?.surveyData || {}; // Safe access to surveyData

  const [affirmation, setAffirmation] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        navigate('/signin'); // Redirect if not authenticated
      }
    });
    const fetchAffirmation = async () => {
      try {
        const affirmationText = await getAffirmation(surveyData.feeling);
        setAffirmation(affirmationText);
      } catch (error) {
        setAffirmation('Something went wrong, but keep your head up!');
      } finally {
        setLoading(false);
      }
    };
    unsubscribe();
    fetchAffirmation();
  }, [surveyData.feeling, navigate]);

  // Function to analyze the survey data and return a behavior prediction
  const analyzeBehavior = () => {
    const { diet = 'unknown', exercise = 'unknown', feeling = 'unknown', sleep = 0, stress = 0 } = surveyData;

    let prediction = 'Overall behavior: ';

    if (feeling === 'stressed' && sleep < 5 && stress >= 5) {
      prediction += 'You seem very stressed and may need immediate mental relief. Try to relax and prioritize better sleep.';
    } else if (feeling === 'neutral' && exercise === 'none' && diet !== 'healthy') {
      prediction += 'You may benefit from incorporating more exercise and improving your diet. This will help in reducing stress levels.';
    } else if (feeling === 'happy' && diet === 'balanced' && exercise !== 'none') {
      prediction += 'You are in a good mental state! Keep maintaining your balanced diet and active lifestyle.';
    } else if (feeling === 'sad' && diet === 'unhealthy' && sleep < 4) {
      prediction += 'You seem to be struggling with both physical and mental health. Consider improving your diet and sleep habits.';
    } else {
      prediction += 'You have a mixed set of habits. Try to focus on balanced diet, good sleep, and regular exercise for mental well-being.';
    }


    return prediction;
  };


  const behaviorPrediction = analyzeBehavior();

  // Text-to-Speech functionality
  const speakAffirmation = () => {
    if ('speechSynthesis' in window && affirmation) {
      const speech = new SpeechSynthesisUtterance(affirmation);
      speech.lang = 'en-US'; // You can set other languages if needed
      window.speechSynthesis.speak(speech);
    }
  };

  return (
    <>
      <SubmissionCalendar currentUser={currentUser} />
      <div className={`${surveyData.feeling === 'happy' ? "behavior-healthy" : "behavior-analysis"}`}>
        <h1>Your Behavior Analysis</h1>
        <p>{behaviorPrediction}</p>
        <h2>You need to believe in Yourself</h2>
        {loading ? <p>Loading...</p> : <p>{affirmation}</p>}
        <button className='behavior-analysis-btn' onClick={speakAffirmation}>🔊 Listen</button>
      </div>
    </>
  );
};

export default BehaviorAnalysis;
