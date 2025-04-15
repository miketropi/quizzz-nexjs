'use client';

/**
 * Confirm Component for React Applications
 * 
 * Usage:
 * 1. Import the component:
 *    import { useConfirm, ConfirmProvider } from '@/components/Confirm';
 * 
 * 2. Wrap your app with ConfirmProvider:
 *    <ConfirmProvider>
 *      <YourApp />
 *    </ConfirmProvider>
 * 
 * 3. Use the useConfirm hook in your components:
 *    const confirm = useConfirm();
 *    
 *    const handleDelete = async () => {
 *      if (await confirm({
 *        title: "Delete Item",
 *        message: "Are you sure you want to delete this item?",
 *        confirmButtonText: "Delete", // optional
 *        cancelButtonText: "Cancel"   // optional
 *      })) {
 *        // User confirmed, proceed with deletion
 *        deleteItem();
 *      }
 *    };
 */

import { useState, useEffect, useRef, forwardRef, useImperativeHandle, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Create context for confirmation dialog
const ConfirmContext = createContext(null);

// Animation variants
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } }
};

const modalVariants = {
  hidden: { 
    scale: 0.8, 
    opacity: 0,
    y: 20
  },
  visible: { 
    scale: 1, 
    opacity: 1, 
    y: 0,
    transition: { 
      type: 'spring',
      stiffness: 400,
      damping: 25
    } 
  },
  exit: { 
    scale: 0.8, 
    opacity: 0,
    y: 10,
    transition: { 
      duration: 0.15 
    } 
  }
};

// ClientOnly wrapper component to ensure components only render on client
const ClientOnly = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  if (!hasMounted) {
    return null;
  }
  
  return <>{children}</>;
};

// Confirmation Dialog Container
const ConfirmDialog = forwardRef((_, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState({
    title: 'Confirm',
    message: 'Are you sure?',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel'
  });
  const [isMounted, setIsMounted] = useState(false);
  const resolveRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Handle click outside
  const dialogRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) {
        handleCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Expose methods through ref
  useImperativeHandle(ref, () => ({
    confirm: (options = {}) => {
      return new Promise((resolve) => {
        setOptions({ ...ConfirmDialog.defaultProps, ...options });
        setIsOpen(true);
        resolveRef.current = resolve;
      });
    }
  }));

  const handleConfirm = () => {
    if (resolveRef.current) {
      resolveRef.current(true);
      resolveRef.current = null;
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    if (resolveRef.current) {
      resolveRef.current(false);
      resolveRef.current = null;
    }
    setIsOpen(false);
  };

  // Only render the portal on the client side
  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
        >
          {/* Background overlay with a blue-gray color instead of black */}
          <div className="absolute inset-0 bg-indigo-900 bg-opacity-40 backdrop-blur-sm opacity-15" />
          
          <motion.div 
            ref={dialogRef}
            className="relative w-full max-w-md rounded-lg bg-white shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            variants={modalVariants}
          >
            <div className="relative p-6">
              <motion.button
                onClick={handleCancel}
                className="absolute right-4 top-4 rounded-md p-1 opacity-70 hover:bg-gray-200 hover:opacity-100"
                aria-label="Close"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="h-5 w-5" />
              </motion.button>
              
              <motion.h3 
                id="modal-title" 
                className="mb-2 text-xl font-semibold text-gray-900"
                initial={{ y: -5, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.1 } }}
              >
                {options.title}
              </motion.h3>
              
              <motion.div 
                className="mt-4 text-sm text-gray-600"
                initial={{ y: -5, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.15 } }}
              >
                <p>{options.message}</p>
              </motion.div>
              
              <motion.div 
                className="mt-6 flex justify-end space-x-3"
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
              >
                <motion.button
                  onClick={handleCancel}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {options.cancelButtonText}
                </motion.button>
                <motion.button
                  onClick={handleConfirm}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {options.confirmButtonText}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
});

ConfirmDialog.displayName = 'ConfirmDialog';
ConfirmDialog.defaultProps = {
  title: 'Confirm',
  message: 'Are you sure?',
  confirmButtonText: 'Confirm',
  cancelButtonText: 'Cancel'
};

// Confirm Provider Component for app-wide usage
export function ConfirmProvider({ children }) {
  const confirmRef = useRef(null);

  return (
    <ConfirmContext.Provider value={confirmRef}>
      {children}
      <ClientOnly>
        <ConfirmDialog ref={confirmRef} />
      </ClientOnly>
    </ConfirmContext.Provider>
  );
}

// Hook for using confirm within components
export function useConfirm() {
  const confirmRef = useContext(ConfirmContext);
  
  if (!confirmRef) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }

  return (options) => confirmRef.current?.confirm(options);
}

// Safely access client-side features
const isBrowser = typeof window !== 'undefined';

// For standalone usage (without context)
export const confirm = (options = {}) => {
  if (!isBrowser) return Promise.resolve(false);
  
  // Create a temporary container if one doesn't exist
  const containerDiv = document.createElement('div');
  containerDiv.id = 'confirm-standalone-container';
  document.body.appendChild(containerDiv);
  
  const confirmRef = { current: null };
  const container = <ConfirmDialog ref={confirmRef} />;
  
  // Render the container
  createPortal(container, containerDiv);
  
  // Return promise that resolves with user's decision
  return new Promise((resolve) => {
    confirmRef.current?.confirm(options)
      .then((result) => {
        // Clean up the container after confirmation
        setTimeout(() => {
          if (document.body.contains(containerDiv)) {
            document.body.removeChild(containerDiv);
          }
        }, 500);
        resolve(result);
      });
  });
};

export default confirm;
