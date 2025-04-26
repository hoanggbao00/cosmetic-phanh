"use client";

import { SymbolIcon } from "@/assets/icons/symbol-icon";
import { motion } from "framer-motion";
import Link from "next/link";

interface Props {
  categories: string[];
}

export function CategoryList({ categories }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
      {categories.map((category, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          key={category}
        >
          <div className="group hover:-translate-y-2 flex items-center transition-transform duration-300 hover:scale-105">
            {index !== 0 && (
              <div>
                <SymbolIcon className="size-4 origin-center text-primary transition-transform duration-300 group-hover:rotate-90 md:size-8" />
              </div>
            )}
            <Link
              href="#"
              className="px-2 text-foreground text-sm tracking-wide transition-all duration-300 hover:text-primary md:text-base lg:text-xl"
            >
              {category}
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
