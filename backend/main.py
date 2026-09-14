from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
        amount = principal * (1 + decimal_rate/frequency) ** (frequency * i)
        
        data_points.append({
            "year": f"Year {i}",
            "value": round(amount, 2)
        })
        
    return data_points