import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { EditorPage } from './pages/EditorPage';
import { TopPage } from './pages/TopPage';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      autoHideDuration={3000}
    >
      <BrowserRouter>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <Box component="main" sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Routes>
              <Route path="/" element={<TopPage />} />
              <Route path="/editor/:id" element={<EditorPage />} />
              {/* 存在しないルートは TopPage にリダイレクト */}
              <Route path="*" element={<TopPage />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;