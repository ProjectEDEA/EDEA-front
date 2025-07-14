import { Box, Button, Fab, List } from '@mui/material';
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
            onClick={handleAddAttribute}
            startIcon={<AddIcon />}
          >
            属性を追加
          </Button>
        </Box>
      </List>
    </Box>
  );
};