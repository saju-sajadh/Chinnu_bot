import React from "react";

export const Modal = ({ isOpen, onClose, children, maxWidth, maxHeight = "max-h-[90vh]" }) => {
    if (!isOpen) return null;
  
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className={`relative ${maxWidth} mx-4 ${maxHeight}`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}          
        </div>
      </div>
    );
  };