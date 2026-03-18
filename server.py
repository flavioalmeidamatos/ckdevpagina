from __future__ import annotations

import json
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
SUBMISSIONS_FILE = DATA_DIR / "diagnosticos.jsonl"
HOST = "0.0.0.0"
PORT = 4173


class SiteHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def _send_json(self, payload: dict, status: HTTPStatus) -> None:
        encoded = json.dumps(payload, ensure_ascii=True).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

    def do_POST(self) -> None:  # noqa: N802
        if self.path != "/api/diagnosticos":
            self._send_json({"ok": False, "error": "not_found"}, HTTPStatus.NOT_FOUND)
            return

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            self._send_json({"ok": False, "error": "invalid_length"}, HTTPStatus.BAD_REQUEST)
            return

        if content_length <= 0:
            self._send_json({"ok": False, "error": "empty_body"}, HTTPStatus.BAD_REQUEST)
            return

        raw_body = self.rfile.read(content_length)
        try:
            payload = json.loads(raw_body.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self._send_json({"ok": False, "error": "invalid_json"}, HTTPStatus.BAD_REQUEST)
            return

        name = str(payload.get("name", "")).strip()
        email = str(payload.get("email", "")).strip()
        message = str(payload.get("message", "")).strip()

        if not name or not email or not message:
            self._send_json({"ok": False, "error": "missing_fields"}, HTTPStatus.BAD_REQUEST)
            return

        record = {
            "created_at": datetime.now(timezone.utc).isoformat(),
            "name": name,
            "email": email,
            "message": message,
            "user_agent": self.headers.get("User-Agent", ""),
            "origin": self.client_address[0],
        }

        DATA_DIR.mkdir(parents=True, exist_ok=True)
        with SUBMISSIONS_FILE.open("a", encoding="utf-8") as fp:
            fp.write(json.dumps(record, ensure_ascii=False) + "\n")

        self._send_json(
            {
                "ok": True,
                "message": "Diagnostico recebido com sucesso.",
            },
            HTTPStatus.OK,
        )


def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), SiteHandler)
    print(f"Serving CKDEV site on http://{HOST}:{PORT}/")
    server.serve_forever()


if __name__ == "__main__":
    main()
