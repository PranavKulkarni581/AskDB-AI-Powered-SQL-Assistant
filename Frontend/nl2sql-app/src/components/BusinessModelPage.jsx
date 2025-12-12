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

// ✅ Example list
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

export default function BusinessModelPage() {
  const [input, setInput] = useState("");
  const [parsedSchema, setParsedSchema] = useState(null);

  // ✅ YOU REMOVED THIS — ADDED BACK
  const [sqlScript, setSqlScript] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const contentRef = useRef(null);
  const erDiagramRef = useRef(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setParsedSchema(null);
    setSqlScript("");

    try {
      const res = await fetch("http://localhost:8080/api/business-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelName: input }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();

      // ✅ Save SQL Script
      setSqlScript(data.sqlScript || "");

      let parsed = {};

      try {
        parsed = JSON.parse(data.schemaDescription || "{}");
      } catch {
        parsed = {};
      }

      parsed.entities = parsed.entities || [];
      parsed.relationships = parsed.relationships || [];
      parsed.description = parsed.description || "No description provided.";

      parsed.relationships = parsed.relationships.map((rel, i) => ({
        from: rel.from_entity || `Entity${i}`,
        to: rel.to_entity || `Entity${i}`,
        type: rel.type || "one-to-many",
      }));

      parsed.entities = parsed.entities.map((entity) => ({
        ...entity,
        attributes: (entity.attributes || []).map((attr) => ({
          name: attr.name,
          type: attr.data_type,
          primaryKey: attr.PK,
          foreignKey: attr.FK,
          autoIncrement: attr.AI,
          unique: attr.unique,
          notNull: attr.not_null,
        })),
      }));

      setParsedSchema(parsed);
    } catch (err) {
      console.error("❌ Error:", err);
      setError("Failed to fetch or parse schema.");
    }

    setLoading(false);
  };

  // ✅ PDF EXPORT unchanged (your design preserved)
  const handleExportPDF = async () => {
    if (!parsedSchema) return;

    const { entities, relationships, description } = parsedSchema;
    const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });

    pdf.setFont("Times", "normal");
    let y = 40;

    pdf.setFontSize(20);
    pdf.text("Business Model → Database Schema", 40, y);
    y += 30;

    pdf.setFontSize(16);
    pdf.text("Entities", 40, y);
    y += 20;

    pdf.setFontSize(12);

    entities.forEach((entity) => {
      pdf.setFont("Times", "bold");
      pdf.text(`• ${entity.name}`, 50, y);
      y += 16;

      pdf.setFont("Times", "normal");
      entity.attributes.forEach((attr) => {
        let line = `  - ${attr.name} (${attr.type})`;
        if (attr.primaryKey) line += " [PK]";
        if (attr.foreignKey) line += ` [FK → ${attr.foreignKey}]`;
        if (attr.autoIncrement) line += " [AI]";
        if (attr.unique) line += " [UQ]";
        if (attr.notNull) line += " [NOT NULL]";

        pdf.text(line, 60, y);
        y += 14;
      });

      y += 8;
    });

    pdf.addPage();
    y = 40;
    pdf.setFontSize(16);
    pdf.text("Relationships", 40, y);
    y += 20;

    pdf.setFontSize(12);
    relationships.forEach((rel) => {
      pdf.text(`• ${rel.from} → ${rel.to} (${rel.type})`, 50, y);
      y += 14;
    });

    pdf.addPage();
    y = 40;
    pdf.setFontSize(16);
    pdf.text("Description", 40, y);
    y += 20;

    const lines = pdf.splitTextToSize(description, 500);
    pdf.text(lines, 50, y);

    pdf.save("BusinessModel.pdf");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-6xl font-extrabold text-center"
      >
        <span className="grad-text">Business Model</span> → Database Schema
      </motion.h1>

      {/* CATEGORY FILTER */}
      <div className="flex flex-wrap justify-center gap-3 mt-10 mb-14">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border shadow-sm ${selectedCategory === cat
                ? "bg-indigo-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* EXAMPLES */}
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
              className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border"
            >
              <div className="mb-3">{ex.icon}</div>
              <h3 className="text-xl font-semibold text-indigo-600">{ex.title}</h3>
              <p className="mt-2 text-sm">{ex.description}</p>
              <button
                onClick={() => setInput(ex.text)}
                className="mt-6 w-full py-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white font-medium"
              >
                Use this Example
              </button>
            </motion.div>
          ))}
      </div>

      {/* INPUT TEXTAREA */}
      <textarea
        className="w-full p-4 rounded-2xl border bg-gray-50 dark:bg-gray-900"
        rows={5}
        placeholder="Describe your business model..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {/* BUTTONS */}
      <div className="flex justify-center mt-10 mb-10 gap-4">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`px-6 py-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 text-white font-medium ${loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105"
            }`}
        >
          {loading ? "Generating..." : "Generate Database"}
        </button>

        {parsedSchema && (
          <button
            onClick={handleExportPDF}
            className="px-6 py-2 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 text-white font-medium hover:scale-105"
          >
            Export PDF
          </button>
        )}
      </div>

      {error && <p className="text-center text-red-500">{error}</p>}

      {parsedSchema && (
        <div ref={contentRef} className="mt-14 space-y-12">
          {/* ENTITIES */}
          <div>
            <h2 className="text-3xl font-bold mb-4 grad-text">Entities</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {parsedSchema.entities.map((entity, idx) => (
                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">

                  <h3 className="text-xl font-semibold">{entity.name}</h3>
                  <ul className="mt-2 list-disc list-inside">
                    {entity.attributes.map((attr, i) => (
                      <li key={i}>
                        {attr.name} ({attr.type})
                        {attr.primaryKey && " PK"}
                        {attr.autoIncrement && " AI"}
                        {attr.unique && " UQ"}
                        {attr.foreignKey && ` FK→${attr.foreignKey}`}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* RELATIONSHIPS */}
          <div>
            <h2 className="text-3xl font-bold mb-4 grad-text">Relationships</h2>
            <ul>
              {parsedSchema.relationships.map((rel, idx) => (
                <li key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded mt-4">
                  <strong>{rel.from}</strong> → <strong>{rel.to}</strong> ({rel.type})
                </li>

              ))}
            </ul>
          </div>

          {/* ✅ SQL SCRIPT SECTION */}
          {sqlScript && (
            <div>
              <h2 className="text-3xl font-bold mb-4 grad-text">Generated SQL</h2>

              <pre className="bg-gray-900 text-green-400 p-4 rounded-xl overflow-auto text-sm shadow-lg">
                {sqlScript}
              </pre>

              <button
                onClick={() => {
                  const blob = new Blob([sqlScript], { type: "text/sql" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "schema.sql";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
               className="mt-4 px-6 py-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 text-white font-medium hover:scale-105 transition"
>
                Download SQL
              </button>
            </div>
          )}

          {/* DESCRIPTION */}
          <div>
            <h2 className="text-3xl font-bold mb-4 grad-text">Description</h2>
            <p>{parsedSchema.description}</p>
          </div>

          {/* ER DIAGRAM */}
          <div>
            <h2 className="text-3xl font-bold mb-4 grad-text">ER Diagram</h2>
            <ERDiagram ref={erDiagramRef} schema={parsedSchema} />
          </div>
        </div>
      )}
    </div>
  );
}
