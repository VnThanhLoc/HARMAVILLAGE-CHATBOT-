from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import pandas as pd
import os
from difflib import SequenceMatcher


try:
    from google import genai
    from google.genai import types
except Exception:
    genai = None
    types = None

load_dotenv()

app = Flask(__name__)


# ==========================
# GEMINI SETUP
# ==========================

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

SYSTEM_PROMPT = """
You are PharmaVillage Assistant.

Purpose:
Provide educational information about medications, drug classes, side effects, alcohol interactions, and medical conditions.

Rules:
1. Never diagnose diseases.
2. Never recommend treatments.
3. Never tell a user to start or stop medication.
4. Never replace professional medical advice.
5. Base answers on the provided drug database.
6. If the name seems missing or misspelled, ask the user to clarify.
7. If the drug seems to have many names (separated by a slash /), accept all names as valid.
8. Accept drug name, generic name, or any brand name as valid when asked about a drug.
9. For each point, separate with a comma instead of a star.
10. If information is unavailable, say so.
11. Be friendly, use formal, simple language.
12. If the user ask an irrelevant question, politely redirect to drug information.
"""

# ==========================
# LOAD CSV
# ==========================

df = pd.read_csv(
    "data/drugs_side_effects.csv"
)

# ==========================
# SEARCH DRUGS
# ==========================

def find_drug(question):

    question = question.lower()

    best_match = None
    best_score = 0

    search_columns = [
        "drug_name",
        "generic_name",
        "brand_names"
    ]

    for _, row in df.iterrows():

        for column in search_columns:

            value = str(
                row.get(column, "")
            ).lower()

            if not value:
                continue

            score = SequenceMatcher(
                None,
                question,
                value
            ).ratio()

            if score > best_score:
                best_score = score
                best_match = row

    if best_score > 0.1:
        return best_match

    return None


# ==========================
# WEB ROUTES
# ==========================

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/provider")
def provider():
    return render_template("provider.html")

@app.route("/drugs")
def drugs():
    return render_template("drugs.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/covid")
def covid():
    return render_template("covid.html")

@app.route("/mission")
def mission():
    return render_template("mission.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/signup")
def signup():
    return render_template("signup.html")

@app.route("/welcome")
def welcome():
    return render_template("welcome.html")

@app.route("/chatbot")
def chatbot_page():
    return render_template("chatbot.html")


@app.route("/chat", methods=["POST"])
def chatbot():

    user_message = request.json["message"]

    drug = find_drug(user_message)

    context = ""

    if drug is not None:

        context = f"""
Drug Name:
{drug.get('drug_name', 'Unknown')}

Generic Name:
{drug.get('generic_name', 'Unknown')}

Brand Names:
{drug.get('brand_names', 'Unknown')}

Drug Class:
{drug.get('drug_classes', 'Unknown')}

Medical Condition:
{drug.get('medical_condition', 'Unknown')}

Condition Description:
{drug.get('medical_condition_description', 'Unknown')}

Side Effects:
{drug.get('side_effects', 'Unknown')}

Pregnancy Category:
{drug.get('pregnancy_category', 'Unknown')}

Alcohol Interaction:
{drug.get('alcohol', 'Unknown')}

Rating:
{drug.get('rating', 'Unknown')}

Reviews:
{drug.get('no_of_reviews', 'Unknown')}
"""

    prompt = f"""
Drug Database Information:

{context}

User Question:

{user_message}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            temperature=0.2,
            max_output_tokens=1000
        )
    )

    return jsonify({
        "reply": response.text
    })


if __name__ == "__main__":
    app.run(debug=True)