import {
    Card, CardContent, IconButton, Grid, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDiagramStore } from '../../store/diagramStore';
import type { RelationType, RelationInfo, ClassData } from '../../types/uml';

interface RelationRowProps {
    classId: string;
    relation: RelationInfo;
    relationIndex: number;
    otherClasses: ClassData[];
}

export const RelationRow = ({ classId, relation, relationIndex, otherClasses }: RelationRowProps) => {
    const { updateRelation, deleteRelation, diagram } = useDiagramStore();

    const handleUpdateRelation = (field: keyof RelationInfo, value: any) => {
        const updatedRelation = {
            ...relation,
            [field]: value,
        };
        updateRelation(classId, relationIndex, updatedRelation);
    };

    // 現在のクラスの他の関係で使用されている対象クラスIDを取得
    const getUsedTargetClassIds = (): string[] => {
        const currentClass = diagram.classes.find(cls => cls.id === classId);
        if (!currentClass?.relations) return [];
        
        // 現在編集中の関係以外で使用されている対象クラスIDを取得
        return currentClass.relations
            .filter((_, index) => index !== relationIndex)
            .map(rel => rel.target_class_id);
    };

    // 選択可能なクラス（他の関係で使用されていないクラス + 現在選択中のクラス）
    const usedTargetIds = getUsedTargetClassIds();
    const availableClasses = otherClasses.filter(cls => 
        !usedTargetIds.includes(cls.id) || cls.id === relation.target_class_id
    );

    return (
        <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
                <Grid container spacing={2}>
                    {/* 対象クラスの選択 */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>対象クラス</InputLabel>
                            <Select
                                value={relation.target_class_id}
                                label="対象クラス"
                                onChange={(e) => handleUpdateRelation('target_class_id', e.target.value)}
                            >
                                {availableClasses.map((cls) => (
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
                                onChange={(e) => handleUpdateRelation('relation', e.target.value as RelationType)}
                            >
                                <MenuItem value="INHERITANCE">継承</MenuItem>
                                <MenuItem value="IMPLEMENTATION">実装</MenuItem>
                                <MenuItem value="ASSOCIATION">関連</MenuItem>
                                <MenuItem value="AGGREGATION">集約</MenuItem>
                                <MenuItem value="COMPOSITION">コンポジション</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* 削除ボタン */}
                    <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end">
                        <IconButton
                            color="error"
                            onClick={() => deleteRelation(classId, relationIndex)}
                            size="small"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};