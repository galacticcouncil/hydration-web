"""Build smaller Latin font faces; the original fonts remain the Unicode fallback.

Run with Python and fonttools[woff] installed. No application dependency is needed.
Keep these ranges in sync with the Latin @font-face rules in src/app/globals.css.
"""

from pathlib import Path

from fontTools import subset
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
RANGES = [
    (0x0000, 0x00FF), (0x0131, 0x0131), (0x0152, 0x0153),
    (0x02BB, 0x02BC), (0x02C6, 0x02C6), (0x02DA, 0x02DA),
    (0x02DC, 0x02DC), (0x2000, 0x206F), (0x20A0, 0x20CF),
    (0x2113, 0x2113), (0x2122, 0x2122), (0x2190, 0x2199),
    (0x2212, 0x2212), (0x2215, 0x2215), (0xFEFF, 0xFEFF),
    (0xFFFD, 0xFFFD),
]
UNICODES = {code for start, end in RANGES for code in range(start, end + 1)}
SOURCES = [
    "geist/geist.woff2",
    "gazpacho/Gazpacho-Medium.woff2",
    "gazpacho/Gazpacho-Italic-Regular.woff2",
    "gazpacho/Gazpacho-Regular.woff2",
]


def verify(source, output):
    original, compact = TTFont(source), TTFont(output)
    original_map, compact_map = original.getBestCmap(), compact.getBestCmap()
    assert set(compact_map) == set(original_map) & UNICODES
    for code, glyph in compact_map.items():
        assert glyph == original_map[code]
        assert compact["hmtx"][glyph] == original["hmtx"][glyph]
    locations = [None]
    if "fvar" in original:
        assert original["fvar"].compile(original) == compact["fvar"].compile(compact)
        locations += [{"wght": weight} for weight in (100, 400, 500, 700, 900)]
    for location in locations:
        original_glyphs = original.getGlyphSet(location=location)
        compact_glyphs = compact.getGlyphSet(location=location)
        for glyph in compact_map.values():
            before = DecomposingRecordingPen(original_glyphs)
            after = DecomposingRecordingPen(compact_glyphs)
            original_glyphs[glyph].draw(before)
            compact_glyphs[glyph].draw(after)
            assert before.value == after.value, (source, glyph, location)


for name in SOURCES:
    source = ROOT / "public/font" / name
    output = source.with_name(source.stem + "-latin.woff2")
    font = TTFont(source, recalcTimestamp=False)
    options = subset.Options()
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.name_languages = ["*"]
    options.glyph_names = True
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=UNICODES)
    subsetter.subset(font)
    font.save(output)
    verify(source, output)
    print(f"{name}: {source.stat().st_size:,} -> {output.stat().st_size:,} bytes; verified")
