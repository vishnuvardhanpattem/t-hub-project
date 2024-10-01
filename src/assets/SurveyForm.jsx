

import React, { useState, useEffect } from 'react';
import './css/SurveyForm.css';
import BehaviorAnalysis from './BehaviorAnalysis';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, query, where, getDocs, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './config/firebase';

const SurveyForm = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        feeling: 'healthy',
        stress: 1,
        sleep: 1,
        exercise: 'none',
        diet: 'healthy',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const collectionRef = collection(db, 'users-status'); // Ensure this is defined

    useEffect(() => {
        // Monitor user authentication state
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                navigate('/signin'); // Redirect if not authenticated
            }
        });


        return () => unsubscribe();
    }, [navigate]);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (currentUser) {
            const emailKey = currentUser.email.replace(/[\.\#\[\]]/g, '_'); // Replace invalid characters for Firestore
            const userDocRef = doc(db, 'users-status', emailKey); // Reference to the user document
            const submissionsRef = collection(userDocRef, 'submissions');

            const canSubmit = await checkDailySubmission(currentUser.uid)
            if (!canSubmit) {
                alert('You have already submitted the survey today.');
                navigate('/behavior-analysis', { state: { surveyData: form } });
                return;
            }

            setIsSubmitted(true);

            await addDoc(submissionsRef, {
                userId: currentUser.uid,
                feeling: form.feeling,
                stress: form.stress,
                sleep: form.sleep,
                exercise: form.exercise,
                diet: form.diet,
                date: new Date().toISOString().split('T')[0], 
            });

            const today = new Date();
            if (today.getDay() === 0) {
              navigate('/weekly-report');
            } else {
              navigate('/behavior-analysis', { state: { surveyData: form } });
            }
          }
        }
    
    const checkDailySubmission = async (userId) => {
        // const today = new Date().toISOString().split('T')[0]; // Get today's date
        // const q = query(collectionRef, where('userId', '==', userId), where('date', '==', today));
        // const querySnapshot = await getDocs(q);
        // return querySnapshot.empty; // Return true if no submission for today
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of today
        const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of today

        const submissionsRef = collection(db, 'users-status', userId, 'submissions');
        const q = query(submissionsRef, where('submittedAt', '>=', startOfDay), where('submittedAt', '<=', endOfDay));

        const querySnapshot = await getDocs(q);
        return querySnapshot.size > 0;
    };

    const onChangeHandler = event => {
        const name = event.target.name;
        const value = event.target.value;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    }

    return (
        <div>
            <div className={`${isSubmitted ? "hidden" : "container"}`}>
                <h1>Daily Mental Health Survey</h1>
                <form onSubmit={onSubmitHandler} className='form-container'>
                    {/* Question 1: Mood */}
                    <label>
                        <p>How are you feeling today?</p>
                        <select required name='feeling' onChange={onChangeHandler}>
                            <option value="" disabled>Select...</option>
                            <option value="happy">Happy</option>
                            <option value="neutral">Neutral</option>
                            <option value="sad">Sad</option>
                            <option value="anxious">Anxious</option>
                            <option value="stressed">Stressed</option>
                        </select>
                    </label>

                    {/* Question 2: Stress Level */}
                    <label>
                        <p>Rate your current stress level (1-10):</p>
                        <input
                            name='stress'
                            onChange={onChangeHandler}
                            type="number"
                            min="1"
                            max="10"
                            required
                        />
                    </label>

                    {/* Question 3: Sleep Quality */}
                    <label>
                        <p>How well did you sleep last night? (1 - Poor, 10 - Excellent)</p>
                        <input
                            name='sleep'
                            onChange={onChangeHandler}
                            type="number"
                            min="1"
                            max="10"
                            required
                        />
                    </label>

                    {/* Question 4: Exercise */}
                    <label>
                        <p>Have you exercised today?</p>
                        <select name='exercise' onChange={onChangeHandler} required>
                            <option value="" disabled>Select...</option>
                            <option value="none">None</option>
                            <option value="light">Light</option>
                            <option value="moderate">Moderate</option>
                            <option value="intense">Intense</option>
                        </select>
                    </label>

                    {/* Question 5: Diet */}
                    <label>
                        <p>How healthy was your diet today?</p>
                        <select name='diet' onChange={onChangeHandler} required>
                            <option value="" disabled>Select...</option>
                            <option value="healthy">Healthy</option>
                            <option value="balanced">Balanced</option>
                            <option value="unhealthy">Unhealthy</option>
                        </select>
                    </label>

                    {/* Submit Button */}
                    <div className='form-btn'><button type="submit">Submit</button></div>
                </form>
            </div>
        </div>
    )
}

export default SurveyForm;
