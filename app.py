import openai
import os
from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Access the API keys from the environment variables
paid_api_key = os.getenv("PAID_API_KEY")
free_api_key = os.getenv("FREE_API_KEY")

# Set the OpenAI API key (use paid key for production)
openai.api_key = paid_api_key

# Initialize Flask app
app = Flask(__name__)

# Route for the homepage (for form input, if needed)
@app.route('/')
def index():
    return render_template('index.html')

# Route to handle GPT requests
@app.route('/plan_my_day', methods=['POST'])
def plan_my_day():
    try:
        # Get user input from JSON request
        user_input = request.json['input']

        # Make a request to OpenAI GPT-3.5 API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # You can switch to "gpt-4" if needed
            messages=[
                {"role": "system", "content": "You are PlanMyDayGPT."},
                {"role": "user", "content": user_input}
            ],
            max_tokens=100  # Limit the tokens to control output length
        )

        # Extract the GPT's response
        output = response['choices'][0]['message']['content'].strip()

        # Return the GPT response as a JSON object
        return jsonify({"output": output})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)