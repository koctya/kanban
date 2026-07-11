import os
import tempfile
from pathlib import Path

os.environ["KANBAN_DB_PATH"] = str(Path(tempfile.mktemp(suffix=".db")))

from fastapi.testclient import TestClient
from main import app
from app.db import init_db, get_board_state, DB_PATH

client = TestClient(app)

def setup_module():
    if DB_PATH.exists():
        os.remove(DB_PATH)
    init_db()


def teardown_module():
    if DB_PATH.exists():
        os.remove(DB_PATH)


def test_board_loads():
    response = client.get("/")
    assert response.status_code == 200
    assert "Kanban Board" in response.text
    assert "name=\"column_id\"" in response.text
    assert "name=\"title\"" in response.text
    assert "name=\"details\"" in response.text


def test_create_card():
    response = client.post("/cards/add", data={"column_id": 1, "title": "Test card", "details": "Test details"})
    assert response.status_code in (200, 303)
    board = get_board_state()
    assert any(card["title"] == "Test card" for card in board["columns"][1]["cards"])


def test_delete_card():
    board = get_board_state()
    card = board["columns"][1]["cards"][0]
    response = client.post(f"/cards/{card['id']}/delete", data={"card_id": card['id']})
    assert response.status_code in (200, 303)
    board = get_board_state()
    assert not any(c["id"] == card["id"] for c in board["columns"][1]["cards"])


def test_move_card_route():
    board = get_board_state()
    source_column = board["columns"][1]
    target_column_id = 2
    if not source_column["cards"]:
        client.post("/cards/add", data={"column_id": 1, "title": "Move route", "details": "Route move test"})
        board = get_board_state()
        source_column = board["columns"][1]
    card = source_column["cards"][0]
    response = client.post(f"/cards/{card['id']}/move", data={"target_column_id": target_column_id})
    assert response.status_code in (200, 303)
    board = get_board_state()
    assert any(c["id"] == card["id"] for c in board["columns"][target_column_id]["cards"])
