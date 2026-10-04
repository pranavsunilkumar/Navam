from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Welcome to FinAI API"}


@app.get("/compound-interest")
def calculate_interest(years: int, principal: float, rate: float, frequency: int):
    data_points = []

    # Convert whole number rate (e.g., 5) to a decimal (0.05) for the math
    decimal_rate = rate / 100

    for i in range(0, years + 1):
        # Swap the hardcoded numbers for our new variables!
        amount = principal * (1 + decimal_rate / frequency) ** (frequency * i)

        data_points.append({
            "year": f"Year {i}",
            "value": round(amount, 2)
        })

    return data_points


# ---------------------------------------------------------------------------
# 🕵️ OPERATIVE PROFILE
# ---------------------------------------------------------------------------

# Assumed long-run annual returns (%) for each risk doctrine.
RISK_RETURNS = {"conservative": 5.0, "balanced": 8.0, "aggressive": 11.0}

# Same 6% "silent drain" used in Episode I of the Compound Protocol.
INFLATION_RATE = 6.0

# (minimum score, rank title) - highest first is resolved in code below.
RANKS = [
    (0, "Recruit"),
    (25, "Field Agent"),
    (50, "Specialist"),
    (70, "Commander"),
    (85, "Architect"),
]


class ProfileInput(BaseModel):
    monthly_income: float = Field(ge=0)
    monthly_expenses: float = Field(ge=0)
    current_savings: float = Field(ge=0)
    monthly_investment: float = Field(ge=0)
    risk_profile: Literal["conservative", "balanced", "aggressive"] = "balanced"
    target_amount: float = Field(gt=0)
    target_years: int = Field(ge=1, le=50)


def future_value(start: float, monthly: float, annual_rate_pct: float, months: int) -> float:
    """Balance after `months` of monthly compounding with a monthly contribution."""
    i = annual_rate_pct / 100 / 12
    growth = (1 + i) ** months
    return start * growth + monthly * ((growth - 1) / i)


def money(value: float) -> str:
    return f"${value:,.0f}"


def analyze_profile(p: ProfileInput) -> dict:
    rate = RISK_RETURNS[p.risk_profile]
    months = p.target_years * 12
    i = rate / 100 / 12

    # --- Projection (one point per year) -----------------------------------
    projection = []
    for y in range(0, p.target_years + 1):
        projection.append({
            "year": y,
            "value": round(future_value(p.current_savings, p.monthly_investment, rate, y * 12), 2),
            "contributed": round(p.current_savings + p.monthly_investment * 12 * y, 2),
        })

    projected = projection[-1]["value"]
    contributed = projection[-1]["contributed"]
    real_value = projected / ((1 + INFLATION_RATE / 100) ** p.target_years)
    coverage = projected / p.target_amount  # 1.0 == target reached

    # --- Monthly investment needed to hit the target ------------------------
    growth = (1 + i) ** months
    gap = p.target_amount - p.current_savings * growth
    required_monthly = 0.0 if gap <= 0 else gap * i / (growth - 1)

    # --- Budget health -------------------------------------------------------
    surplus = p.monthly_income - p.monthly_expenses
    invest_rate = (p.monthly_investment / p.monthly_income) if p.monthly_income > 0 else 0.0
    if p.monthly_expenses > 0:
        runway = p.current_savings / p.monthly_expenses
    else:
        runway = 12.0 if p.current_savings > 0 else 0.0  # no expenses entered: don't reward an empty profile
    overspend = max(0.0, p.monthly_investment - surplus)

    # For scoring, only money you can actually afford to invest counts.
    affordable = min(p.monthly_investment, max(surplus, 0.0))
    affordable_rate = (affordable / p.monthly_income) if p.monthly_income > 0 else 0.0

    # --- Readiness score (0-100) ---------------------------------------------
    score_parts = {
        "investing": min(affordable_rate / 0.20, 1.0) * 35,   # invest 20% of income = full marks
        "runway": min(runway / 6, 1.0) * 25,              # 6 months of expenses = full marks
        "goal": min(coverage, 1.0) * 30,                  # reaching the target = full marks
        "budget": 10.0 if (p.monthly_income > 0 and overspend == 0) else 0.0,
    }
    score = round(sum(score_parts.values()))

    rank_index = 0
    for idx, (minimum, _) in enumerate(RANKS):
        if score >= minimum:
            rank_index = idx
    rank = RANKS[rank_index][1]
    next_rank = RANKS[rank_index + 1] if rank_index + 1 < len(RANKS) else None

    # --- Directives (plain-language next steps) ------------------------------
    directives = []

    if p.monthly_income <= 0:
        directives.append({"level": "warning",
                           "text": "Enter your monthly income to unlock savings-rate analysis."})
    elif overspend > 0:
        directives.append({"level": "critical",
                           "text": f"You invest {money(overspend)} more per month than your surplus allows. "
                                   f"Lower the investment or cut expenses."})

    if p.monthly_expenses > 0:
        if runway < 3:
            directives.append({"level": "critical",
                               "text": f"Your savings cover {runway:.1f} months of expenses. "
                                       f"Build an emergency fund of at least 3 months before taking more risk."})
        elif runway < 6:
            directives.append({"level": "warning",
                               "text": f"Your savings cover {runway:.1f} months of expenses. 6 months is the safer target."})
        else:
            directives.append({"level": "ok",
                               "text": f"Your emergency fund covers {runway:.1f} months of expenses."})

    if p.monthly_income > 0:
        if invest_rate < 0.10:
            directives.append({"level": "warning",
                               "text": f"You invest {invest_rate * 100:.0f}% of your income. Aim for 20%."})
        elif invest_rate < 0.20:
            directives.append({"level": "warning",
                               "text": f"You invest {invest_rate * 100:.0f}% of your income. You are close to the 20% mark."})
        elif overspend == 0:
            directives.append({"level": "ok",
                               "text": f"You invest {invest_rate * 100:.0f}% of your income, which meets the 20% mark."})

    if coverage >= 1:
        directives.append({"level": "ok",
                           "text": f"At this pace you pass your target by {money(projected - p.target_amount)}."})
    else:
        directives.append({"level": "warning",
                           "text": f"At this pace you reach {coverage * 100:.0f}% of your target. "
                                   f"Investing {money(required_monthly)} per month closes the gap."})

    return {
        "rate": rate,
        "inflation": INFLATION_RATE,
        "projected_value": round(projected, 2),
        "contributed": round(contributed, 2),
        "growth_earned": round(projected - contributed, 2),
        "real_value": round(real_value, 2),
        "goal_coverage": round(coverage * 100, 1),
        "required_monthly": round(required_monthly, 2),
        "surplus": round(surplus, 2),
        "invest_rate": round(invest_rate * 100, 1),
        "runway_months": round(runway, 1),
        "score": score,
        "score_parts": {k: round(v, 1) for k, v in score_parts.items()},
        "rank": rank,
        "next_rank": next_rank[1] if next_rank else None,
        "points_to_next": (next_rank[0] - score) if next_rank else 0,
        "directives": directives,
        "projection": projection,
    }


@app.post("/profile-analysis")
def profile_analysis(profile: ProfileInput):
    return analyze_profile(profile)