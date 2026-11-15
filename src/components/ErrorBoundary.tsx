import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = {
    hasError: false,
    message: '',
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'An unexpected rendering error occurred.',
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleResetAndReload = () => {
    try {
      localStorage.removeItem('hh_ai_draft_v1');
    } catch {
      // Ignore storage access failures
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F5EEE0] text-[#1E1B18] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full rounded-2xl border border-[#DDD2BC] bg-[#FFFDF8] p-7 shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-[#9A4319] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#1E1B18]">
              Unable to render workspace
            </h1>
            <p className="text-sm text-[#4A433A] leading-relaxed">
              Something unexpected interrupted the page. Your workspace can be safely reset without affecting exported files.
            </p>
            {this.state.message && (
              <p className="text-xs font-mono-code bg-[#FAF4E8] border border-[#DDD2BC] rounded-lg px-3 py-2 text-[#4A433A] break-words">
                {this.state.message}
              </p>
            )}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="cursor-pointer min-h-[42px] px-4 rounded-xl border border-[#D7CCB5] bg-[#FAF4E8] hover:bg-[#EFE5D3] text-xs font-semibold text-[#1E1B18] transition-colors"
              >
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleResetAndReload}
                className="cursor-pointer min-h-[42px] px-4 rounded-xl bg-[#24201C] hover:bg-[#38322C] text-[#FFFDF8] text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Draft &amp; Reload</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
