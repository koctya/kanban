import os
import socket
import subprocess
import tempfile
import time
from pathlib import Path

import httpx
import pytest
from playwright.sync_api import sync_playwright

SERVER_HOST = "127.0.0.1"

def find_free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind((SERVER_HOST, 0))
        return sock.getsockname()[1]

@pytest.fixture(scope="session")
def server_process():
    db_path = Path(tempfile.mktemp(suffix=".db"))
    os.environ["KANBAN_DB_PATH"] = str(db_path)
    port = find_free_port()
    server_url = f"http://{SERVER_HOST}:{port}"
    process = subprocess.Popen(
        ["uv", "run", "uvicorn", "main:app", "--port", str(port)],
        cwd="/Users/kal/code/ai/kanban",
        env=os.environ.copy(),
    )

    for _ in range(30):
        try:
            response = httpx.get(server_url, timeout=1.0)
            if response.status_code == 200:
                break
        except Exception:
            time.sleep(0.5)
    else:
        process.terminate()
        process.wait(timeout=10)
        pytest.fail("Server failed to start for Playwright test")

    yield server_url

    process.terminate()
    process.wait(timeout=10)

def test_drag_and_drop_card(server_process):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(server_process)
        page.wait_for_selector("#board-grid")

        assert page.locator("text=Project kickoff").count() == 1

        card = page.locator(".card", has_text="Project kickoff").first
        target = page.locator("#column-2 .card-list")

        card.drag_to(target)

        page.wait_for_timeout(1000)
        assert page.locator("#column-2 .card", has_text="Project kickoff").count() == 1
        browser.close()
