import { useState } from 'react';
import {
  Box,
  AppBar,
  Button,
  Toolbar,
  Typography,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Divider
} from '@mui/material';
import PolylineIcon from '@mui/icons-material/Polyline';
import SaveIcon from '@mui/icons-material/Save';
import IosShareIcon from '@mui/icons-material/IosShare';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useDiagramStore } from '../../store/diagramStore';

export const Header = () => {
  const { diagram, updateDiagramName } = useDiagramStore();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const handleNameChange = (value: string) => {
    updateDiagramName(value);
  };

  // 共有ダイアログを開く
  const handleShareClick = () => {
    setShareDialogOpen(true);
  };

  // 共有ダイアログを閉じる
  const handleCloseShareDialog = () => {
    setShareDialogOpen(false);
  };

  // リンクをクリップボードにコピー
  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      console.log('リンクをコピーしました:', link);
      // 必要に応じてトースト通知を表示
    } catch (error) {
      console.error('コピーに失敗しました:', error);
    }
  };

  // リンクを生成
  const generateLinks = () => {
    const baseUrl = window.location.origin;
    const diagramId = diagram.id;

    const editLink = `${baseUrl}/editor/${diagramId}`;
    const shareLink = `${baseUrl}/view/${diagramId}`; // 閲覧専用リンク

    return { editLink, shareLink };
  };

  const { editLink, shareLink } = generateLinks();

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* 左側のロゴとタイトル */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PolylineIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              EDEA
            </Typography>
          </Box>

          {/* 右側のボタン */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              onChange={(e) => handleNameChange(e.target.value)}
              value={diagram.name}
              label="ダイアグラム名"
              size="small"
              variant="outlined"
              placeholder="ダイアグラム名を入力"
              sx={{
                width: 300,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    borderWidth: 1,
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.6)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.9)',
                    borderWidth: 2,
                  },
                  '& .MuiOutlinedInput-input': {
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    '&::placeholder': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      opacity: 1,
                    },
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.875rem',
                  '&.Mui-focused': {
                    color: 'rgba(255, 255, 255, 0.95)',
                  },
                },
                '& .MuiInputLabel-shrink': {
                  backgroundColor: 'transparent',
                  px: 0.5,
                },
              }}
            />
            <Button
              variant="contained"
              color="secondary"
              startIcon={<SaveIcon />}
              sx={{
                minWidth: 100,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              保存
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<IosShareIcon />}
              onClick={handleShareClick}
              sx={{
                minWidth: 100,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              共有
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 共有ダイアログ */}
      <Dialog
        open={shareDialogOpen}
        onClose={handleCloseShareDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: 500,
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1
        }}>
          <Box /> {/* 左側の空きスペース */}
          <IconButton
            onClick={handleCloseShareDialog}
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 0, pb: 3 }}>
          {/* 編集リンク */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              編集リンク
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              編集可能なURLリンクです。
            </Typography>
            <TextField
              fullWidth
              value={editLink}
              variant="outlined"
              size="small"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleCopyLink(editLink)}
                      size="small"
                      sx={{ color: 'primary.main' }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f5f5f5',
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#c0c0c0',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: '0.875rem',
                  color: '#666',
                },
              }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* 共有リンク */}
          <Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              共有リンク
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              閲覧のみ可能なURLリンクです。
            </Typography>
            <TextField
              fullWidth
              value={shareLink}
              variant="outlined"
              size="small"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleCopyLink(shareLink)}
                      size="small"
                      sx={{ color: 'primary.main' }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f5f5f5',
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#c0c0c0',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: '0.875rem',
                  color: '#666',
                },
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};