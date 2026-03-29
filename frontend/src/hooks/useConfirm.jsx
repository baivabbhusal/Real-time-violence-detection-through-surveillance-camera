/**
 * useConfirm — replaces window.confirm with a styled modal.
 * Usage:
 *   const { confirm, ConfirmDialog } = useConfirm();
 *   const ok = await confirm("Delete this camera?");
 *   if (ok) doDelete();
 *   // Render <ConfirmDialog /> somewhere in the JSX.
 */
import { useState, useCallback } from "react";

export default function useConfirm() {
  const [state, setState] = useState(null); // { message, title, resolve }

  const confirm = useCallback((message, title = "Are you sure?") => {
    return new Promise((resolve) => {
      setState({ message, title, resolve });
    });
  }, []);

  const handleClose = (result) => {
    state?.resolve(result);
    setState(null);
  };

  function ConfirmDialog() {
    if (!state) return null;
    return (
      <div
        className="fixed inset-0 z-[600] flex items-center justify-center p-5 bg-black/70 backdrop-blur-sm"
        onClick={() => handleClose(false)}
      >
        <div
          className="w-full max-w-sm bg-[#141c26] border border-white/[0.1] rounded-xl p-6 shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="font-display text-lg font-bold tracking-wide text-[#e8edf5] mb-2">
            {state.title}
          </h3>
          <p className="text-sm text-[#768eac] mb-6">{state.message}</p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => handleClose(false)}
              className="px-4 py-2 text-sm text-[#7a8a9e] border border-white/10 rounded hover:text-[#e8edf5] hover:bg-[#1a2333] hover:border-white/20 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => handleClose(true)}
              className="px-4 py-2 text-sm bg-[#ff3c5f]/10 text-[#ff3c5f] border border-[#ff3c5f]/30 rounded font-display font-semibold tracking-wider hover:bg-[#ff3c5f]/20 transition-all"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return { confirm, ConfirmDialog };
}