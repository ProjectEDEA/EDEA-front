import { 
  Box, Typography, Select, MenuItem, FormControl, InputLabel, 
  Button, Card, CardContent, IconButton, Grid 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDiagramStore } from '../../store/diagramStore';
import type { RelationType, RelationInfo, Multiplicity } from '../../types/uml';

interface RelationEditorProps {
  classId: string;
}

export const RelationEditor = ({ classId }: RelationEditorProps) => {
  const { diagram, addRelation, updateRelation, deleteRelation } = useDiagramStore();
  
  // 現在のクラスを取得
  const currentClass = diagram.classes.find(cls => cls.id === classId);
  
  // 関係を追加できる他のクラスリスト（自分以外）
  const otherClasses = diagram.classes.filter(cls => cls.id !== classId);
  
  const handleAddRelation = () => {
    if (otherClasses.length > 0) {
      addRelation(classId, {
        target_class_id: otherClasses[0].id,
        relation: 'ASSOCIATION',
      });
    }
  };
  
  const handleUpdateRelation = (index: number, field: keyof RelationInfo, value: any) => {
    if (currentClass?.relations) {
      const updatedRelation = {
        ...currentClass.relations[index],
        [field]: value,
      };
      updateRelation(classId, index, updatedRelation);
    }
  };
  
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle1">クラス間の関係</Typography>
        <Button 
          variant="contained" 
          size="small" 
          onClick={handleAddRelation}
          disabled={otherClasses.length === 0}
        >
          関係を追加
        </Button>
      </Box>
      
      {currentClass?.relations?.map((relation, index) => {
        const targetClass = diagram.classes.find(cls => cls.id === relation.target_class_id);
        
        return (
          <Card key={index} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                {/* 対象クラスの選択 */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>対象クラス</InputLabel>
                    <Select
                      value={relation.target_class_id}
                      label="対象クラス"
                      onChange={(e) => handleUpdateRelation(index, 'target_class_id', e.target.value)}
                    >
                      {otherClasses.map((cls) => (
                        <MenuItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                {/* 関係の種類 */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>関係の種類</InputLabel>
                    <Select
                      value={relation.relation}
                      label="関係の種類"
                      onChange={(e) => handleUpdateRelation(index, 'relation', e.target.value as RelationType)}
                    >
                      <MenuItem value="INHERITANCE">継承</MenuItem>
                      <MenuItem value="IMPLEMENTATION">実装</MenuItem>
                      <MenuItem value="ASSOCIATION">関連</MenuItem>
                      <MenuItem value="AGGREGATION">集約</MenuItem>
                      <MenuItem value="COMPOSITION">コンポジション</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                {/* 多重度と役割名（省略） */}
                
                {/* 削除ボタン */}
                <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end">
                  <IconButton color="error" onClick={() => deleteRelation(classId, index)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      })}
      
      {(!currentClass?.relations || currentClass.relations.length === 0) && (
        <Typography variant="body2" color="text.secondary">
          関係がありません。「関係を追加」から作成してください。
        </Typography>
      )}
    </Box>
  );
};