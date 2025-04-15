'use client';

/**
 * Toast Component for React Applications
 * 
 * Usage:
 * 1. Wrap your app with ToastProvider:
 *    <ToastProvider position="top-right">
 *      <YourApp />
 *    </ToastProvider>
 * 
 * 2. Use the useToast hook in your components:
 *    const toast = useToast();
 *    toast.success("Operation successful!");
 *    toast.error("Something went wrong");
 *    toast.warning("Please be careful");
 *    toast.info("Just FYI");
 * 
 * 3. For standalone usage without context:
 *    import { toast } from './Toast';
 *    toast.success("It worked!");
 *    
 * 4. Additional options:
 *    - Custom duration: toast.success("Message", 3000); // 3 seconds
 *    - Dismiss programmatically: const id = toast.info("Processing..."); toast.dismiss(id);
 *    - Dismiss all: toast.dismissAll();
 */

import { useState, useEffect, useRef, forwardRef, useImperativeHandle, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// Note: Next.js 13+ needs this import for client components
import * as ReactDOM from 'react-dom/client';

// Toast Types and Style Variants
const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

const TOAST_STYLES = {
  [TOAST_TYPES.SUCCESS]: {
    bgColor: 'bg-green-50',
    borderColor: 'border-green-400',
    textColor: 'text-green-800',
    progressColor: 'bg-green-500',
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
  },
  [TOAST_TYPES.ERROR]: {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-400',
    textColor: 'text-red-800',
    progressColor: 'bg-red-500',
    icon: <AlertCircle className="h-5 w-5 text-red-500" />,
  },
  [TOAST_TYPES.WARNING]: {
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-400',
    textColor: 'text-amber-800',
    progressColor: 'bg-amber-500',
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  },
  [TOAST_TYPES.INFO]: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-400',
    textColor: 'text-blue-800',
    progressColor: 'bg-blue-500',
    icon: <Info className="h-5 w-5 text-blue-500" />,
  },
};

// Toast Context for global usage
const ToastContext = createContext(null);

// Toast Item Component
const ToastItem = ({ id, message, type = TOAST_TYPES.INFO, duration = 5000, onClose }) => {
  const { bgColor, borderColor, textColor, progressColor, icon } = TOAST_STYLES[type];
  const [isPaused, setIsPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(duration);
  const startTimeRef = useRef(null);
  
  // Initialize startTime after component mounts to avoid hydration mismatch
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    // Only run timer effect on client-side after mount
    if (!startTimeRef.current) return;
    
    if (!isPaused) {
      const timer = setTimeout(() => {
        onClose(id);
      }, remainingTime);

      startTimeRef.current = Date.now();

      return () => {
        clearTimeout(timer);
        const elapsed = Date.now() - startTimeRef.current;
        setRemainingTime(prev => Math.max(0, prev - elapsed));
      };
    }
  }, [id, onClose, isPaused, remainingTime]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ duration: 0.2 }}
      className={`relative flex w-full max-w-sm overflow-hidden rounded-lg border ${borderColor} ${bgColor} shadow-md backdrop-blur-sm`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="alert"
    >
      <div className="flex w-full items-center p-4">
        <div className="shrink-0">{icon}</div>
        <div className={`ml-3 mr-8 flex-1 ${textColor}`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => onClose(id)}
          className="absolute right-2 top-2 shrink-0 rounded-md p-1 opacity-70 hover:bg-gray-200 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-200">
        <motion.div
          className={`h-full ${progressColor}`}
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ 
            duration: remainingTime / 1000, 
            ease: "linear",
            pause: isPaused
          }}
        />
      </div>
    </motion.div>
  );
};

// ClientOnly wrapper component to ensure components only render on client
const ClientOnly = ({ children, ...delegated }) => {
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  if (!hasMounted) {
    return null;
  }
  
  return <>{children}</>;
};

