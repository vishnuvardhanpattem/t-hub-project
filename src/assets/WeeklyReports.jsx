


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from './config/firebase'; // Firebase config
import WeeklyChart from './WeeklyChart';

const WeeklyReports = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [weeklyData, setWeeklyData] = useState([]);
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
        <div>
            <h2>Weekly Report</h2>
            {/* Render the Weekly Chart with the fetched data */}
            {weeklyData.length > 0 ? (
                <WeeklyChart weeklyData={weeklyData} />
            ) : (
                <p>No data available for this week.</p>
            )}
        </div>
    );
};

export default WeeklyReports;
