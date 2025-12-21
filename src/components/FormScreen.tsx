import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FormScreenProps {
  children: ReactNode;
  className?: string;
}

export const FormScreen = ({ children, className = '' }: FormScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className={`screen justify-center ${className}`}
    >
      {children}
    </motion.div>
  );
};
