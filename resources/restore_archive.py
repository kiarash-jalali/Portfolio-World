"""Recreate and verify the original portfolio migration ZIP from its four parts."""
from pathlib import Path
import hashlib
import os
import tempfile

DIRECTORY = Path(__file__).resolve().parent
NAME = "Portfolio-World_Complete_Migration_2026-10-16.zip"
EXPECTED_SHA256 = "e02a004dbb8ec6e6976612fe9507d089c10419596b75fa9a434cbff8dd7a170a"


def main():
    parts = [DIRECTORY / f"{NAME}.part{i:03d}" for i in range(1, 5)]
    for part in parts:
        if not part.is_file():
            raise SystemExit(f"Missing archive part: {part.name}")
    digest = hashlib.sha256()
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(dir=DIRECTORY, suffix=".tmp", delete=False) as output:
            temporary = Path(output.name)
            for part in parts:
                with part.open("rb") as source:
                    while chunk := source.read(1024 * 1024):
                        output.write(chunk)
                        digest.update(chunk)
        if digest.hexdigest() != EXPECTED_SHA256:
            raise SystemExit("Checksum mismatch: download all four parts again.")
        target = DIRECTORY / NAME
        os.replace(temporary, target)
        print(f"Restored and verified: {target}")
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


if __name__ == "__main__":
    main()
