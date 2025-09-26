from __future__ import annotations


def get_level_up_xp(level: int) -> int:
    """XP required to advance from the given level to the next.

    Mirrors the simple linear progression used in the older stats module:
    required_xp = level * 50 + 50 (i.e., 100 for L1->L2, 150 for L2->L3, ...)
    """
    if level < 1:
        level = 1
    return level * 50 + 50


def compute_level_from_total_xp(total_xp: int) -> int:
    """Compute the user's level based solely on their total XP.

    - Starts at level 1.
    - Each subsequent level requires an increasing amount of XP defined by get_level_up_xp.
    - This derives a level without needing a separate "xp toward next level" field.
    """
    if total_xp is None or total_xp <= 0:
        return 1

    level = 1
    xp_remaining = int(total_xp)
    while True:
        req = get_level_up_xp(level)
        if xp_remaining < req:
            break
        xp_remaining -= req
        level += 1
    return level
