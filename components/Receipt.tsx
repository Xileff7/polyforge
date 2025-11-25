import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Order, PaymentMethod } from '../types';
import { Printer, CheckCircle2, Smartphone } from 'lucide-react';

interface ReceiptProps {
  order: Order;
  onClose: () => void;
}

export const Receipt: React.FC<ReceiptProps> = ({ order, onClose }) => {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  const handleMobileView = () => {
    // Close the modal and navigate to the dedicated print page
    onClose();
    navigate(`/print/${order.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div id="printable-receipt" className="bg-white text-slate-900 w-full max-w-md p-8 rounded-lg shadow-2xl relative animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        
        {/* Screen Only Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 no-print"
        >
          Close X
        </button>

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

        <div className="mt-8 no-print flex flex-col gap-3">
          <button
            onClick={handlePrint}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
          >
            <Printer size={20} />
            Quick Print
          </button>
          
          <button
            onClick={handleMobileView}
            className="w-full bg-white border-2 border-slate-200 text-slate-700 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <Smartphone size={20} />
            Wireless / Mobile Print Page
          </button>
        </div>
      </div>
    </div>
  );
};