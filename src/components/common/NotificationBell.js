 import React, { useEffect, useState, useContext, useRef, useCallback } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TYPE_STYLES = {
  notice:       { icon: "📢", bg: "bg-amber-50",   border: "border-amber-200"   },
  attendance:   { icon: "✅", bg: "bg-emerald-50",  border: "border-emerald-200" },
  result:       { icon: "🏆", bg: "bg-purple-50",   border: "border-purple-200"  },
  class:        { icon: "📅", bg: "bg-blue-50",     border: "border-blue-200"    },
  fee:          { icon: "💰", bg: "bg-orange-50",   border: "border-orange-200"  },
  live_session: { icon: "📡", bg: "bg-red-50",      border: "border-red-200"     },
  test:         { icon: "📝", bg: "bg-purple-50",   border: "border-purple-200"  },
  general:      { icon: "🔔", bg: "bg-slate-50",    border: "border-slate-200"   },
};

// Section mapping — where each type goes in NotificationCenter
const TYPE_TAB = {
  notice:       "notices",
  class:        "routine",
  attendance:   "attendance",
  test:         "tests",
  test_link:    "tests",
  fee:          "fees",
  live_session: "live",
  result:       "result",
  general:      "notifications",
};

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)    return "Just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

// ── Notification Sound ─────────────────────────────────────────────────────────
const playNotificationSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    // Bell-like chime: two tones
    const play = (freq, start, duration) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };
    play(880, 0,    0.3);
    play(1100, 0.15, 0.3);
  } catch (e) {
    // Audio not supported — silent fail
  }
};

const NotificationBell = () => {
  const { user }  = useContext(AuthContext);
  const navigate  = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread]               = useState(0);
  const [open, setOpen]                   = useState(false);
 // const [loading, setLoading]             = useState(false);
  const prevUnread = useRef(0);
  const dropRef    = useRef(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const res = await API.get("/notifications");
      const newNotifs = res.data.notifications || [];
      const newUnread = res.data.unread || 0;

      // ✅ Play sound if new notifications arrived
      if (newUnread > prevUnread.current && prevUnread.current !== 0) {
        playNotificationSound();
      }
      prevUnread.current = newUnread;

      setNotifications(newNotifs);
      setUnread(newUnread);
    } catch (e) { console.error(e); }
  }, [user]);

  // Poll every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnread(u => Math.max(0, u - 1));
    } catch (e) { console.error(e); }
  };

  const markAllRead = async () => {
    try {
      await API.put("/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnread(0);
    } catch (e) { console.error(e); }
  };

  // ✅ Click notification → mark read + go to NotificationCenter with correct tab
  const handleClick = (n) => {
    if (!n.read) markRead(n._id);
    const tab = TYPE_TAB[n.type] || "notifications";
    navigate(`/${user?.role}/notifications?section=${tab}`);
    setOpen(false);
  };

  // ✅ "View All" → go to NotificationCenter
  const goToCenter = () => {
    navigate(`/${user?.role}/notifications`);
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropRef}>

      {/* Bell Button */}
      <button
        onClick={() => { setOpen(o => !o); if (!open) fetchNotifications(); }}
        className="relative p-2 rounded-xl hover:bg-slate-100 transition"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6 text-slate-600">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-sm">Notifications</span>
              {unread > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{unread}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button onClick={markAllRead} className="text-xs text-blue-600 hover:text-blue-800 font-semibold">
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-slate-400">
                <span className="text-3xl mb-2">🔔</span>
                <p className="text-sm font-semibold">No notifications yet</p>
              </div>
            ) : (
              notifications.slice(0, 8).map((n) => {
                const style = TYPE_STYLES[n.type] || TYPE_STYLES.general;
                return (
                  <button key={n._id} onClick={() => handleClick(n)}
                    className={`w-full text-left flex gap-3 px-4 py-3 hover:bg-slate-50 transition ${!n.read ? "bg-blue-50/40" : ""}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 border ${style.bg} ${style.border}`}>
                      {n.icon || style.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${!n.read ? "text-slate-900" : "text-slate-600"}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{n.message}</p>
                      <p className="text-xs text-slate-300 mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer — View All */}
          <div className="border-t border-slate-100">
            <button onClick={goToCenter}
              className="w-full py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-2">
              View All Notifications →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;