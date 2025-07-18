import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { DiagramView } from '../components/diagram/DiagramView';
import { EditorPanel } from '../components/diagram/EditorPanel';
import { Header } from '../components/layout/Header';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDiagramStore } from '../store/diagramStore';
import { convertSourceToTarget } from '../api/convertData';
import { client } from '../api/client';

export const EditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setDiagram, diagram, setEditorMode } = useDiagramStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ダイアグラムを読み込む関数
  const loadDiagram = async (diagramId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await client.getDiagram(diagramId);

      console.log('編集モードでダイアグラム読み込み成功:', response.data);

      // サーバーからのデータを内部形式に変換
      const convertedData = convertSourceToTarget(response.data);
      setDiagram(convertedData);
    } catch (error) {
      console.error('ダイアグラム読み込みエラー:', error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          // ダイアグラムが存在しない場合
          console.log('ダイアグラムが存在しません。TopPageに遷移します。');
          navigate('/', { replace: true });
          return;
        }
      }

      setError('ダイアグラムの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // コンポーネントマウント時に編集モードに設定
  useEffect(() => {
    console.log('EditorPage: 編集モードに設定');
    setEditorMode(true);
  }, [setEditorMode]);

  // URLパラメータのIDが変更されたときにダイアグラムを読み込む
  useEffect(() => {
    if (!id) {
      console.log('IDが指定されていません。TopPageに遷移します。');
      navigate('/', { replace: true });
      return;
    }

    // 現在のダイアグラムIDと異なる場合のみ読み込み
    if (diagram.id !== id) {
      loadDiagram(id);
    } else {
      setLoading(false);
    }
  }, [id, diagram.id, navigate]);

  // ローディング中の表示
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography>ダイアグラムを読み込み中...</Typography>
      </Box>
    );
  }

  // エラー時の表示
  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: 2
        }}
      >
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <button onClick={() => navigate('/')}>
          TopPageに戻る
        </button>
      </Box>
    );
  }

  // 編集モード時の表示
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* 左側: UML図ビューア */}
        <Grid size={{xs:7,md:7}}>
          <DiagramView />
        </Grid>

        {/* 右側: 編集パネル */}
        <Grid size={{xs:6,md:5}}>
          <EditorPanel />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditorPage;