import React from 'react';

const Sidebar = ({ title, items, active, onChange, footer }) => (
  <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white shadow-sm transition-all duration-300">
    <div className="p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">VenueSync</h2>
      </div>
      <p className="mt-2 text-xs font-medium uppercase tracking-wider text-slate-500">{title}</p>
    </div>
    
    <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onChange(item.key)}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
            active === item.key
              ? 'bg-brand-50 text-brand-700'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
    
    {footer ? (
      <div className="border-t border-slate-200 p-4">
        {footer}
      </div>
    ) : null}
  </aside>
);

export default Sidebar;
