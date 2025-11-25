import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { MOCK_PRODUCTS } from './constants';
import { Product, Order, PaymentMethod } from './types';
import { Receipt } from './components/Receipt';
import { AdminPanel } from './components/AdminPanel';
import { PrintPage } from './components/PrintPage';
import { judgeFreeRequest, generateReceiptMessage } from './services/geminiService';
import { ShoppingBag, Star, Box, ShieldCheck, Zap, Loader2 } from 'lucide-react';

// Sub-components inside App.tsx to keep file count low while maintaining structure
// In a larger app, these would be in components/ folder

const ProductCard: React.FC<{ product: Product; onBuy: (p: Product) => void }> = ({ product, onBuy }) => (
  <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-700 group flex flex-col h-full">
    <div className="p-6 flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{product.name}</h3>
        <span className="text-orange-400 font-bold font-mono text-lg">
          {product.id === '5' ? '€???' : `€${product.price.toFixed(2)}`}
        </span>
      </div>
      
      <div className="mb-4">
         <span className="inline-block bg-slate-700 px-2 py-1 rounded text-xs font-bold text-slate-300 border border-slate-600">
          {product.filamentType}
        </span>
      </div>

      <p className="text-slate-400 text-sm mb-4 flex-grow">{product.description}</p>
      
      <div className="flex items-center gap-4 text-xs text-slate-500 mb-6">
        <div className="flex items-center gap-1">
          <Box size={14} /> High Detail
        </div>
      </div>
      
      <button 
        onClick={() => onBuy(product)}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
      >
        <ShoppingBag size={18} /> Buy / Ask
      </button>
    </div>
  </div>
);

