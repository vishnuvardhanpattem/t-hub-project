
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from './config/firebase'; // Firebase config
import WeeklyChart from './WeeklyChart';
import { getAffirmation } from './openaiService';
import './css/WeeklyReports.css';

const WeeklyReport = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [weeklyData, setWeeklyData] = useState([]);
    const [affirmation, setAffirmation] = useState('');
    const [healthTips, setHealthTips] = useState([]);
    const [motivationalStory, setMotivationalStory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Authentication check
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                navigate('/signin'); // Redirect to sign-in if not authenticated
            }
        });

        // Fetch affirmation
        const fetchAffirmation = async () => {
            try {
                const prompt = "Give me a postive affirmation to encourage me , I am feeling like Sad upto 70 words";
                const affirmationText = await getAffirmation({ prompt });
                setAffirmation(affirmationText);
            } catch (error) {
                console.error('Error fetching affirmation:', error);
                setAffirmation("I am worthy of love and happiness. This sadness is temporary, and I have the strength to overcome it. Every day brings new opportunities for joy and growth. I choose to focus on the positive and embrace the beauty that surrounds me.");
            }
        };
        fetchAffirmation();

        // Fetch health tips
        const healthTipsToRelieve = async () => {
            try {
                const prompt = "Give me 5 health & mental tips to stress and depression relief. Each tip should be in single line and upto 70 words.";
                const healthTipsText = await getAffirmation({ prompt });
                const tipsArray = healthTipsText.split(/\d+\.\s/).filter(Boolean).map(tip => {
                    const formattedTip = tip
                        .replace(/\*\*/g, '') // Remove asterisks
                        .replace(/How it helps/i, '\nHow it helps') // Add new line before "How it helps"
                        .replace(/How it works/i, '\nHow it works'); // Add new line before "How it works"
        
                    return formattedTip.trim();
                });
        
                // Format health tips into an array of objects
                const formattedHealthTips = tipsArray.map((tip, index) => ({
                    id: index + 1,
                    content: tip,
                }));
                
                setHealthTips(formattedHealthTips);
            } catch (error) {
                console.error('Error fetching health tips:', error);
            }
        };

        // Fetch motivational stories
        const motivationalStories = async () => {
            try {
                const prompt = "Give a short motivational story easy to read up to 2 or 3 paragraphs, in paragraph format to encourage, whether what I am feeling like Sad or Stressed or Anxious or Depressed or Unhappy or Unmotivated.";
                const motivationalStoryText = await getAffirmation({ prompt });
                // Split motivational story into paragraphs
                const storyArray = motivationalStoryText.split('\n\n').map(paragraph => paragraph.trim()).filter(Boolean);
                setMotivationalStory(storyArray);
            } catch (error) {
                console.error('Error fetching motivational story:', error);
            }
        };

        // Call the functions
        fetchAffirmation();
        healthTipsToRelieve();
        motivationalStories();

        return () => unsubscribe();
    }, [navigate]);

    // Fetch weekly data once we have the current user
    useEffect(() => {
        if (!currentUser) return; // Don't proceed if no user is logged in

        const fetchWeeklyData = async () => {
            const emailKey = currentUser.email.replace(/[\.\#\[\]]/g, '_'); // Replace invalid characters for Firestore path
            const submissionsRef = collection(db, 'users-status', emailKey, 'submissions');

            // Get the start and end of the week (Sunday to Saturday)
            const startOfWeek = new Date();
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Set to last Sunday
            const endOfWeek = new Date();
            endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to next Saturday

            // Query for submissions between the start and end of the week
            const weekSnapshot = await getDocs(query(
                submissionsRef,
                where('date', '>=', startOfWeek.toISOString().split('T')[0]),
                where('date', '<=', endOfWeek.toISOString().split('T')[0])
            ));

            const weekData = weekSnapshot.docs.map(doc => doc.data());
            setWeeklyData(weekData); // Update state with fetched weekly data
        };

        fetchWeeklyData();
    }, [currentUser]); // Re-run when currentUser changes

    console.log("Weekly Data: ", weeklyData);

    return (
        <div className='weekly-report-container'>
            <div className="weekly-report-sub-container">
                <center><h2>Weekly Report</h2></center>
                <div className="weekly-report-affirmation">
                    <h3>You need to believe in yourself</h3>
                    <p>{affirmation}</p>
                    
                </div>
            </div>
            {weeklyData.length > 0 ? (
                <WeeklyChart weeklyData={weeklyData} />
            ) : (
                <p>No data available for this week.</p>
            )}
            <div className="weekly-report-gen">
                <div className="weekly-report-health-tips">
                    <h3>Health & Mental Tips for Stress Relief:</h3>
                    <ul>
                        {healthTips.map(tip => (
                            <li key={tip.id}>
                                <strong>{tip.id}. </strong>{tip.content}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="weekly-report-motivation">
                    <h3>Motivational Story:</h3>
                    <ul>
                        {motivationalStory.map((paragraph, index) => (
                            <li key={index}>{paragraph}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default WeeklyReport;
