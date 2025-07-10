import { useState } from 'react';
import { Box, Typography, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useDiagramStore } from '../../store/diagramStore';
import { AttributeEditor } from './AttributeEditor'; // これから作成
import { MethodEditor } from './MethodEditor';

export const EditorPanel = () => {
    const { diagram, selectedClassId, updateClassName } = useDiagramStore();
    const [view, setView] = useState<'attributes' | 'methods' | 'relations'>('attributes');

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

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" gutterBottom>
                    クラスの編集
                </Typography>

                {selectedClass && (
                    <>
                        <TextField
                            label="クラス名"
                            value={selectedClass.name}
                            onChange={handleNameChange}
                            fullWidth
                            margin="normal"
                        />

                        <ToggleButtonGroup
                            value={view}
                            exclusive
                            onChange={handleViewChange}
                            fullWidth
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
                        {/* TODO: view === 'methods' や 'relations' の場合のコンポーネントも後で追加 */}
                        {view === 'methods' && <MethodEditor selectedClass={selectedClass} />}
                    </>
                )}
            </Box>
        </Box>
    );
};