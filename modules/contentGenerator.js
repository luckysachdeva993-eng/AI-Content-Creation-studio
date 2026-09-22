const createPrompt = require("./promptGenerator");

function generateContent(type, idea) {

    const prompt = createPrompt(type, idea);

    return prompt;

}

module.exports = generateContent;