import { useState, useRef } from "react";
import { motion } from "framer-motion";
import ERDiagram from "../components/ERDiagram";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Lucide Icons
import {
  ShoppingCart,
  Hospital,
  GraduationCap,
  Car,
  Wallet,
  Users,
  Boxes,
  Utensils,
  MessageCircle,
} from "lucide-react";

// ✅ Example list (kept outside component — allowed)
const exampleList = [
  {
    title: "E-commerce Store",
    icon: <ShoppingCart className="w-8 h-8 text-indigo-500" />,
    category: "Retail",
    description: "Products, cart, orders, reviews.",
    text: `An e-commerce platform where customers browse products, add items to cart,
place orders, make payments, write reviews, and track deliveries. Admins manage inventory.`,
  },
  {
    title: "Hospital Management",
    icon: <Hospital className="w-8 h-8 text-pink-500" />,
    category: "Healthcare",
    description: "Patients, doctors, appointments, billing.",
    text: `Appointments, patient records, doctor schedules, prescriptions, medical reports, billing.`,
  },
  {
    title: "Learning LMS",
    icon: <GraduationCap className="w-8 h-8 text-green-500" />,
    category: "Education",
    description: "Courses, quizzes, certificates.",
    text: `Instructors upload lessons & quizzes. Students enroll, track progress, earn certificates.`,
  },
  {
    title: "Ride-Sharing App",
    icon: <Car className="w-8 h-8 text-yellow-500" />,
    category: "Transport",
    description: "Riders, drivers, trips, payments.",
    text: `Ride booking, driver matching, GPS tracking, trips, fare calculation, payments.`,
  },
  {
    title: "FinTech Wallet",
    icon: <Wallet className="w-8 h-8 text-blue-500" />,
    category: "Finance",
    description: "Wallet, KYC, bank linking.",
    text: `Deposits, withdrawals, transfers, KYC, linked bank accounts, analytics.`,
  },
  {
    title: "CRM System",
    icon: <Users className="w-8 h-8 text-purple-500" />,
    category: "SaaS",
    description: "Leads, pipeline, tasks.",
    text: `Managing leads, client calls, tasks, meeting logs, sales pipeline analytics.`,
  },
  {
    title: "Inventory System",
    icon: <Boxes className="w-8 h-8 text-orange-500" />,
    category: "Retail",
    description: "Stock, warehouses, suppliers.",
    text: `Inventory tracking, warehouses, purchase orders, suppliers, stock levels.`,
  },
  {
    title: "Restaurant Ordering",
    icon: <Utensils className="w-8 h-8 text-red-500" />,
    category: "Food",
    description: "Menu, orders, billing.",
    text: `Menu items, table management, order tracking, billing, kitchen workflow.`,
  },
  {
    title: "Social Network",
    icon: <MessageCircle className="w-8 h-8 text-cyan-500" />,
    category: "Social",
    description: "Posts, comments, likes.",
    text: `Profiles, posts, comments, likes, messaging, notifications.`,
  },
];

const categories = [
  "All",
  "Retail",
  "Healthcare",
  "Education",
  "Transport",
  "Finance",
  "SaaS",
  "Food",
  "Social",
];

// ✅ ✅ ✅ MAIN COMPONENT
export default function BusinessModelPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [input, setInput] = useState("");
  const [parsedSchema, setParsedSchema] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const contentRef = useRef(null);
  const erDiagramRef = useRef(null);

  // ✅ Generate Schema
  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setParsedSchema(null);

    try {
      const res = await fetch("http://localhost:8080/api/business-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelName: input }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      const parsed = JSON.parse(data.schemaDescription || "{}");

      parsed.entities = parsed.entities || [];
      parsed.relationships = parsed.relationships || [];

      setParsedSchema(parsed);
    } catch (err) {
      setError("Failed to fetch schema.");
    }

    setLoading(false);
  };

  // ✅ Export PDF
  const handleExportPDF = async () => {
    const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });

    pdf.text("Business Model → Database Schema", 40, 40);

    pdf.save("BusinessModel.pdf");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-6xl font-extrabold text-center"
      >
        <span className="grad-text">Business Model</span> → Database Schema
      </motion.h1>

      {/* ✅ CATEGORY FILTER */}
      <div className="flex flex-wrap justify-center gap-3 mt-10 mb-14">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border shadow-sm
            ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ✅ SAMPLE EXAMPLES */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
        {exampleList
          .filter(
            (ex) => selectedCategory === "All" || ex.category === selectedCategory
          )
          .map((ex, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border"
            >
              <div className="mb-3">{ex.icon}</div>

              <h3 className="text-xl font-semibold text-indigo-600">
                {ex.title}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                {ex.description}
              </p>

              <button
                onClick={() => setInput(ex.text)}
                className="mt-6 w-full py-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white font-medium"
              >
                Use this Example
              </button>
            </motion.div>
          ))}
      </div>

      {/* ✅ Input Box */}
      <textarea
        rows={5}
        className="w-full p-4 rounded-2xl border bg-gray-50 dark:bg-gray-900"
        placeholder="Describe your business model..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {/* ✅ ACTION BUTTONS */}
      <div className="flex justify-center gap-4 mt-10">
        <button
          onClick={handleGenerate}
          className="px-6 py-2 rounded-2xl bg-indigo-600 text-white shadow-lg"
        >
          {loading ? "Generating..." : "Generate Database"}
        </button>

        {parsedSchema && (
          <button
            onClick={handleExportPDF}
            className="px-6 py-2 rounded-2xl bg-purple-600 text-white shadow-lg"
          >
            Export PDF
          </button>
        )}
      </div>

      {/* ✅ Error */}
      {error && (
        <p className="text-center text-red-500 font-medium mt-6">{error}</p>
      )}

      {/* ✅ OUTPUT */}
      {parsedSchema && (
        <div ref={contentRef} className="mt-14 space-y-12">
          <h2 className="text-3xl font-bold">Entities</h2>
          <pre>{JSON.stringify(parsedSchema.entities, null, 2)}</pre>

          <h2 className="text-3xl font-bold">Relationships</h2>
          <pre>{JSON.stringify(parsedSchema.relationships, null, 2)}</pre>

          <h2 className="text-3xl font-bold">ER Diagram</h2>
          <ERDiagram ref={erDiagramRef} schema={parsedSchema} />
        </div>
      )}
    </div>
  );
}
