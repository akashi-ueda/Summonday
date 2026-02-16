"use client";

import { motion } from "framer-motion";

export function BackgroundEffects() {
    return (
        <div className="pointer-events-none absolute inset-0 z-0">
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute h-1 w-1 rounded-full bg-[hsl(0,0%,100%,0.4)]"
                    style={{
                        left: `${15 + i * 14}%`,
                        top: `${20 + (i % 3) * 25}%`,
                    }}
                    animate={{
                        y: [-10, 10, -10],
                        opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                        duration: 3 + i * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.3,
                    }}
                />
            ))}
        </div>
    );
}
