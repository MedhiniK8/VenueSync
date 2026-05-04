import React from 'react';

const toneMap = {
  slate: 'text-slate-900',
  amber: 'text-amber-600',
  emerald: 'text-brand-600',
  rose: 'text-rose-600'
};

const StatCard = ({ label, value, tone = 'slate' }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card transition-all hover:shadow-md">
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <p className={`mt-2 text-3xl font-bold tracking-tight ${toneMap[tone] || 'text-slate-900'}`}>
      {value}
    </p>
  </div>
);

export default StatCard;
