import { motion } from "framer-motion";

export default function LoadingDots() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex gap-3" style={{ perspective: 1000 }}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{
                y: [0, -18, 0],
                scale: [1, 1.3, 0.95],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut", // ✅ aquí ya no falla
            }}
            className="w-4 h-4 rounded-full bg-[#f4bc3c]"
            style={{
              boxShadow: "0px 6px 0px rgba(0,0,0,0.25)"
            }}
          />
        ))}
      </div>
    </div>
  );
}