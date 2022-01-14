import "./App.css";
import { WebView } from "./views/webView/WebView";
import { ElectronView } from "./views/electronView/ElectronView";

function App() {
  return (
    <div className="app">
      <div className="container">
        {window.location.href.includes("#electron") ? (
          <ElectronView />
        ) : (
          <WebView />
        )}
      </div>
    </div>
  );
}

export default App;
