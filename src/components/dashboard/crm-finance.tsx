import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { CreditCard, TrendingUp, CheckCircle, Clock, AlertCircle, Search, Download } from 'lucide-react';
import { cn } from '../../lib/utils';

type Payment = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  client_name?: string;
  concept: string;
};

export function FinanceManager() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const enriched = data.map(p => ({
        ...p,
        client_name: p.profiles?.full_name
      }));

      setPayments(enriched);
      
      const total = enriched
        .filter(p => p.status === 'completed')
        .reduce((acc, curr) => acc + curr.amount, 0);
      setTotalRevenue(total);

    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 sm:p-10 md:p-20 text-center uppercase font-black text-[#1A1A1A]/20 tracking-widest">Abriendo Bóveda Financiera...</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-[#1A1A1A]">Bóveda de Finanzas</h2>
            <p className="text-[#1A1A1A]/40 text-sm mt-2">Control de ingresos, validación de pagos y auditoría Sasori.</p>
          </div>
         <div className="bg-sasori-red p-8 rounded-[2.5rem] flex items-center justify-between shadow-2xl shadow-sasori-red/20">
            <div>
               <p className="text-[9px] font-black uppercase tracking-widest text-white/80">Ingresos Totales (USD)</p>
               <p className="text-3xl font-black text-white">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white">
               <TrendingUp size={24} />
            </div>
         </div>
      </div>

      <div className="bg-[#EDEDED] border border-black/5 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-black/5 text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]/30 bg-black/5">
              <th className="py-8 px-8">Transacción</th>
              <th className="py-8 px-4">Cliente</th>
              <th className="py-8 px-4">Monto</th>
              <th className="py-8 px-4">Estado</th>
              <th className="py-8 px-8 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {payments.map(payment => (
              <tr key={payment.id} className="group hover:bg-black/5 transition-colors">
                <td className="py-6 px-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-black/5 flex items-center justify-center text-[#1A1A1A]/40 group-hover:text-sasori-red transition-colors shadow-sm">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-tight text-[#1A1A1A]">#TX-{payment.id.slice(0,6)}</p>
                      <p className="text-[9px] text-[#1A1A1A]/30 font-bold uppercase tracking-widest">{payment.concept || 'Servicio Digital'}</p>
                    </div>
                  </div>
                </td>
                <td className="py-6 px-4 text-xs font-black uppercase text-[#1A1A1A]/60">
                  {payment.client_name || 'Anónimo'}
                </td>
                <td className="py-6 px-4">
                   <span className="text-sm font-black text-[#1A1A1A]">${payment.amount.toLocaleString()}</span>
                   <span className="text-[9px] ml-1 font-bold text-[#1A1A1A]/20 uppercase">{payment.currency || 'USD'}</span>
                </td>
                <td className="py-6 px-4">
                   <div className={cn(
                     "inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                     payment.status === 'completed' ? "bg-emerald-500/10 text-emerald-500" : 
                     payment.status === 'pending' ? "bg-amber-500/10 text-amber-500" : "bg-sasori-red/10 text-sasori-red"
                   )}>
                     {payment.status === 'completed' ? <CheckCircle size={10} /> : 
                      payment.status === 'pending' ? <Clock size={10} /> : <AlertCircle size={10} />}
                     {payment.status === 'completed' ? 'Completado' : 
                      payment.status === 'pending' ? 'Pendiente' : 'Fallido'}
                   </div>
                </td>
                <td className="py-6 px-8 text-right">
                  <button className="text-[#1A1A1A]/20 hover:text-sasori-red transition-all">
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 md:py-20 text-center text-[#1A1A1A]/10 font-black uppercase">No hay registros financieros</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
