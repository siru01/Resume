from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from data import profile, experience, projects, blogs

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/profile")
def get_profile():
    return profile

@app.get("/api/experience")
def get_experience():
    return experience

@app.get("/api/projects")
def get_projects():
    return projects

@app.get("/api/blogs")
def get_blogs():
    return blogs