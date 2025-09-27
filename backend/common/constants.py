from datetime import timedelta

# Base energy regen interval (free users)
ENERGY_REGEN_INTERVAL_FREE = timedelta(minutes=10)

# Subscription type boosts (percent faster regen)
MONTHLY_REGEN_BOOST = 0.25  # 25%
YEARLY_REGEN_BOOST = 0.35  # 35%

# XP boost percentages by subscription type
MONTHLY_XP_BOOST = 0.20  # 20%
YEARLY_XP_BOOST = 0.25  # 25%

# Energy cap (optional; set None to disable cap)
ENERGY_MAX = 100

# Streak saver monthly usage limit per subscription type
STREAK_SAVER_LIMIT_MONTHLY = 1
STREAK_SAVER_LIMIT_YEARLY = 2

XP_AWARD_PER_TEST = 10
XP_AWARD_PER_PRACTICE = 5
ENERGY_COST_PER_TEST = 5
ENERGY_COST_PER_PRACTICE = 2

__all__ = [
    "ENERGY_REGEN_INTERVAL_FREE",
    "MONTHLY_REGEN_BOOST",
    "YEARLY_REGEN_BOOST",
    "MONTHLY_XP_BOOST",
    "YEARLY_XP_BOOST",
    "ENERGY_MAX",
    "STREAK_SAVER_LIMIT_MONTHLY",
    "STREAK_SAVER_LIMIT_YEARLY",
    "XP_AWARD_PER_TEST",
    "XP_AWARD_PER_PRACTICE",
    "ENERGY_COST_PER_TEST",
    "ENERGY_COST_PER_PRACTICE",
]
