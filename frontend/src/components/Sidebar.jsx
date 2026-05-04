import React from 'react';

const Sidebar = ({ title, items, active, onChange, footer }) => (
  <aside className="flex h-full w-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-soft lg:w-72">
    <div>
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">Smart venue booking workspace</p>
    </div>
    <nav className="mt-6 flex flex-1 flex-col gap-2">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onChange(item.key)}
          className={`rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
            active === item.key
              ? 'bg-tealbrand text-white'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
    {footer ? <div className="mt-4 border-t border-slate-200 pt-4">{footer}</div> : null}
  </aside>
);

export default Sidebar;
