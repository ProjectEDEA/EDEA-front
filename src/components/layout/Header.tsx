import { AppBar, Toolbar, Typography } from '@mui/material';
import PolylineIcon from '@mui/icons-material/Polyline';

export const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <PolylineIcon sx={{ mr: 1 }} />
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: 2,
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
            EDEA
        </Typography>
      </Toolbar>
    </AppBar>
  );
};