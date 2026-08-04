"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useFunnelStore } from "@/src/store/useFunnelStore";
import { InteractiveFunnel } from "./interactive-funnel";

export function FunnelModal({ lang = "es" }: { lang?: string }) {
  const { isOpen, closeFunnel } = useFunnelStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-12">
          {/* Fondo oscuro con desenfoque */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeFunnel}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />
          
          {/* Contenedor del embudo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl"
          >
            {/* Botón flotante para cerrar (X) */}
            <button
              onClick={closeFunnel}
              className="absolute top-4 right-4 z-50 p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-zinc-600 hover:text-black" />
            </button>

            <InteractiveFunnel lang={lang} onClose={closeFunnel} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
