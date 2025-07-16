import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  DialogActions,
  IconButton,
  InputAdornment,
  Divider
} from '@mui/material';
import PolylineIcon from '@mui/icons-material/Polyline';
import SaveIcon from '@mui/icons-material/Save';
import IosShareIcon from '@mui/icons-material/IosShare';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WarningIcon from '@mui/icons-material/Warning';
import { useDiagramStore } from '../../store/diagramStore';
import { convertTargetToSource } from '../../api/convertData';
import axios from 'axios';
import { useSnackbar } from 'notistack';

export const Header = () => {
  const navigate = useNavigate();
  const { diagram, isEditorMode, updateDiagramName } = useDiagramStore();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleNameChange = (value: string) => {
    updateDiagramName(value);
  };

  // 保存ボタン
  const handleSaveClick = async () => {
    try {
      setSaving(true);
      const convertedData = convertTargetToSource(diagram);
      const baseURL = "http://localhost:3000";

      await axios.post(baseURL + "/api_p1", convertedData);
      console.log('ダイアグラム保存成功');

      // 保存成功のトースト表示
      enqueueSnackbar('ダイアグラムを保存しました', {
        variant: 'success',
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });

    } catch (error) {
      console.error('ダイアグラム保存エラー:', error);

      // 保存失敗のトースト表示
      enqueueSnackbar('保存に失敗しました', {
        variant: 'error',
        autoHideDuration: 4000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });
    } finally {
      setSaving(false);
    }
  };

  // 共有ダイアログを開く
  const handleShareClick = () => {
    setShareDialogOpen(true);
  };

  // 共有ダイアログを閉じる
  const handleCloseShareDialog = () => {
    setShareDialogOpen(false);
  };

  // 削除ダイアログを開く
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  // 削除ダイアログを閉じる
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  // ダイアグラムを削除
  const handleDeleteDiagram = async () => {
    try {
      setDeleting(true);
      const baseURL = "http://localhost:3000";

      await axios.delete(`${baseURL}/api_p1/${diagram.id}`);
      console.log('ダイアグラム削除成功');

      // 削除成功のトースト表示
      enqueueSnackbar(`「${diagram.name}」を削除しました`, {
        variant: 'success',
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });

      // ダイアログを閉じる
      setDeleteDialogOpen(false);

      // 少し遅延してからTopPageに遷移（トーストを見せるため）
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);

    } catch (error) {
      console.error('ダイアグラム削除エラー:', error);

      // 削除失敗のトースト表示
      enqueueSnackbar('削除に失敗しました', {
        variant: 'error',
        autoHideDuration: 4000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });

      // エラーが発生してもダイアログを閉じる
      setDeleteDialogOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  // リンクをクリップボードにコピー
  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      console.log('リンクをコピーしました:', link);

      // コピー成功のトースト表示
      enqueueSnackbar('リンクをコピーしました', {
        variant: 'success',
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      });

    } catch (error) {
      console.error('コピーに失敗しました:', error);

      // コピー失敗のトースト表示
      enqueueSnackbar('コピーに失敗しました', {
        variant: 'error',
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      });
    }
  };

  // リンクを生成
  const generateLinks = () => {
    const baseUrl = window.location.origin;
    const diagramId = diagram.id;

    const editLink = `${baseUrl}/editor/${diagramId}`;
    const shareLink = `${baseUrl}/preview/${diagramId}`; // 閲覧専用リンク

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
            {/* ダイアグラム名表示・編集 */}
            {isEditorMode ? (
              // 編集モード: TextField（編集可能）
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
            ) : (
              // プレビューモード: Typography（読み取り専用）
              <Box
                sx={{
                  width: 300,
                  px: 2,
                  py: 1.5,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: '40px', // TextFieldと同じ高さ
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '100%',
                  }}
                >
                  {diagram.name || 'ダイアグラム名なし'}
                </Typography>
              </Box>
            )}
            {isEditorMode && (
              <Button
                variant="contained"
                color="secondary"
                startIcon={saving ? null : <SaveIcon />}
                onClick={handleSaveClick}
                disabled={saving}
                sx={{
                  minWidth: 100,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.5)',
                  },
                }}
              >
                {saving ? '保存中...' : '保存'}
              </Button>
            )}
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
            {isEditorMode && (
              <Button
                variant="contained"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteClick}
                sx={{
                  minWidth: 100,
                  backgroundColor: 'rgba(244, 67, 54, 0.8)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(244, 67, 54, 0.9)',
                  },
                  '&:active': {
                    backgroundColor: 'rgba(244, 67, 54, 1)',
                  },
                }}
              >
                削除
              </Button>
            )}
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
          {isEditorMode && (
            <>
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
            </>
          )}

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

      {/* 削除確認ダイアログ */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: 400,
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'error.main'
        }}>
          <WarningIcon color="error" />
          ダイアグラムの削除
        </DialogTitle>

        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            「<strong>{diagram.name}</strong>」を削除しますか？
          </Typography>
          <Typography variant="body2" color="text.secondary">
            この操作は取り消すことができません。削除されたダイアグラムは復元できません。
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            disabled={deleting}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleDeleteDiagram}
            variant="contained"
            color="error"
            disabled={deleting}
            startIcon={deleting ? null : <DeleteIcon />}
          >
            {deleting ? '削除中...' : '削除する'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};