import React, { useState, useEffect } from 'react';
import { Order, PaymentMethod } from '../types';
import { ADMIN_PASSWORD } from '../constants';
import { Lock, Unlock, Euro, Gift, LogOut } from 'lucide-react';

interface AdminPanelProps {
  orders: Order[];
  onExit: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ orders, onExit }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid Access Code');
    }
  };

  const totalRevenue = orders
    .filter(o => o.method === PaymentMethod.CASH)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const freeGiven = orders.filter(o => o.method === PaymentMethod.ASK_FOR_FREE).length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-sm border border-slate-700">
          <div className="flex justify-center mb-6 text-orange-500">
            <Lock size={48} />
          </div>
          <h2 className="text-2xl font-bold text-center text-white mb-6">Restricted Area</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Admin Key"
              className="w-full bg-slate-700 text-white border border-slate-600 rounded p-3 focus:outline-none focus:border-orange-500"
            />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded font-bold transition-colors">
              Unlock
            </button>
          </form>
          <button onClick={onExit} className="w-full mt-4 text-slate-400 text-sm hover:text-white">
            ← Back to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-slate-700 pb-6">
          <div className="flex items-center gap-3">
            <Unlock className="text-green-500" size={32} />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <button 
            onClick={onExit}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded text-sm transition-colors"
          >
            <LogOut size={16} /> Exit
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-400 font-medium">Total Revenue</h3>
              <Euro className="text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white">€{totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-400 font-medium">Freebies Granted</h3>
              <Gift className="text-orange-400" />
            </div>
            <p className="text-3xl font-bold text-white">{freeGiven}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-400 font-medium">Total Orders</h3>
              <div className="text-blue-400 font-bold">#</div>
            </div>
            <p className="text-3xl font-bold text-white">{orders.length}</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h3 className="text-xl font-bold">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-sm">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Notes / Model</th>
                  <th className="p-4">Type</th>
                  <th className="p-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 text-sm">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-700/50">
                    <td className="p-4 font-mono text-xs text-slate-500">{order.id.slice(0, 8)}...</td>
                    <td className="p-4 font-medium">{order.customerName}</td>
                    <td className="p-4">{order.productName}</td>
                    <td className="p-4 text-slate-400 italic max-w-xs truncate">{order.notes || '-'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        order.method === PaymentMethod.CASH 
                          ? 'bg-green-900/50 text-green-400' 
                          : 'bg-orange-900/50 text-orange-400'
                      }`}>
                        {order.method === PaymentMethod.CASH ? 'CASH' : 'FREE'}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono">
                      €{order.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">No orders yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};