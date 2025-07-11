import {
  Box, Typography, Button
} from '@mui/material';
import { useDiagramStore } from '../../store/diagramStore';
import { RelationRow } from './RelationRow';

interface RelationEditorProps {
  classId: string;
}

export const RelationEditor = ({ classId }: RelationEditorProps) => {
  const { diagram, addRelation } = useDiagramStore();

  // 現在のクラスを取得
  const currentClass = diagram.classes.find(cls => cls.id === classId);

  // 関係を追加できる他のクラスリスト（自分以外）
  const otherClasses = diagram.classes.filter(cls => cls.id !== classId);

  // すでに関係がある対象クラスIDを取得
  const existingTargetIds = currentClass?.relations?.map(rel => rel.target_class_id) || [];

  // まだ関係を持っていないクラスがあるかチェック
  const availableClasses = otherClasses.filter(cls => !existingTargetIds.includes(cls.id));
  const canAddRelation = availableClasses.length > 0;

  const handleAddRelation = () => {
    if (canAddRelation) {
      addRelation(classId, {
        target_class_id: availableClasses[0].id,
        relation: 'ASSOCIATION',
      });
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
          disabled={!canAddRelation}
        >
          関係を追加
        </Button>
      </Box>

      {currentClass?.relations?.map((relation, index) => (
        <RelationRow
          key={index}
          classId={classId}
          relation={relation}
          relationIndex={index}
          otherClasses={otherClasses}
        />
      ))}

      {(!currentClass?.relations || currentClass.relations.length === 0) && (
        <Typography variant="body2" color="text.secondary">
          関係がありません。「関係を追加」から作成してください。
        </Typography>
      )}

      {!canAddRelation && otherClasses.length > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          ※ すべてのクラスとの関係が既に設定されています。
        </Typography>
      )}
    </Box>
  );
};