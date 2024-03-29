import './App.css';
import { WebView } from './views/webView/WebView';
import { ElectronView } from './views/electronView/ElectronView';
import { isElectronProcess } from './util';

function App() {
  console.log(isElectronProcess());
  return (
    <div className="app">
      <div className="container">
        {isElectronProcess() ? <ElectronView /> : <WebView />}
      </div>
    </div>
  );
}

export default App;
