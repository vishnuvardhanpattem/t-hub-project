




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
        console.log("user b : ", user)
        setCurrentUser(user);
        console.log("Current User b : " , currentUser)
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
    fetchAffirmation();
    return () => unsubscribe();
  }, [surveyData.feeling, navigate]);

  useEffect(() => {
    if (currentUser) {
      console.log("Updated currentUser: ", currentUser); // Now currentUser will be updated
    }
  }, [currentUser]);

  // Function to analyze the survey data and return a behavior prediction
  const analyzeBehavior = () => {
    const { diet = 'unknown', exercise = 'unknown', feeling = 'unknown', sleep = 0, stress = 0 } = surveyData;


    let prediction = 'Overall behavior: ';
  
    // Enhanced logic based on combined metrics
    if (feeling === 'stressed' && sleep < 5 && stress >= 7) {
      prediction += 'You are highly stressed and experiencing poor sleep. Consider practicing relaxation techniques like meditation or deep breathing exercises.';
    } else if (feeling === 'anxious' && stress >= 7 && exercise === 'none') {
      prediction += 'Anxiety levels seem high and lack of exercise could be contributing. Physical activity is a great way to reduce anxiety. Start with light exercise.';
    } else if (feeling === 'sad' && diet === 'unhealthy' && sleep < 4) {
      prediction += 'Your mental and physical health might be affected by poor sleep and an unhealthy diet. Try improving your nutrition and setting a consistent sleep schedule.';
    } else if (feeling === 'neutral' && exercise === 'none' && diet !== 'healthy') {
      prediction += 'You seem to be coping fine, but incorporating exercise and a healthier diet could improve your overall mental well-being.';
    } else if (feeling === 'happy' && diet === 'balanced' && exercise !== 'none') {
      prediction += 'Great job! You are in a positive mental state and maintaining good physical health. Keep up your balanced diet and regular exercise!';
    } else if (feeling === 'neutral' && sleep > 6 && diet === 'healthy' && exercise === 'light') {
      prediction += 'You are maintaining a balanced lifestyle, but adding moderate or intense physical activities could boost your mood further.';
    } else if (feeling === 'stressed' && diet === 'balanced' && sleep >= 7 && exercise === 'intense') {
      prediction += 'Even though you are maintaining a healthy lifestyle, high levels of stress indicate you might be overworking or mentally exhausted. Consider resting or taking breaks.';
    } else {
      prediction += 'Your behavior is varied, but focusing on maintaining good habits like consistent exercise, proper sleep, and a balanced diet will help improve your well-being.';
    }
  
    // Additional advice for users with high-stress patterns
    if (stress > 7) {
      prediction += ' Since your stress levels are high, practicing mindfulness techniques, going for a walk, or listening to calming music can help.';
    }
  
    // Sleep-related feedback
    if (sleep < 4) {
      prediction += ' Your sleep seems insufficient. Aim for at least 7-8 hours of quality sleep to improve mood and reduce stress.';
    } else if (sleep >= 8) {
      prediction += ' Great job getting sufficient sleep! Keep it up for a positive impact on your overall health.';
    }
  
    // Diet-related feedback
    if (diet === 'unhealthy') {
      prediction += ' Your diet could use some improvement. Try incorporating more fruits, vegetables, and whole grains.';
    }
  
    // Exercise-related feedback
    if (exercise === 'none') {
      prediction += ' Regular physical activity can significantly reduce stress and boost mood. Try starting with light exercises such as walking or stretching.';
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
