import React from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '../utils/cn';

interface AnimatedTextProps {
  text: string;
  className?: string;
  el?: any;
}

export function AnimatedText({ text, className, el: Wrapper = 'p' }: AnimatedTextProps) {
  const words = text.split(' ');

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <Wrapper className={cn('flex flex-wrap overflow-hidden', className)}>
      <motion.span
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-wrap"
      >
        {words.map((word, index) => (
          <span key={index} className="mr-1 mb-1 flex">
            {word.split("").map((char, charIndex) => (
              <motion.span variants={child} key={charIndex}>
                {char}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.span>
    </Wrapper>
  );
}
