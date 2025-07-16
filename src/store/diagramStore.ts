import { create } from "zustand";
import type {
  DiagramData,
  ClassData,
  Variable,
  Method,
  RelationInfo,
  RelationType,
} from "../types/uml";
import { mockDiagram, mockServerResponseJSON } from "../mocks/diagramData";
import { getInverseRelation } from "../utils/diagramUtils";
import { calculateCustomHierarchicalLayout, calculateLayout } from "../utils/layout";
import { convertSourceToTarget } from "../api/convertData";
import axios from "axios";

/**
 * プロジェクト名と現在日時からハッシュ化されたIDを生成
 */
export const generateProjectId = (projectName: string): string => {
  const timestamp = new Date().toISOString();
  const source = `${projectName}_${timestamp}`;

  // シンプルなハッシュ関数（実際のプロダクションではより強力なライブラリを使用）
  let hash = 0;
  for (let i = 0; i < source.length; i++) {
    const char = source.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 32bit整数に変換
  }

  // 負の値を正の値に変換し、16進数の文字列として返す
  const hashString = Math.abs(hash).toString(16);

  // プレフィックスを付けて識別しやすくする
  return `proj_${hashString}_${Date.now().toString(36)}`;
};

/**
 * 新しい空のダイアグラムデータを作成
 */
export const createNewDiagram = (
  projectName: string,
  projectId?: string
): DiagramData => {
  const id = projectId || generateProjectId(projectName);
  const now = Math.floor(Date.now() / 1000);

  return {
    id: id,
    name: projectName,
    classes: [],
    // createdAt: now,
    // lastModified: now,
  };
};

// ストアが保持する状態の型定義
interface DiagramState {
  diagram: DiagramData;
  selectedClassId: string | null;
  isEditorMode: boolean; // エディタモードのフラグ
}

// ストアが提供するアクション（操作）の型定義
interface DiagramActions {
  setEditorMode: (isEditor: boolean) => void;
  setDiagram: (diagram: DiagramData) => void;
  updateDiagramName: (name: string) => void;
  selectClass: (classId: string | null) => void;
  addClass: (newClass: ClassData) => void;
  deleteClass: (classId: string) => void;
  applyAutoLayout: () => void;
  updateClassName: (classId: string, newName: string) => void;
  updateAllClassPositions: (diagram: DiagramData) => void;
  addAttribute: (classId: string) => void;
  updateAttribute: (
    classId: string,
    attrIndex: number,
    updatedAttribute: Partial<Variable>
  ) => void;
  deleteAttribute: (classId: string, attrIndex: number) => void;
  addMethod: (classId: string) => void;
  updateMethod: (
    classId: string,
    methodIndex: number,
    updatedMethod: Partial<Method>
  ) => void;
  deleteMethod: (classId: string, methodIndex: number) => void;
  addParameter: (classId: string, methodIndex: number) => void;
  updateParameter: (
    classId: string,
    methodIndex: number,
    paramIndex: number,
    updatedParam: Partial<Variable>
  ) => void;
  deleteParameter: (
    classId: string,
    methodIndex: number,
    paramIndex: number
  ) => void;
  addRelation: (classId: string, relation: RelationInfo) => void;
  updateRelation: (
    classId: string,
    index: number,
    update: RelationInfo
  ) => void;
  deleteRelation: (classId: string, index: number) => void;
}

