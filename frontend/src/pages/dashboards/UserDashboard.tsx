import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Search,
  Star,
  Calendar,
  Users,
  CheckCircle,
  Menu,
  LogOut,
  User as UserIcon,
  Sparkles,
  Calculator,
  BrainCircuit,
  MessageSquare,
  MapPin,
} from "lucide-react";

/**
 * UserDashboard.tsx
 * - Option C: backend planner has no image field, so we use a placeholder image.
 * - Corrected field names to match backend: fullName, specialization, phone, city.
 * - Ensures booking / enquiry / payment fetch & refresh flows.
 */

/* -------------------- Types -------------------- */
interface Planner {
  id: number;
  fullName: string;
  email?: string;
  phone?: string;
  city?: string;
  specialization?: string;
  profilePhoto?: string;  // Profile photo URL
  averageRating?: number;  // Average rating (0-5)
  totalRatings?: number;   // Total number of ratings
  events?: {
    id?: number;
    name?: string;
    date?: string;
    theme?: string;
    price?: number;
    image?: string;
  }[];
}

type Booking = {
  id: number;
  name: string;
  email: string;
  eventType: string;
  eventName: string;
  eventDate: string;
  venue: string;
  plannerId?: number;
  status?: string;
  paymentStatus?: string;
};

type Enquiry = {
  id: number;
  name: string;
  email: string;
  enquiryDetails: string;
  reply?: string | null;
  status?: string;
};

type PaymentRecord = {
  id: number;
  bookingId: number;
  userEmail: string;
  plannerId: number;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  status: string;
  paymentDate: string;
};

import { useNavigate } from 'react-router-dom';

/* -------------------- Constants -------------------- */
const PLACEHOLDER_IMG = "https://via.placeholder.com/280x280.png?text=Planner";

