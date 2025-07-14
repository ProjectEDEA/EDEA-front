import { useCallback } from 'react';
import ReactFlow, { Background, Controls, Node } from 'reactflow';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import 'reactflow/dist/style.css';
import { useDiagramStore } from '../../store/diagramStore';
import { ClassNode } from './ClassNode';
import type { ClassData, RelationType } from '../../types/uml';
import { getEdgeLabel, getMarkerEndForRelation } from '../../utils/diagramUtils';
import { DiamondMarker } from './DiamondMarker';

const nodeTypes = {
  classNode: ClassNode,
};

// 関係の種類に応じたエッジスタイル
const getEdgeStyleForRelation = (relationType: RelationType) => {
  switch (relationType) {
    case 'INHERITANCE':
      return { stroke: '#333', strokeWidth: 2 };
    case 'IMPLEMENTATION':
      return { stroke: '#333', strokeWidth: 1.5, strokeDasharray: '5,5' };
    case 'ASSOCIATION':
      return { stroke: '#666', strokeWidth: 1 };
    case 'AGGREGATION':
      return { stroke: '#888', strokeWidth: 2 };
    case 'COMPOSITION':
      return { stroke: '#000', strokeWidth: 2.5 };
    default:
      return {};
  }
};

export const DiagramView = () => {
  const { diagram, selectClass, addClass } = useDiagramStore();

  const nodes = diagram.classes.map((classData) => ({
    id: classData.id,
    type: 'classNode',
    position: classData.position,
    data: classData,
    draggable: true,
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
        data: rel
      })) ?? []
  );

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node<ClassData>) => {
    selectClass(node.id);
  }, [selectClass]);

  const handleAddClass = useCallback(() => {
    // 新しいクラスのIDを生成
    const newClassId = `class_${Date.now()}`;
    
    // 新しいクラスの位置を計算（他のクラスと重ならないように）
    const existingPositions = diagram.classes.map(cls => cls.position);
    let newPosition = { x: 100, y: 100 };
    
    // 既存のクラスと重ならない位置を見つける
    while (existingPositions.some(pos => 
      Math.abs(pos.x - newPosition.x) < 200 && Math.abs(pos.y - newPosition.y) < 150
    )) {
      newPosition.x += 220;
      if (newPosition.x > 800) {
        newPosition.x = 100;
        newPosition.y += 170;
      }
    }

    // 新しいクラスを追加
    const newClass: ClassData = {
      id: newClassId,
      name: '新しいクラス',
      attributes: [],
      methods: [],
      relations: [],
      position: newPosition
    };

    addClass(newClass);
    
    // 新しく作成したクラスを選択状態にする
    selectClass(newClassId);
  }, [diagram.classes, addClass, selectClass]);

  return (
    <div style={{ height: '100%', border: '1px solid #ddd', position: 'relative' }}>
      <DiamondMarker />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
      
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
    </div>
  );
};