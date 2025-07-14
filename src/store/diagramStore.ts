import { create } from "zustand";
import type {
  DiagramData,
  ClassData,
  Variable,
  Method,
  RelationInfo,
  RelationType,
} from "../types/uml";
import { mockDiagram } from "../mocks/diagramData";
import { getInverseRelation } from "../utils/diagramUtils";

// ストアが保持する状態の型定義
interface DiagramState {
  diagram: DiagramData;
  selectedClassId: string | null;
}

// ストアが提供するアクション（操作）の型定義
interface DiagramActions {
  selectClass: (classId: string | null) => void;
  addClass: (newClass: ClassData) => void;
  updateClassName: (classId: string, newName: string) => void;
  // TODO: 今後ここに属性やメソッドを追加/編集するアクションを追加していく
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
  selectedClassId: null,

  // アクションの実装
  selectClass: (classId) => set({ selectedClassId: classId }),

  addClass: (newClass: ClassData) => set((state) => {
  const newDiagram = {
    ...state.diagram,
    classes: [...state.diagram.classes, newClass]
  };
  
  return { diagram: newDiagram };
}),

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
