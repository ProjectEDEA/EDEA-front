import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Container,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { convertTargetToSource } from '../api/convertData';
import { createNewDiagram, useDiagramStore } from '../store/diagramStore';
import edeaLogo from '../img/EDEA-logo.png';
import { client } from '../api/client'; // APIクライアントのインポート

export const TopPage = () => {
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const [projectName, setProjectName] = useState('');
    const { setDiagram } = useDiagramStore();

    // ダイアログを開く
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    // ダイアログを閉じる
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setProjectName('');
    };

    // プロジェクト作成
    const handleCreateProject = async () => {
        try {
            const newDiagram = createNewDiagram(projectName);
            setDiagram(newDiagram);
            const convertedData = convertTargetToSource(newDiagram);
            client.postDiagram(convertedData); // 新しいダイアグラムを作成
            navigate(`/editor/${newDiagram.id}`);
        } catch (error) {
            console.error('Project creation failed:', error);
        }

        handleCloseDialog();
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                bgcolor: '#f5f5f5',
                p: 3
            }}
        >
            <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
                {/* EDEAタイトルBox */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center', // 中央寄せを追加
                    mb: 6
                }}>
                    <img
                        src={edeaLogo}
                        alt="EDEA Logo"
                        style={{
                            width: 100,
                            height: 100,
                            objectFit: 'contain' // 画像の縦横比を保持
                        }}
                    />
                    <Typography
                        variant="h1"
                        component="h1"
                        sx={{
                            // mb: 6,
                            fontWeight: 300,
                            color: '#666',
                            letterSpacing: '0.4rem',
                            fontFamily: 'Arial, sans-serif'
                        }}
                    >
                        EDEA
                    </Typography>
                </Box>

                {/* 作成ボタン */}
                <Button
                    variant="outlined"
                    sx={{
                        borderRadius: '50px',
                        px: 5,
                        py: 1,
                        borderWidth: 1,
                        borderColor: '#888',
                        color: '#555',
                        fontSize: '1.1rem',
                        '&:hover': {
                            bgcolor: '#eee',
                            borderWidth: 1,
                            borderColor: '#666',
                        }
                    }}
                    onClick={handleOpenDialog}
                >
                    作成
                </Button>
            </Container>

            {/* プロジェクト作成ダイアログ */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
                <DialogTitle sx={{ textAlign: 'center' }}>新しいダイアグラム</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="ダイアグラム名"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button
                        onClick={handleCloseDialog}
                        color="inherit"
                        sx={{ borderRadius: '20px' }}
                    >
                        キャンセル
                    </Button>
                    <Button
                        onClick={handleCreateProject}
                        variant="contained"
                        disabled={!projectName}
                        sx={{ borderRadius: '20px' }}
                    >
                        作成
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TopPage;