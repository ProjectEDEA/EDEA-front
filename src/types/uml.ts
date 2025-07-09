// 可視性 (visibility)
export type Visibility = 'PUBLIC' | 'PRIVATE' | 'PROTECTED' | 'NON_MODIFIER';

// 関係の種類 (Relation)
export type RelationType =
  | 'NONE'
  | 'INHERITANCE'      // 継承
  | 'IMPLEMENTATION'   // 実現
  | 'ASSOCIATION'      // 関連
  | 'AGGREGATION'      // 集約
  | 'COMPOSITION';     // コンポジション

// 多重度 (Multiplicity)
export interface Multiplicity {
  lower: number;
  upper?: number; // optionalなので `?` をつける
}

// 変数・属性 (Variable)
export interface Variable {
  visibility?: Visibility;
  is_static?: boolean;
  name: string;
  type: string;
}

// メソッド (Method)
export interface Method {
  visibility: Visibility;
  is_abstract?: boolean;
  is_static?: boolean;
  name: string;
  return_type: string;
  parameters: Variable[]; // repeatedなので配列
}

// 関係の詳細情報 (RelationInfo)
export interface RelationInfo {
  target_class_id: string;
  relation: RelationType;
  multiplicity_p?: Multiplicity; // 親側の多重度
  multiplicity_c?: Multiplicity; // 子側の多重度
  role_name_p?: string;
  role_name_c?: string;
}

// クラス本体のデータ構造 (Class)
// これがUML図のクラス一つ分に相当します
export interface ClassData {
  id: string; // クラスの一意なID
  name: string;
  relations?: RelationInfo[]; // Protobufのラッパーをなくし、直接配列として持つ方がTypeScriptでは扱いやすい
  attributes: Variable[];
  methods: Method[];
  // React Flowで描画するための位置情報も追加しておくと便利
  position: { x: number; y: number };
}

// ダイアグラム全体のデータ構造
// 複数のクラスと、それらを結ぶ関連情報で構成されます
export interface DiagramData {
  id: string; // ダイアグラムの一意なID
  classes: ClassData[];
  // Note: 関係(線)の情報は各クラスが持つか、ここで一元管理するか設計次第です。
  // 今回はスキーマに合わせて各クラスが持つ形にしています。
}