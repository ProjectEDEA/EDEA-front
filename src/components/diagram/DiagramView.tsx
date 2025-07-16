import { useCallback, useEffect, useRef } from 'react';
import ReactFlow, { Background, Controls, Node, ReactFlowInstance } from 'reactflow';
// import {
//   ReactFlow,
//   Background,
//   Controls,
//   Node,
//   ReactFlowInstance,
//   ReactFlowProvider,
// } from '@xyflow/react';
import { ReactFlowProvider } from '@xyflow/react';
import { Fab, SpeedDial, SpeedDialAction } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
// import 'reactflow/dist/style.css';
import '@xyflow/react/dist/style.css';
import { useDiagramStore } from '../../store/diagramStore';
import { ClassNode } from './ClassNode';
import type { ClassData, RelationType } from '../../types/uml';
import { getEdgeLabel, getMarkerEndForRelation, getMarkerStartForRelation } from '../../utils/diagramUtils';
import { DiamondMarker } from './DiamondMarker';
import { calculateLayout, calculateHierarchicalLayout, calculateCustomHierarchicalLayout } from '../../utils/layout';
import CustomEdge from './CustomEdge';
import CustomEdgeStartEnd from './CustomEdgeStartEnd';

const nodeTypes = {
  classNode: ClassNode,
};

const edgeTypes = {
  custom: CustomEdge,
  'start-end': CustomEdgeStartEnd,
};

// 関係の種類に応じたエッジスタイル
const getEdgeStyleForRelation = (relationType: RelationType) => {
  switch (relationType) {
    case 'INHERITANCE':
      return { stroke: '#000', strokeWidth: 2.5 };
    case 'IMPLEMENTATION':
      return { stroke: '#000', strokeWidth: 2.5, strokeDasharray: '8' };
    case 'ASSOCIATION':
      return { stroke: '#000', strokeWidth: 2.5 };
    case 'AGGREGATION':
      return { stroke: '#000', strokeWidth: 2.5 };
    case 'COMPOSITION':
      return { stroke: '#000', strokeWidth: 2.5 };
    default:
      return {};
  }
};

export const DiagramView = () => {
  const { diagram, selectClass, isEditorMode, addClass, applyAutoLayout, updateAllClassPositions } = useDiagramStore();
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  const nodes = diagram.classes.map((classData) => ({
    id: classData.id,
    type: 'classNode',
    position: classData.position,
    data: {
      classData,
    }
  }));

  const edges = diagram.classes.flatMap(
    (classData) =>
      classData.relations?.map((rel) => ({
        id: `${classData.id}-${rel.target_class_id}`,
        source: classData.id,
        target: rel.target_class_id,
        type: 'smoothstep',
        label: getEdgeLabel(rel),
        style: getEdgeStyleForRelation(rel.relation),
        markerEnd: getMarkerEndForRelation(rel.relation),
        markerStart: getMarkerStartForRelation(rel.relation),
        // data: rel
      })) ?? []
  );

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    selectClass(node.id);
  }, [selectClass]);

  const handleAddClass = useCallback(() => {
    const newClassId = `class_${Date.now()}`;
    const newClass: ClassData = {
      id: newClassId,
      name: '新しいクラス',
      attributes: [],
      methods: [],
      relations: [],
      position: { x: 50, y: 50 } // とりあえず左上に配置
    };
    addClass(newClass);
    selectClass(newClassId);
  }, [addClass, selectClass]);

  const applyCustomHierarchicalLayout = useCallback(() => {
    updateAllClassPositions(diagram);

    // レイアウト更新後に少し遅延してfitViewを実行
    setTimeout(() => {
      if (reactFlowInstance.current) {
        reactFlowInstance.current.fitView({
          padding: 0.1, // 10%のパディングを追加
          minZoom: 0.1, // 最小ズーム
          maxZoom: 1.5, // 最大ズーム
          duration: 800 // アニメーション時間（ミリ秒）
        });
      }
    }, 100);
  }, [diagram.classes, updateAllClassPositions]);

  // ReactFlowインスタンスを取得
  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance;
  }, []);

  useEffect(() => {
    // 編集モードかつクラスが存在する場合のみ実行
    if (isEditorMode && diagram.classes.length > 0) {
      console.log('ダイアグラムが更新されました。自動レイアウトを実行します。');
      
      // ReactFlowが初期化されるまで待機
      const timer = setTimeout(() => {
        applyCustomHierarchicalLayout();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [diagram.classes.length, diagram.classes, isEditorMode, applyCustomHierarchicalLayout]);

  return (
    <ReactFlowProvider>
      <div style={{ height: '100%', border: '1px solid #ddd', position: 'relative' }}>
        <DiamondMarker />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          // edgeTypes={edgeTypes}
          onNodeClick={handleNodeClick}
          onInit={onInit} // ReactFlowインスタンスを取得
          fitView
          fitViewOptions={{
            padding: 0.1,
            minZoom: 0.1,
            maxZoom: 1.5
          }}
        >
          <Background />
          <Controls />
        </ReactFlow>

        {/* 編集モードのときのみボタンを表示 */}
      {isEditorMode && (
        <>
          {/* ★ 自動レイアウト実行ボタン */}
          <Fab
            color="secondary"
            aria-label="auto layout"
            onClick={applyCustomHierarchicalLayout}
            sx={{ position: 'absolute', bottom: 16, right: 88, zIndex: 1000 }}
          >
            <AutoFixHighIcon />
          </Fab>

          {/* 新規クラス追加ボタン */}
          <Fab
            color="primary"
            aria-label="add class"
            onClick={handleAddClass}
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              zIndex: 1000
            }}
          >
            <AddIcon />
          </Fab>
        </>
      )}
      </div>
    </ReactFlowProvider>
  );
};