"use client";
import { motion, Variants, type Variant } from "framer-motion";
import * as React from "react";

type RevealProps = {
  as?: keyof React.JSX.IntrinsicElements;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
};

const hiddenVariant: Variant = { opacity: 0, y: 24, filter: "blur(6px)" };
const showVariant: Variant = {
  opacity: 1,
  y: 0,
  filter: "blur(0px)",
  transition: { type: "spring", stiffness: 120, damping: 16 },
};
const defaultVariants: Variants = { hidden: hiddenVariant, show: showVariant };

const motionMap = {
  div: motion.div,
  section: motion.section,
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
} as const;

type MotionTag = keyof typeof motionMap;

export function Reveal({ as = "div", children, className, delay = 0, y = 24, once = true }: RevealProps) {
  const tag: MotionTag = (as in motionMap ? (as as MotionTag) : "div");
  const Component = motionMap[tag];
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-10% 0px -10% 0px" }}
      variants={{
        hidden: { ...(hiddenVariant as object), y },
        show: {
          ...(showVariant as object),
          y: 0,
          transition: { type: "spring", stiffness: 120, damping: 16, delay },
        },
      }}
    >
      {children}
    </Component>
  );
}

type StaggerProps = {
  children: React.ReactNode;
  delay?: number;
  stagger?: number;
  className?: string;
};

export function Stagger({ children, delay = 0.1, stagger = 0.08, className }: StaggerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      variants={{
        hidden: {},
        show: { transition: { delayChildren: delay, staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function Item({ children, delay = 0, y = 20, className }: Omit<RevealProps, "as" | "once">) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y, filter: "blur(6px)" },
        show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 140, damping: 16, delay } },
      }}
    >
      {children}
    </motion.div>
  );
}
