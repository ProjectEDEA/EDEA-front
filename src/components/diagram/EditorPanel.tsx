import { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDiagramStore } from '../../store/diagramStore';
import { AttributeEditor } from './AttributeEditor';
import { MethodEditor } from './MethodEditor';
import { RelationEditor } from './RelationEditor';

export const EditorPanel = () => {
    const { diagram, selectedClassId, updateClassName, deleteClass } = useDiagramStore();
    const [view, setView] = useState<'attributes' | 'methods' | 'relations'>('attributes');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const selectedClass = diagram.classes.find(
        (cls) => cls.id === selectedClassId
    );

    const handleViewChange = (
        event: React.MouseEvent<HTMLElement>,
        newView: 'attributes' | 'methods' | 'relations' | null
    ) => {
        if (newView !== null) {
            setView(newView);
        }
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedClass) {
            updateClassName(selectedClass.id, event.target.value);
        }
    };

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedClass) {
            deleteClass(selectedClass.id);
            setDeleteDialogOpen(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" gutterBottom>
                    クラスの編集
                </Typography>

                {selectedClass && (
                    <>
                        {/* クラス名と削除ボタンを横並びに配置 */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mt: 2 }}>
                            <TextField
                                label="クラス名"
                                value={selectedClass.name}
                                onChange={handleNameChange}
                                fullWidth
                                margin="normal"
                                sx={{ mb: 0 }}
                            />
                            <IconButton
                                color="error"
                                onClick={handleDeleteClick}
                                aria-label="クラスを削除"
                                sx={{ mb: 1 }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>

                        <ToggleButtonGroup
                            value={view}
                            exclusive
                            onChange={handleViewChange}
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            <ToggleButton value="attributes">変数</ToggleButton>
                            <ToggleButton value="methods">関数</ToggleButton>
                            <ToggleButton value="relations">関係</ToggleButton>
                        </ToggleButtonGroup>
                    </>
                )}
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                {!selectedClass ? (
                    <Typography>左のダイアグラムからクラスを選択してください</Typography>
                ) : (
                    <>
                        {view === 'attributes' && <AttributeEditor selectedClass={selectedClass} />}
                        {view === 'methods' && <MethodEditor selectedClass={selectedClass} />}
                        {view === 'relations' && <RelationEditor classId={selectedClass.id} />}
                    </>
                )}
            </Box>

            {/* 削除確認ダイアログ */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    クラスの削除
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        クラス「{selectedClass?.name}」を削除しますか？
                        <br />
                        この操作は元に戻せません。
                        <br />
                        また、このクラスに関連する全ての関係も削除されます。
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        キャンセル
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        削除
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};