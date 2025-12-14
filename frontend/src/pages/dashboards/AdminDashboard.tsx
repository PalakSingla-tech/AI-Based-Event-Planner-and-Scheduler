import React, { useState, useEffect } from "react";
import {
  Grid,
  Calendar,
  MessageSquare,
  Users,
  Zap,
  Search,
  Mail,
  BarChart2,
  LogOut,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


/* ---------------------- Types ---------------------- */
type Booking = {
  id: number;
  name: string;
  email: string;
  eventType: string;
  eventName: string;
  venue: string;
  eventDate: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  paidAmount?: number;
  totalAmount?: number;
  plannerId?: number;
};

type Enquiry = {
  id: number;
  name: string;
  email: string;
  enquiryDetails: string;
  reply: string | null;
  status: "Pending" | "Replied";
  date?: string;
};

type UserItem = {
  id: number;
  fullName: string;
  email: string;
  role: string;
};

type EventItem = {
  id: number;
  name: string;
  date: string;
  theme: string;
  price: number;
  image?: string;
  plannerId?: number;
};

type Planner = {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  city?: string;
  specialization?: string;
};

/* ---------------------- Component ---------------------- */
export default function Dashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState<
    "Overview" | "Bookings" | "Enquiries" | "Events" | "ManageUsers" | "Planners"
  >("Overview");

  /* ---------------------- EVENTS ---------------------- */
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);


  /* event form + edit state */
  const [isEditingEvent, setIsEditingEvent] = useState<EventItem | null>(null);
  const [eventForm, setEventForm] = useState({
    name: "",
    date: "",
    theme: "",
    price: "",
    image: "",
    plannerId: "" // string for select binding
  });

  /* fetch events */
  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:8080/events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  /* handle create / update event */
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventForm.plannerId) {
      alert("Please select a planner before saving the event.");
      return;
    }

    const eventData = {
      name: eventForm.name,
      date: eventForm.date,
      theme: eventForm.theme,
      price: Number(eventForm.price || 0),
      image: eventForm.image,
      plannerId: Number(eventForm.plannerId),
    };

    try {
      let res;
      if (isEditingEvent) {
        res = await fetch(`http://localhost:8080/events/${isEditingEvent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        });
      } else {
        res = await fetch("http://localhost:8080/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        });
      }

      if (!res.ok) {
        const errMsg = await res.text();
        alert("Error: " + errMsg);
        return;
      }

      await fetchEvents(); // refresh event list
      alert("Event saved successfully!");

      setEventForm({ name: "", date: "", theme: "", price: "", image: "", plannerId: "" });
      setIsEditingEvent(null);

    } catch (err) {
      console.error("Event save error:", err);
      alert("Failed to save event. Check console.");
    }
  };

  /* delete event */
  const deleteEvent = async (id: number) => {
    if (!confirm("Delete this event?")) return;
    try {
      const res = await fetch(`http://localhost:8080/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setEvents(prev => prev.filter(ev => ev.id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  const editEvent = (ev: EventItem) => {
    setIsEditingEvent(ev);
    setEventForm({
      name: ev.name,
      date: ev.date,
      theme: ev.theme,
      price: ev.price.toString(),
      image: ev.image || "",
      plannerId: ev.plannerId ? String(ev.plannerId) : "",
    });
    setActive("Events");
  };

  /* ---------------------- PLANNERS (separate page) ---------------------- */
  const [planners, setPlanners] = useState<Planner[]>([]);
  const [loadingPlanners, setLoadingPlanners] = useState(true);


  const [isEditingPlanner, setIsEditingPlanner] = useState<Planner | null>(null);
  const [plannerForm, setPlannerForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    specialization: ""
  });

  const [plannerSearch, setPlannerSearch] = useState("");

  const fetchPlanners = async () => {
    try {
      const res = await fetch("http://localhost:8080/planners");
      const data = await res.json();
      setPlanners(data);
    } catch (err) {
      console.error("Error fetching planners:", err);
    } finally {
      setLoadingPlanners(false);
    }
  };

  useEffect(() => {
    fetchPlanners();
  }, []);

  const addPlanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = {
        fullName: plannerForm.fullName,
        email: plannerForm.email,
        phone: plannerForm.phone,
        city: plannerForm.city,
        specialization: plannerForm.specialization
      };
      const res = await fetch("http://localhost:8080/planners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Add planner failed");
      const saved = await res.json();
      setPlanners(prev => [...prev, saved]);
      setPlannerForm({ fullName: "", email: "", phone: "", city: "", specialization: "" });
    } catch (err) {
      console.error("Error adding planner:", err);
    }
  };

  const updatePlanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingPlanner) return;
    try {
      const body = {
        fullName: plannerForm.fullName,
        email: plannerForm.email,
        phone: plannerForm.phone,
        city: plannerForm.city,
        specialization: plannerForm.specialization
      };
      const res = await fetch(`http://localhost:8080/planners/${isEditingPlanner.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Update planner failed");
      const updated = await res.json();
      setPlanners(prev => prev.map(p => (p.id === updated.id ? updated : p)));
      setIsEditingPlanner(null);
      setPlannerForm({ fullName: "", email: "", phone: "", city: "", specialization: "" });
    } catch (err) {
      console.error("Error updating planner:", err);
    }
  };

  const deletePlanner = async (id: number) => {
    if (!confirm("Delete this planner? This cannot be undone.")) return;
    try {
      const res = await fetch(`http://localhost:8080/planners/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setPlanners(prev => prev.filter(p => p.id !== id));
      // refresh events to avoid showing stale planner names
      fetchEvents();
    } catch (err) {
      console.error("Error deleting planner:", err);
    }
  };

  const startEditPlanner = (p: Planner) => {
    setIsEditingPlanner(p);
    setPlannerForm({
      fullName: p.fullName || "",
      email: p.email || "",
      phone: p.phone || "",
      city: p.city || "",
      specialization: p.specialization || "",
    });
    setActive("Planners");
  };

  const filteredPlanners = planners.filter(p =>
    p.fullName.toLowerCase().includes(plannerSearch.toLowerCase()) ||
    (p.email || "").toLowerCase().includes(plannerSearch.toLowerCase()) ||
    (p.city || "").toLowerCase().includes(plannerSearch.toLowerCase()) ||
    (p.specialization || "").toLowerCase().includes(plannerSearch.toLowerCase())
  );

  /* ---------------------- BOOKINGS ---------------------- */
  const [booking, setBooking] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:8080/bookings");
      const data = await res.json();

      const formatted: Booking[] = data.map((b: any) => ({
        id: b.id,
        name: b.name,
        email: b.email,
        eventType: b.eventType,
        eventName: b.eventName,
        venue: b.venue,
        eventDate: b.eventDate,
        status: b.status,
        paidAmount: b.paidAmount,
        totalAmount: b.totalAmount,
      }));

      setBooking(formatted);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const openModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const updateBookingStatus = async (id: number, status: Booking["status"]) => {
    try {
      const res = await fetch(`http://localhost:8080/bookings/${id}/status?status=${encodeURIComponent(status)}`, {
        method: "PUT",
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      setBooking(prev => prev.map(b => (b.id === id ? { ...b, status } : b)));
      fetchAnalytics();
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status. Please try again.");
      // Revert optimistic update if we had one, or just fetch again
      fetchBookings();
    }
  };

  /* ---------------------- ENQUIRIES ---------------------- */
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loadingEnquiry, setLoadingEnquiry] = useState(true);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch("http://localhost:8080/enquiries");
      const data = await res.json();
      setEnquiries(data);
    } catch (err) {
      console.error("Failed to fetch enquiries:", err);
    } finally {
      setLoadingEnquiry(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const [replyModal, setReplyModal] = useState<{ open: boolean; enquiry?: Enquiry }>({ open: false });
  const openReply = (enquiry: Enquiry) => setReplyModal({ open: true, enquiry });

  const sendReply = async (replyMessage: string) => {
    if (!replyModal.enquiry) return;

    try {
      await fetch(`http://localhost:8080/enquiries/${replyModal.enquiry.id}/reply`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyMessage }),
      });

      setEnquiries(prev =>
        prev.map(e =>
          e.id === replyModal.enquiry!.id ? { ...e, reply: replyMessage, status: "Replied" } : e
        )
      );

      alert(`Reply sent!`);
      setReplyModal({ open: false });
    } catch (err) {
      console.error("Failed to send reply:", err);
    }
  };

  /* ---------------------- USERS ---------------------- */
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8080/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ---------------------- ANALYTICS ---------------------- */
  const [analytics, setAnalytics] = useState({
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0
  });

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/analytics/overview");
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const removeUser = async (id: number) => {
    try {
      await fetch(`http://localhost:8080/users/${id}`, {
        method: "DELETE",
      });
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error("Error removing user:", err);
    }
  };

  /* ---------------------- FILTERS ---------------------- */
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterEventType, setFilterEventType] = useState("All");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const filteredBookings = booking.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.eventName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "All" || b.status === filterStatus;
    const matchesEventType = filterEventType === "All" || b.eventType.toLowerCase() === filterEventType.toLowerCase();

    const matchesStartDate = !filterStartDate || new Date(b.eventDate) >= new Date(filterStartDate);
    const matchesEndDate = !filterEndDate || new Date(b.eventDate) <= new Date(filterEndDate);

    return matchesSearch && matchesStatus && matchesEventType && matchesStartDate && matchesEndDate;
  });

  /* ---------------------- STATS ---------------------- */
  /* ---------------------- STATS ---------------------- */
  const totalEvents = events.length;
  const totalUsers = users.length;


  const bookingStats = [
    { status: "Pending", count: booking.filter(b => (b.status || "").toLowerCase() === "pending").length },
    { status: "Confirmed", count: booking.filter(b => (b.status || "").toLowerCase() === "confirmed").length },
    { status: "Completed", count: booking.filter(b => (b.status || "").toLowerCase() === "completed").length },
    { status: "Cancelled", count: booking.filter(b => (b.status || "").toLowerCase() === "cancelled").length },
  ];

  const enquiryStats = [
    { status: "Replied", count: enquiries.filter(e => e.reply).length },
    { status: "Pending", count: enquiries.filter(e => !e.reply).length },
  ];

  /* ---------------------- RENDER ---------------------- */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white flex transition-colors duration-200">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 h-screen p-4 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-teal-50 dark:bg-white/10"><Zap className="w-5 h-5 text-teal-600 dark:text-white" /></div>
          <div>
            <div className="text-lg font-semibold">Eventura</div>
          </div>
        </div>

        <nav className="flex-1">
          {[
            { key: "Overview", label: "Overview", icon: <Grid className="w-4 h-4" /> },
            { key: "Bookings", label: "Bookings", icon: <Calendar className="w-4 h-4" /> },
            { key: "Enquiries", label: "Enquiries", icon: <MessageSquare className="w-4 h-4" /> },
            { key: "Events", label: "Events", icon: <Users className="w-4 h-4" /> },
            { key: "ManageUsers", label: "Manage Users", icon: <Users className="w-4 h-4" /> },
            { key: "Planners", label: "Planners", icon: <Zap className="w-4 h-4" /> },
          ].map(item => (
            <button key={item.key} onClick={() => setActive(item.key as any)}
              className={`w-full flex items-center gap-3 py-3 px-3 rounded-xl mb-2 transition-all text-left ${active === item.key ? "bg-gradient-to-r from-purple-600 to-teal-500 text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
              <div className={`${active === item.key ? "text-white" : "text-teal-600 dark:text-teal-400"}`}>{item.icon}</div>
              <div>
                <div className="text-sm font-medium">{item.label}</div>
                <div className={`text-xs ${active === item.key ? "text-purple-100" : "text-gray-500 dark:text-gray-500"}`}>
                  {item.key === "Bookings" ? `${booking.length} records` : item.key === "Enquiries" ? `${enquiries.length} msgs` : ""}
                </div>
              </div>
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-2">
          <button
            onClick={() => {
              Swal.fire({
                title: "Are you sure?",
                text: "You will be logged out of your account.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#10B981",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Logout",
                background: "#1f2937",
                color: "#fff",
              }).then((result) => {
                if (result.isConfirmed) {
                  // Clear session from localStorage
                  localStorage.removeItem("email");
                  localStorage.removeItem("role");

                  // Redirect to login page
                  navigate("/login");

                  Swal.fire({
                    title: "Logged Out",
                    text: "You have been successfully logged out.",
                    icon: "success",
                    background: "#1f2937",
                    color: "#fff",
                  });
                }
              });
            }}
            className="w-full py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>

        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 overflow-y-auto">
        {(loadingEvents || loadingPlanners || loadingBookings) && (
          <div className="fixed top-4 right-4 bg-teal-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
            Loading data...
          </div>
        )}
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{active}</h2>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white dark:bg-dark-card shadow-sm border border-gray-200 dark:border-gray-800"><Search className="w-4 h-4 text-gray-500 dark:text-gray-400" /></div>
            <div className="p-2 rounded-xl bg-white dark:bg-dark-card shadow-sm border border-gray-200 dark:border-gray-800"><Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" /></div>
          </div>
        </div>

        {/* CONTENT */}
        {active === "Overview" && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-4">
              <StatCard title="Total Users" value={totalUsers} icon={<Users />} accent="bg-teal-500/10 text-teal-600 dark:text-teal-400" />
              <StatCard title="Total Events" value={totalEvents} icon={<Zap />} accent="bg-purple-600/10 text-purple-600 dark:text-purple-400" />
              <StatCard title="Bookings" value={analytics.totalBookings} icon={<Calendar />} accent="bg-blue-500/10 text-blue-600 dark:text-blue-400" />
              <StatCard title="Revenue" value={`₹${analytics.totalRevenue}`} icon={<BarChart2 />} accent="bg-green-500/10 text-green-600 dark:text-green-400" />
            </div>

            <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <h3 className="font-semibold mb-3">Notifications</h3>
              <ul className="space-y-2">
                {booking.filter(b => b.status === "Pending").map(b => (
                  <li key={b.id} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    Booking pending: <span className="font-medium">{b.name}</span> - {b.eventName}
                  </li>
                ))}
                {enquiries.filter(e => !e.reply).map(e => (
                  <li key={e.id} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    Enquiry not replied: <span className="font-medium">{e.name}</span>
                  </li>
                ))}
                {booking.filter(b => b.status === "Confirmed").length + enquiries.filter(e => e.reply).length === 0 && (
                  <li className="text-sm text-gray-500 dark:text-gray-400">No new notifications</li>
                )}
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <h3 className="font-semibold mb-3 flex items-center gap-2"><BarChart2 className="w-4 h-4" /> Booking Stats</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={bookingStats} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <XAxis dataKey="status" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip />
                    <Bar dataKey="count" fill="rgba(16,185,129,0.7)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <h3 className="font-semibold mb-3 flex items-center gap-2"><BarChart2 className="w-4 h-4" /> Enquiry Stats</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={enquiryStats} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <XAxis dataKey="status" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip />
                    <Bar dataKey="count" fill="rgba(139,92,246,0.7)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {active === "Bookings" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">Bookings</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">{booking.length} total</div>
              </div>

              {/* FILTER BAR */}
              <div className="flex flex-wrap gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Search by name, email or event..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none text-sm w-64 focus:ring-2 focus:ring-teal-500"
                />

                <select
                  value={filterEventType}
                  onChange={(e) => setFilterEventType(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-teal-500"
                >
                  <option value="All" className="text-black">All Event Types</option>
                  <option value="wedding" className="text-black">Wedding</option>
                  <option value="birthday" className="text-black">Birthday</option>
                  <option value="corporate" className="text-black">Corporate</option>
                  <option value="concert" className="text-black">Concert</option>
                  <option value="other" className="text-black">Other</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-teal-500"
                >
                  <option value="All" className="text-black">All Status</option>
                  <option value="Pending" className="text-black">Pending</option>
                  <option value="Confirmed" className="text-black">Confirmed</option>
                  <option value="Completed" className="text-black">Completed</option>
                  <option value="Cancelled" className="text-black">Cancelled</option>
                </select>

                <input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-teal-500"
                />

                <input
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-teal-500"
                />

                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterEventType("All");
                    setFilterStatus("All");
                    setFilterStartDate("");
                    setFilterEndDate("");
                  }}
                  className="px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm transition-all"
                >
                  Reset
                </button>
              </div>

              <div className="overflow-x-auto">
                {loadingBookings ? (
                  <p>Loading...</p>
                ) : (
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                        <th className="py-3 pr-6">Name</th>
                        <th className="py-3 pr-6">Event</th>
                        <th className="py-3 pr-6">Date</th>
                        <th className="py-3 pr-6">Planner</th>
                        <th className="py-3 pr-6">Paid</th>
                        <th className="py-3 pr-6">Remaining</th>
                        <th className="py-3 pr-6">Status</th>
                        <th className="py-3 pr-6">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                          <td className="py-3 pr-6 font-medium text-gray-900 dark:text-white">{b.name}</td>
                          <td className="py-3 pr-6 text-gray-600 dark:text-gray-300">{b.eventName}</td>
                          <td className="py-3 pr-6 text-gray-600 dark:text-gray-300">{b.eventDate}</td>
                          <td className="py-3 pr-6 text-gray-600 dark:text-gray-300">
                            {planners.find(p => p.id === b.plannerId)?.fullName || "Not Assigned"}
                          </td>
                          <td className="py-3 pr-6 text-green-600 dark:text-green-400 font-medium">₹{b.paidAmount ?? 0}</td>
                          <td className="py-3 pr-6 text-red-500 dark:text-red-400 font-medium">₹{(b.totalAmount ?? 0) - (b.paidAmount ?? 0)}</td>

                          <td className="py-3 pr-6">
                            <select
                              value={b.status}
                              onChange={(e) =>
                                updateBookingStatus(b.id, e.target.value as Booking["status"])
                              }
                              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                            >
                              <option className="text-black">Pending</option>
                              <option className="text-black">Confirmed</option>
                              <option className="text-black">Completed</option>
                              <option className="text-black">Cancelled</option>
                            </select>
                          </td>

                          <td className="py-3 pr-6 flex gap-2">
                            <button
                              onClick={() => openModal(b)}
                              className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all"
                            >
                              View
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  const res = await fetch(`http://localhost:8080/api/analytics/remind/${b.id}`, { method: "POST" });
                                  if (res.ok) {
                                    Swal.fire({ title: "Reminder Sent!", icon: "success", background: "#1f2937", color: "#fff" });
                                  } else {
                                    Swal.fire({ title: "Failed to send reminder", icon: "error", background: "#1f2937", color: "#fff" });
                                  }
                                } catch (e) {
                                  console.error(e);
                                  Swal.fire({ title: "Error occurred", icon: "error", background: "#1f2937", color: "#fff" });
                                }
                              }}
                              className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
                              title="Send Reminder"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                            <button
                              onClick={async () => {
                                const result = await Swal.fire({
                                  title: 'Send to Planner',
                                  input: 'email',
                                  inputLabel: 'Enter Planner Email',
                                  inputPlaceholder: 'planner@example.com',
                                  showCancelButton: true,
                                  confirmButtonText: 'Send',
                                  confirmButtonColor: '#10B981',
                                  background: '#1f2937',
                                  color: '#fff',
                                  inputValidator: (value) => {
                                    if (!value) {
                                      return 'Email is required!';
                                    }
                                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                                      return 'Please enter a valid email!';
                                    }
                                  }
                                });

                                if (result.isConfirmed && result.value) {
                                  try {
                                    const res = await fetch(`http://localhost:8080/api/analytics/send-to-planner/${b.id}`, {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ plannerEmail: result.value })
                                    });
                                    if (res.ok) {
                                      Swal.fire({ title: "Sent to Planner!", icon: "success", background: "#1f2937", color: "#fff" });
                                    } else {
                                      Swal.fire({ title: "Failed to send", icon: "error", background: "#1f2937", color: "#fff" });
                                    }
                                  } catch (e) {
                                    console.error(e);
                                    Swal.fire({ title: "Error occurred", icon: "error", background: "#1f2937", color: "#fff" });
                                  }
                                }
                              }}
                              className="px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all"
                              title="Send to Planner"
                            >
                              <Users className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )
        }

        {/* VIEW MODAL */}
        {
          isModalOpen && selectedBooking && (
            <div className="fixed inset-0 bg-black/60 flex justify-center items-center backdrop-blur-sm z-50">
              <div className="bg-gray-900 p-6 rounded-2xl border border-white/10 w-full max-w-lg shadow-xl">
                <h2 className="text-xl font-semibold mb-4 text-white">Booking Details</h2>

                <div className="space-y-3 text-gray-300">
                  <p><span className="font-semibold">Name:</span> {selectedBooking.name}</p>
                  <p><span className="font-semibold">Email:</span> {selectedBooking.email}</p>
                  <p><span className="font-semibold">Event Type:</span> {selectedBooking.eventType}</p>
                  <p><span className="font-semibold">Event:</span> {selectedBooking.eventName}</p>
                  <p><span className="font-semibold">Venue:</span> {selectedBooking.venue}</p>
                  <p><span className="font-semibold">Event Date:</span> {selectedBooking.eventDate}</p>
                  <p><span className="font-semibold">Total Amount:</span> ₹{selectedBooking.totalAmount ?? 0}</p>
                  <p><span className="font-semibold">Paid Amount:</span> ₹{selectedBooking.paidAmount ?? 0}</p>
                  <p><span className="font-semibold">Remaining:</span> ₹{(selectedBooking.totalAmount ?? 0) - (selectedBooking.paidAmount ?? 0)}</p>
                  <p><span className="font-semibold">Status:</span> {selectedBooking.status}</p>
                </div>

                <button
                  onClick={closeModal}
                  className="mt-6 w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          )
        }

        {/* ENQUIRIES */}
        {
          active === "Enquiries" && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">Enquiries</h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{enquiries.length} messages</div>
                </div>
                <div className="space-y-3">
                  {loadingEnquiry ? (
                    <p className="text-gray-500 dark:text-gray-400">Loading enquiries...</p>
                  ) : enquiries.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">No enquiries yet.</p>
                  ) : enquiries.map((q) => (
                    <div key={q.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 flex items-start justify-between hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-gray-900 dark:text-white">{q.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{q.email}</div>
                          <div className="px-2 py-0.5 rounded-md text-xs text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 ml-2">{q.date}</div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">{q.enquiryDetails}</div>
                        <div className="mt-3 flex gap-2">
                          <button onClick={() => openReply(q)} className="text-sm px-3 py-1 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20 transition-all">Reply</button>
                          <div className="text-sm px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{q.reply ? "Replied" : "Pending"}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        }

        {/* EVENTS */}
        {
          active === "Events" && (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Event Form */}
                <div className="bg-white/4 p-4 rounded-2xl border border-white/10">
                  <h3 className="font-semibold mb-3">{isEditingEvent ? "Edit Event" : "Add Past Event"}</h3>
                  <form onSubmit={handleEventSubmit} className="space-y-3">
                    <input placeholder="Event Name" value={eventForm.name} onChange={(e) => setEventForm(s => ({ ...s, name: e.target.value }))} className="w-full p-3 rounded-xl bg-white/5 outline-none" required />
                    <div className="flex gap-2">
                      <input type="date" value={eventForm.date} onChange={(e) => setEventForm(s => ({ ...s, date: e.target.value }))} className="w-1/2 p-3 rounded-xl bg-white/5 outline-none" required />
                      <input placeholder="Theme" value={eventForm.theme} onChange={(e) => setEventForm(s => ({ ...s, theme: e.target.value }))} className="w-1/2 p-3 rounded-xl bg-white/5 outline-none" />
                    </div>
                    <input placeholder="Price" value={eventForm.price} onChange={(e) => setEventForm(s => ({ ...s, price: e.target.value }))} className="w-full p-3 rounded-xl bg-white/5 outline-none" />
                    <input placeholder="Image URL (optional)" value={eventForm.image} onChange={(e) => setEventForm(s => ({ ...s, image: e.target.value }))} className="w-full p-3 rounded-xl bg-white/5 outline-none" />

                    {/* PLANNER DROPDOWN */}
                    <select
                      value={eventForm.plannerId}
                      onChange={(e) => setEventForm(s => ({ ...s, plannerId: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-white/5 outline-none"
                      required
                    >
                      <option value="" className="text-black">Select Planner</option>
                      {planners.map(p => (
                        <option key={p.id} value={p.id} className="text-black">{p.fullName}</option>
                      ))}
                    </select>

                    <div className="flex gap-3">
                      <button type="submit" className="px-4 py-2 rounded-xl bg-teal-500/80">Save</button>
                      {isEditingEvent && <button onClick={() => { setIsEditingEvent(null); setEventForm({ name: "", date: "", theme: "", price: "", image: "", plannerId: "" }); }} className="px-4 py-2 rounded-xl bg-white/5">Cancel</button>}
                    </div>
                  </form>
                </div>

                {/* Event List */}
                <div className="space-y-3">
                  {events.map(ev => (
                    <div key={ev.id} className="bg-white/4 p-3 rounded-2xl border border-white/10 flex items-center gap-4">
                      <div className="w-24 h-16 rounded-md overflow-hidden bg-gray-700 flex items-center justify-center">
                        {ev.image ? <img src={ev.image} alt={ev.name} className="object-cover w-full h-full" /> : <div className="text-xs text-gray-400">No image</div>}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{ev.name}</div>
                            <div className="text-xs text-gray-300">
                              {ev.theme} • {ev.date} • Assigned to: {planners.find(p => p.id === ev.plannerId)?.fullName || "Unknown"}
                            </div>
                          </div>
                          <div className="text-sm font-semibold">₹{ev.price}</div>
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button onClick={() => editEvent(ev)} className="px-3 py-1 rounded-lg bg-white/5">Edit</button>
                          <button onClick={() => deleteEvent(ev.id)} className="px-3 py-1 rounded-lg bg-red-600/30">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div >
            </div >
          )
        }

        {/* PLANNERS PAGE */}
        {
          active === "Planners" && (
            <div className="space-y-6">

              {/* Add Planner Form */}
              <div className="bg-white/4 p-4 rounded-2xl border border-white/10 max-w-xl">
                <h3 className="font-semibold mb-3">
                  {isEditingPlanner ? "Edit Planner" : "Add Planner"}
                </h3>

                <form onSubmit={isEditingPlanner ? updatePlanner : addPlanner} className="space-y-3">
                  <input
                    className="w-full p-3 rounded-xl bg-white/5 outline-none"
                    placeholder="Full Name"
                    value={plannerForm.fullName}
                    onChange={(e) => setPlannerForm({ ...plannerForm, fullName: e.target.value })}
                    required
                  />

                  <input
                    className="w-full p-3 rounded-xl bg-white/5 outline-none"
                    placeholder="Email"
                    value={plannerForm.email}
                    onChange={(e) => setPlannerForm({ ...plannerForm, email: e.target.value })}
                    required
                  />

                  <div className="flex gap-2">
                    <input
                      className="w-1/2 p-3 rounded-xl bg-white/5 outline-none"
                      placeholder="Phone"
                      value={plannerForm.phone}
                      onChange={(e) => setPlannerForm({ ...plannerForm, phone: e.target.value })}
                    />
                    <input
                      className="w-1/2 p-3 rounded-xl bg-white/5 outline-none"
                      placeholder="City"
                      value={plannerForm.city}
                      onChange={(e) => setPlannerForm({ ...plannerForm, city: e.target.value })}
                    />
                  </div>

                  <input
                    className="w-full p-3 rounded-xl bg-white/5 outline-none"
                    placeholder="Specialization"
                    value={plannerForm.specialization}
                    onChange={(e) => setPlannerForm({ ...plannerForm, specialization: e.target.value })}
                  />

                  <div className="flex gap-3">
                    <button type="submit" className="px-4 py-2 rounded-xl bg-teal-500/80">
                      {isEditingPlanner ? "Update" : "Add"}
                    </button>
                    {isEditingPlanner && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingPlanner(null);
                          setPlannerForm({ fullName: "", email: "", phone: "", city: "", specialization: "" });
                        }}
                        className="px-4 py-2 rounded-xl bg-white/5"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Plner List */}
              {/* Planner List */}
              <div className="bg-white/4 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Planner List</h3>
                  <input
                    type="text"
                    placeholder="Search planners..."
                    value={plannerSearch}
                    onChange={(e) => setPlannerSearch(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-sm"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-300">
                        <th className="py-3 pr-6">Name</th>
                        <th className="py-3 pr-6">Email</th>
                        <th className="py-3 pr-6">Phone</th>
                        <th className="py-3 pr-6">City</th>
                        <th className="py-3 pr-6">Specialization</th>
                        <th className="py-3 pr-6">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredPlanners.map((p) => (
                        <tr key={p.id} className="border-t border-white/6">
                          <td className="py-3 pr-6">{p.fullName}</td>
                          <td className="py-3 pr-6">{p.email}</td>
                          <td className="py-3 pr-6">{p.phone}</td>
                          <td className="py-3 pr-6">{p.city}</td>
                          <td className="py-3 pr-6">{p.specialization}</td>

                          <td className="py-3 pr-6 flex gap-2">
                            <button
                              onClick={() => startEditPlanner(p)}
                              className="px-3 py-1 rounded-lg bg-white/5"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deletePlanner(p.id)}
                              className="px-3 py-1 rounded-lg bg-red-600/20"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )
        }


        {/* MANAGE USERS */}
        {
          active === "ManageUsers" && (
            <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">Users</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">{users.length} accounts</div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                      <th className="py-3 pr-6">Name</th>
                      <th className="py-3 pr-6">Email</th>
                      <th className="py-3 pr-6">Role</th>
                      <th className="py-3 pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingUsers ? (
                      <tr><td className="py-4 text-gray-500 dark:text-gray-400">Loading...</td></tr>
                    ) : users.length === 0 ? (
                      <tr><td className="py-4 text-gray-500 dark:text-gray-400">No users found.</td></tr>
                    ) : users.map(u => (
                      <tr key={u.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="py-3 pr-6 font-medium text-gray-900 dark:text-white">{u.fullName}</td>
                        <td className="py-3 pr-6 text-gray-600 dark:text-gray-300">{u.email}</td>
                        <td className="py-3 pr-6 text-gray-600 dark:text-gray-300">{u.role}</td>
                        <td className="py-3 pr-6 flex gap-2">
                          <button onClick={() => removeUser(u.id)} className="px-3 py-1 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all">Remove</button>
                          <button onClick={() => alert("Edit user (mock)")} className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        }

        {/* Reply Modal */}
        {
          replyModal.open && replyModal.enquiry && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-dark-card p-6 border border-gray-200 dark:border-gray-800 shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reply to {replyModal.enquiry.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{replyModal.enquiry.email} • {replyModal.enquiry.date}</p>
                  </div>
                  <button onClick={() => setReplyModal({ open: false })} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">Close</button>
                </div>

                <div className="mt-4">
                  <textarea id="replyMessage" placeholder="Write your reply..." className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white h-40 outline-none focus:ring-2 focus:ring-teal-500" />
                  <div className="mt-3 flex justify-end gap-3">
                    <button onClick={() => setReplyModal({ open: false })} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">Cancel</button>
                    <button onClick={() => { const el = document.getElementById("replyMessage") as HTMLTextAreaElement | null; sendReply(el?.value || ""); }} className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold shadow-md hover:shadow-lg transition-all">Send Reply</button>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </main >
    </div >
  );
}

/* ---------------------- Small StatCard Component ---------------------- */
const StatCard: React.FC<{ title: string; value: string | number; icon?: React.ReactNode; accent?: string }> = ({ title, value, icon, accent }) => (
  <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm transition-all hover:shadow-md">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
        <div className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</div>
      </div>
      <div className={`p-2 rounded-lg ${accent ?? "bg-purple-600/10 text-purple-600 dark:text-purple-400"}`}>{icon}</div>
    </div>
  </div>
);
