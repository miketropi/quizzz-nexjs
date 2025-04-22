'use client';

/**
 * Modal Component for React Applications
 * 
 * Usage:
 * 1. Import the component:
 *    import { useModal, ModalProvider } from '@/components/Modal';
 * 
 * 2. Wrap your app with ModalProvider:
 *    <ModalProvider>
 *      <YourApp />
 *    </ModalProvider>
 * 
 * 3. Use the useModal hook in your components:
 *    const modal = useModal();
 *    
 *    // Open modal
 *    modal.open({
 *      title: "Modal Title",
 *      content: <YourComponent />,  // React component or JSX
 *      size: "md",                 // optional: 'sm', 'md', 'lg', 'xl', 'full'
 *      closeOnClickOutside: true,  // optional
 *      showCloseButton: true,      // optional
 *    });
 *    
 *    // Close modal
 *    modal.close();
 * 
 * 4. For standalone usage without context:
 *    import { modal } from '@/components/Modal';
 *    modal.open({ title: "Hello", content: <p>World</p> });
 */

import { useState, useEffect, useRef, forwardRef, useImperativeHandle, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as ReactDOM from 'react-dom/client';

// Create context for modal
const ModalContext = createContext(null);

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

// Modal Component
const ModalContainer = forwardRef((_, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState({
    title: '',
    content: null,
    size: 'md',
    closeOnClickOutside: true,
    showCloseButton: true
  });
  const [isMounted, setIsMounted] = useState(false);
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    // Create the portal element only on the client side
    setPortalElement(document.body);
    return () => setIsMounted(false);
  }, []);

  // Handle click outside
  const modalRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (options.closeOnClickOutside && modalRef.current && !modalRef.current.contains(e.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling of the body when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = '';
    };
  }, [isOpen, options.closeOnClickOutside]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
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
    open: (options = {}) => {
      setOptions({ 
        title: options.title || '',
        content: options.content || null,
        size: options.size || 'md',
        closeOnClickOutside: options.closeOnClickOutside !== false,
        showCloseButton: options.showCloseButton !== false
      });
      setIsOpen(true);
    },
    close: () => {
      setIsOpen(false);
    }
  }));

  const handleClose = () => {
    setIsOpen(false);
  };

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full mx-4'
  };

  // Only render the portal on the client side
  if (!isMounted || !portalElement) return null;

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
          {/* Background overlay */}
          <div className="absolute inset-0 bg-opacity-30 backdrop-blur-sm" />
          
          <motion.div 
            ref={modalRef}
            className={`relative w-full ${sizeClasses[options.size]} rounded-lg bg-white shadow-xl border border-gray-200`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            variants={modalVariants}
          >
            {options.showCloseButton && (
              <motion.button
                onClick={handleClose}
                className="absolute right-4 top-4 rounded-md p-1 opacity-70 hover:bg-gray-200 hover:opacity-100"
                aria-label="Close"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="h-5 w-5" />
              </motion.button>
            )}
            
            {options.title && (
              <motion.h3 
                id="modal-title" 
                className="mb-2 border-b border-gray-200 p-6 pb-3 text-xl font-semibold text-gray-900"
                initial={{ y: -5, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.1 } }}
              >
                {options.title}
              </motion.h3>
            )}
            
            <motion.div 
              className={`p-6 ${options.title ? 'pt-3' : ''}`}
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.15 } }}
            >
              {options.content}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalElement
  );
});

ModalContainer.displayName = 'ModalContainer';

// Modal Provider Component for app-wide usage
export function ModalProvider({ children }) {
  const modalRef = useRef(null);

  return (
    <ModalContext.Provider value={modalRef}>
      {children}
      <ClientOnly>
        <ModalContainer ref={modalRef} />
      </ClientOnly>
    </ModalContext.Provider>

  );
}

// Hook for using modal within components
export function useModal() {
  const modalRef = useContext(ModalContext);
  
  if (!modalRef) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return {
    open: (options) => modalRef.current?.open(options),
    close: () => modalRef.current?.close()
  };
}

// Safely access client-side features
const isBrowser = typeof window !== 'undefined';

// Singleton instance for standalone usage
let standaloneInstance = null;

// For standalone usage (without context)
export const modal = {
  _ref: null,
  _root: null,
  _ensureContainer() {
    if (!isBrowser) return this._ref;
    
    if (!this._ref && !standaloneInstance) {
      // Create a container only once and on the client side
      const containerDiv = document.createElement('div');
      containerDiv.id = 'modal-standalone-container';
      document.body.appendChild(containerDiv);
      
      const containerRef = { current: null };
      
      // Use ReactDOM.createRoot for React 18+
      if (typeof ReactDOM !== 'undefined' && ReactDOM.createRoot) {
        this._root = ReactDOM.createRoot(containerDiv);
        this._root.render(<ModalContainer ref={containerRef} />);
        this._ref = containerRef;
        standaloneInstance = true;
      }
    }
    return this._ref;
  },
  
  open(options) {
    if (!isBrowser) return;
    const ref = this._ensureContainer();
    ref?.current?.open(options);
  },
  
  close() {
    if (!isBrowser) return;
    this._ref?.current?.close();
  }
};

// Default export for simple imports
export default modal;