// Toast Container Component
const ToastContainer = forwardRef(({ position = 'bottom-right' }, ref) => {
  const [toasts, setToasts] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  
  // Position classes for the container
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'top-center': 'top-0 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
  };

  // Set mounted state after component mounts in browser
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Expose methods through ref
  useImperativeHandle(ref, () => ({
    show: (message, type, duration) => {
      const id = String(Date.now()) + String(Math.random()).slice(2, 8);
      setToasts(prev => [...prev, { id, message, type, duration }]);
      return id;
    },
    success: (message, duration) => {
      return ref.current.show(message, TOAST_TYPES.SUCCESS, duration);
    },
    error: (message, duration) => {
      return ref.current.show(message, TOAST_TYPES.ERROR, duration);
    },
    warning: (message, duration) => {
      return ref.current.show(message, TOAST_TYPES.WARNING, duration);
    },
    info: (message, duration) => {
      return ref.current.show(message, TOAST_TYPES.INFO, duration);
    },
    dismiss: (id) => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    },
    dismissAll: () => {
      setToasts([]);
    }
  }));

  const handleCloseToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Only render the portal on the client side
  if (!isMounted) return null;

  return createPortal(
    <div className={`fixed z-50 m-4 flex flex-col gap-2 ${positionClasses[position]}`}>
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastItem
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={handleCloseToast}
          />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
});

ToastContainer.displayName = 'ToastContainer';

// Toast Provider Component for app-wide usage
export function ToastProvider({ children, position }) {
  const toastRef = useRef(null);

  return (
    <ToastContext.Provider value={toastRef}>
      {children}
      <ClientOnly>
        <ToastContainer ref={toastRef} position={position} />
      </ClientOnly>
    </ToastContext.Provider>
  );
}

// Hook for using toast within components
export function useToast() {
  const toastRef = useContext(ToastContext);
  
  if (!toastRef) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return {
    show: (message, type = TOAST_TYPES.INFO, duration = 5000) => 
      toastRef.current?.show(message, type, duration),
    success: (message, duration = 5000) => 
      toastRef.current?.success(message, duration),
    error: (message, duration = 5000) => 
      toastRef.current?.error(message, duration),
    warning: (message, duration = 5000) => 
      toastRef.current?.warning(message, duration),
    info: (message, duration = 5000) => 
      toastRef.current?.info(message, duration),
    dismiss: (id) => toastRef.current?.dismiss(id),
    dismissAll: () => toastRef.current?.dismissAll(),
  };
}

// Safely access client-side features
const isBrowser = typeof window !== 'undefined';

// For standalone usage (without context)
export const toast = {
  _ref: null,
  _root: null,
  _ensureContainer() {
    if (!isBrowser) return this._ref;
    
    if (!this._ref) {
      const containerDiv = document.createElement('div');
      containerDiv.id = 'toast-standalone-container';
      document.body.appendChild(containerDiv);
      
      const containerRef = { current: null };
      
      // Use ReactDOM.createRoot for React 18+
      if (typeof ReactDOM !== 'undefined' && ReactDOM.createRoot) {
        this._root = ReactDOM.createRoot(containerDiv);
        this._root.render(<ToastContainer ref={containerRef} position="bottom-right" />);
      } else {
        // Fallback to createPortal for older React versions
        const container = <ToastContainer ref={containerRef} position="bottom-right" />;
        createPortal(container, containerDiv);
      }
      
      this._ref = containerRef;
    }
    return this._ref;
  },
  
  show(message, type, duration) {
    if (!isBrowser) return null;
    const ref = this._ensureContainer();
    return ref.current?.show(message, type, duration);
  },
  
  success(message, duration) {
    if (!isBrowser) return null;
    return this.show(message, TOAST_TYPES.SUCCESS, duration);
  },
  
  error(message, duration) {
    if (!isBrowser) return null;
    return this.show(message, TOAST_TYPES.ERROR, duration);
  },
  
  warning(message, duration) {
    if (!isBrowser) return null;
    return this.show(message, TOAST_TYPES.WARNING, duration);
  },
  
  info(message, duration) {
    if (!isBrowser) return null;
    return this.show(message, TOAST_TYPES.INFO, duration);
  },
  
  dismiss(id) {
    if (!isBrowser) return;
    this._ref?.current?.dismiss(id);
  },
  
  dismissAll() {
    if (!isBrowser) return;
    this._ref?.current?.dismissAll();
  }
};

// Export toast types for external usage
export { TOAST_TYPES };

// Default export for simple imports
export default toast;
