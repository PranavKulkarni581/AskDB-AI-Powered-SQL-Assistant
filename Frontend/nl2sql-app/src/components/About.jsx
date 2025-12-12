import { motion } from "framer-motion";
import { Github, Linkedin, Rocket } from "lucide-react";
import haripriyaImg from "../assets/HARIPRIYA.png";
import tanviImg from "../assets/TANVI.png";
import pranavImg from "../assets/PRANAV.png";


export default function AboutUs() {
  const team = [
    {
      name: "Pranav Kulkarni",
      role: "Full Stack Developer",
      img: pranavImg,
      github: "https://github.com/yourGithub",
      linkedin: "https://linkedin.com/in/yourLinkedIn",
      desc: "Built the UI/UX and implemented the complete frontend with seamless user flow.",
    },
    {
      name: "Haripriya Yele",
      role: "Backend & AI Engineer",
      img: haripriyaImg,
      github: "https://github.com/yourGithub2",
      linkedin: "https://linkedin.com/in/yourLinkedIn2",
      desc: "Developed backend architecture, API engine and integrated AI schema generation.",
    },
    {
      name: "Tanvi Diwan",
      role: "Data & System Designer",
      img: tanviImg,
      github: "https://github.com/yourGithub3",
      linkedin: "https://linkedin.com/in/yourLinkedIn3",
      desc: "Designed ER models, schema logic, database flow and validation pipelines.",
    },
  ];

  const timeline = [
    { year: "2024 Oct", title: "Idea Born", desc: "We wanted to eliminate the struggle of writing SQL manually." },
    { year: "2024 Dec", title: "Prototype Launched", desc: "NL → SQL conversion working with basic schema generation." },
    { year: "2025 Jan", title: "AI-Driven Upgrade", desc: "Integrated advanced AI to generate complete ERD + SQL DDL." },
    { year: "2025 Feb", title: "Public Release", desc: "Launched this platform with production-ready UI & performance." },
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Title */}
    <motion.h1
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-center"
        >
          About <span className="grad-text">Us</span> 
        </motion.h1>
       

        {/* Mission Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="
            mt-12 p-8 rounded-3xl backdrop-blur-xl
            bg-white/20 dark:bg-gray-800/30
            border border-white/30 dark:border-gray-700/40 
            shadow-lg shadow-indigo-500/10
          "
        >
          <div className="flex items-center gap-3 mb-4">
            <Rocket className="w-7 h-7 text-indigo-500 drop-shadow" />
            <h3 className="text-2xl font-semibold grad-text">Our Mission</h3>
          </div>

          <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
            Our mission is simple — make databases accessible to everyone. We convert natural
            language into production-ready SQL, ER diagrams, and full database schemas — instantly.
          </p>
        </motion.div>

        {/* Team Section */}
        <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {team.map((m, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="
                p-8 rounded-3xl backdrop-blur-xl
                bg-white/20 dark:bg-gray-800/30
                border border-white/30 dark:border-gray-700/40
                shadow-xl hover:shadow-2xl
                hover:scale-[1.02] transition
              "
            >
              <div className="w-28 h-28 mx-auto rounded-full overflow-hidden shadow-lg shadow-indigo-600/20">
                <img src={m.img} alt={m.name} className="object-cover w-full h-full" />
              </div>

              <h3 className="mt-5 text-xl font-semibold text-center grad-text">{m.name}</h3>

              <p className="text-center text-sm text-indigo-400 font-medium mt-1">
                {m.role}
              </p>

              <p className="mt-3 text-sm text-center text-slate-700 dark:text-slate-300">
                {m.desc}
              </p>

              <div className="mt-5 flex justify-center gap-4">
                <a
                  href={m.linkedin}
                  className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition"
                  target="_blank"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href={m.github}
                  className="p-2 rounded-full bg-black/80 hover:bg-black text-white transition"
                  target="_blank"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        

      </div>
    </section>
  );
}
