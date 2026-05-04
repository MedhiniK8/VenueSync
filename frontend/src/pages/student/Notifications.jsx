import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let intervalId;

    const load = async () => {
      const { data } = await api.get('/notifications/mine');
      setNotifications(data);
    };

    load();
    intervalId = window.setInterval(load, 30000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-3">
      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">No notifications yet</div>
      ) : (
        notifications.map((item) => (
          <div key={item._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
            <p className="text-sm text-slate-700">{item.message}</p>
            <p className="mt-2 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
