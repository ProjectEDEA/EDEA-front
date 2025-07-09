import { Box, Grid } from '@mui/material';
// import  Grid  from "@mui/material/Grid2";
import { DiagramView } from '../components/diagram/DiagramView';
import { EditorPanel } from '../components/diagram/EditorPanel';

export const EditorPage = () => {
  return (
    <Box sx={{ p: 2, height: '90vh' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* 左側: UML図ビューア */}
        <Grid size={{xs:8,md:8}}>
          <DiagramView />
        </Grid>

        {/* 右側: 編集パネル */}
        <Grid size={{xs:4,md:4}}>
          <EditorPanel />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditorPage;