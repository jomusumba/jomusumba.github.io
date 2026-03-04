import argparse
import re
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMAGES_DIR = ROOT / "images"
HTML_FILES = [ROOT / "index.html", ROOT / "labs.html", ROOT / "cv.html"]

IMAGE_EXTS = {".jpg", ".jpeg", ".png"}


def collect_images(root: Path, recursive: bool) -> list[Path]:
    if not root.exists():
        return []
    if recursive:
        return [p for p in root.rglob("*") if p.suffix.lower() in IMAGE_EXTS]
    return [p for p in root.iterdir() if p.suffix.lower() in IMAGE_EXTS]


def needs_conversion(source: Path, target: Path, force: bool) -> bool:
    if force:
        return True
    if not target.exists():
        return True
    return source.stat().st_mtime > target.stat().st_mtime


def convert_images_to_webp(root: Path, recursive: bool, force: bool, quality: int, dry_run: bool) -> int:
    images = collect_images(root, recursive)
    if not images:
        print("No source images found.")
        return 0

    converted = 0
    for image_path in images:
        webp_path = image_path.with_suffix(".webp")
        if not needs_conversion(image_path, webp_path, force):
            continue
        try:
            if dry_run:
                print(f"[dry-run] Convert {image_path.name} -> {webp_path.name}")
                converted += 1
                continue
            with Image.open(image_path) as img:
                if "A" in img.getbands():
                    img = img.convert("RGBA")
                else:
                    img = img.convert("RGB")
                img.save(webp_path, "WEBP", quality=quality, method=6)
            converted += 1
        except Exception as exc:
            print(f"Failed to convert {image_path.name}: {exc}")

    return converted


def update_html_sources(html_files: list[Path], dry_run: bool) -> int:
    pattern = re.compile(r"(src=)(['\"])(images/[^'\"]+)\.(png|jpg|jpeg)\2", re.IGNORECASE)
    updated_files = 0
    for html_path in html_files:
        if not html_path.exists():
            continue
        content = html_path.read_text(encoding="utf-8")
        updated = pattern.sub(r"\1\2\3.webp\2", content)
        if updated != content:
            if dry_run:
                print(f"[dry-run] Update image sources in {html_path.name}")
            else:
                html_path.write_text(updated, encoding="utf-8")
                print(f"Updated image sources in {html_path.name}.")
            updated_files += 1
    return updated_files


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert images to WebP and update HTML sources.")
    parser.add_argument("--root", default=str(IMAGES_DIR), help="Images directory to scan.")
    parser.add_argument("--recursive", action="store_true", help="Scan subdirectories.")
    parser.add_argument("--force", action="store_true", help="Recreate WebP even if up-to-date.")
    parser.add_argument("--quality", type=int, default=82, help="WebP quality (0-100).")
    parser.add_argument("--dry-run", action="store_true", help="Show changes without writing.")
    parser.add_argument("--no-html", action="store_true", help="Skip HTML updates.")
    args = parser.parse_args()

    root = Path(args.root)
    converted = convert_images_to_webp(root, args.recursive, args.force, args.quality, args.dry_run)
    if not args.no_html:
        update_html_sources(HTML_FILES, args.dry_run)

    if args.dry_run:
        print(f"[dry-run] {converted} image(s) would be converted.")
    else:
        print(f"Converted {converted} image(s) to WebP.")


if __name__ == "__main__":
    main()
