"use client";

import { motion } from "framer-motion";
import type { ComponentProps } from "react";

interface FadeUpProps extends ComponentProps<typeof motion.div> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
}

export function FadeUpContainer({ children, className, stagger = 0.05, delay = 0.2 }: FadeUpProps) {
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div variants={container} initial='hidden' animate='show' className={className}>
      {children}
    </motion.div>
  );
}

FadeUpContainer.displayName = "FadeUpContainer";

export function FadeUpItem({ children, className }: React.HTMLProps<HTMLDivElement>) {
  const item = {
    hidden: {
      opacity: 0,
      y: 16,
      filter: "blur(4px)",
    },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 19,
        mass: 1.2,
      },
    },
  };

  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  );
}
