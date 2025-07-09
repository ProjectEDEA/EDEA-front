import { create } from "zustand";
import type { DiagramData, ClassData, Variable } from "../types/uml";
import { mockDiagram } from "../mocks/diagramData";

// ストアが保持する状態の型定義
interface DiagramState {
  diagram: DiagramData;
  selectedClassId: string | null;
}

// ストアが提供するアクション（操作）の型定義
interface DiagramActions {
  selectClass: (classId: string | null) => void;
  updateClassName: (classId: string, newName: string) => void;
  // TODO: 今後ここに属性やメソッドを追加/編集するアクションを追加していく
  addAttribute: (classId: string) => void;
  updateAttribute: (
    classId: string,
    attrIndex: number,
    updatedAttribute: Partial<Variable>
  ) => void;
  deleteAttribute: (classId: string, attrIndex: number) => void;
}

// ストアの作成
export const useDiagramStore = create<DiagramState & DiagramActions>((set) => ({
  // 初期状態
  diagram: mockDiagram, // まずはモックデータを初期値とする
  selectedClassId: null,

  // アクションの実装
  selectClass: (classId) => set({ selectedClassId: classId }),

  updateClassName: (classId, newName) =>
    set((state) => ({
      diagram: {
        ...state.diagram,
        classes: state.diagram.classes.map((cls) =>
          cls.id === classId ? { ...cls, name: newName } : cls
        ),
      },
    })),

  addAttribute: (classId) =>
    set((state) => ({
      diagram: {
        ...state.diagram,
        classes: state.diagram.classes.map((cls) => {
          if (cls.id === classId) {
            // 新しい空の属性を追加
            const newAttribute: Variable = {
              name: "newAttribute",
              type: "String",
              visibility: "PRIVATE",
            };
            return {
              ...cls,
              attributes: [...cls.attributes, newAttribute],
            };
          }
          return cls;
        }),
      },
    })),

  updateAttribute: (classId, attrIndex, updatedAttribute) =>
    set((state) => ({
      diagram: {
        ...state.diagram,
        classes: state.diagram.classes.map((cls) => {
          if (cls.id === classId) {
            const newAttributes = [...cls.attributes];
            newAttributes[attrIndex] = {
              ...newAttributes[attrIndex],
              ...updatedAttribute,
            };
            return { ...cls, attributes: newAttributes };
          }
          return cls;
        }),
      },
    })),

  deleteAttribute: (classId, attrIndex) =>
    set((state) => ({
      diagram: {
        ...state.diagram,
        classes: state.diagram.classes.map((cls) => {
          if (cls.id === classId) {
            // 該当するインデックスの属性を削除
            const newAttributes = cls.attributes.filter(
              (_, index) => index !== attrIndex
            );
            return { ...cls, attributes: newAttributes };
          }
          return cls;
        }),
      },
    })),
}));
