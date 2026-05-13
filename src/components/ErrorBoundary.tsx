import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 p-8 text-center">
          <div className="w-24 h-24 rounded-full bg-surface border border-white/40 flex items-center justify-center text-5xl shadow-lg">
            🐱
          </div>
          <h2 className="text-2xl font-extrabold text-gradient">
            ¡Ups! Algo salió mal
          </h2>
          <p className="text-text-muted font-semibold">
            Intenta recargar la página
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3.5 rounded-2xl font-extrabold text-white shadow-lg active:scale-95 transition-all"
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
              boxShadow: '0 6px 20px rgba(124, 58, 237, 0.35)',
            }}
          >
            Recargar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
