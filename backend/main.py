from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

LEETCODE_GRAPHQL = "https://leetcode.com/graphql"

HEADERS = {
    "Content-Type": "application/json",
    "Referer": "https://leetcode.com",
    "Origin": "https://leetcode.com",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
}

@app.get("/")
def read_root():
    return {"status": "ok", "message": "LeetCode GraphQL Proxy API"}

@app.post("/leetcode/graphql")
@app.get("/leetcode/graphql")
async def leetcode_graphql_proxy(payload: dict = None):
    """Proxy LeetCode GraphQL requests to bypass browser CORS."""
    if not payload:
        payload = {
            "query": """
            query userPublicProfile($username: String!) {
              allQuestionsCount { difficulty count }
              matchedUser(username: $username) {
                username
                profile { ranking }
                submitStatsGlobal {
                  acSubmissionNum { difficulty count }
                  totalSubmissionNum { difficulty count }
                }
              }
            }
            """,
            "variables": {"username": "SIRU10"}
        }

    async with httpx.AsyncClient(timeout=12.0) as client:
        try:
            response = await client.post(
                LEETCODE_GRAPHQL,
                json=payload,
                headers=HEADERS,
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=502, detail=str(e))
