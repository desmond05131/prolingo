import React from 'react';
import { MOCK_PROFILE, MOCK_SUBSCRIPTION_PLANS } from '../../constants';

// Row 5: Subscription info + button
export function SubscriptionSection({ profile = MOCK_PROFILE, onSelectPlan }) {
  const current = profile.subscription?.plan || 'Free';

  return (
    <div className="w-full p-6 rounded-lg bg-white shadow border border-gray-200 flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-800">Subscription</h2>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">Current Plan</span>
            <span className="text-base font-medium text-gray-800">{current}</span>
        </div>
        <div>
          <button
            type="button"
            onClick={() => onSelectPlan?.()}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Buy / Upgrade
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 pt-2">
        {MOCK_SUBSCRIPTION_PLANS.map(plan => (
          <div key={plan.id} className={`border rounded-md px-3 py-2 text-xs flex flex-col gap-1 ${plan.name === current ? 'bg-indigo-50 border-indigo-400' : 'border-gray-200 bg-gray-50'}`}> 
            <span className="font-medium">{plan.name}</span>
            <span>${plan.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
