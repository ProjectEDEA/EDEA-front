import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { Header } from './components/layout/Header';
import { EditorPage } from './pages/EditorPage';

function App() {
  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Routes>
            {/* とりあえずルートパスでEditorPageを表示 */}
            <Route path="/" element={<EditorPage />} />
            {/*
              本来は以下のようにIDでページを分ける
              <Route path="/edit/:diagramId" element={<EditorPage />} />
            */}
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
    );
}

export default App;
