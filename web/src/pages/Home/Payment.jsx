import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { payClientSubscription } from '../../client-api';
import { useToast } from '../../hooks/use-toast';

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Optional plan info passed from Subscription page
  const plan = location.state?.plan || null;

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const onPay = async () => {
    try {
      setLoading(true);
      await payClientSubscription();
      toast.success('Payment successful');
      navigate('/subscription', { replace: true });
    } catch (e) {
      const msg = e?.response?.data?.detail || e?.message || 'Payment failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="rounded-2xl bg-secondary text-secondary-foreground px-6 py-6 shadow-sm">
            <h1 className="text-2xl font-bold mb-1">Complete Payment</h1>
            <p className="text-sm opacity-80">
              {plan ? `You are paying for the ${plan.name} plan.` : 'Please review and submit your payment details.'}
            </p>
          </div>

          <div className="rounded-xl border border-white bg-secondary text-secondary-foreground p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name on Card</label>
              <input
                className="w-full rounded-md border border-white bg-transparent px-3 py-2"
                placeholder="Jane Developer"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Card Number</label>
              <input
                className="w-full rounded-md border border-white bg-transparent px-3 py-2"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Expiry</label>
                <input
                  className="w-full rounded-md border border-white bg-transparent px-3 py-2"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CVV</label>
                <input
                  className="w-full rounded-md border border-white bg-transparent px-3 py-2"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={onPay}
              disabled={loading}
              className="w-full rounded-lg bg-primary text-secondary-foreground text-sm font-semibold py-2.5 hover:bg-primary-600 disabled:opacity-70"
            >
              {loading ? 'Processing...' : 'Pay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
