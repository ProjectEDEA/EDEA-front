import { Grid, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDiagramStore } from '../../store/diagramStore';
import type { Variable } from '../../types/uml';

interface ParameterRowProps {
    classId: string;
    methodIndex: number;
    parameter: Variable;
    paramIndex: number;
}

export const ParameterRow = ({ classId, methodIndex, parameter, paramIndex }: ParameterRowProps) => {
    const { updateParameter, deleteParameter } = useDiagramStore();

    const handleChange = (field: keyof Variable, value: string) => {
        updateParameter(classId, methodIndex, paramIndex, { [field]: value });
    };

    return (
        <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Grid size={{ xs: 5, md: 5 }}>
                <TextField label="型" value={parameter.type} onChange={(e) => handleChange('type', e.target.value)} fullWidth size="small" />
            </Grid>
            <Grid size={{ xs: 6, md: 6 }}>
                <TextField label="名前" value={parameter.name} onChange={(e) => handleChange('name', e.target.value)} fullWidth size="small" />
            </Grid>
            <Grid size={{ xs: 1, md: 1 }}>
                <IconButton size="small" onClick={() => deleteParameter(classId, methodIndex, paramIndex)}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Grid>
        </Grid>
    );
};