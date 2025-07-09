// 変更点: useMemo, mockDiagramを削除し、Zustandのフックをインポート
import { useCallback } from 'react'; // useCallbackをインポート
import ReactFlow, { Background, Controls, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import { useDiagramStore } from '../../store/diagramStore'; // Zustandストアをインポート
import { ClassNode } from './ClassNode';
import type { ClassData } from '../../types/uml';

const nodeTypes = {
  classNode: ClassNode,
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
  }));

  const edges = diagram.classes.flatMap(
    (classData) =>
      classData.relations?.map((rel) => ({
        id: `${classData.id}-${rel.target_class_id}`,
        source: classData.id,
        target: rel.target_class_id,
        label: rel.relation,
        type: 'smoothstep',
      })) ?? []
  );

  // ★追加点: ノードクリック時の処理
  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node<ClassData>) => {
    selectClass(node.id);
  }, [selectClass]);

  return (
    <div style={{ height: '100%', border: '1px solid #ddd' }}>
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