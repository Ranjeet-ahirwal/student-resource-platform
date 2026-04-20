exports.chatWithAI = async (req, res) => {

  const { message } = req.body;

  // Simple smart replies (for demo + viva)
  let reply = "";

  if (message.toLowerCase().includes("dsa")) {
    reply = "DSA (Data Structures & Algorithms) helps in writing efficient code and solving problems.";
  } 
  else if (message.toLowerCase().includes("java")) {
    reply = "Java is an object-oriented programming language used for building scalable applications.";
  }
  else if (message.toLowerCase().includes("dbms")) {
    reply = "DBMS is used to store, manage and retrieve data efficiently.";
  }
  else {
    reply = "I am your AI assistant. Ask me about DSA, Java, DBMS, etc.";
  }

  res.json({ reply });

};

// const OpenAI = require("openai");
// console.log("KEY:", process.env.OPENROUTER_API_KEY);
// const client = new OpenAI({
//   apiKey: process.env.OPENROUTER_API_KEY,
//   baseURL: "https://openrouter.ai/api/v1",
// });

// exports.chatWithAI = async (req, res) => {
//   try {
//     const { message } = req.body;

//     const response = await client.chat.completions.create({
//       model: "openrouter/free",
//       messages: [
//         {
//           role: "system",
//           content: "You are a helpful AI tutor."
//         },
//         {
//           role: "user",
//           content: message
//         }
//       ]
//     });

//     res.json({
//       reply: response.choices[0].message.content
//     });

//   } catch (error) {
//     console.log("ERROR:", error);
//     res.status(500).json({
//       error: error.message
//     });
//   }
// };