const CheckoutModal: React.FC<{ 
  product: Product; 
  onClose: () => void;
  onComplete: (order: Order) => void;
}> = ({ product, onClose, onComplete }) => {
  const [step, setStep] = useState<'SELECT' | 'FORM' | 'PROCESSING'>('SELECT');
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [reason, setReason] = useState('');
  const [processingMsg, setProcessingMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('PROCESSING');

    if (method === PaymentMethod.CASH) {
      setProcessingMsg('Verifying Payment...');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate async
      const msg = await generateReceiptMessage(product, name);
      
      const newOrder: Order = {
        id: crypto.randomUUID(),
        productId: product.id,
        productName: product.name,
        amount: product.price,
        date: new Date().toISOString(),
        method: PaymentMethod.CASH,
        customerName: name,
        notes: notes,
        receiptMessage: msg
      };
      onComplete(newOrder);

    } else {
      setProcessingMsg('Consulting AI Shopkeeper...');
      const judgment = await judgeFreeRequest(product, reason);
      
      if (judgment.approved) {
        setProcessingMsg('Request Approved! Generating Receipt...');
        const msg = await generateReceiptMessage(product, name);
        const newOrder: Order = {
          id: crypto.randomUUID(),
          productId: product.id,
          productName: product.name,
          amount: 0,
          date: new Date().toISOString(),
          method: PaymentMethod.ASK_FOR_FREE,
          customerName: name,
          notes: notes,
          aiJudgmentReason: judgment.reason,
          receiptMessage: msg + ` AI Note: "${judgment.wittyComment}"`
        };
        onComplete(newOrder);
      } else {
        alert(`Request Denied.\nAI Says: "${judgment.wittyComment}"\nReason: ${judgment.reason}`);
        setStep('SELECT'); // Reset to try paying with cash
      }
    }
  };

  if (step === 'PROCESSING') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="text-center text-white">
          <Loader2 size={64} className="animate-spin mx-auto mb-4 text-blue-500" />
          <h3 className="text-2xl font-bold animate-pulse">{processingMsg}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-800 w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        <div className="bg-slate-900 p-4 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Purchase {product.name}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <div className="p-6">
          {step === 'SELECT' ? (
            <div className="space-y-4">
              <p className="text-slate-300 mb-6">How would you like to acquire this artifact?</p>
              
              <button 
                onClick={() => { setMethod(PaymentMethod.CASH); setStep('FORM'); }}
                className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 p-4 rounded-xl flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500 p-2 rounded-lg text-white">
                    <EuroSign size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-emerald-400 font-bold group-hover:text-emerald-300">Pay Cash</h3>
                    <p className="text-xs text-slate-400">Support the creator directly. €{product.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="text-emerald-500">→</div>
              </button>

              <button 
                onClick={() => { setMethod(PaymentMethod.ASK_FOR_FREE); setStep('FORM'); }}
                className="w-full bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 p-4 rounded-xl flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500 p-2 rounded-lg text-white">
                    <Zap size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-purple-400 font-bold group-hover:text-purple-300">Ask for Free</h3>
                    <p className="text-xs text-slate-400">Convince the AI why you deserve it.</p>
                  </div>
                </div>
                <div className="text-purple-500">→</div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Your Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Model Specification / Notes</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="E.g. iPhone 17 Pro, Infinity Cube..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
                <p className="text-xs text-slate-500 mt-1">Specify the exact model or details here.</p>
              </div>

              {method === PaymentMethod.ASK_FOR_FREE && (
                <div className="animate-in fade-in slide-in-from-bottom-2">
                  <label className="block text-sm text-purple-400 mb-1 font-bold">Why should you get this for free?</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full bg-slate-900 border border-purple-500/50 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    placeholder="Be creative. The AI judge is watching..."
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    * The AI Judge analyzes sentiment, creativity, and audacity.
                  </p>
                </div>
              )}

              {method === PaymentMethod.CASH && (
                <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg text-sm text-emerald-300 flex items-center gap-2">
                  <ShieldCheck size={16} /> 
                  Secure simulated cash transaction.
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setStep('SELECT')}
                  className="flex-1 py-3 text-slate-400 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className={`flex-1 py-3 rounded-lg font-bold text-white shadow-lg transition-transform active:scale-95 ${
                    method === PaymentMethod.CASH ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-purple-600 hover:bg-purple-500'
                  }`}
                >
                  {method === PaymentMethod.CASH ? `Pay €${product.price}` : 'Submit Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Page Component
const StoreFront: React.FC<{ 
  onBuy: (p: Product) => void;
  orders: Order[];
}> = ({ onBuy, orders }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {/* Hero Section */}
      <div className="relative bg-slate-900 border-b border-slate-800">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/600?blur=10')] opacity-20 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 to-slate-900" />
        
        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10 text-center">
          <div className="inline-block px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-sm mb-6">
            EST. 2024 • AI POWERED COMMERCE
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 mb-6 tracking-tight">
            POLYFORGE
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Premium 3D printed artifacts. Pay with credits or convince our AI Overlord of your worthiness.
          </p>
          <div className="flex justify-center gap-8 text-sm font-semibold text-slate-500">
             <span className="flex items-center gap-2"><Star size={16} className="text-yellow-500" /> Premium Quality</span>
             <span className="flex items-center gap-2"><Zap size={16} className="text-purple-500" /> AI Pricing</span>
             <span className="flex items-center gap-2"><Box size={16} className="text-blue-500" /> Fast Shipping</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
          <span className="bg-blue-500 w-2 h-8 rounded-full"></span>
          Latest Prints
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} onBuy={onBuy} />
          ))}
        </div>
      </div>

      {/* Footer / Admin Link */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <p>© 2024 PolyForge Industries. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0 items-center">
            <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <button 
              onClick={() => navigate('/admin')}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors text-xs"
            >
              Admin Access
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Main App Component
const AppContent: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleBuy = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleOrderComplete = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    setSelectedProduct(null);
    setCurrentOrder(order);
  };

  const closeReceipt = () => {
    setCurrentOrder(null);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<StoreFront onBuy={handleBuy} orders={orders} />} />
        <Route path="/admin" element={<AdminPanel orders={orders} onExit={() => navigate('/')} />} />
        <Route path="/print/:orderId" element={<PrintPage orders={orders} />} />
      </Routes>

      {/* Modals - only show if not on print page or admin page ideally, but these are conditioned by state anyway */}
      {selectedProduct && (
        <CheckoutModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onComplete={handleOrderComplete}
        />
      )}

      {currentOrder && (
        <Receipt order={currentOrder} onClose={closeReceipt} />
      )}
    </>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// Icon helper
function EuroSign({ size }: { size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M4 10h12" />
      <path d="M4 14h9" />
      <path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2" />
    </svg>
  );
}