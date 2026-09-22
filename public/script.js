const contentButtons =
    document.querySelectorAll(".content-button");

const generateButton =
    document.querySelector("#generateButton");

const userIdea =
    document.querySelector("#userIdea");

const result =
    document.querySelector("#result");

const history =
    document.querySelector("#history");

const clearHistoryButton =
    document.querySelector("#clearHistoryButton");

const copyButton =
    document.querySelector("#copyButton");


let selectedType = "";


// ==========================================
// CONTENT TYPE SELECTION
// ==========================================

contentButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        for (let i = 0; i < contentButtons.length; i++) {

            contentButtons[i].className =
                "content-button";

        }

        button.className =
            "content-button selected";

        selectedType =
            button.getAttribute("data-type");

        console.log(
            "Selected content type:",
            selectedType
        );

    });

});


// ==========================================
// GENERATE CONTENT
// ==========================================

generateButton.addEventListener(
    "click",
    async function() {

        const idea =
            userIdea.value;


        // Check content type

        if (selectedType === "") {

            result.textContent =
                "Please select a content type first.";

            return;

        }


        // Check idea

        if (idea.trim() === "") {

            result.textContent =
                "Please describe your idea first.";

            userIdea.focus();

            return;

        }


        // Disable button while AI is working

        generateButton.disabled = true;

        generateButton.textContent =
            "Generating...";


        result.textContent =
            "✨ Gemini AI is creating your content...";


        try {

            const response =
                await fetch("/generate", {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        type: selectedType,

                        idea: idea

                    })

                });


            const data =
                await response.json();


            // Check server response

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Something went wrong."
                );

            }


            // Display generated result

            result.textContent =
                data.result;


            // Load new history

            await loadHistory();


            // Scroll to result

            result.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }


        catch (error) {

            result.textContent =
                "❌ Error: " +
                error.message;


            console.error(
                "Generation error:",
                error
            );

        }


        finally {

            generateButton.disabled =
                false;

            generateButton.textContent =
                "Generate with AI";

        }

    }
);


// ==========================================
// COPY RESULT
// ==========================================

copyButton.addEventListener(
    "click",
    async function() {

        const textToCopy =
            result.textContent;


        if (
            textToCopy === "" ||
            textToCopy ===
            "Your generated content will appear here."
        ) {

            alert(
                "There is no generated content to copy."
            );

            return;

        }


        try {

            await navigator.clipboard.writeText(
                textToCopy
            );


            copyButton.textContent =
                "✓ Copied!";


            setTimeout(
                function() {

                    copyButton.textContent =
                        "Copy Result";

                },
                2000
            );

        }


        catch (error) {

            console.error(
                "Copy error:",
                error
            );


            alert(
                "Could not copy the result."
            );

        }

    }
);


// ==========================================
// LOAD HISTORY
// ==========================================

async function loadHistory() {

    try {

        const response =
            await fetch("/history");


        if (!response.ok) {

            throw new Error(
                "Could not load history."
            );

        }


        const data =
            await response.json();


        // Check whether history exists

        if (
            !Array.isArray(data) ||
            data.length === 0
        ) {

            history.textContent =
                "No history available yet.";

            return;

        }


        // Clear previous history

        history.innerHTML = "";


        // Display newest item first

        for (
            let i = data.length - 1;
            i >= 0;
            i--
        ) {

            const item =
                data[i];


            const historyItem =
                document.createElement(
                    "div"
                );


            historyItem.className =
                "history-item";


            // Type

            const typeText =
                document.createElement(
                    "strong"
                );

            typeText.textContent =
                "Type: " +
                item.type;


            // Idea

            const ideaText =
                document.createElement(
                    "div"
                );

            ideaText.textContent =
                "Idea: " +
                item.idea;


            // Date

            const dateText =
                document.createElement(
                    "div"
                );

            const formattedDate =
                new Date(item.date)
                    .toLocaleString();


            dateText.textContent =
                "Date: " +
                formattedDate;


            // Result heading

            const resultTitle =
                document.createElement(
                    "strong"
                );

            resultTitle.textContent =
                "Result:";


            // Result

            const resultText =
                document.createElement(
                    "p"
                );

            resultText.textContent =
                item.result;


            // Add elements to history card

            historyItem.appendChild(
                typeText
            );


            historyItem.appendChild(
                document.createElement("br")
            );


            historyItem.appendChild(
                ideaText
            );


            historyItem.appendChild(
                document.createElement("br")
            );


            historyItem.appendChild(
                dateText
            );


            historyItem.appendChild(
                document.createElement("br")
            );


            historyItem.appendChild(
                resultTitle
            );


            historyItem.appendChild(
                resultText
            );


            history.appendChild(
                historyItem
            );

        }

    }


    catch (error) {

        history.textContent =
            "Could not load history.";


        console.error(
            "History error:",
            error
        );

    }

}


// ==========================================
// CLEAR HISTORY
// ==========================================

clearHistoryButton.addEventListener(
    "click",
    async function() {

        const confirmClear =
            confirm(
                "Are you sure you want to clear all history?"
            );


        if (!confirmClear) {

            return;

        }


        try {

            const response =
                await fetch(
                    "/history",
                    {
                        method: "DELETE"
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Could not clear history."
                );

            }


            await loadHistory();


            result.textContent =
                "✓ History cleared successfully.";


        }


        catch (error) {

            result.textContent =
                "❌ Error: " +
                error.message;


            console.error(
                "Clear history error:",
                error
            );

        }

    }
);


// ==========================================
// LOAD HISTORY WHEN PAGE OPENS
// ==========================================

loadHistory();