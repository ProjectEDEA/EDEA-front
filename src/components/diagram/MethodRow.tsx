import { Box, Card, CardContent, Checkbox, FormControlLabel, Grid, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useDiagramStore } from '../../store/diagramStore';
import type { Method } from '../../types/uml';
import { ParameterRow } from './ParameterRow';

interface MethodRowProps {
    classId: string;
    method: Method;
    methodIndex: number;
}

export const MethodRow = ({ classId, method, methodIndex }: MethodRowProps) => {
    const { updateMethod, deleteMethod, addParameter } = useDiagramStore();

    const handleChange = (field: keyof Method, value: any) => {
        updateMethod(classId, methodIndex, { [field]: value });
    };

    const handleCheckboxChange = (field: 'is_static' | 'is_abstract', checked: boolean) => {
        updateMethod(classId, methodIndex, { [field]: checked });
    };

    return (
        <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
                <Grid container spacing={1} alignItems="center">
                    <Grid size={{ xs: 3 }}>
                        <Select
                            value={method.visibility}
                            label="可視性"
                            onChange={(e) => handleChange('visibility', e.target.value)} 
                            fullWidth size="small"
                        >
                            <MenuItem value="PUBLIC">+ public</MenuItem>
                            <MenuItem value="PRIVATE">- private</MenuItem>
                            <MenuItem value="PROTECTED"># protected</MenuItem>
                        </Select>
                    </Grid>
                    <Grid size={{ xs: 3 }}><FormControlLabel control={<Checkbox checked={!!method.is_static} onChange={(e) => handleCheckboxChange('is_static', e.target.checked)} />} label="static" /></Grid>
                    <Grid size={{ xs: 4 }}><FormControlLabel control={<Checkbox checked={!!method.is_abstract} onChange={(e) => handleCheckboxChange('is_abstract', e.target.checked)} />} label="abstract" /></Grid>
                    <Grid size={{ xs: 2 }}><IconButton onClick={() => deleteMethod(classId, methodIndex)}><DeleteIcon /></IconButton></Grid>
                    <Grid size={{ xs: 6 }}><TextField label="戻り値の型" value={method.return_type} onChange={(e) => handleChange('return_type', e.target.value)} fullWidth size="small" /></Grid>
                    <Grid size={{ xs: 6 }}><TextField label="名前" value={method.name} onChange={(e) => handleChange('name', e.target.value)} fullWidth size="small" /></Grid>
                </Grid>
                <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>引数</Typography>
                    {method.parameters.map((param, index) => (
                        <ParameterRow key={index} classId={classId} methodIndex={methodIndex} parameter={param} paramIndex={index} />
                    ))}
                    <IconButton size="small" color="primary" onClick={() => addParameter(classId, methodIndex)}><AddCircleIcon /></IconButton>
                </Box>
            </CardContent>
        </Card>
    );
};