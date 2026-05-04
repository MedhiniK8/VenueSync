import React from 'react';

const StatCard = ({ label, value, tone = 'teal' }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
    <p className="text-sm text-slate-500">{label}</p>
    <p className={`mt-2 text-3xl font-bold ${tone === 'blue' ? 'text-bluebrandDeep' : 'text-tealbrand'}`}>
      {value}
    </p>
  </div>
);

export default StatCard;