// ストアの作成
export const useDiagramStore = create<DiagramState & DiagramActions>((set) => ({
  // 初期状態
  diagram: mockDiagram, // まずはモックデータを初期値とする
  // diagram: convertSourceToTarget(mockServerResponseJSON), // APIからのデータ変換を行う
  selectedClassId: null,
  isEditorMode: true,

  setEditorMode: (isEditor: boolean) => set({ isEditorMode: isEditor }),

  // 新しく追加：ダイアグラム全体をセット
  setDiagram: (diagram: DiagramData) => {
    set(() => ({
      diagram: diagram,
      selectedClassId: null,
    }))
    useDiagramStore.getState().updateAllClassPositions(diagram);
  },

  loadDiagramById: async (id: string) => {
    try {
      const baseURL = "http://localhost:3000";
      const response = await axios.get(`${baseURL}/api_p1/${id}`);

      const convertedData = convertSourceToTarget(response.data);
      set(() => ({
        diagram: convertedData,
        selectedClassId: null,
      }));

      return true;
    } catch (error) {
      console.error("Failed to load diagram:", error);
      return false;
    }
  },

  // ダイアグラム名の更新
  updateDiagramName: (name: string) =>
    set((state) => ({
      diagram: {
        ...state.diagram,
        name: name,
      },
    })),

  // アクションの実装
  selectClass: (classId) => set({ selectedClassId: classId }),

  addClass: (newClass: ClassData) =>
    set((state) => {
      const newDiagram = {
        ...state.diagram,
        classes: [...state.diagram.classes, newClass],
      };

      return { diagram: newDiagram };
    }),

  deleteClass: (classId: string) =>
    set((state) => {
      const newDiagram = { ...state.diagram };

      // 1. 削除対象のクラスをフィルタリング
      newDiagram.classes = newDiagram.classes.filter(
        (cls) => cls.id !== classId
      );

      // 2. 他のクラスから削除対象クラスへの関係を削除
      newDiagram.classes.forEach((cls) => {
        if (cls.relations) {
          cls.relations = cls.relations.filter(
            (rel) => rel.target_class_id !== classId
          );
        }
      });

      // 3. 削除したクラスが選択されていた場合、選択状態をクリア
      const newSelectedClassId =
        state.selectedClassId === classId ? null : state.selectedClassId;

      return {
        diagram: newDiagram,
        selectedClassId: newSelectedClassId,
      };
    }),

  applyAutoLayout: () =>
    set((state) => {
      const newPositions = calculateLayout(state.diagram.classes);
      return {
        diagram: {
          ...state.diagram,
          classes: state.diagram.classes.map((cls) => ({
            ...cls,
            position: newPositions.get(cls.id) || cls.position,
          })),
        },
      };
    }),

  updateAllClassPositions: (diagram: DiagramData) => {
    const newPositions = calculateCustomHierarchicalLayout(diagram.classes);
    const updatedClasses = diagram.classes.map((cls) => ({
      ...cls,
      position: newPositions.get(cls.id) || cls.position,
    }));

    set((state) => {
      const newDiagram = {
        ...state.diagram,
        classes: updatedClasses,
      };

      return { diagram: newDiagram };
    });
  },

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

  addMethod: (classId) =>
    set((state) => ({
      diagram: {
        ...state.diagram,
        classes: state.diagram.classes.map((cls) => {
          if (cls.id === classId) {
            const newMethod: Method = {
              name: "newMethod",
              return_type: "void",
              visibility: "PUBLIC",
              parameters: [],
            };
            return { ...cls, methods: [...cls.methods, newMethod] };
          }
          return cls;
        }),
      },
    })),

  updateMethod: (classId, methodIndex, updatedMethod) =>
    set((state) => ({
      diagram: {
        ...state.diagram,
        classes: state.diagram.classes.map((cls) => {
          if (cls.id === classId) {
            const newMethods = [...cls.methods];
            newMethods[methodIndex] = {
              ...newMethods[methodIndex],
              ...updatedMethod,
            };
            return { ...cls, methods: newMethods };
          }
          return cls;
        }),
      },
    })),

  deleteMethod: (classId, methodIndex) =>
    set((state) => ({
      diagram: {
        ...state.diagram,
        classes: state.diagram.classes.map((cls) => {
          if (cls.id === classId) {
            return {
              ...cls,
              methods: cls.methods.filter((_, i) => i !== methodIndex),
            };
          }
          return cls;
        }),
      },
    })),

  addParameter: (classId, methodIndex) =>
    set((state) => ({
      diagram: {
        ...state.diagram,
        classes: state.diagram.classes.map((cls) => {
          if (cls.id === classId) {
            const newMethods = [...cls.methods];
            const targetMethod = newMethods[methodIndex];
            const newParam: Variable = { name: "newParam", type: "String" };
            targetMethod.parameters = [...targetMethod.parameters, newParam];
            return { ...cls, methods: newMethods };
          }
          return cls;
        }),
      },
    })),

  updateParameter: (classId, methodIndex, paramIndex, updatedParam) =>
    set((state) => ({
      diagram: {
        ...state.diagram,
        classes: state.diagram.classes.map((cls) => {
          if (cls.id === classId) {
            const newMethods = [...cls.methods];
            const targetMethod = newMethods[methodIndex];
            const newParams = [...targetMethod.parameters];
            newParams[paramIndex] = {
              ...newParams[paramIndex],
              ...updatedParam,
            };
            targetMethod.parameters = newParams;
            return { ...cls, methods: newMethods };
          }
          return cls;
        }),
      },
    })),

  deleteParameter: (classId, methodIndex, paramIndex) =>
    set((state) => ({
      diagram: {
        ...state.diagram,
        classes: state.diagram.classes.map((cls) => {
          if (cls.id === classId) {
            const newMethods = [...cls.methods];
            const targetMethod = newMethods[methodIndex];
            targetMethod.parameters = targetMethod.parameters.filter(
              (_, i) => i !== paramIndex
            );
            return { ...cls, methods: newMethods };
          }
          return cls;
        }),
      },
    })),

  // 関係の追加
  addRelation: (classId, relation) =>
    set((state) => {
      const newDiagram = { ...state.diagram };
      const classIndex = newDiagram.classes.findIndex(
        (cls) => cls.id === classId
      );

      if (classIndex >= 0) {
        if (!newDiagram.classes[classIndex].relations) {
          newDiagram.classes[classIndex].relations = [];
        }
        newDiagram.classes[classIndex].relations!.push(relation);
      }

      return { diagram: newDiagram };
    }),

  // 関係の更新
  updateRelation: (classId, index, update) =>
    set((state) => {
      const newDiagram = { ...state.diagram };
      const classIndex = newDiagram.classes.findIndex(
        (cls) => cls.id === classId
      );

      if (classIndex >= 0 && newDiagram.classes[classIndex].relations) {
        newDiagram.classes[classIndex].relations![index] = {
          ...newDiagram.classes[classIndex].relations![index],
          ...update,
        };
      }

      return { diagram: newDiagram };
    }),

  // 関係の削除
  deleteRelation: (classId, index) =>
    set((state) => {
      const newDiagram = { ...state.diagram };
      const classIndex = newDiagram.classes.findIndex(
        (cls) => cls.id === classId
      );

      if (classIndex >= 0 && newDiagram.classes[classIndex].relations) {
        newDiagram.classes[classIndex].relations!.splice(index, 1);
      }

      return { diagram: newDiagram };
    }),

  // 双方向関係を追加するメソッド
  addBidirectionalRelation: (
    sourceClassId: string,
    targetClassId: string,
    relation: RelationType
  ) =>
    set((state) => {
      const newDiagram = { ...state.diagram };
      const sourceIndex = newDiagram.classes.findIndex(
        (cls) => cls.id === sourceClassId
      );

      // ソースクラスに関係を追加
      if (sourceIndex >= 0) {
        if (!newDiagram.classes[sourceIndex].relations) {
          newDiagram.classes[sourceIndex].relations = [];
        }

        newDiagram.classes[sourceIndex].relations!.push({
          target_class_id: targetClassId,
          relation: relation,
        });
      }

      // 対象クラスに逆方向の関係を追加（必要な場合）
      const inverseRelation = getInverseRelation(relation);
      if (inverseRelation) {
        const targetIndex = newDiagram.classes.findIndex(
          (cls) => cls.id === targetClassId
        );
        if (targetIndex >= 0) {
          if (!newDiagram.classes[targetIndex].relations) {
            newDiagram.classes[targetIndex].relations = [];
          }

          newDiagram.classes[targetIndex].relations!.push({
            target_class_id: sourceClassId,
            relation: inverseRelation,
          });
        }
      }

      return { diagram: newDiagram };
    }),
}));
