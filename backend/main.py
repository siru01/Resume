from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Changed function name to 'render_home'
@app.get("/", response_class=HTMLResponse)
async def read_items(request: Request):
    return templates.TemplateResponse(
        request=request, name="index.html", 
    )

# Kept this as 'read_item'
@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id, "status": "active"}