import { Box, CircularProgress, Typography } from '@mui/material';
import { DiagramView } from '../components/diagram/DiagramView';
import { Header } from '../components/layout/Header';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDiagramStore } from '../store/diagramStore';
import { convertSourceToTarget } from '../api/convertData';
import { client } from '../api/client';

const PreviewPage = () => {
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

      console.log('プレビューモードでダイアグラム読み込み成功:', response.data);

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

  // コンポーネントマウント時にプレビューモードに設定
  useEffect(() => {
    console.log('PreviewPage: プレビューモードに設定');
    setEditorMode(false);
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

  // プレビューモード時の表示（フルスクリーン）
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box sx={{ flex: 1 }}>
        <DiagramView />
      </Box>
    </Box>
  );
}

export default PreviewPage;