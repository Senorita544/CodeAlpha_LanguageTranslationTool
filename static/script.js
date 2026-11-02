
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");

const sourceLang = document.getElementById("sourceLang");
const targetLang = document.getElementById("targetLang");

const translateBtn = document.getElementById("translateBtn");
const copyBtn = document.getElementById("copyBtn");
const swapBtn = document.getElementById("swapBtn");

const statusMessage = document.getElementById("statusMessage");
const charCount = document.getElementById("charCount");


// Character counter
inputText.addEventListener("input", function () {
    charCount.textContent = `${inputText.value.length} / 5000`;
});


// Translation function
translateBtn.addEventListener("click", async function () {

    const text = inputText.value.trim();

    if (!text) {
        statusMessage.textContent = "Please enter some text!";
        return;
    }

    if (sourceLang.value === targetLang.value) {
        statusMessage.textContent = "Please select different languages.";
        return;
    }

    translateBtn.disabled = true;
    translateBtn.textContent = "Translating...";
    statusMessage.textContent = "Please wait...";
    outputText.value = "";

    try {

        const response = await fetch("/translate", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                text: text,
                source_lang: sourceLang.value,
                target_lang: targetLang.value
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Translation failed.");
        }

        outputText.value = result.translated_text;
        statusMessage.textContent = "Translation completed successfully!";

    } catch (error) {

        statusMessage.textContent = error.message;
        outputText.value = "";

    } finally {

        translateBtn.disabled = false;
        translateBtn.textContent = "Translate Now";

    }

});


// Copy translated text
copyBtn.addEventListener("click", async function () {

    if (!outputText.value.trim()) {
        statusMessage.textContent = "Nothing to copy!";
        return;
    }

    try {
        await navigator.clipboard.writeText(outputText.value);
        statusMessage.textContent = "Translation copied successfully!";
    } catch (error) {
        statusMessage.textContent = "Unable to copy. Please copy manually.";
    }

});


// Swap source and target languages
swapBtn.addEventListener("click", function () {

    const previousSource = sourceLang.value;

    sourceLang.value = targetLang.value;
    targetLang.value = previousSource;

    inputText.value = outputText.value;
    outputText.value = "";

    charCount.textContent = `${inputText.value.length} / 5000`;

    statusMessage.textContent = "Languages swapped!";

});
