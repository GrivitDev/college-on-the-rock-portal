'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoader } from '@/contexts/LoaderContext';

export default function Loader() {
  const { loading, success } = useLoader();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (loading) setVisible(true);
    else if (success) {
      setTimeout(() => setVisible(false), 800);
    } else {
      setVisible(false);
    }
  }, [loading, success]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 2 }}
            animate={
              success
                ? { scale: 4, opacity: 0 }
                : {
                    scale: [2, 4, 2],
                  }
            }
            transition={{
              duration: success ? 0.8 : 3, // 🐢 slower pulse
              repeat: success ? 0 : Infinity,
              ease: 'easeInOut',
            }}
            className="w-32 h-32 flex items-center justify-center" // 🧩 reduced size
          >
            <Image
              src="/logo.png"
              className="w-full h-full"
              alt="Loading..."
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
