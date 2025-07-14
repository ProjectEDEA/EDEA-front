import { MarkerType } from 'reactflow';
import type { RelationType, RelationInfo } from '../types/uml';

/**
 * 関係の種類に応じたラベルを返す
 */
export const getRelationTypeLabel = (relationType: RelationType): string => {
  switch (relationType) {
    case 'INHERITANCE': return '継承';
    case 'IMPLEMENTATION': return '実装';
    case 'ASSOCIATION': return '関連';
    case 'AGGREGATION': return '集約';
    case 'COMPOSITION': return 'コンポジション';
    default: return '';
  }
};

/**
 * 関係の種類に応じたマーカー（矢印）を返す
 */
export const getMarkerEndForRelation = (relationType: RelationType) => {
  switch (relationType) {
    case 'INHERITANCE':
      return {
        type: MarkerType.ArrowClosed,
        width: 24,
        height: 24,
        color: '#000',
      };
    case 'IMPLEMENTATION':
      return {
        type: MarkerType.ArrowClosed,
        width: 24,
        height: 24,
        color: '#000',
      };
    case 'ASSOCIATION':
      return {
        type: MarkerType.Arrow,
        width: 24,
        height: 24,
        color: '#000',
      };
    default:
      return undefined;
  }
};

export const getMarkerStartForRelation = (relationType: RelationType) => {
  switch (relationType) {
    case 'AGGREGATION':
        return 'diamond';
    case 'COMPOSITION':
        return 'diamondclosed';
    default:
      return undefined;
  }
};

/**
 * 双方向の関係を追加するヘルパー関数
 * diagramStore.tsで使用
 */
export const getInverseRelation = (relationType: RelationType): RelationType | null => {
  switch (relationType) {
    case 'ASSOCIATION': return 'ASSOCIATION';
    case 'AGGREGATION': return 'AGGREGATION';
    case 'COMPOSITION': return 'COMPOSITION';
    // 継承や実装の場合は逆向きの関係を自動生成しない
    default: return null;
  }
};

/**
 * エッジラベルの生成関数
 */
export const getEdgeLabel = (relation: RelationInfo): string => {
  let label = getRelationTypeLabel(relation.relation);
  
  // 多重度を追加
  if (relation.multiplicity_p || relation.multiplicity_c) {
    label += '\n';
    if (relation.multiplicity_p) {
      label += `${relation.multiplicity_p.lower}..${relation.multiplicity_p.upper || '*'} `;
    }
    if (relation.multiplicity_c) {
      label += `${relation.multiplicity_c.lower}..${relation.multiplicity_c.upper || '*'}`;
    }
  }
  
  return label;
};