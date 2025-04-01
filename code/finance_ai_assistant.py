from flask import Flask, render_template_string, request
import requests

app = Flask(__name__)

TEMPLATE = """
<!doctype html>
<html>
<head>
    <title>Finance AI Assistant</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 40px; }
        input, select { padding: 10px; margin: 12px; width: 90%; border: 1px solid #ccc; border-radius: 5px; }
        button { padding: 10px 20px; background-color: #000; color: white; border: none; border-radius: 5px; cursor: pointer; }
        .result { background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: left; width: 90%; margin: 20px auto; font-size: 14px; line-height: 1.6; }
    </style>
</head>
<body>
    <h2>Finance AI Assistant</h2>
    <form method="POST">
        <input name="name" placeholder="Name" required>
        <input name="age" type="number" placeholder="Age" required>

        <select name="income_source" required>
            <option value="">Primary source of funds</option>
            <option>Allowance</option>
            <option>Salary</option>
            <option>Freelance</option>
            <option>Other</option>
        </select>

        <select name="income_consistency" required>
            <option value="">Income consistency</option>
            <option>Fixed</option>
            <option>Variable</option>
        </select>

        <input name="monthly_income" type="number" placeholder="Monthly Income" required>
        <input name="monthly_expenditure" type="number" placeholder="Monthly Expenditure" required>

        <input name="financial_goals" placeholder="Comma-separated goals (e.g., Save more, Start investing)" required>

        <select name="risk_preference" required>
            <option value="">Investment risk preference</option>
            <option>High Risk, High Reward</option>
            <option>Medium Risk, Steady Growth</option>
            <option>Low Risk, Secure Returns</option>
        </select>

        <select name="saving_frequency" required>
            <option value="">Saving/Investing frequency</option>
            <option>Weekly</option>
            <option>Bi-weekly</option>
            <option>Monthly</option>
        </select>

        <select name="investment_preference" required>
            <option value="">Investment preference</option>
            <option>Saving</option>
            <option>Investing</option>
            <option>Balanced</option>
        </select>

        <button type="submit">Generate Plan</button>
    </form>

    {% if result %}
    <div class="result">{{ result|safe }}</div>
    {% endif %}
</body>
</html>
"""

@app.route("/", methods=["GET", "POST"])
def index():
    result = ""
    if request.method == "POST":
        data = request.form
        prompt = f"""
Generate a simple and structured financial plan for the user with the following details:
- Name: {data['name']}
- Age: {data['age']}
- Primary income source: {data['income_source']}
- Income consistency: {data['income_consistency']}
- Monthly income: ${data['monthly_income']}
- Monthly expenditure: ${data['monthly_expenditure']}
- Financial goals: {data['financial_goals']}
- Saving/Investing frequency: {data['saving_frequency']}
- Investment preference: {data['investment_preference']}
- Investment risk preference: {data['risk_preference']}

The response should include:
1. A friendly greeting personalized with the user's name.
2. A brief financial summary showing expenses, savings, and investments.
3. A pie chart-style breakdown of financial allocation with exact percentages for:
   - Expenses
   - Investments
   - Liquid Savings
   - Emergency Savings
4. Recommended percentage allocations for investments, emergency savings, and liquid savings.
5. A section suggesting possible investment opportunities based on the user's preference (e.g., Cryptocurrencies, Penny Stocks, Venture Capital).
6. The tone should be concise, engaging, and easy to understand.

Ensure the response is visually structured for clarity and readability.
"""

        API_KEY = ""  
        try:
            response = requests.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}",
                headers={"Content-Type": "application/json"},
                json={"contents": [{"parts": [{"text": prompt}]}]}
            )
            data = response.json()
            if data.get("candidates"):
                raw = data['candidates'][0]['content']['parts'][0]['text']
                result = raw.replace("**", "<strong>").replace("\n\n", "<br><br>").replace("\n* ", "<br>• ")
            else:
                result = "Error: No response from Gemini API."
        except Exception as e:
            result = f"Error generating financial plan: {e}"

    return render_template_string(TEMPLATE, result=result)

if __name__ == "__main__":
    app.run(debug=True)
