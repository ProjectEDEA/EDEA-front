import type { DiagramData } from '../types/uml';

// モックデータを作成
export const mockDiagram: DiagramData = {
  id: 'diagram-001',
  classes: [
    {
      id: 'class-01',
      name: 'Animal',
      position: { x: 100, y: 100 },
      attributes: [
        {
          name: 'name',
          type: 'String',
          visibility: 'PROTECTED',
        },
      ],
      methods: [
        {
          name: 'speak',
          return_type: 'void',
          visibility: 'PUBLIC',
          is_abstract: true, // 抽象メソッド
          parameters: [],
        },
      ],
    },
    {
      id: 'class-02',
      name: 'Dog',
      position: { x: 400, y: 300 },
      relations: [
        {
          target_class_id: 'class-01', // Animalクラスを指す
          relation: 'INHERITANCE',     // 継承関係
        },
      ],
      attributes: [
        {
          name: 'breed',
          type: 'String',
          visibility: 'PRIVATE',
        },
      ],
      methods: [
        {
          name: 'speak',
          return_type: 'void',
          visibility: 'PUBLIC',
          parameters: [], // speakメソッドをオーバーライド
        },
        {
          name: 'fetch',
          return_type: 'Ball',
          visibility: 'PUBLIC',
          parameters: [
            {
              name: 'item',
              type: 'Ball',
            },
          ],
        },
      ],
    },
  ],
};