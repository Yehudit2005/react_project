import { useCallback, useEffect, useRef, useState } from 'react';

interface UndoState {
  message: string;
  onUndo: () => Promise<void> | void;
  // ✅ תיקון: onCommit נקרא רק אחרי שה-5 שניות עברו ללא ביטול
  onCommit: () => Promise<void> | void;
}

interface UseUndoActionReturn {
  showUndo: boolean;
  undoMessage: string;
  triggerWithUndo: (
    message: string,
    onUndo: () => Promise<void> | void,
    onCommit: () => Promise<void> | void
  ) => void;
  handleUndo: () => Promise<void>;
  dismissUndo: () => void;
}

const UNDO_TIMEOUT_MS = 5000;

export const useUndoAction = (): UseUndoActionReturn => {
  const [undoState, setUndoState] = useState<UndoState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const dismissUndo = useCallback(() => {
    clearTimer();
    setUndoState(null);
  }, []);

  // Ctrl+Z support
  useEffect(() => {
    if (!undoState) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoState]);

  const triggerWithUndo = useCallback(
    (
      message: string,
      onUndo: () => Promise<void> | void,
      // ✅ תיקון: onCommit = מה שקורה ב-DB רק אחרי שהזמן עבר
      onCommit: () => Promise<void> | void
    ) => {
      clearTimer();
      setUndoState({ message, onUndo, onCommit });

      timerRef.current = setTimeout(async () => {
        // ✅ תיקון: רק כאן — אחרי 5 שניות — מבצעים את הפעולה ב-DB
        await onCommit();
        setUndoState(null);
      }, UNDO_TIMEOUT_MS);
    },
    []
  );

  const handleUndo = useCallback(async () => {
    if (!undoState) return;
    // ✅ תיקון: ביטול הטיימר כדי ש-onCommit לא יקרה
    clearTimer();
    await undoState.onUndo();
    setUndoState(null);
  }, [undoState]);

  return {
    showUndo: !!undoState,
    undoMessage: undoState?.message ?? '',
    triggerWithUndo,
    handleUndo,
    dismissUndo,
  };
};