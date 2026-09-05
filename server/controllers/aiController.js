const {
 GoogleGenerativeAI
} =
require(
 "@google/generative-ai"
);

const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY);

const generateReview =
async(req,res)=>{

 const model =
 genAI.getGenerativeModel({
  model:"gemini-1.5-flash"
 });

 const {
  projectType,
  healthScore,
  readmeScore
 } = req.body;

 const prompt = `
 Review this repository.

 Project Type:
 ${projectType}

 Health:
 ${healthScore}

 Readme:
 ${readmeScore}

 Give strengths and improvements.
 `;

 const result =
 await model.generateContent(
  prompt
 );

 res.json({
  review:
  result.response.text()
 });

};