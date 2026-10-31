#!/usr/bin/env python3
"""Build an animated Azure architecture diagram (self-contained HTML) from a JSON spec.
Usage: python3 build_diagram.py spec.json icons_dir template.html out.html
Icons are resolved by slug from the official Microsoft zip (e.g. 10061-icon-service-Virtual-Networks.svg)
or the fallback extracted set (virtual-networks.svg). Unresolved icons are reported and drawn as placeholders."""
import base64, json, re, sys
from pathlib import Path
 
def slug(name: str) -> str:
    s = Path(name).stem.lower()
    s = re.sub(r"^\d+-icon-service-", "", s)       # official zip prefix
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s
 
def index_icons(root: Path) -> dict:
    idx = {}
    for p in root.rglob("*.svg"):
        idx.setdefault(slug(p.name), p)
    return idx
 
def resolve(name, idx):
    k = slug(name)
    if k in idx: return idx[k]
    for cand in (k + "s", k.rstrip("s"), "azure-" + k):   # plural / prefix variants
        if cand in idx: return idx[cand]
    flat = {s.replace("-", ""): s for s in idx}             # ExpressRoute vs express-route
    if k.replace("-", "") in flat: return idx[flat[k.replace("-", "")]]
    hits = sorted([s for s in idx if k in s], key=len)
    return idx[hits[0]] if hits else None
 
def main():
    spec_p, icons_p, tpl_p, out_p = map(Path, sys.argv[1:5])
    spec = json.loads(spec_p.read_text())
    idx = index_icons(icons_p)
    wanted = {n["icon"] for n in spec.get("nodes", []) if n.get("icon")}
    wanted |= {"virtual-networks", "subnet"}
    icons, missing = {}, []
    for name in sorted(wanted):
        p = resolve(name, idx)
        if p is None: missing.append(name); continue
        icons[name] = "data:image/svg+xml;base64," + base64.b64encode(p.read_bytes()).decode()
    html = tpl_p.read_text().replace("/*__SPEC__*/null", json.dumps(spec)).replace("/*__ICONS__*/null", json.dumps(icons))
    html = html.replace("__TITLE__", spec.get("title", "Azure architecture"))
    out_p.write_text(html)
    print(f"wrote {out_p} | icons resolved: {len(icons)} | missing: {missing or 'none'}")
    if missing:
        sugg = {m: [s for s in idx if any(t in s for t in slug(m).split('-') if len(t) > 3)][:6] for m in missing}
        print("suggestions:", json.dumps(sugg, indent=1))
 
if __name__ == "__main__":
    main()
