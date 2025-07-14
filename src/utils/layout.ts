import dagre from 'dagre';
import type { ClassData } from '../types/uml';

// レイアウト計算の定数（ClassNodeのおおよそのサイズに合わせて調整）
const NODE_WIDTH = 220;
const NODE_HEIGHT = 200;

export const calculateLayout = (classes: ClassData[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  // グラフの設定（親から子への方向を明確にする）
  dagreGraph.setGraph({ 
    rankdir: direction, // 'TB' = Top to Bottom
    nodesep: 60,        // ノード間の水平距離を狭める
    ranksep: 180,       // レベル間の垂直距離を増やす
    marginx: 100,       // 左右のマージンを増やす
    marginy: 100,       // 上下のマージンを増やす
    align: 'UL',        // 左上揃え
    acyclicer: 'greedy' // 循環を避ける
  });

  // 1. 全ノードを登録
  classes.forEach((cls) => {
    dagreGraph.setNode(cls.id, { 
      width: NODE_WIDTH, 
      height: NODE_HEIGHT,
      label: cls.name // デバッグ用
    });
  });

  // 2. 継承関係のエッジを登録（親 → 子の方向で登録）
  classes.forEach((childClass) => {
    childClass.relations?.forEach((rel) => {
      // 継承関係のみを対象とする
      if (rel.relation === 'INHERITANCE' || rel.relation === 'IMPLEMENTATION') {
        const parentClassExists = classes.some(c => c.id === rel.target_class_id);
        
        if (parentClassExists) {
          // 重要: 親から子への方向でエッジを設定
          // これにより親が上、子が下に配置される
          dagreGraph.setEdge(rel.target_class_id, childClass.id, {
            label: rel.relation === 'INHERITANCE' ? '継承' : '実装',
            weight: 10 // 継承関係の重みを高くして優先度を上げる
          });
        }
      }
    });
  });

  // 3. その他の関係（関連、集約、コンポジション）も追加
  classes.forEach((sourceClass) => {
    sourceClass.relations?.forEach((rel) => {
      if (rel.relation === 'ASSOCIATION' || rel.relation === 'AGGREGATION' || rel.relation === 'COMPOSITION') {
        const targetClassExists = classes.some(c => c.id === rel.target_class_id);
        
        if (targetClassExists) {
          // 関連関係は元の方向のまま、重みを低くする
          dagreGraph.setEdge(sourceClass.id, rel.target_class_id, {
            label: rel.relation,
            weight: 1 // 継承関係より低い重み
          });
        }
      }
    });
  });

  // 4. レイアウト計算を実行
  dagre.layout(dagreGraph);

  // 5. 計算結果を位置座標として返す
  const newPositions = new Map<string, { x: number; y: number }>();
  
  classes.forEach((cls) => {
    const nodeWithPosition = dagreGraph.node(cls.id);
    if (nodeWithPosition) {
      newPositions.set(cls.id, {
        // Dagreは中心座標を返すので、左上座標に変換
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      });
    }
  });

  return newPositions;
};

/**
 * 階層レイアウト専用の関数
 * 継承関係のみを考慮して、より明確な階層構造を作成
 */
export const calculateHierarchicalLayout = (classes: ClassData[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  // 階層構造により適した設定
  dagreGraph.setGraph({ 
    rankdir: 'TB',
    nodesep: 80,        // 同じレベルのノード間距離を適度に
    ranksep: 200,       // レベル間の距離をさらに広げる
    marginx: 120,       // 左右のマージンを増やす
    marginy: 100,       // 上下のマージンを増やす
    align: 'UL',        // 左上揃え
    ranker: 'longest-path' // 最長パスランキングを使用
  });

  // ノードを登録
  classes.forEach((cls) => {
    dagreGraph.setNode(cls.id, { 
      width: NODE_WIDTH, 
      height: NODE_HEIGHT 
    });
  });

  // 継承関係のみをエッジとして登録
  classes.forEach((childClass) => {
    childClass.relations?.forEach((rel) => {
      if (rel.relation === 'INHERITANCE' || rel.relation === 'IMPLEMENTATION') {
        const parentClassExists = classes.some(c => c.id === rel.target_class_id);
        
        if (parentClassExists) {
          // 親 → 子の方向
          dagreGraph.setEdge(rel.target_class_id, childClass.id, {
            weight: 10 // 重みを設定して配置を安定化
          });
        }
      }
    });
  });

  // レイアウト計算
  dagre.layout(dagreGraph);

  // 結果を返す
  const newPositions = new Map<string, { x: number; y: number }>();
  
  classes.forEach((cls) => {
    const nodeWithPosition = dagreGraph.node(cls.id);
    if (nodeWithPosition) {
      newPositions.set(cls.id, {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      });
    }
  });

  return newPositions;
};

/**
 * カスタム階層レイアウト（手動計算）
 * 複数の子クラスがある場合により確実な配置を保証
 */
export const calculateCustomHierarchicalLayout = (classes: ClassData[]) => {
  // 1. 親子関係を分析
  const parentChildMap = new Map<string, string[]>(); // 親ID -> 子IDの配列
  const childParentMap = new Map<string, string>(); // 子ID -> 親ID
  const rootClasses: string[] = []; // 親を持たないクラス
  
  // 関係を分析
  classes.forEach(cls => {
    parentChildMap.set(cls.id, []);
    
    cls.relations?.forEach(rel => {
      if (rel.relation === 'INHERITANCE' || rel.relation === 'IMPLEMENTATION') {
        // cls が子、rel.target_class_id が親
        childParentMap.set(cls.id, rel.target_class_id);
        
        if (!parentChildMap.has(rel.target_class_id)) {
          parentChildMap.set(rel.target_class_id, []);
        }
        parentChildMap.get(rel.target_class_id)!.push(cls.id);
      }
    });
  });
  
  // ルートクラス（親を持たないクラス）を特定
  classes.forEach(cls => {
    if (!childParentMap.has(cls.id)) {
      rootClasses.push(cls.id);
    }
  });
  
  // 2. レベルごとにクラスを分類
  const levels: string[][] = [];
  const visited = new Set<string>();
  
  const assignToLevel = (classIds: string[], level: number) => {
    if (classIds.length === 0) return;
    
    if (!levels[level]) {
      levels[level] = [];
    }
    
    classIds.forEach(classId => {
      if (!visited.has(classId)) {
        visited.add(classId);
        levels[level].push(classId);
        
        // 子クラスを次のレベルに追加
        const children = parentChildMap.get(classId) || [];
        if (children.length > 0) {
          assignToLevel(children, level + 1);
        }
      }
    });
  };
  
  // ルートから開始
  assignToLevel(rootClasses, 0);
  
  // 孤立したクラスを処理
  classes.forEach(cls => {
    if (!visited.has(cls.id)) {
      if (!levels[0]) levels[0] = [];
      levels[0].push(cls.id);
    }
  });
  
  // 3. 位置を計算（画面サイズに依存しない固定値を使用）
  const newPositions = new Map<string, { x: number; y: number }>();
  const levelHeight = NODE_HEIGHT + 120; // レベル間の距離
  const nodeSpacing = NODE_WIDTH + 80; // ノード間の距離
  
  levels.forEach((levelClasses, levelIndex) => {
    const totalWidth = levelClasses.length * nodeSpacing;
    const startX = 100; // 固定の開始位置
    
    levelClasses.forEach((classId, nodeIndex) => {
      const x = startX + nodeIndex * nodeSpacing;
      const y = 100 + levelIndex * levelHeight;
      
      newPositions.set(classId, { x, y });
    });
  });
  
  return newPositions;
};