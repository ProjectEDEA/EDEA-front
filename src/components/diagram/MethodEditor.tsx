import { Box, Fab, List } from '@mui/material';
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
            </List>
            <Fab color="primary" sx={{ position: 'absolute', bottom: 16, right: 16 }} onClick={() => addMethod(selectedClass.id)}>
                <AddIcon />
            </Fab>
        </Box>
    );
};