import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Stats } from "../../components/Stats/Stats";
import { MOCK_SUBSCRIPTION_PLANS_PAID } from "../../constants";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";
import { createClientSubscription, getMyActiveSubscription, unsubscribeClientSubscription } from "../../client-api";
import "../../styles/Home.css";

const formatPrice = (p) => `$${p}`;

function SubscriptionHome() {
  const plans = MOCK_SUBSCRIPTION_PLANS_PAID;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSub, setActiveSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map backend type to our local plan ids
  // Backend types: "month" | "year" (in mock)
  // Local plan ids: "monthly" | "annual"
  const planIdFromType = (type) => {
    if (!type) return null;
    const t = String(type).toLowerCase();
    if (t.startsWith("mon")) return "monthly";
    if (t.startsWith("yr") || t.startsWith("year") || t.startsWith("ann")) return "annual";
    return null;
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getMyActiveSubscription();
        // data: array; choose first with is_active === true
        const current = Array.isArray(data) ? data.find((d) => d?.is_active) : null;
        if (mounted) {
          setActiveSub(current || null);
        }
      } catch (e) {
        if (mounted) setError(e?.message || "Failed to load subscription");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const activePlanId = useMemo(() => planIdFromType(activeSub?.type), [activeSub]);

  const handleSubscribe = async (planId) => {
    // If current plan is active, run unsubscribe
    if (activePlanId && activePlanId === planId) {
      try {
        setLoading(true);
        await unsubscribeClientSubscription();
        toast.success('Unsubscribed successfully');
        // Refresh active state
        const data = await getMyActiveSubscription();
        const current = Array.isArray(data) ? data.find((d) => d?.is_active) : null;
        setActiveSub(current || null);
      } catch (e) {
        const msg = e?.response?.data?.detail || e?.message || 'Failed to unsubscribe';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Find plan metadata
    const plan = plans.find((p) => p.id === planId);
    if (!plan) {
      toast.error('Unknown plan');
      return;
    }

    // Map local plan id to backend type
    const type = planId === 'monthly' ? 'month' : planId === 'annual' ? 'year' : null;
    if (!type) {
      toast.error('Unsupported plan type');
      return;
    }

    try {
      setLoading(true);
      const amount = String(Math.round(Number(plan.price) * 100)); // send cents as string, e.g., 799
      await createClientSubscription({ type, is_renewable: true, amount });
      toast.success('Subscription created. Redirecting to payment...');
      navigate('/subscription/payment', { state: { plan }, replace: true });
    } catch (e) {
      const msg = e?.response?.data?.detail || e?.message || 'Failed to create subscription';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Header Card similar feel to AchievementHeader */}
          <div className="rounded-2xl bg-secondary text-secondary-foreground px-6 py-10 md:py-12 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none" />
            <div className="relative max-w-4xl">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Upgrade Your Learning
              </h1>
              <p className="text-base md:text-lg max-w-2xl font-medium opacity-90">
                Unlock higher XP gains, automatic streak protection and faster
                energy recovery with a Pro subscription.
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={[
                  "relative rounded-xl border p-6 transition-all bg-secondary text-secondary-foreground border-white shadow-lg",
                  // Make each card a flex column so the subscribe button can align at the bottom
                  "flex flex-col",
                ].join(" ")}
              >
                {/* Highlight if this is the active plan */}
                {activePlanId === plan.id && (
                  <div className="absolute inset-0 pointer-events-none rounded-xl ring-2 ring-indigo-500/80" />
                )}
                {plan.featured && (
                  <span
                    className="absolute top-2 right-2 rounded-full bg-indigo-500 text-secondary text-[10px] font-semibold px-2 py-1 shadow-sm transform rotate-25 translate-x-7"
                    style={{
                      // Slight extra letter spacing for readability when rotated
                      letterSpacing: "0.5px"
                    }}
                  >
                    BEST VALUE!!
                  </span>
                )}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight mb-1 flex items-center gap-2">
                      {plan.name}
                    </h2>
                    {activePlanId === plan.id && (
                      <span className="inline-block text-[11px] font-semibold text-indigo-600">Current plan</span>
                    )}
                    {plan.savingsNote && (
                      <div className="text-[11px] font-medium mb-2">
                        {plan.savingsNote}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {plan.priceLabel || formatPrice(plan.price)}
                    </div>
                    <div className="text-[11px] uppercase tracking-wide">
                      {plan.cadence}
                    </div>
                  </div>
                </div>
                <ul className="my-5 space-y-1 text-sm list-disc pl-5 marker:text-secondary-foreground/70">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="leading-snug">
                      {perk}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-4">
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading || (activePlanId && activePlanId !== plan.id)}
                    className="w-full rounded-lg bg-primary text-secondary-foreground text-sm font-semibold py-2.5 hover:bg-primary-600 disabled:opacity-70"
                  >
                    {loading
                      ? "Loading..."
                      : activePlanId === plan.id
                        ? "Unsubscribe"
                        : `Subscribe ${plan.name} Plan`}
                  </button>
                  {activePlanId && activePlanId !== plan.id && (
                    <p className="mt-2 text-xs opacity-80">You already have an active subscription.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionHome;
