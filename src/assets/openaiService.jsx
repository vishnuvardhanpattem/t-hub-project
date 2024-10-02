

import axios from 'axios';

const geminiAPIKey = 'AIzaSyAwEKkw9757Qf7ykQPFFpbvHf2jOcs8d_I'; // Replace with your actual Gemini API key


export const getAffirmation = async ({prompt}) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiAPIKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    console.log("response : " ,response); // Log the response for debugging

    // Extract the result based on the API's response structure
    return response?.data.candidates[0]?.content.parts[0]?.text; // Adjust based on the actual response from Gemini API
  } catch (error) {
    console.error("Error fetching affirmation:", error);
    throw error;
  }
};


