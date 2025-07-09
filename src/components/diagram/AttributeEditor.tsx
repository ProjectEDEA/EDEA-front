import { Box, Fab, List } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useDiagramStore } from '../../store/diagramStore';
import type { ClassData } from '../../types/uml';
import { AttributeRow } from './AttributeRow';

interface AttributeEditorProps {
  selectedClass: ClassData;
}

export const AttributeEditor = ({ selectedClass }: AttributeEditorProps) => {
  const { addAttribute } = useDiagramStore();

  const handleAddAttribute = () => {
    addAttribute(selectedClass.id);
  };

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      <List>
        {selectedClass.attributes.map((attr, index) => (
          <AttributeRow
            key={index} // 本来はユニークなIDが良い
            classId={selectedClass.id}
            attribute={attr}
            index={index}
          />
        ))}
      </List>
      <Fab
        color="primary"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        onClick={handleAddAttribute}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};