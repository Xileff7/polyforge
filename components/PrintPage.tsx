import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Order, PaymentMethod } from '../types';
import { Printer, ArrowLeft, Share, CheckCircle2 } from 'lucide-react';

interface PrintPageProps {
  orders: Order[];
}

export const PrintPage: React.FC<PrintPageProps> = ({ orders }) => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = orders.find(o => o.id === orderId);

  useEffect(() => {
    // Automatically trigger system print dialog when page loads
    // giving a slight delay for styles and layout to settle
    if (order) {
      const timer = setTimeout(() => {
        window.print();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [order]);

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-xl text-center max-w-md w-full border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Receipt Not Found</h2>
          <p className="text-slate-400 mb-6">The receipt session has expired or the ID is invalid.</p>
          <button 
            onClick={() => navigate('/')} 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold transition-colors"
          >
            Return to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
        {/* Navigation Bar - Hidden during print */}
        <div className="bg-white shadow-sm p-4 flex justify-between items-center no-print sticky top-0 z-10">
            <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
                <ArrowLeft size={20} /> Back
            </button>
            <h1 className="font-bold text-slate-800">Print Preview</h1>
            <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        <div className="flex-grow p-4 md:p-8 flex flex-col items-center gap-6 overflow-y-auto">
            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-sm text-blue-800 flex gap-3 items-start no-print">
                    <Share className="shrink-0 mt-0.5" size={16} />
                    <p>
                      <strong>System Print Dialog:</strong> This page should automatically open your device's printing software. If not, click the button below.
                    </p>
                 </div>

                 {/* Receipt Container - Matches Receipt.tsx style but without modal wrappers */}
                 <div id="printable-receipt" className="bg-white text-slate-900 w-full p-8 rounded-lg shadow-xl relative">
                    <div className="text-center border-b-2 border-dashed border-slate-300 pb-6 mb-6">
                        <div className="flex justify-center mb-4 text-emerald-600 no-print">
                            <CheckCircle2 size={48} />
                        </div>
                        <h1 className="text-3xl font-bold uppercase tracking-widest">PolyForge</h1>
                        <p className="text-sm text-slate-500">Premium 3D Fabrication</p>
                        <p className="text-xs text-slate-400 mt-1">Receipt #{order.id.slice(0, 8)}</p>
                    </div>

                    <div className="space-y-4 mb-6 font-mono text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Date:</span>
                            <span>{new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Customer:</span>
                            <span className="font-bold">{order.customerName}</span>
                        </div>
                        
                        {order.notes && (
                            <div className="bg-slate-50 p-2 rounded border border-slate-100 my-2">
                                <span className="text-slate-500 text-xs block mb-1">Model / Notes:</span>
                                <span className="font-bold break-words">{order.notes}</span>
                            </div>
                        )}

                        <div className="border-b border-slate-200 my-2"></div>
                        <div className="flex justify-between items-center">
                            <span>{order.productName}</span>
                            <span className="font-bold text-lg">
                            {order.method === PaymentMethod.ASK_FOR_FREE ? '€0.00' : `€${order.amount.toFixed(2)}`}
                            </span>
                        </div>
                        {order.method === PaymentMethod.ASK_FOR_FREE && (
                            <div className="mt-2 text-xs text-orange-600 italic">
                            * Promo: Persuaded AI Overlord
                            </div>
                        )}
                        <div className="border-b-2 border-slate-900 my-2"></div>
                        <div className="flex justify-between text-xl font-bold">
                            <span>TOTAL</span>
                            <span>{order.method === PaymentMethod.ASK_FOR_FREE ? '€0.00' : `€${order.amount.toFixed(2)}`}</span>
                        </div>
                    </div>

                    <div className="text-center text-xs font-mono text-slate-500 space-y-2">
                        <div className="flex justify-center my-4">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`Receipt is valid. Order ID: ${order.id}`)}`}
                            alt="Validation QR Code"
                            className="w-24 h-24"
                          />
                        </div>
                        <p className="text-[10px] uppercase tracking-wider mb-2">Scan to Verify Validity</p>
                        <p>{order.receiptMessage}</p>
                        <p className="mt-4">*** CUSTOMER COPY ***</p>
                    </div>
                 </div>
            </div>

            <button
                onClick={() => window.print()}
                className="w-full max-w-md bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 shadow-lg no-print transition-all active:scale-95"
            >
                <Printer size={24} />
                Open System Print Dialog
            </button>
        </div>
    </div>
  );
};