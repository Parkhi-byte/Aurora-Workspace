import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900 flex items-center justify-center p-4">
                    <div className="max-w-2xl w-full bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 border border-red-700/50">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle size={48} className="text-red-500" />
                            </div>

                            <h1 className="text-4xl font-bold text-white mb-4">
                                Oops! Something went wrong
                            </h1>

                            <p className="text-gray-400 mb-8 text-lg">
                                We encountered an unexpected error. Don't worry, your data is safe.
                            </p>

                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="mb-8 p-4 bg-gray-900/50 rounded-xl border border-gray-700 text-left">
                                    <p className="text-red-400 font-mono text-sm mb-2">
                                        {this.state.error.toString()}
                                    </p>
                                    {this.state.errorInfo && (
                                        <details className="mt-2">
                                            <summary className="text-gray-500 text-sm cursor-pointer hover:text-gray-400">
                                                Stack trace
                                            </summary>
                                            <pre className="text-xs text-gray-500 mt-2 overflow-auto max-h-40">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={this.handleReset}
                                    className="px-6 py-3 bg-gradient-to-r from-aurora-600 to-aurora-700 hover:from-aurora-700 hover:to-aurora-800 text-white rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg"
                                >
                                    <RefreshCw size={20} />
                                    Try Again
                                </button>

                                <button
                                    onClick={this.handleGoHome}
                                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold flex items-center gap-2 transition-all"
                                >
                                    <Home size={20} />
                                    Go Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
