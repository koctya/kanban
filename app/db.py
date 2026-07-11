import os
import sqlite3
from pathlib import Path

DEFAULT_DB_PATH = Path(__file__).resolve().parent.parent / "kanban.db"
DB_PATH = Path(os.getenv("KANBAN_DB_PATH")) if os.getenv("KANBAN_DB_PATH") else DEFAULT_DB_PATH

CREATE_COLUMNS = [
    "Backlog",
    "To Do",
    "In Progress",
    "Review",
    "Done",
]

SEED_CARDS = [
    (0, "Project kickoff", "Define scope and setup initial board."),
    (1, "Design board layout", "Create column headers and card styles."),
    (2, "Implement backend", "Build routes, database, and templates."),
    (3, "Add drag/drop", "Enable moving cards between columns."),
    (4, "Review and polish", "Test and refine UI for launch."),
]

SQL_SCHEMA = [
    "CREATE TABLE IF NOT EXISTS columns (id INTEGER PRIMARY KEY, title TEXT NOT NULL, position INTEGER NOT NULL);",
    "CREATE TABLE IF NOT EXISTS cards (id INTEGER PRIMARY KEY, column_id INTEGER NOT NULL, title TEXT NOT NULL, details TEXT NOT NULL, position INTEGER NOT NULL, FOREIGN KEY(column_id) REFERENCES columns(id));",
]


def get_connection(db_path: Path | None = None):
    path = Path(db_path) if db_path is not None else DB_PATH
    return sqlite3.connect(path)


def init_db(db_path: Path | None = None):
    path = Path(db_path) if db_path is not None else DB_PATH
    path.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(path) as conn:
        for statement in SQL_SCHEMA:
            conn.execute(statement)
        conn.commit()

        existing = conn.execute("SELECT COUNT(1) FROM columns").fetchone()[0]
        if existing == 0:
            for position, title in enumerate(CREATE_COLUMNS):
                conn.execute("INSERT INTO columns (title, position) VALUES (?, ?)", (title, position))
            conn.commit()

        existing_cards = conn.execute("SELECT COUNT(1) FROM cards").fetchone()[0]
        if existing_cards == 0:
            for position, (column_id, title, details) in enumerate(SEED_CARDS):
                conn.execute(
                    "INSERT INTO cards (column_id, title, details, position) VALUES (?, ?, ?, ?)",
                    (column_id + 1, title, details, position),
                )
            conn.commit()


def get_board_state(db_path: Path | None = None):
    with get_connection(db_path) as conn:
        columns = {
            row[0]: {"id": row[0], "title": row[1], "position": row[2], "cards": []}
            for row in conn.execute("SELECT id, title, position FROM columns ORDER BY position").fetchall()
        }
        cards = conn.execute(
            "SELECT id, column_id, title, details, position FROM cards ORDER BY position"
        ).fetchall()
        for card_id, column_id, title, details, position in cards:
            columns[column_id]["cards"].append(
                {"id": card_id, "column_id": column_id, "title": title, "details": details, "position": position}
            )
        return {"columns": columns}


def update_column_title(column_id: int, title: str, db_path: Path | None = None):
    with get_connection(db_path) as conn:
        conn.execute("UPDATE columns SET title = ? WHERE id = ?", (title, column_id))
        conn.commit()


def create_card(column_id: int, title: str, details: str, db_path: Path | None = None):
    with get_connection(db_path) as conn:
        position = conn.execute(
            "SELECT COALESCE(MAX(position), -1) + 1 FROM cards WHERE column_id = ?",
            (column_id,),
        ).fetchone()[0]
        conn.execute(
            "INSERT INTO cards (column_id, title, details, position) VALUES (?, ?, ?, ?)",
            (column_id, title, details, position),
        )
        conn.commit()


def delete_card(card_id: int, db_path: Path | None = None):
    with get_connection(db_path) as conn:
        row = conn.execute("SELECT column_id FROM cards WHERE id = ?", (card_id,)).fetchone()
        if not row:
            return None
        column_id = row[0]
        conn.execute("DELETE FROM cards WHERE id = ?", (card_id,))
        conn.commit()
        return column_id


def move_card(card_id: int, target_column_id: int, db_path: Path | None = None):
    with get_connection(db_path) as conn:
        row = conn.execute("SELECT id FROM cards WHERE id = ?", (card_id,)).fetchone()
        if not row:
            return
        position = conn.execute(
            "SELECT COALESCE(MAX(position), -1) + 1 FROM cards WHERE column_id = ?",
            (target_column_id,),
        ).fetchone()[0]
        conn.execute(
            "UPDATE cards SET column_id = ?, position = ? WHERE id = ?",
            (target_column_id, position, card_id),
        )
        conn.commit()
