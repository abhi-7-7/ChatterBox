import React from "react";

class SafeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("SafeComponent caught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;
      return (
        <div className="p-4 m-2 rounded-xl bg-red-100 text-red-700 border border-red-300">
          {fallback || "⚠️ This section failed to load."}
        </div>
      );
    }

    return this.props.children || null;
  }
}

export default SafeComponent;
