import { createTheme } from '@mui/material/styles';
import { blue, grey } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    primary: {
      main: blue[800], // アプリのメインカラー
    },
    background: {
      default: grey[50], // 背景色
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
  },
});