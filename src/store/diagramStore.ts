import { create } from "zustand";
import type { DiagramData, ClassData } from "../types/uml";
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
}));
