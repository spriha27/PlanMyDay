// static/js/script.js

document.getElementById('planForm').addEventListener('submit', async function(e) {
    e.preventDefault();  // Prevent the default form submission

    const userInput = document.getElementById('input').value;

    // Show a loading message while waiting for the response
    document.getElementById('response').innerText = "Generating your plan...";

    // Send the POST request to the Flask backend
    const response = await fetch('/plan_my_day', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: userInput })
    });

    // Get the JSON response
    const data = await response.json();

    // Handle the response: display either the output or an error message
    if (data.error) {
        document.getElementById('response').innerText = "Error: " + data.error;
    } else {
        document.getElementById('response').innerText = data.output;
    }
});