import React, { useEffect, useState, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const fmt12 = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
};

const getSlotStatus = (startTime, endTime) => {
  const now  = new Date();
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  const start = new Date(); start.setHours(sh, sm, 0, 0);
  const end   = new Date(); end.setHours(eh, em, 0, 0);
  if (now >= start && now <= end) return "ongoing";
  if (now > end)   return "done";
  return "upcoming";
};

const BRANCH_COLORS = {
  CSE: "from-blue-600 to-indigo-600",
  ECE: "from-purple-600 to-violet-600",
  ME:  "from-orange-500 to-amber-500",
  CE:  "from-emerald-600 to-teal-600",
  EE:  "from-yellow-500 to-orange-500",
};

const StudentRoutine = () => {
  const { user } = useContext(AuthContext);
  const [routine, setRoutine]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [now, setNow]           = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Live clock — updates every 30 seconds
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fetchRoutine = async () => {
      setLoading(true);
      try {
        const res = await API.get("/routines/my-branch");
        setRoutine(res.data.routine || null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutine();
  }, [selectedDate]);

  const isToday = selectedDate === new Date().toISOString().split("T")[0];
  const branch  = user?.department || "";
  const gradBg  = BRANCH_COLORS[branch] || "from-slate-700 to-slate-900";

  // Find next class
  const nextClass = routine?.slots?.find((s) => getSlotStatus(s.startTime, s.endTime) === "upcoming");
  const ongoingClass = routine?.slots?.find((s) => getSlotStatus(s.startTime, s.endTime) === "ongoing");

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-5">

      {/* Header card with gradient */}
      <div className={`bg-gradient-to-br ${gradBg} rounded-3xl p-6 text-white shadow-lg`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/70 text-xs uppercase font-semibold tracking-wide">Class Routine</p>
            <h1 className="text-2xl font-black mt-1">{branch} Department</h1>
            <p className="text-white/80 text-sm mt-1">
              {isToday
                ? new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" })
                : new Date(selectedDate).toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black tabular-nums">
              {now.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true })}
            </p>
            <p className="text-white/60 text-xs mt-1">Current Time</p>
          </div>
        </div>

        {/* Ongoing / Next class pill */}
        {isToday && ongoingClass && (
          <div className="mt-4 bg-white/20 backdrop-blur rounded-2xl p-3 flex items-center gap-3">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <div>
              <p className="text-white font-bold text-sm">📍 Ongoing: {ongoingClass.subject}</p>
              <p className="text-white/70 text-xs">{fmt12(ongoingClass.startTime)} – {fmt12(ongoingClass.endTime)} · {ongoingClass.teacher?.name}</p>
            </div>
          </div>
        )}

        {isToday && !ongoingClass && nextClass && (
          <div className="mt-4 bg-white/20 backdrop-blur rounded-2xl p-3 flex items-center gap-3">
            <div className="text-lg">⏰</div>
            <div>
              <p className="text-white font-bold text-sm">Next: {nextClass.subject}</p>
              <p className="text-white/70 text-xs">Starts at {fmt12(nextClass.startTime)} · {nextClass.teacher?.name}</p>
            </div>
          </div>
        )}

        {isToday && !ongoingClass && !nextClass && routine?.slots?.length > 0 && (
          <div className="mt-4 bg-white/20 backdrop-blur rounded-2xl p-3 flex items-center gap-3">
            <div className="text-lg">🎉</div>
            <p className="text-white font-semibold text-sm">All classes for today are done!</p>
          </div>
        )}
      </div>

      {/* No routine */}
      {!routine ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
          <p className="text-5xl mb-4">📭</p>
          <p className="font-bold text-slate-700 text-lg">No routine published</p>
          <p className="text-slate-400 text-sm mt-2">
            {isToday
              ? "Admin has not published today's routine yet. Check back after 10:00 AM."
              : "No routine found for this date."}
          </p>
        </div>
      ) : (
        <>
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100">
              <p className="text-2xl font-black text-slate-800">{routine.slots?.length || 0}</p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Total Classes</p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100">
              <p className="text-2xl font-black text-emerald-600">
                {isToday ? routine.slots?.filter(s => getSlotStatus(s.startTime, s.endTime) === "done").length : 0}
              </p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Done</p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100">
              <p className="text-2xl font-black text-blue-600">
                {isToday ? routine.slots?.filter(s => getSlotStatus(s.startTime, s.endTime) === "upcoming").length : routine.slots?.length || 0}
              </p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Remaining</p>
            </div>
          </div>

          {/* Time slots */}
          <div className="space-y-3">
            {routine.slots?.map((slot, i) => {
              const status = isToday ? getSlotStatus(slot.startTime, slot.endTime) : "upcoming";
              return (
                <div
                  key={i}
                  className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden transition hover:shadow-md ${
                    status === "ongoing"  ? "border-blue-400 shadow-blue-100" :
                    status === "done"     ? "border-slate-100 opacity-60" :
                                           "border-slate-100"
                  }`}
                >
                  <div className="flex items-stretch">
                    {/* Time column */}
                    <div className={`flex flex-col items-center justify-center px-4 py-4 min-w-[80px] ${
                      status === "ongoing" ? "bg-blue-600 text-white" :
                      status === "done"    ? "bg-slate-100 text-slate-400" :
                                            "bg-slate-800 text-white"
                    }`}>
                      <p className="text-xs font-bold">{fmt12(slot.startTime)}</p>
                      <div className="w-px h-4 bg-current opacity-40 my-1" />
                      <p className="text-xs font-bold">{fmt12(slot.endTime)}</p>
                    </div>

                    {/* Content */}
                    <div className="flex-1 px-5 py-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-slate-800">{slot.subject}</p>
                            {status === "ongoing" && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold animate-pulse">● Live Now</span>
                            )}
                            {status === "done" && (
                              <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">✓ Done</span>
                            )}
                          </div>
                          {slot.course && (
                            <p className="text-xs text-slate-400 mt-0.5">{slot.course?.name} · {slot.course?.code}</p>
                          )}
                        </div>
                        {slot.room && (
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-semibold shrink-0">
                            🏫 {slot.room}
                          </span>
                        )}
                      </div>

                      {/* Teacher */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {slot.teacher?.name?.charAt(0) || "T"}
                        </div>
                        <p className="text-xs text-slate-500 font-semibold">{slot.teacher?.name || "—"}</p>
                        {slot.teacher?.designation && (
                          <span className="text-xs text-slate-300">· {slot.teacher.designation}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentRoutine;