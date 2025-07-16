import { Box, Button, List } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useDiagramStore } from '../../store/diagramStore';
import type { ClassData } from '../../types/uml';
import { MethodRow } from './MethodRow';

interface MethodEditorProps {
    selectedClass: ClassData;
}

export const MethodEditor = ({ selectedClass }: MethodEditorProps) => {
    const { addMethod } = useDiagramStore();

    return (
        <Box sx={{ position: 'relative', height: '100%' }}>
            <List>
                {selectedClass.methods.map((method, index) => (
                    <MethodRow key={index} classId={selectedClass.id} method={method} methodIndex={index} />
                ))}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 2
                    }}
                >
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => addMethod(selectedClass.id)}
                        startIcon={<AddIcon />}
                    >
                        関数を追加
                    </Button>
                </Box>
            </List>
        </Box>
    );
};