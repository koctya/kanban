from fastapi import FastAPI, Request, Form, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse
from jinja2 import Environment, FileSystemLoader, select_autoescape
from app.db import init_db, get_board_state, update_column_title, create_card, delete_card, move_card

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

jinja_env = Environment(
    loader=FileSystemLoader("templates"),
    autoescape=select_autoescape(["html", "xml"]),
)

def render_template(template_name: str, **context) -> HTMLResponse:
    return HTMLResponse(jinja_env.get_template(template_name).render(**context))

@app.on_event("startup")
async def startup_event():
    init_db()

@app.get("/", response_class=HTMLResponse)
async def board_view(request: Request):
    board = get_board_state()
    return render_template("index.html", request=request, board=board)

@app.post("/columns/{column_id}/rename")
async def rename_column(request: Request, column_id: int, title: str = Form(...)):
    update_column_title(column_id, title.strip() or "Untitled")
    board = get_board_state()
    if "HX-Request" in request.headers:
        return render_template("partials/column_header.html", request=request, column=board["columns"][column_id])
    return RedirectResponse(url="/", status_code=status.HTTP_303_SEE_OTHER)

@app.post("/cards/add")
async def add_card(request: Request, column_id: int = Form(...), title: str = Form(...), details: str = Form("")):
    create_card(column_id, title.strip() or "New card", details.strip())
    board = get_board_state()
    if "HX-Request" in request.headers:
        return render_template("partials/cards.html", request=request, cards=board["columns"][column_id]["cards"])
    return RedirectResponse(url="/", status_code=status.HTTP_303_SEE_OTHER)

@app.post("/cards/{card_id}/delete")
async def remove_card(request: Request, card_id: int):
    column_id = delete_card(card_id)
    board = get_board_state()
    if "HX-Request" in request.headers and column_id is not None:
        return render_template("partials/cards.html", request=request, cards=board["columns"][column_id]["cards"])
    return RedirectResponse(url="/", status_code=status.HTTP_303_SEE_OTHER)

@app.post("/cards/{card_id}/move")
async def move_card_endpoint(request: Request, card_id: int, target_column_id: int = Form(...)):
    move_card(card_id, target_column_id)
    board = get_board_state()
    if "HX-Request" in request.headers:
        return render_template("partials/board_columns.html", request=request, board=board)
    return RedirectResponse(url="/", status_code=status.HTTP_303_SEE_OTHER)
