import { Box, Typography, TextField } from '@mui/material';
import { useDiagramStore } from '../../store/diagramStore'; // Zustandストアをインポート

export const EditorPanel = () => {
  // ★変更点: ストアから必要な情報を取得
  const { diagram, selectedClassId, updateClassName } = useDiagramStore();

  // 選択されたクラスのデータを検索
  const selectedClass = diagram.classes.find(
    (cls) => cls.id === selectedClassId
  );

  // クラス名が変更されたときのハンドラ
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedClass) {
      updateClassName(selectedClass.id, event.target.value);
    }
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ddd', height: '100%' }}>
      <Typography variant="h5" gutterBottom>
        クラスの編集
      </Typography>

      {selectedClass ? (
        // ★変更点: 選択されたクラスの情報を表示し、編集可能にする
        <>
          <TextField
            label="クラス名"
            value={selectedClass.name}
            onChange={handleNameChange} // onChangeイベントを追加
            fullWidth
            margin="normal"
          />
          {/* 今後、ここに属性やメソッドの編集UIを追加していく */}
        </>
      ) : (
        <Typography>左のダイアグラムからクラスを選択してください</Typography>
      )}
    </Box>
  );
};