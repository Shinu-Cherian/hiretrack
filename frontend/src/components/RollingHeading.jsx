import { motion } from "motion/react";

export function RollingHeading({
  title,
  className = "text-6xl md:text-9xl font-black mb-8 uppercase tracking-tight flex flex-wrap justify-center gap-x-4 gap-y-2 md:gap-x-8 leading-[1.1]",
}) {
  return (
    <motion.h2
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1 }}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
        hidden: {},
      }}
      className={className}
      style={{ perspective: 1000 }}
    >
      {title}
    </motion.h2>
  );
}

export function RollingWord({ text, className = "" }) {
  const wordVariants = {
    hidden: { y: "120%", rotateX: -90, opacity: 0 },
    visible: {
      y: "0%",
      rotateX: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1,
        opacity: { duration: 0.4 },
      },
    },
  };

  return (
    <span className={`rolling-word relative overflow-hidden inline-flex p-2 -m-2 ${className}`}>
      <motion.span
        className="rolling-word-inner inline-block pt-1 pr-3"
        variants={wordVariants}
        style={{ transformOrigin: "50% 50% -50px" }}
      >
        {text}
      </motion.span>
    </span>
  );
}
