import { useCallback, useEffect, useRef, useState } from 'react';

interface UndoState {
  message: string;
  onUndo: () => Promise<void> | void;
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
  dismissUndo: () => Promise<void>;
}

const UNDO_TIMEOUT_MS = 5000;

export const useUndoAction = (): UseUndoActionReturn => {
  const [undoState, setUndoState] = useState<UndoState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCommittingRef = useRef(false);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const commitNow = useCallback(async () => {
    if (!undoState || isCommittingRef.current) return;

    isCommittingRef.current = true;
    clearTimer();

    await undoState.onCommit();

    setUndoState(null);
    isCommittingRef.current = false;
  }, [undoState]);

  const dismissUndo = useCallback(async () => {
    await commitNow();
  }, [commitNow]);

  const handleUndo = useCallback(async () => {
    if (!undoState || isCommittingRef.current) return;

    clearTimer();
    await undoState.onUndo();
    setUndoState(null);
  }, [undoState]);

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
  }, [undoState, handleUndo]);

  const triggerWithUndo = useCallback(
    (
      message: string,
      onUndo: () => Promise<void> | void,
      onCommit: () => Promise<void> | void
    ) => {
      clearTimer();
      isCommittingRef.current = false;

      const newState = { message, onUndo, onCommit };
      setUndoState(newState);

      timerRef.current = setTimeout(async () => {
        if (isCommittingRef.current) return;

        isCommittingRef.current = true;
        await newState.onCommit();

        setUndoState(null);
        isCommittingRef.current = false;
      }, UNDO_TIMEOUT_MS);
    },
    []
  );

  return {
    showUndo: !!undoState,
    undoMessage: undoState?.message ?? '',
    triggerWithUndo,
    handleUndo,
    dismissUndo,
  };
};