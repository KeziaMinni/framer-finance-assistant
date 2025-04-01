import React, { useState } from "react"
import {
    NameInputOverride,
    AgeInputOverride,
    IncomeSourceOverride,
    IncomeConsistencyOverride,
    MonthlyIncomeOverride,
    MonthlyExpenditureOverride,
    FinancialGoalsOverride,
    InvestmentRiskPreferenceOverride,
    SavingFrequencyOverride,
    InvestmentPreferenceOverride,
    GeneratePlanOverride,
    ContinueButtonOverride,
} from "./Examples.tsx"

export default function FinanceAIAssistant() {
    const [currentPage, setCurrentPage] = useState(1)
    const [name, setName] = useState("")
    const [age, setAge] = useState("")
    const [incomeSource, setIncomeSource] = useState("")
    const [incomeConsistency, setIncomeConsistency] = useState("")
    const [monthlyIncome, setMonthlyIncome] = useState("")
    const [monthlyExpenditure, setMonthlyExpenditure] = useState("")
    const [financialGoals, setFinancialGoals] = useState([])
    const [savingFrequency, setSavingFrequency] = useState("")
    const [investmentPreference, setInvestmentPreference] = useState("")
    const [investmentRiskPreference, setInvestmentRiskPreference] = useState("") // Added this line
    const [result, setResult] = useState("")

    const API_KEY = "" 

    const nextPage = () => {
        setCurrentPage(currentPage + 1)
    }

    const generatePlan = async () => {
        const prompt = `
Generate a simple and structured financial plan for the user with the following details:
- Name: ${name}
- Age: ${age}
- Primary income source: ${incomeSource}
- Income consistency: ${incomeConsistency}
- Monthly income: $${monthlyIncome}
- Monthly expenditure: $${monthlyExpenditure}
- Financial goals: ${financialGoals.join(", ")}
- Saving/Investing frequency: ${savingFrequency}
- Investment preference: ${investmentPreference}
- Investment risk preference: ${investmentRiskPreference}

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
`

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                    }),
                }
            )
            const data = await response.json()

            if (data && data.candidates && data.candidates.length > 0) {
                let rawText = data.candidates[0].content.parts[0].text.trim()
                setResult(formatFinancialPlan(rawText))
            } else {
                setResult("Error: No response from Gemini API.")
            }
        } catch (error) {
            console.error("API Error:", error)
            setResult(`Error generating financial plan. Please try again.`)
        }
    }

    function formatFinancialPlan(text) {
        return `
        <h3>📊 Your Financial Plan</h3>
        ${text
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\n{2,}/g, "<br><br>")
            .replace(/\n\*\s/g, "<br>• ")}
    `
    }

    const renderPage = () => {
        switch (currentPage) {
            case 1:
                return (
                    <div>
                        <h2>Personal Details</h2>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            placeholder="Age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            style={inputStyle}
                        />
                        <button onClick={nextPage} style={buttonStyle}>
                            Continue
                        </button>
                    </div>
                )
            case 2:
                return (
                    <div>
                        <h2>Finances</h2>
                        <p>What is your primary source of funds?</p>
                        <select
                            value={incomeSource}
                            onChange={(e) => setIncomeSource(e.target.value)}
                            style={inputStyle}
                        >
                            <option value="">Select an option</option>
                            <option value="Allowance">Allowance</option>
                            <option value="Salary">Salary</option>
                            <option value="Freelance">Freelance</option>
                            <option value="Other">Other</option>
                        </select>
                        <button onClick={nextPage} style={buttonStyle}>
                            Continue
                        </button>
                    </div>
                )
            case 3:
                return (
                    <div>
                        <h2>Finances</h2>
                        <p>Do you have a consistent income?</p>
                        <select
                            value={incomeConsistency}
                            onChange={(e) =>
                                setIncomeConsistency(e.target.value)
                            }
                            style={inputStyle}
                        >
                            <option value="">Select an option</option>
                            <option value="Fixed">I have a fixed income</option>
                            <option value="Variable">
                                It varies each month
                            </option>
                        </select>
                        <p>
                            What is your monthly income? (If it varies, please
                            enter your average salary)
                        </p>
                        <input
                            type="number"
                            value={monthlyIncome}
                            onChange={(e) => setMonthlyIncome(e.target.value)}
                            style={inputStyle}
                        />
                        <button onClick={nextPage} style={buttonStyle}>
                            Continue
                        </button>
                    </div>
                )
            case 4:
                return (
                    <div>
                        <h2>Personal Details</h2>
                        <p>What is your monthly expenditure on average?</p>
                        <input
                            type="number"
                            value={monthlyExpenditure}
                            onChange={(e) =>
                                setMonthlyExpenditure(e.target.value)
                            }
                            style={inputStyle}
                        />
                        <button onClick={nextPage} style={buttonStyle}>
                            Continue
                        </button>
                    </div>
                )
            case 5:
                return (
                    <div>
                        <h2>Goals</h2>
                        <p>
                            What would you like to achieve with your finances?
                        </p>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                            }}
                        >
                            {[
                                { label: "Become financially literate" },
                                { label: "Understand monthly budgeting" },
                                { label: "Save more" },
                                { label: "Learn saving strategies" },
                                { label: "Create liquid funds" },
                                { label: "Build an emergency fund" },
                                { label: "Start investing" },
                                { label: "Other" },
                            ].map((goal) => (
                                <div
                                    key={goal.label}
                                    style={{ marginLeft: "5px" }}
                                >
                                    <label
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            id={goal.label}
                                            value={goal.label}
                                            checked={financialGoals.includes(
                                                goal.label
                                            )}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFinancialGoals([
                                                        ...financialGoals,
                                                        goal.label,
                                                    ])
                                                } else {
                                                    setFinancialGoals(
                                                        financialGoals.filter(
                                                            (g) =>
                                                                g !== goal.label
                                                        )
                                                    )
                                                }
                                            }}
                                        />
                                        {goal.label}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <p>What is your investment risk preference?</p>
                        <select
                            value={investmentRiskPreference}
                            onChange={(e) =>
                                setInvestmentRiskPreference(e.target.value)
                            }
                            style={inputStyle}
                        >
                            <option value="">Select an option</option>
                            <option value="High Risk, High Reward">
                                High Risk, High Reward
                            </option>
                            <option value="Medium Risk, Steady Growth">
                                Medium Risk, Steady Growth
                            </option>
                            <option value="Low Risk, Secure Returns">
                                Low Risk, Secure Returns
                            </option>
                        </select>

                        <button onClick={nextPage} style={buttonStyle}>
                            Continue
                        </button>
                    </div>
                )
            case 6:
                return (
                    <div>
                        <h2>Preferences</h2>
                        <p>How frequently would you like to save or invest?</p>
                        <select
                            value={savingFrequency}
                            onChange={(e) => setSavingFrequency(e.target.value)}
                            style={inputStyle}
                        >
                            <option value="">Select an option</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Bi-weekly">Bi-weekly</option>
                            <option value="Monthly">
                                Monthly on a specific day
                            </option>
                        </select>
                        <p>
                            Would you prefer to focus more on saving or
                            investing?
                        </p>
                        <select
                            value={investmentPreference}
                            onChange={(e) =>
                                setInvestmentPreference(e.target.value)
                            }
                            style={inputStyle}
                        >
                            <option value="">Select an option</option>
                            <option value="Saving">Saving</option>
                            <option value="Investing">Investing</option>
                            <option value="Balanced">Balanced approach</option>
                        </select>
                        <button onClick={nextPage} style={buttonStyle}>
                            Continue
                        </button>
                    </div>
                )
            case 7:
                return (
                    <div>
                        <h2>📊 Your Financial Plan</h2>
                        <button onClick={generatePlan} style={buttonStyle}>
                            Generate Plan
                        </button>
                        <div
                            style={resultStyle}
                            dangerouslySetInnerHTML={{ __html: result }}
                        ></div>
                    </div>
                )
            default:
                return <div>Error: Invalid page</div>
        }
    }

    return (
        <div
            style={{
                textAlign: "center",
                padding: "0px",
                fontFamily: "Arial, sans-serif",
            }}
        >
            {renderPage()}
        </div>
    )
}

const inputStyle = {
    padding: "10px",
    margin: "12px",
    borderRadius: "5px",
    backgroundColor: "#F5F5F505",
    border: "1px solid #ccc",
    width: "95%",
}

const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "#000000",
    color: "white",
    width: "100%",
    border: "1px solid #ffffff",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "20px",
}

const resultStyle = {
    backgroundColor: "#f5f5f5",
    padding: "15px",
    borderRadius: "5px",
    textAlign: "left",
    margin: "20px auto",
    width: "100%",
    fontSize: "14px",
    lineHeight: "1.6",
}
