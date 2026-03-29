import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("VisionGuard error:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080a0f] p-8">
        <div className="max-w-md text-center space-y-4">
          <div className="flex justify-center opacity-30">
            <svg width="56" height="56" viewBox="0 0 48 48" fill="none">
              <path d="M24 4L44 14V34L24 44L4 34V14L24 4Z" stroke="#ff3c5f" strokeWidth="2" fill="none" />
              <line x1="24" y1="16" x2="24" y2="28" stroke="#ff3c5f" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="24" cy="33" r="1.5" fill="#ff3c5f" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-wide text-[#e8edf5]">Something went wrong</h1>
          <p className="text-sm text-[#7a8a9e]">{this.state.error?.message || "An unexpected error occurred."}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-[#00d4ff] text-[#080a0f] font-display font-semibold tracking-widest rounded hover:bg-[#33dcff] transition-colors"
          >
            RELOAD
          </button>
        </div>
      </div>
    );
  }
}