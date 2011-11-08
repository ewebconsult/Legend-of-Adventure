var jgassets = {
    "npc.spr.left":
        {"type": "sequence",
         "duration": 14, "positions": 2,
         "sequence": [
            {"sprite": {"x": 0, "y": 32, "swidth": 32, "sheight": 32}},
            {"sprite": {"x": 64, "y": 32, "swidth": 32, "sheight": 32}}
         ]},
    "npc.spr.right":
        {"type": "sequence",
         "duration": 14, "positions": 2,
         "sequence": [
            {"sprite": {"x": 0, "y": 64, "swidth": 32, "sheight": 32}},
            {"sprite": {"x": 64, "y": 64, "swidth": 32, "sheight": 32}}
         ]},
    "npc.spr.down":
        {"type": "sequence",
         "duration": 14, "positions": 2,
         "sequence": [
            {"sprite": {"x": 0, "y": 0, "swidth": 32, "sheight": 32}},
            {"sprite": {"x": 64, "y": 0, "swidth": 32, "sheight": 32}}
         ]},
    "npc.spr.up":
        {"type": "sequence",
         "duration": 14, "positions": 2,
         "sequence": [
            {"sprite": {"x": 0, "y": 96, "swidth": 32, "sheight": 32}},
            {"sprite": {"x": 64, "y": 96, "swidth": 32, "sheight": 32}}
         ]},
    "npc.static.left": {"type": "static", "sprite": {"x": 32, "y": 32, "swidth": 32, "sheight": 32}},
    "npc.static.right": {"type": "static", "sprite": {"x": 32, "y": 64, "swidth": 32, "sheight": 32}},
    "npc.static.down": {"type": "static", "sprite": {"x": 32, "y": 0, "swidth": 32, "sheight": 32}},
    "npc.static.up": {"type": "static", "sprite": {"x": 32, "y": 96, "swidth": 32, "sheight": 32}},
    "weapon_order": ["sw", "bo", "ma", "ax", "ha", "st"],
    "weapon_prefixes_order": ["plain", "forged", "sharp", "broad", "old", "leg", "fla", "agile", "bane", "ench", "evil", "spite", "ether", "ancie"],
    "weapon_prefixes": {
        "plain": ["Plain", 0],
        "forged": ["Forged", 1],
        "sharp": ["Sharp", 2],
        "broad": ["Broad", 3],
        "old": ["Old", 4],
        "leg": ["Legendary", 5],
        "fla": ["Flaming", 6],
        "agile": ["Agile", 7],
        "bane": ["Baneful", 8],
        "ench": ["Enchanted", 9],
        "evil": ["Evil", 10],
        "spite": ["Spiteful", 11],
        "ether": ["Ether", 12],
        "ancie": ["Ancient", 13]
    }
};