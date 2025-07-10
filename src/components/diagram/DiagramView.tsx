// 変更点: useMemo, mockDiagramを削除し、Zustandのフックをインポート
import { useCallback } from 'react'; // useCallbackをインポート
import ReactFlow, { Background, Controls, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import { useDiagramStore } from '../../store/diagramStore'; // Zustandストアをインポート
import { ClassNode } from './ClassNode';
import type { ClassData, RelationType } from '../../types/uml';
import { getEdgeLabel, getMarkerEndForRelation, getRelationTypeLabel } from '../../utils/diagramUtils';
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
  // ストアから状態とアクションを取得
  const { diagram, selectClass } = useDiagramStore();

  // ★変更点: ストアのデータからnodesとedgesを生成
  const nodes = diagram.classes.map((classData) => ({
    id: classData.id,
    type: 'classNode',
    position: classData.position,
    data: classData,
    draggable: true,
  }));

  // エッジの生成
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

  // ★追加点: ノードクリック時の処理
  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node<ClassData>) => {
    selectClass(node.id);
  }, [selectClass]);

  return (
    <div style={{ height: '100%', border: '1px solid #ddd', position: 'relative' }}>
      <DiamondMarker /> {/* ひし形マーカーを追加 */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick} // クリックイベントを登録
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};