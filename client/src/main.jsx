import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import store from './store/store.js';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce, ToastContainer } from 'react-toastify';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div onContextMenu={e => e.preventDefault()}>
        <App />
      </div>
      <ToastContainer
        position="bottom-center"
        hideProgressBar
        autoClose={2000}
        newestOnTop={false}
        draggable
        theme="dark"
        transition={Bounce}
      />
    </ThemeProvider>
  </Provider>,
)