/* -------------------- Component -------------------- */
export default function UserDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState<
    "Dashboard" | "Find Planners" | "My Bookings" | "Enquiries" | "Profile" | "Logout" | "Payments" | "AI Planner"
  >("Dashboard");

  const [planners, setPlanners] = useState<Planner[]>([]);
  const [filteredPlanners, setFilteredPlanners] = useState<Planner[]>([]);
  const [filter, setFilter] = useState({ type: "", date: "", location: "", budget: "" });
  const [query, setQuery] = useState("");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [viewReplyEnquiry, setViewReplyEnquiry] = useState<Enquiry | null>(null);
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", city: "" });

  /* AI Features State */
  const [aiTab, setAiTab] = useState<"recommend" | "budget">("recommend");
  const [aiCriteria, setAiCriteria] = useState("");
  const [aiRecommendation, setAiRecommendation] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const [budgetForm, setBudgetForm] = useState({ type: "Wedding", theme: "Modern", guests: "100", location: "Mumbai" });
  const [budgetPrediction, setBudgetPrediction] = useState("");

  const handleGetRecommendations = async () => {
    if (!aiCriteria.trim()) return toast.error("Please enter your requirements");
    setAiLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ criteria: aiCriteria }),
      });
      const data = await res.text();
      setAiRecommendation(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to get recommendations");
    } finally {
      setAiLoading(false);
    }
  };

  const handlePredictBudget = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/ai/predict-budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budgetForm),
      });
      const data = await res.text();
      setBudgetPrediction(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to predict budget");
    } finally {
      setAiLoading(false);
    }
  };

  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    eventType: "",
    eventName: "",
    eventDate: "",
    venue: "",
  });

  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    email: "",
    enquiryDetails: "",
  });

  const [bookingPlanner, setBookingPlanner] = useState<Planner | null>(null);
  const [enquiryPlanner, setEnquiryPlanner] = useState<Planner | null>(null);
  const [viewEventsPlanner, setViewEventsPlanner] = useState<Planner | null>(null);

  const userEmail = localStorage.getItem("userEmail") || profile.email || "";

  // Payment states
  const [paymentBooking, setPaymentBooking] = useState<Booking | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentOption, setPaymentOption] = useState<"FULL" | "TOKEN">("FULL");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  // Removed manual card form state

  // Payment history
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  // Rating states
  const [ratingPlanner, setRatingPlanner] = useState<Planner | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const [ratingBooking, setRatingBooking] = useState<Booking | null>(null);

  /* -------------------- Load planners from backend -------------------- */
  useEffect(() => {
    const loadPlanners = async () => {
      try {
        const res = await fetch("http://localhost:8080/planners");
        if (!res.ok) throw new Error("Failed to fetch planners");
        const data: Planner[] = await res.json();
        // backend uses fullName & specialization (per your backend fields)
        setPlanners(data);
        setFilteredPlanners(data);
      } catch (err) {
        console.error("Error fetching planners:", err);
        toast.error("Could not load planners.");
      }
    };

    const loadProfile = async () => {
      if (!userEmail) return;
      try {
        const res = await fetch(`http://localhost:8080/profile/${encodeURIComponent(userEmail)}`);
        if (res.ok) {
          const data = await res.json();
          // Map backend Auth fields to frontend profile state
          setProfile({
            name: data.fullName || "",
            email: data.email || "",
            phone: data.phone || "",
            city: data.city || "",
          });
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    loadPlanners();
    loadProfile();
  }, [userEmail]);

  /* -------------------- Load bookings/enquiries/payments for logged-in user -------------------- */
  const refreshUserData = async (email: string) => {
    if (!email) return;
    try {
      const [bkRes, enqRes, payRes] = await Promise.all([
        fetch(`http://localhost:8080/mybookings/${encodeURIComponent(email)}`),
        fetch(`http://localhost:8080/enquiries/${encodeURIComponent(email)}`),
        fetch(`http://localhost:8080/payments/${encodeURIComponent(email)}`),
      ]);

      if (bkRes.ok) {
        const bk = await bkRes.json();
        setBookings(bk || []);
      } else {
        setBookings([]);
      }

      if (enqRes.ok) {
        const eq = await enqRes.json();
        setEnquiries(eq || []);
      } else {
        setEnquiries([]);
      }

      if (payRes.ok) {
        const ps = await payRes.json();
        setPayments(ps || []);
      } else {
        setPayments([]);
      }
    } catch (err) {
      console.error("Error refreshing user data:", err);
    }
  };

  useEffect(() => {
    if (userEmail) refreshUserData(userEmail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail, active]); // refresh when active tab changes (useful after actions)

  /* -------------------- Filter logic for planners -------------------- */
  useEffect(() => {
    const q = query.trim().toLowerCase();
    const res = planners.filter((p) => {
      if (q && !p.fullName?.toLowerCase().includes(q) && !p.specialization?.toLowerCase().includes(q)) return false;
      if (filter.type && p.specialization && p.specialization.toLowerCase() !== filter.type.toLowerCase()) return false;
      if (filter.location && p.city && p.city.toLowerCase() !== filter.location.toLowerCase()) return false;
      if (filter.budget && p.fullName && !p.fullName.toLowerCase().includes(filter.budget.toLowerCase())) return false; // fallback
      return true;
    });
    setFilteredPlanners(res);
  }, [planners, query, filter]);

  /* -------------------- Booking submit (user) -------------------- */
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingPlanner) return toast.error("Select a planner first");
    if (!bookingForm.name || !bookingForm.email) return toast.error("Please provide name & email");

    try {
      const params = new URLSearchParams();
      params.append("name", bookingForm.name);
      params.append("email", bookingForm.email);
      params.append("eventType", bookingForm.eventType);
      params.append("eventName", bookingForm.eventName);
      params.append("eventDate", bookingForm.eventDate);
      params.append("venue", bookingForm.venue);
      params.append("plannerId", String(bookingPlanner.id));

      const res = await fetch("http://localhost:8080/booking", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Booking create failed:", txt);
        throw new Error("Failed to create booking");
      }

      toast.success("🎉 Booking submitted — admin will confirm it.");
      setBookingPlanner(null);
      setBookingForm({ name: "", email: "", eventType: "", eventName: "", eventDate: "", venue: "" });

      // refresh user bookings
      if (userEmail) await refreshUserData(userEmail);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to create booking");
    }
  };

  /* -------------------- Enquiry submit (user) -------------------- */
  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryPlanner) return toast.error("Select a planner first");
    if (!enquiryForm.name || !enquiryForm.email || !enquiryForm.enquiryDetails) return toast.error("Fill all enquiry fields");

    try {
      const params = new URLSearchParams();
      params.append("name", enquiryForm.name);
      params.append("email", enquiryForm.email);
      params.append("enquiryDetails", enquiryForm.enquiryDetails);

      const res = await fetch("http://localhost:8080/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Enquiry create failed:", txt);
        throw new Error("Failed to send enquiry");
      }

      toast.success("📩 Enquiry sent!");
      setEnquiryPlanner(null);
      setEnquiryForm({ name: "", email: "", enquiryDetails: "" });

      if (userEmail) await refreshUserData(userEmail);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to send enquiry");
    }
  };

  /* -------------------- Payment modal open -------------------- */
  const openPaymentModal = async (b: Booking) => {
    if (!b.plannerId) return toast.error("Planner ID missing for this booking");

    try {
      // fetch events for planner to get price (your backend endpoint exists /events/byPlanner/{plannerId})
      const r = await fetch(`http://localhost:8080/events/byPlanner/${b.plannerId}`);
      if (!r.ok) {
        console.error("Failed to fetch planner events");
        throw new Error("Failed to fetch events");
      }
      const events = await r.json();
      if (!events || events.length === 0) {
        return toast.error("No event/price information found for this planner");
      }

      // choose first event price as earlier agreed behaviour
      const price = Number(events[0].price ?? 0);
      setTotalPrice(price);

      // Determine if this is a fresh payment or remaining balance
      // If backend supports tracking paidAmount, we could use that.
      // For now, if status is PARTIALLY_PAID, we assume it's remaining balance.
      if (b.paymentStatus === "PARTIALLY_PAID") {
        // Calculate remaining. We need to know how much was paid. 
        // Since we don't have paidAmount in frontend Booking type yet (unless we add it), 
        // we can assume token was 20%. So remaining is 80%.
        // Ideally, fetch booking details again if needed.
        // Let's assume the user paid 20% token.
        const token = Math.round(price * 0.2);
        const remaining = price - token;
        setPaymentAmount(remaining);
        setPaymentOption("FULL"); // Only option is to pay the rest
      } else {
        setPaymentAmount(price);
        setPaymentOption("FULL");
      }

      setPaymentBooking(b);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch event price");
    }
  };

  // Effect to update payment amount based on option
  useEffect(() => {
    if (!paymentBooking || paymentBooking.paymentStatus === "PARTIALLY_PAID") return;

    if (paymentOption === "FULL") {
      setPaymentAmount(totalPrice);
    } else {
      setPaymentAmount(Math.round(totalPrice * 0.2));
    }
  }, [paymentOption, totalPrice, paymentBooking]);

  /* -------------------- Razorpay Payment -------------------- */
  const handleRazorpayPayment = async () => {
    if (!paymentBooking) return;

    const options = {
      key: "rzp_test_RkPNC0zRs20KkI", // Replace with your actual key
      amount: paymentAmount * 100, // Amount in paise
      currency: "INR",
      name: "Eventura",
      description: `Payment for ${paymentBooking.eventName}`,
      image: "https://your-logo-url.com/logo.png",
      handler: async function (response: any) {
        const t = toast.loading("Verifying payment...");
        try {
          const txId = response.razorpay_payment_id;
          // call backend to mark booking paid and create PaymentHistory
          const res = await fetch(
            `http://localhost:8080/booking/payment/${paymentBooking.id}?amount=${paymentAmount}&method=RAZORPAY&txId=${encodeURIComponent(
              txId
            )}`,
            {
              method: "PUT",
            }
          );

          if (!res.ok) {
            const txt = await res.text();
            console.error("Payment call failed:", txt);
            throw new Error("Payment failed");
          }

          // refresh user bookings & payments
          if (userEmail) await refreshUserData(userEmail);

          toast.dismiss(t);
          toast.success("💳 Payment successful!");
          setPaymentBooking(null);
        } catch (err) {
          console.error(err);
          toast.dismiss(t);
          toast.error("Payment verification failed.");
        }
      },
      prefill: {
        name: profile.name,
        email: profile.email,
        contact: profile.phone,
      },
      theme: {
        color: "#9333ea",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  /* -------------------- Logout -------------------- */
  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    toast.success("Logged out");
    navigate("/");
  };

  /* -------------------- Save profile -------------------- */
  const handleSaveProfile = async () => {
    try {
      const res = await fetch("http://localhost:8080/updateProfile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      const updated = await res.json();
      setProfile(updated);
      toast.success("Profile saved");
      // also update userEmail local if changed
      if (updated.email) localStorage.setItem("userEmail", updated.email);
    } catch (err) {
      console.error(err);
      toast.error("Could not save profile");
    }
  };

  /* -------------------- Rating submission -------------------- */
  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingPlanner || !ratingBooking) return toast.error("Invalid rating request");

    try {
      const res = await fetch("http://localhost:8080/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plannerId: ratingPlanner.id,
          userEmail: profile.email,
          userName: profile.name,
          rating: ratingValue,
          comment: ratingComment,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to submit rating");
      }

      toast.success("⭐ Rating submitted successfully!");
      setRatingPlanner(null);
      setRatingBooking(null);
      setRatingValue(5);
      setRatingComment("");

      // Refresh planners to get updated ratings
      const plannersRes = await fetch("http://localhost:8080/planners");
      if (plannersRes.ok) {
        const data = await plannersRes.json();
        setPlanners(data);
        setFilteredPlanners(data);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to submit rating");
    }
  };

  /* -------------------- Render -------------------- */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white flex transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-gray-800 p-6 hidden md:block transition-colors duration-200">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-600 to-teal-500 p-2 rounded-lg">
              <img src="https://your-logo-url.com/logo.png" alt="logo" className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Eventura</h3>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {[
            "Dashboard",
            "Find Planners",
            "AI Planner",
            "My Bookings",
            "Enquiries",
            "Payments",
            "Profile",
            "Logout",
          ].map((item) => (
            <button
              key={item}
              onClick={() => setActive(item as any)}
              className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl transition-all hover:scale-102 hover:shadow-lg ${active === item ? "bg-gradient-to-r from-purple-600 to-teal-500 text-white font-semibold shadow-md" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
            >
              <span className="w-6 h-6 flex items-center justify-center">
                {item === "Find Planners" && <Users className="w-5 h-5" />}
                {item === "Dashboard" && <Calendar className="w-5 h-5" />}
                {item === "AI Planner" && <BrainCircuit className="w-5 h-5" />}
                {item === "My Bookings" && <CheckCircle className="w-5 h-5" />}
                {item === "Enquiries" && <Search className="w-5 h-5" />}
                {item === "Profile" && <UserIcon className="w-5 h-5" />}
                {item === "Payments" && <Star className="w-5 h-5" />}
                {item === "Logout" && <LogOut className="w-5 h-5" />}
              </span>
              <span>{item}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main  */}
      <main className="flex-1 p-6">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="md:hidden p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <Menu className="w-6 h-6" />
            </div>
            <div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search planners or events..."
                className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right mr-4 hidden sm:block">
              <p className="text-sm text-gray-500 dark:text-gray-400">Welcome Back!</p>
              <p className="font-semibold">{profile.name || "Guest"}</p>
            </div>
            <img
              src="https://via.placeholder.com/80"
              alt="user"
              className="w-12 h-12 rounded-full ring-4 ring-teal-200/10 object-cover"
            />
          </div>
        </header>

        <section>
          {/* Dashboard */}
          {active === "Dashboard" && (
            <div className="space-y-8">
              {/* Hero Section */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-teal-900 p-8 text-white shadow-xl">
                <div className="relative z-10 max-w-2xl">
                  <h2 className="text-3xl font-bold mb-2">Welcome back, {profile.name || "Guest"}! </h2>
                  <p className="text-purple-100 text-lg mb-6">Ready to plan your next extraordinary event? Let's make it memorable.</p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform translate-x-12"></div>
                <div className="absolute right-0 bottom-0 h-64 w-64 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mb-16"></div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Calendar className="w-24 h-24 text-purple-500" />
                  </div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <h4 className="text-gray-500 dark:text-gray-400 font-medium text-sm">Upcoming Booking</h4>
                    <p className="mt-2 font-bold text-2xl text-gray-900 dark:text-white truncate">
                      {bookings.length > 0 ? bookings[0].eventName : "No upcoming events"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {bookings.length > 0 ? `${bookings[0].eventDate} • ${bookings[0].venue}` : "Book your first event today"}
                    </p>
                  </div>
                </div>

                <div className="group p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <MessageSquare className="w-24 h-24 text-teal-500" />
                  </div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center mb-4 text-teal-600 dark:text-teal-400">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <h4 className="text-gray-500 dark:text-gray-400 font-medium text-sm">Active Enquiries</h4>
                    <p className="mt-2 font-bold text-2xl text-gray-900 dark:text-white">{enquiries.length}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {enquiries.length > 0 ? "Waiting for planner response" : "No active enquiries"}
                    </p>
                  </div>
                </div>

                <div className="group p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Star className="w-24 h-24 text-yellow-500" />
                  </div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center mb-4 text-yellow-600 dark:text-yellow-400">
                      <Star className="w-6 h-6" />
                    </div>
                    <h4 className="text-gray-500 dark:text-gray-400 font-medium text-sm">Total Spent</h4>
                    <p className="mt-2 font-bold text-2xl text-gray-900 dark:text-white">
                      ₹{payments.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Across all bookings</p>
                  </div>
                </div>
              </div>

              {/* Recommended Planners */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" /> Top Rated Planners
                  </h3>
                  <button onClick={() => setActive("Find Planners")} className="text-teal-600 dark:text-teal-400 font-medium hover:underline">
                    View All
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {planners.slice(0, 3).map((p) => (
                    <div key={p.id} className="group bg-white dark:bg-dark-card rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <img src={p.profilePhoto || PLACEHOLDER_IMG} alt="p" className="w-16 h-16 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform" />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-teal-600 transition-colors">{p.fullName}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{p.specialization}</p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" /> {p.city || "Mumbai"}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-bold text-sm text-gray-900 dark:text-white">{p.averageRating?.toFixed(1) || "0.0"}</span>
                          <span className="text-xs text-gray-400">({p.totalRatings || 0})</span>
                        </div>
                        <button
                          onClick={() => {
                            setBookingPlanner(p);
                            setBookingForm(prev => ({ ...prev, name: profile.name, email: profile.email }));
                          }}
                          className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium rounded-lg group-hover:bg-teal-500 group-hover:text-white transition-all"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Find Planners */}
          {active === "Find Planners" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm sticky top-0 z-20 backdrop-blur-xl bg-white/80 dark:bg-dark-card/80">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Search className="w-5 h-5 text-teal-500" /> Find Your Perfect Planner
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{filteredPlanners.length} results found</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <select
                      value={filter.type}
                      onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                      className="w-full p-3 pl-10 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none appearance-none transition-all"
                    >
                      <option value="">All Event Types</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Concert">Concert</option>
                      <option value="Other">Other</option>
                    </select>
                    <Sparkles className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <input
                      value={filter.date}
                      placeholder="Date (YYYY-MM-DD)"
                      onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                      className="w-full p-3 pl-10 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    />
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <input
                      value={filter.location}
                      placeholder="Location (e.g. Mumbai)"
                      onChange={(e) => setFilter({ ...filter, location: e.target.value })}
                      className="w-full p-3 pl-10 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    />
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select
                      value={filter.budget}
                      onChange={(e) => setFilter({ ...filter, budget: e.target.value })}
                      className="w-full p-3 pl-10 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none appearance-none transition-all"
                    >
                      <option value="">Budget (any)</option>
                      <option value="10k">₹10k-40k</option>
                      <option value="30k">₹30k-80k</option>
                      <option value="50k">₹50k-1L</option>
                      <option value="1L">₹1L+</option>
                    </select>
                    <Calculator className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlanners.map((p) => (
                  <div
                    key={p.id}
                    className="group flex flex-col p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        <img src={p.profilePhoto || PLACEHOLDER_IMG} alt={p.fullName} className="w-20 h-20 rounded-xl object-cover shadow-md" />
                        <div className="absolute -bottom-2 -right-2 bg-teal-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          PRO
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white truncate group-hover:text-teal-600 transition-colors">{p.fullName}</h4>
                        <p className="text-sm text-teal-600 dark:text-teal-400 font-medium truncate">{p.specialization}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <MapPin className="w-3 h-3" /> {p.city || "Mumbai"}
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-sm">
                          <div className="flex items-center text-yellow-400">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-bold text-gray-900 dark:text-white ml-1">{p.averageRating?.toFixed(1) || "0.0"}</span>
                          </div>
                          <span className="text-gray-400 text-xs">• {p.totalRatings || 0} reviews</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Starting from</div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">₹10,000</div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setBookingPlanner(p);
                            setBookingForm(prev => ({ ...prev, name: profile.name, email: profile.email }));
                          }}
                          className="px-3 py-2 bg-gradient-to-br from-indigo-900 via-purple-900 to-teal-900 text-white font-semibold rounded-lg hover:opacity-90 transition-all text-sm shadow-md"
                        >
                          Book Now
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const res = await fetch(`http://localhost:8080/events/byPlanner/${p.id}`);
                              if (res.ok) {
                                const events = await res.json();
                                setViewEventsPlanner({ ...p, events });
                              } else {
                                setViewEventsPlanner(p); // Fallback if fetch fails
                                toast.error("Could not load events");
                              }
                            } catch (e) {
                              console.error(e);
                              setViewEventsPlanner(p);
                            }
                          }}
                          className="px-3 py-2 bg-gradient-to-br from-indigo-900 via-purple-900 to-teal-900 text-white font-medium rounded-lg hover:opacity-90 transition-all text-sm shadow-md"
                        >
                          View Portfolio
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          setEnquiryPlanner(p);
                          setEnquiryForm(prev => ({ ...prev, name: profile.name, email: profile.email }));
                        }}
                        className="w-full px-3 py-2 bg-gradient-to-br from-indigo-900 via-purple-900 to-teal-900 text-white font-medium rounded-lg hover:opacity-90 transition-all text-sm flex items-center justify-center gap-2 shadow-sm"
                      >
                        <MessageSquare className="w-4 h-4" /> Send Enquiry
                      </button>
                    </div>
                  </div>
                ))}

                {filteredPlanners.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No planners found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                      We couldn't find any planners matching your filters. Try adjusting your search criteria.
                    </p>
                    <button
                      onClick={() => {
                        setFilter({ type: "", date: "", location: "", budget: "" });
                        setQuery("");
                      }}
                      className="mt-4 px-4 py-2 text-teal-600 font-medium hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-all"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>

              {/* Booking Modal */}
              {bookingPlanner && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl">
                    <h3 className="text-xl font-bold mb-4 text-teal-400">Book {bookingPlanner.fullName}</h3>
                    <form onSubmit={handleBookingSubmit} className="space-y-3">
                      <input type="text" placeholder="Your Name" value={bookingForm.name} onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })} className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700" />
                      <input type="email" placeholder="Your Email" value={bookingForm.email} onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })} className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700" />
                      <input type="text" placeholder="Event Type" value={bookingForm.eventType} onChange={(e) => setBookingForm({ ...bookingForm, eventType: e.target.value })} className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700" />
                      <input type="text" placeholder="Event Name" value={bookingForm.eventName} onChange={(e) => setBookingForm({ ...bookingForm, eventName: e.target.value })} className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700" />
                      <input type="date" value={bookingForm.eventDate} onChange={(e) => setBookingForm({ ...bookingForm, eventDate: e.target.value })} className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700" />
                      <input type="text" placeholder="Venue" value={bookingForm.venue} onChange={(e) => setBookingForm({ ...bookingForm, venue: e.target.value })} className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700" />
                      <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setBookingPlanner(null)} className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-purple-500 text-black font-semibold">Confirm Booking</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Enquiry Modal */}
              {enquiryPlanner && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl">
                    <h3 className="text-xl font-bold mb-4 text-purple-400">Send Enquiry to {enquiryPlanner.fullName}</h3>
                    <form onSubmit={handleEnquirySubmit} className="space-y-3">
                      <input type="text" placeholder="Your Name" value={enquiryForm.name} onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })} className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700" />
                      <input type="email" placeholder="Your Email" value={enquiryForm.email} onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })} className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700" />
                      <textarea placeholder="Your Message" value={enquiryForm.enquiryDetails} onChange={(e) => setEnquiryForm({ ...enquiryForm, enquiryDetails: e.target.value })} className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700" />
                      <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setEnquiryPlanner(null)} className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-teal-500 text-black font-semibold">Send Enquiry</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* View Events Modal */}
              {viewEventsPlanner && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-3xl shadow-2xl p-6 relative">
                    <button onClick={() => setViewEventsPlanner(null)} className="absolute top-3 right-3 text-gray-400 hover:text-white">✕</button>
                    <h3 className="text-2xl font-bold mb-4 text-teal-400">Events by {viewEventsPlanner.fullName}</h3>
                    <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
                      {viewEventsPlanner.events && viewEventsPlanner.events.length > 0 ? (
                        viewEventsPlanner.events.map((ev, i) => (
                          <div key={i} className="bg-gray-800/70 border border-gray-700 rounded-xl p-4 flex gap-4 hover:bg-gray-800 transition-all">
                            <img src={ev.image || PLACEHOLDER_IMG} alt={ev.name} className="w-24 h-24 rounded-lg object-cover border border-gray-700" />
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-white">{ev.name}</h4>
                              <p className="text-sm text-gray-400">{ev.theme}</p>
                              <p className="text-sm text-teal-400 mt-1">{ev.date}</p>
                              <p className="text-sm text-gray-300 mt-1">₹{ev.price ?? "—"}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-400 text-center py-10">No events hosted by this planner yet.</div>
                      )}
                    </div>

                    <div className="mt-5 flex justify-end">
                      <button onClick={() => setViewEventsPlanner(null)} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-all">Close</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* My Bookings */}
          {active === "My Bookings" && (
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">My Bookings</h3>
              <div className="overflow-auto rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm">
                <table className="w-full min-w-[700px] text-left">
                  <thead className="text-gray-400 text-sm">
                    <tr>
                      <th className="p-4">Event Name</th>
                      <th className="p-4">Event Type</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Venue</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length > 0 ? (
                      bookings.map((b) => (
                        <tr key={b.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                          <td className="p-4">{b.eventName}</td>
                          <td className="p-4">{b.eventType}</td>
                          <td className="p-4">{b.eventDate}</td>
                          <td className="p-4">{b.venue}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${String(b.status).toUpperCase() === "CONFIRMED" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"}`}>
                              {b.status ?? "PENDING"}
                            </span>
                          </td>
                          <td className="p-4">
                            {String(b.status).toUpperCase() === "CONFIRMED" && b.paymentStatus !== "PAID" && (
                              <button onClick={() => openPaymentModal(b)} className="px-3 py-1 rounded-lg bg-gradient-to-r from-teal-500 to-purple-500 text-white font-semibold shadow-sm hover:shadow-md transition-all">
                                {b.paymentStatus === "PARTIALLY_PAID" ? "Pay Remaining" : "Pay Now"}
                              </button>
                            )}
                            {b.paymentStatus === "PAID" && (
                              <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium">Paid</span>
                            )}
                          </td>
                          <td className="p-4">
                            {b.paymentStatus === "PAID" && b.plannerId && (
                              <button
                                onClick={async () => {
                                  const plannerRes = await fetch(`http://localhost:8080/planners`);
                                  if (plannerRes.ok) {
                                    const allPlanners = await plannerRes.json();
                                    const planner = allPlanners.find((p: Planner) => p.id === b.plannerId);
                                    if (planner) {
                                      setRatingPlanner(planner);
                                      setRatingBooking(b);
                                    }
                                  }
                                }}
                                className="px-3 py-1 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-medium text-sm shadow-sm transition-all flex items-center gap-1"
                              >
                                <Star className="w-3 h-3" /> Rate
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-gray-500 dark:text-gray-400">No bookings found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payments */}
          {active === "Payments" && (
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Payment History</h3>
              <div className="overflow-auto rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm">
                <table className="w-full min-w-[700px] text-left">
                  <thead className="text-gray-400 text-sm">
                    <tr>
                      <th className="p-4">Transaction ID</th>
                      <th className="p-4">Event</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Method</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length > 0 ? (
                      payments.map((p) => (
                        <tr key={p.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                          <td className="p-4">{p.transactionId}</td>
                          <td className="p-4">{bookings.find((b) => b.id === p.bookingId)?.eventName ?? "—"}</td>
                          <td className="p-4">₹{p.amount}</td>
                          <td className="p-4">{p.paymentMethod}</td>
                          <td className="p-4">{new Date(p.paymentDate).toLocaleString()}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${p.status === "PAID" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"}`}>{p.status}</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-gray-500 dark:text-gray-400">No payments found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Enquiries */}
          {active === "Enquiries" && (
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">My Enquiries</h3>
              <div className="space-y-4">
                {enquiries.length > 0 ? (
                  enquiries.map((q) => (
                    <div key={q.id} className="p-4 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 flex items-center justify-between shadow-sm">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">General Enquiry</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{q.name}</div>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-lg text-sm font-medium ${q.status === "Replied" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}>{q.status || "Pending"}</div>
                        <button onClick={() => setViewReplyEnquiry(q)} className="mt-2 block px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-teal-500 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all">View Reply</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 p-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">No enquiries found.</div>
                )}
              </div>
            </div>
          )}

          {/* AI Planner */}
          {active === "AI Planner" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-500" /> AI Planner Assistant
                </h3>
              </div>

              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setAiTab("recommend")}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${aiTab === "recommend" ? "bg-purple-600 text-white shadow-lg" : "bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800"}`}
                >
                  <Users className="w-5 h-5" /> Recommendation Engine
                </button>
                <button
                  onClick={() => setAiTab("budget")}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${aiTab === "budget" ? "bg-teal-500 text-white shadow-lg" : "bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800"}`}
                >
                  <Calculator className="w-5 h-5" /> Budget Predictor
                </button>
              </div>

              {aiTab === "recommend" ? (
                <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                  <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Find your perfect planner</h4>
                  <div className="flex gap-3 mb-6">
                    <input
                      value={aiCriteria}
                      onChange={(e) => setAiCriteria(e.target.value)}
                      placeholder="Describe what you're looking for (e.g., 'Best wedding planner in Mumbai for a luxury theme')"
                      className="flex-1 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                    <button
                      onClick={handleGetRecommendations}
                      disabled={aiLoading}
                      className="px-6 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all disabled:opacity-50"
                    >
                      {aiLoading ? "Analyzing..." : "Ask AI"}
                    </button>
                  </div>

                  {aiRecommendation && (
                    <div className="p-6 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30">
                      <h5 className="font-semibold text-purple-700 dark:text-purple-300 mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4" /> AI Recommendations</h5>
                      <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {aiRecommendation}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                  <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Estimate your event budget</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Type</label>
                      <select
                        value={budgetForm.type}
                        onChange={(e) => setBudgetForm({ ...budgetForm, type: e.target.value })}
                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option>Wedding</option>
                        <option>Birthday</option>
                        <option>Corporate</option>
                        <option>Concert</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Theme</label>
                      <input
                        value={budgetForm.theme}
                        onChange={(e) => setBudgetForm({ ...budgetForm, theme: e.target.value })}
                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Guest Count</label>
                      <input
                        value={budgetForm.guests}
                        onChange={(e) => setBudgetForm({ ...budgetForm, guests: e.target.value })}
                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                      <input
                        value={budgetForm.location}
                        onChange={(e) => setBudgetForm({ ...budgetForm, location: e.target.value })}
                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handlePredictBudget}
                    disabled={aiLoading}
                    className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold transition-all disabled:opacity-50 mb-6"
                  >
                    {aiLoading ? "Calculating..." : "Predict Budget"}
                  </button>

                  {budgetPrediction && (
                    <div className="p-6 rounded-xl bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-900/30">
                      <h5 className="font-semibold text-teal-700 dark:text-teal-300 mb-3 flex items-center gap-2"><Calculator className="w-4 h-4" /> Estimated Budget Analysis</h5>
                      <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {budgetPrediction}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Profile */}
          {active === "Profile" && (
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Profile</h3>
              <div className="max-w-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                <label className="block mb-3 text-sm text-gray-500 dark:text-gray-400">Full name</label>
                <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none mb-4" />

                <label className="block mb-3 text-sm text-gray-500 dark:text-gray-400">Email</label>
                <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none mb-4" />

                <label className="block mb-3 text-sm text-gray-500 dark:text-gray-400">Phone</label>
                <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none mb-4" />

                <label className="block mb-3 text-sm text-gray-500 dark:text-gray-400">City</label>
                <input value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none mb-4" />

                <div className="flex gap-3 mt-4">
                  <button onClick={handleSaveProfile} className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-teal-500 text-white font-semibold shadow-md hover:shadow-lg transition-all">Save</button>
                  <button className="px-6 py-3 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Logout */}
          {active === "Logout" && (
            <div className="text-center p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">You're about to sign out</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Thanks for using Eventura.</p>
              <button onClick={handleLogout} className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-teal-500 text-white font-semibold shadow-md hover:shadow-lg transition-all">Confirm Logout</button>
            </div>
          )}
        </section>
      </main>

      {/* Payment Modal  */}

      {paymentBooking && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl relative">
            <button onClick={() => setPaymentBooking(null)} className="absolute top-3 right-3 text-gray-400 hover:text-white">✕</button>

            <h3 className="text-2xl font-bold text-teal-400 mb-2">Pay for {paymentBooking.eventName}</h3>

            {paymentBooking.paymentStatus !== "PARTIALLY_PAID" && (
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setPaymentOption("FULL")}
                  className={`flex-1 py-2 rounded-lg border ${paymentOption === "FULL" ? "bg-teal-500/20 border-teal-500 text-teal-400" : "border-gray-700 text-gray-400"}`}
                >
                  Full Payment
                </button>
                <button
                  onClick={() => setPaymentOption("TOKEN")}
                  className={`flex-1 py-2 rounded-lg border ${paymentOption === "TOKEN" ? "bg-purple-500/20 border-purple-500 text-purple-400" : "border-gray-700 text-gray-400"}`}
                >
                  Token (20%)
                </button>
              </div>
            )}

            <div className="bg-gray-800/50 p-4 rounded-xl mb-6 space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Total Amount</span>
                <span>₹{totalPrice}</span>
              </div>
              {paymentOption === "TOKEN" && paymentBooking.paymentStatus !== "PARTIALLY_PAID" && (
                <div className="flex justify-between text-purple-400">
                  <span>Token Amount (20%)</span>
                  <span>₹{Math.round(totalPrice * 0.2)}</span>
                </div>
              )}
              {paymentBooking.paymentStatus === "PARTIALLY_PAID" && (
                <div className="flex justify-between text-purple-400">
                  <span>Remaining Balance</span>
                  <span>₹{paymentAmount}</span>
                </div>
              )}
              <div className="border-t border-gray-700 pt-2 flex justify-between text-xl font-bold text-white">
                <span>To Pay Now</span>
                <span>₹{paymentAmount}</span>
              </div>
            </div>

            <button
              onClick={handleRazorpayPayment}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-purple-600 text-white font-bold text-lg hover:opacity-90 transition-all"
            >
              Pay via Razorpay
            </button>

            {/* <div className="flex gap-3">
              <input placeholder="Expiry (MM/YY)" value={paymentForm.expiry} onChange={(e) => setPaymentForm({ ...paymentForm, expiry: e.target.value })} className="w-1/2 p-3 rounded-lg bg-gray-800 border border-gray-700" />
              <input placeholder="CVV" value={paymentForm.cvv} onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })} className="w-1/2 p-3 rounded-lg bg-gray-800 border border-gray-700" />
            </div> */}

            {/* <button onClick={handlePaymentSubmit} className="mt-5 w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-teal-500 text-black font-bold">Pay Securely</button> */}
          </div>
        </div>

      )}
      {/* Enquiry Reply Modal */}
      {viewReplyEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-dark-card p-6 border border-gray-200 dark:border-gray-800 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Enquiry Details</h3>
              <button onClick={() => setViewReplyEnquiry(null)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                <LogOut className="w-5 h-5 rotate-180" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Your Question</p>
                <p className="text-gray-800 dark:text-gray-200">{viewReplyEnquiry.enquiryDetails}</p>
              </div>

              <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900/30">
                <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">Admin Reply</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {viewReplyEnquiry.reply || <span className="italic text-gray-500 dark:text-gray-400">No reply yet. Please check back later.</span>}
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setViewReplyEnquiry(null)}
                  className="px-5 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {ratingPlanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-gray-900 border border-gray-700 p-6 shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-yellow-400">Rate {ratingPlanner.fullName}</h3>
            <form onSubmit={handleRatingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Rating</label>
                <div className="flex gap-2 justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingValue(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 ${star <= ratingValue
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-600"
                          }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-center text-gray-400 text-sm mb-4">
                  {ratingValue === 1 && "Poor"}
                  {ratingValue === 2 && "Fair"}
                  {ratingValue === 3 && "Good"}
                  {ratingValue === 4 && "Very Good"}
                  {ratingValue === 5 && "Excellent"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Comment (Optional)</label>
                <textarea
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="Share your experience with this planner..."
                  className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 outline-none"
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setRatingPlanner(null);
                    setRatingBooking(null);
                    setRatingValue(5);
                    setRatingComment("");
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold hover:opacity-90 transition-all"
                >
                  Submit Rating
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
