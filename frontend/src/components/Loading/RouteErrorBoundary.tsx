import { Component, type ErrorInfo, type ReactNode } from "react";

type RouteErrorBoundaryProps = Readonly<{
  children: ReactNode;
  resetKey: string;
}>;

type RouteErrorBoundaryState = Readonly<{
  hasError: boolean;
}>;

class RouteErrorBoundary extends Component<
  RouteErrorBoundaryProps,
  RouteErrorBoundaryState
> {
  state: RouteErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): RouteErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Route Mahreen gagal dirender", error, info.componentStack);
  }

  componentDidUpdate(previousProps: RouteErrorBoundaryProps) {
    if (
      this.state.hasError &&
      previousProps.resetKey !== this.props.resetKey
    ) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="route-error" id="main-content" tabIndex={-1}>
        <div className="route-error__card" role="alert">
          <span className="route-error__eyebrow">Koneksi terputus</span>
          <h1>Halaman belum berhasil dimuat</h1>
          <p>
            Versi situs mungkin baru diperbarui atau koneksi Anda sempat
            terputus. Muat ulang untuk mengambil versi terbaru.
          </p>
          <div className="route-error__actions">
            <button type="button" onClick={() => window.location.reload()}>
              Muat Ulang
            </button>
            <a href="/" data-no-spa="true">Kembali ke Beranda</a>
          </div>
        </div>
      </main>
    );
  }
}

export default RouteErrorBoundary;
