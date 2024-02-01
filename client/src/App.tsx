import './styles/App.css';
import AppBar from './components/AppBar';
import { ThemeProvider } from '@emotion/react';
import { theme } from './styles/Palette';
import { Outlet } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <AppBar />
        <Outlet />
      </ThemeProvider>
    </>
  );
};

export default App;
