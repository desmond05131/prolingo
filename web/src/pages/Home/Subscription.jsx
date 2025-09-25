import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Stats } from "../../components/Stats/Stats";
import { MOCK_SUBSCRIPTION_PLANS_PAID } from "../../constants";
import "../../styles/Home.css";

const formatPrice = (p) => `$${p}`;

function SubscriptionHome() {
  const plans = MOCK_SUBSCRIPTION_PLANS_PAID;
  const handleSubscribe = (planId) => {
    console.log("Subscribing to plan", planId);
    alert(`Subscribed to ${planId} (mock)`);
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

          <div className="grid gap-6 md:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={[
                  "relative rounded-xl border p-6 transition-all bg-secondary text-secondary-foreground border-white shadow-lg",
                  // Make each card a flex column so the subscribe button can align at the bottom
                  "flex flex-col"
                ].join(" ")}
              >
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
                    className="w-full rounded-lg bg-primary text-secondary-foreground text-sm font-semibold py-2.5 hover:bg-primary-600"
                  >
                    Subscribe {plan.name} Plan
                  </button>
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
