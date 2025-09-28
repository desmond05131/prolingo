from premium.models import PremiumSubscription
from datetime import timedelta
from .constants import (
    ENERGY_REGEN_INTERVAL_FREE,
    MONTHLY_REGEN_BOOST,
    YEARLY_REGEN_BOOST,
    MONTHLY_XP_BOOST,
    YEARLY_XP_BOOST,
    STREAK_SAVER_LIMIT_MONTHLY,
    STREAK_SAVER_LIMIT_YEARLY,
)


def user_has_active_premium(user) -> bool:
    """Return True if user has an active premium subscription."""
    if not user or not user.is_authenticated:
        return False
    # Using .filter(...).exists() to avoid hitting save() custom logic
    return PremiumSubscription.objects.filter(user=user, status=PremiumSubscription.Status.ACTIVE).exists()

def get_user_active_subscription(user) -> PremiumSubscription | None:
    if not user or not user.is_authenticated:
        return None
    return (
        PremiumSubscription.objects.filter(user=user, status=PremiumSubscription.Status.ACTIVE)
        .order_by("-updated_at")
        .first()
    )


def get_regen_interval_for_user(user) -> timedelta:
    """Return energy regen interval for the user considering premium plan boosts.

    Lower interval == faster regen. Boost reduces the free interval accordingly.
    """
    base = ENERGY_REGEN_INTERVAL_FREE
    sub = get_user_active_subscription(user)
    if not sub:
        return base
    if sub.type == PremiumSubscription.SubscriptionType.MONTH:
        return timedelta(seconds=base.total_seconds() * (1 - MONTHLY_REGEN_BOOST))
    if sub.type == PremiumSubscription.SubscriptionType.YEAR:
        return timedelta(seconds=base.total_seconds() * (1 - YEARLY_REGEN_BOOST))
    return base


def get_streak_saver_limit_for_user(user) -> int:
    sub = get_user_active_subscription(user)
    if not sub:
        return 0
    if sub.type == PremiumSubscription.SubscriptionType.MONTH:
        return STREAK_SAVER_LIMIT_MONTHLY
    if sub.type == PremiumSubscription.SubscriptionType.YEAR:
        return STREAK_SAVER_LIMIT_YEARLY
    return 0


def get_xp_boost_multiplier_for_user(user) -> float:
    """Return a multiplier >= 1.0 to apply to base XP earnings.

    Monthly: +20% => 1.2x, Yearly: +25% => 1.25x, Non-premium: 1.0x.
    """
    sub = get_user_active_subscription(user)
    if not sub:
        return 1.0
    if sub.type == PremiumSubscription.SubscriptionType.MONTH:
        return 1.0 + MONTHLY_XP_BOOST
    if sub.type == PremiumSubscription.SubscriptionType.YEAR:
        return 1.0 + YEARLY_XP_BOOST
    return 1.0


__all__ = [
    "user_has_active_premium",
    "get_user_active_subscription",
    "get_regen_interval_for_user",
    "get_streak_saver_limit_for_user",
    "get_xp_boost_multiplier_for_user",
]
