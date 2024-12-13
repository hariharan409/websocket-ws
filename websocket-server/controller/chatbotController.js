const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.PALM2_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // gemini-2.0

exports.googleBardPalm2Api = async(query) => {
    try {
        const result = await model.generateContent(query);
        console.log(result?.response?.text());
        return result?.response?.text();
    } catch (error) {
        return "fuck you bro";
    }
}