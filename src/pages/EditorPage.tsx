import { Box, Grid } from '@mui/material';
// import  Grid  from "@mui/material/Grid2";
import { DiagramView } from '../components/diagram/DiagramView';
import { EditorPanel } from '../components/diagram/EditorPanel';
import { Header } from '../components/layout/Header';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

export const EditorPage = () => {
  const { diagramId } = useParams<{ diagramId: string }>();

  // useEffect(() => {
  //   if (diagramId) {
  //     fetchAndSetDiagram(diagramId);
  //   }
  // }, [fetchAndSetDiagram, diagramId]);
  
  return (
    <Box sx={{ p: 0, height: '90vh' }}>
      <Header />
      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* 左側: UML図ビューア */}
        <Grid size={{xs:7,md:7}}>
          <DiagramView />
        </Grid>

        {/* 右側: 編集パネル */}
        <Grid size={{xs:6,md:5}}>
          <EditorPanel />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditorPage;