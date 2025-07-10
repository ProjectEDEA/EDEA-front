import { Grid, Select, MenuItem, TextField, IconButton, FormControl, InputLabel, FormControlLabel, Checkbox } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDiagramStore } from '../../store/diagramStore';
import type { Variable } from '../../types/uml';

interface AttributeRowProps {
    classId: string;
    attribute: Variable;
    index: number;
}

export const AttributeRow = ({ classId, attribute, index }: AttributeRowProps) => {
    const { updateAttribute, deleteAttribute } = useDiagramStore();

    const handleChange = (field: keyof Variable, value: string | boolean) => {
        updateAttribute(classId, index, { [field]: value });
    };

    return (
        <Card variant="outlined" sx={{ mb: 1, backgroundColor: 'white' }}>
            <CardContent>
                <Grid container spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Grid size={{ xs: 3, md: 3 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>可視性</InputLabel>
                            <Select
                                value={attribute.visibility ?? 'PRIVATE'}
                                label="可視性"
                                onChange={(e) => handleChange('visibility', e.target.value)}
                            >
                                <MenuItem value="PUBLIC">+ public</MenuItem>
                                <MenuItem value="PRIVATE">- private</MenuItem>
                                <MenuItem value="PROTECTED"># protected</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 3, md: 3 }}>
                        <TextField
                            label="型"
                            value={attribute.type}
                            onChange={(e) => handleChange('type', e.target.value)}
                            fullWidth
                            size="small"
                        />
                    </Grid>
                    <Grid size={{ xs: 3, md: 3 }}>
                        <TextField
                            label="名前"
                            value={attribute.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            fullWidth
                            size="small"
                        />
                    </Grid>
                    <Grid size={{ xs: 2, md: 2 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={attribute.is_static ?? false}
                                    onChange={(e) => handleChange('is_static', e.target.checked)}
                                    size="small"
                                />
                            }
                            label="static"
                            sx={{ ml: 1 }}
                        />
                    </Grid>
                    <Grid size={{ xs: 1, md: 1 }}>
                        <IconButton onClick={() => deleteAttribute(classId, index)}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};