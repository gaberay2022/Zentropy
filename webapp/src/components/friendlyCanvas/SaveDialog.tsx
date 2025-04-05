import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './SaveDialog.css';

interface SaveDialogProps {
  onSave: (title: string) => void;
  onCancel: () => void;
}

export const SaveDialog: React.FC<SaveDialogProps> = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const modalRoot = document.body;

  useEffect(() => {
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (title.trim()) {
      onSave(title.trim());
    }
  }, [title, onSave]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target === e.currentTarget) {
      onCancel();
    }
  }, [onCancel]);

  const handleDialogClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const modalContent = (
    <div className="save-dialog-overlay" onClick={handleOverlayClick}>
      <div className="save-dialog" onClick={handleDialogClick}>
        <h2>Save Your Drawing</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="drawing-title">Title</label>
            <input
              type="text"
              id="drawing-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your drawing"
              autoFocus
              required
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="button-group">
            <button 
              type="button" 
              className="cancel-button"
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-button"
              onClick={(e) => e.stopPropagation()}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, modalRoot);
};