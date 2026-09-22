const http = require("http");
const fs = require("fs");
const path = require("path");

const { GoogleGenAI } = require("@google/genai");

const generateContent = require("./modules/contentGenerator");


// ==========================================
// GEMINI AI CONNECTION
// ==========================================

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});
// ==========================================
// WAIT FUNCTION
// ==========================================

function sleep(ms) {

    return new Promise(function(resolve) {

        setTimeout(resolve, ms);

    });

}


// ==========================================
// GEMINI RETRY FUNCTION
// ==========================================

async function generateWithRetry(prompt) {

    const maxRetries = 3;


    for (
        let attempt = 0;
        attempt <= maxRetries;
        attempt++
    ) {

        try {

            const response =
                await ai.models.generateContent({

                    model:
                        "gemini-3.6-flash",

                    contents:
                        prompt

                });


            return response;

        }


        catch (error) {

            const status =
                error.status ||
                error.statusCode ||
                error.code;


            const message =
                String(
                    error.message ||
                    error
                );


            const isRetryable =
                status === 429 ||
                status === 500 ||
                status === 502 ||
                status === 503 ||
                status === 504 ||
                message.includes("503") ||
                message
                    .toLowerCase()
                    .includes("high demand") ||
                message
                    .toLowerCase()
                    .includes("overloaded");


            if (
                !isRetryable ||
                attempt === maxRetries
            ) {

                throw error;

            }


            const delay =
                2000 *
                Math.pow(
                    2,
                    attempt
                );


            console.log(
                `Gemini is busy. Retrying in ${delay / 1000} seconds...`
            );


            await sleep(delay);

        }

    }

}

// ==========================================
// HISTORY FILE PATH
// ==========================================

const historyFile =
    path.join(__dirname, "data", "history.json");


// ==========================================
// CREATE SERVER
// ==========================================

const server = http.createServer(
    (request, response) => {


        // ==========================================
        // GENERATE AI CONTENT
        // ==========================================

        if (
            request.method === "POST" &&
            request.url === "/generate"
        ) {

            let body = "";


            // Receive request data

            request.on("data", (chunk) => {

                body += chunk;

            });


            // Request completely received

            request.on("end", async () => {

                try {

                    const data =
                        JSON.parse(body);


                    const type =
                        data.type;

                    const idea =
                        data.idea;


                    // Create professional prompt

                    const prompt =
                        generateContent(
                            type,
                            idea
                        );


                    // Send prompt to Gemini

                   const aiResponse =
                   await generateWithRetry(prompt);

                    // Get generated text

                    const generatedResult =
                        aiResponse.text;


                    // Create history item

                    const historyItem = {

                        type: type,

                        idea: idea,

                        result: generatedResult,

                        date:
                            new Date().toISOString()

                    };


                    // ==========================================
                    // SAVE HISTORY
                    // ==========================================

                    let history = [];


                    try {

                        const fileData =
                            await fs.promises.readFile(
                                historyFile,
                                "utf8"
                            );


                        if (
                            fileData.trim() !== ""
                        ) {

                            history =
                                JSON.parse(
                                    fileData
                                );

                        }

                    }
                    catch (error) {

                        // File does not exist yet

                        if (
                            error.code !== "ENOENT"
                        ) {

                            throw error;

                        }

                    }


                    history.push(
                        historyItem
                    );


                    await fs.promises.writeFile(

                        historyFile,

                        JSON.stringify(
                            history,
                            null,
                            4
                        )

                    );


                    // ==========================================
                    // SEND RESPONSE
                    // ==========================================

                    response.writeHead(
                        200,
                        {
                            "Content-Type":
                                "application/json"
                        }
                    );


                    response.end(
                        JSON.stringify({

                            result:
                                generatedResult

                        })
                    );

                }


                catch (error) {

                    console.log(
                        "AI generation error:",
                        error
                    );


                    response.writeHead(
                        500,
                        {
                            "Content-Type":
                                "application/json"
                        }
                    );


                    response.end(
                        JSON.stringify({

                            error:
                                "AI generation failed. Please check your Gemini API key and try again."

                        })
                    );

                }

            });


            return;

        }


        // ==========================================
        // GET GENERATION HISTORY
        // ==========================================

        if (
            request.method === "GET" &&
            request.url === "/history"
        ) {

            fs.readFile(

                historyFile,

                "utf8",

                (error, fileData) => {


                    if (error) {

                        response.writeHead(

                            500,

                            {
                                "Content-Type":
                                    "application/json"
                            }

                        );


                        response.end(

                            JSON.stringify({

                                error:
                                    "Could not read history."

                            })

                        );


                        return;

                    }


                    response.writeHead(

                        200,

                        {
                            "Content-Type":
                                "application/json"
                        }

                    );


                    response.end(
                        fileData
                    );

                }

            );


            return;

        }


        // ==========================================
        // CLEAR GENERATION HISTORY
        // ==========================================

        if (
            request.method === "DELETE" &&
            request.url === "/history"
        ) {

            fs.writeFile(

                historyFile,

                "[]",

                (error) => {


                    if (error) {

                        response.writeHead(

                            500,

                            {
                                "Content-Type":
                                    "application/json"
                            }

                        );


                        response.end(

                            JSON.stringify({

                                error:
                                    "Could not clear history."

                            })

                        );


                        return;

                    }


                    response.writeHead(

                        200,

                        {
                            "Content-Type":
                                "application/json"
                        }

                    );


                    response.end(

                        JSON.stringify({

                            message:
                                "History cleared successfully."

                        })

                    );

                }

            );


            return;

        }


        // ==========================================
        // SERVE FRONTEND FILES
        // ==========================================

        let filePath;


        if (
            request.url === "/"
        ) {

            filePath =
                path.join(
                    __dirname,
                    "public",
                    "index.html"
                );

        }

        else if (
            request.url === "/style.css"
        ) {

            filePath =
                path.join(
                    __dirname,
                    "public",
                    "style.css"
                );

        }

        else if (
            request.url === "/script.js"
        ) {

            filePath =
                path.join(
                    __dirname,
                    "public",
                    "script.js"
                );

        }

        else {

            response.writeHead(

                404,

                {
                    "Content-Type":
                        "text/plain"
                }

            );


            response.end(
                "404 - File Not Found"
            );


            return;

        }


        // ==========================================
        // DETERMINE FILE TYPE
        // ==========================================

        const extension =
            path.extname(
                filePath
            );


        let contentType =
            "text/plain";


        if (
            extension === ".html"
        ) {

            contentType =
                "text/html";

        }

        else if (
            extension === ".css"
        ) {

            contentType =
                "text/css";

        }

        else if (
            extension === ".js"
        ) {

            contentType =
                "text/javascript";

        }


        // ==========================================
        // READ AND SEND FRONTEND FILE
        // ==========================================

        fs.readFile(

            filePath,

            (error, data) => {


                if (error) {

                    response.writeHead(

                        500,

                        {
                            "Content-Type":
                                "text/plain"
                        }

                    );


                    response.end(
                        "Error: Could not load the file."
                    );


                    return;

                }


                response.writeHead(

                    200,

                    {
                        "Content-Type":
                            contentType
                    }

                );


                response.end(
                    data
                );

            }

        );

    }
);


// ==========================================
// START SERVER
// ==========================================

const PORT = 5000;


server.listen(

    PORT,

    () => {

        console.log(
            `Server is running at http://localhost:${PORT}`
        );

    }

);