// const OPENAI_API_KEY = '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';

// export const getAffirmation = async (mood) => {
//   try {
//     const prompt = `Give me a positive affirmation for someone feeling ${mood}.`;

//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: 'text-davinci-003',
//         prompt: prompt,
//         max_tokens: 50,  // You can adjust the token count as needed
//       }),
//     });

//     const data = await response.json();
//     if (data.choices && data.choices.length > 0) {
//       return data.choices[0].text.trim();
//     } else {
//       return 'Stay strong, you are capable of amazing things!';
//     }
//   } catch (error) {
//     console.error('Error fetching affirmation:', error);
//     return 'Something went wrong, but keep your head up!';
//   }
// };

import axios from 'axios';

const geminiAPIKey = 'AIzaSyAwEKkw9757Qf7ykQPFFpbvHf2jOcs8d_I'; // Replace with your actual Gemini API key


export const getAffirmation = async ({mood}) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiAPIKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Generate a positive affirmation for someone feeling ${mood}.`
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


