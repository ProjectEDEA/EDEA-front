import type { DiagramData } from "../types/uml";

// モックデータを作成
export const mockDiagram: DiagramData = {
  id: "diagram-001",
  name: "Sample UML Diagram",
  classes: [
    {
      id: "class-01",
      name: "Animal",
      position: { x: 100, y: 100 },
      attributes: [
        {
          name: "name",
          type: "String",
          visibility: "PROTECTED",
        },
      ],
      methods: [
        {
          name: "speak",
          return_type: "void",
          visibility: "PUBLIC",
          is_abstract: true, // 抽象メソッド
          parameters: [],
        },
      ],
    },
    {
      id: "class-02",
      name: "Dog",
      position: { x: 400, y: 300 },
      relations: [
        {
          target_class_id: "class-01", // Animalクラスを指す
          relation: "INHERITANCE", // 継承関係
        },
      ],
      attributes: [
        {
          name: "breed",
          type: "String",
          visibility: "PRIVATE",
        },
      ],
      methods: [
        {
          name: "speak",
          return_type: "void",
          visibility: "PUBLIC",
          parameters: [], // speakメソッドをオーバーライド
        },
        {
          name: "fetch",
          return_type: "Ball",
          visibility: "PUBLIC",
          parameters: [
            {
              name: "item",
              type: "Ball",
            },
          ],
        },
      ],
    },
    {
      id: "class-03",
      name: "Dog2",
      position: { x: 200, y: 500 },
      relations: [
        {
          target_class_id: "class-01", // Animalクラスを指す
          relation: "INHERITANCE", // 継承関係
        },
      ],
      attributes: [
        {
          name: "breed",
          type: "String",
          visibility: "PRIVATE",
        },
      ],
      methods: [
        {
          name: "speak",
          return_type: "void",
          visibility: "PUBLIC",
          parameters: [], // speakメソッドをオーバーライド
        },
        {
          name: "fetch",
          return_type: "Ball",
          visibility: "PUBLIC",
          parameters: [
            {
              name: "item",
              type: "Ball",
            },
          ],
        },
      ],
    },
  ],
};

export const mockServerResponseJSON = {
  "last_modified": 1752497946,
  "created_at": 1752497946,
  "file_id": {
    "id": "vehicle_diagram_001"
  },
  "name": "Vehicle Management System",
  "classes": [
    {
      "id": "vehicle_001",
      "name": "Vehicle",
      "relations": {
        "relation_infos": []
      },
      "attributes": [
        {
          "visibility": 3,
          "is_static": false,
          "name": "id",
          "type": "String"
        },
        {
          "visibility": 3,
          "is_static": false,
          "name": "brand",
          "type": "String"
        },
        {
          "visibility": 3,
          "is_static": false,
          "name": "year",
          "type": "int"
        },
        {
          "visibility": 2,
          "is_static": true,
          "name": "total_vehicles",
          "type": "int"
        }
      ],
      "methods": [
        {
          "visibility": 1,
          "is_abstract": true,
          "is_static": false,
          "name": "start",
          "return_type": "void",
          "parameters": []
        },
        {
          "visibility": 1,
          "is_abstract": true,
          "is_static": false,
          "name": "stop",
          "return_type": "void",
          "parameters": []
        },
        {
          "visibility": 1,
          "is_abstract": false,
          "is_static": false,
          "name": "getBrand",
          "return_type": "String",
          "parameters": []
        },
        {
          "visibility": 1,
          "is_abstract": false,
          "is_static": true,
          "name": "getTotalVehicles",
          "return_type": "int",
          "parameters": []
        }
      ]
    },
    {
      "id": "car_001",
      "name": "Car",
      "relations": {
        "relation_infos": [
          {
            "target_class_id": "vehicle_001",
            "relation": 1,
            "multiplicity_p": {
              "lower": 1,
              "upper": 1
            },
            "multiplicity_c": {
              "lower": 0,
              "upper": null
            },
            "role_name_p": "parent",
            "role_name_c": "child"
          },
          {
            "target_class_id": "engine_001",
            "relation": 5,
            "multiplicity_p": {
              "lower": 1,
              "upper": 1
            },
            "multiplicity_c": {
              "lower": 1,
              "upper": 1
            },
            "role_name_p": "owner",
            "role_name_c": "part"
          },
          {
            "target_class_id": "driver_001",
            "relation": 3,
            "multiplicity_p": {
              "lower": 1,
              "upper": 1
            },
            "multiplicity_c": {
              "lower": 0,
              "upper": 5
            },
            "role_name_p": "vehicle",
            "role_name_c": "driver"
          }
        ]
      },
      "attributes": [
        {
          "visibility": 2,
          "is_static": false,
          "name": "doors",
          "type": "int"
        },
        {
          "visibility": 2,
          "is_static": false,
          "name": "fuel_type",
          "type": "String"
        },
        {
          "visibility": 2,
          "is_static": false,
          "name": "engine",
          "type": "Engine"
        }
      ],
      "methods": [
        {
          "visibility": 1,
          "is_abstract": false,
          "is_static": false,
          "name": "start",
          "return_type": "void",
          "parameters": []
        },
        {
          "visibility": 1,
          "is_abstract": false,
          "is_static": false,
          "name": "stop",
          "return_type": "void",
          "parameters": []
        },
        {
          "visibility": 1,
          "is_abstract": false,
          "is_static": false,
          "name": "openDoor",
          "return_type": "void",
          "parameters": [
            {
              "visibility": null,
              "is_static": null,
              "name": "door_number",
              "type": "int"
            }
          ]
        },
        {
          "visibility": 2,
          "is_abstract": false,
          "is_static": false,
          "name": "checkEngine",
          "return_type": "boolean",
          "parameters": []
        }
      ]
    },
    {
      "id": "engine_001",
      "name": "Engine",
      "relations": {
        "relation_infos": []
      },
      "attributes": [
        {
          "visibility": 2,
          "is_static": false,
          "name": "horsepower",
          "type": "int"
        },
        {
          "visibility": 2,
          "is_static": false,
          "name": "displacement",
          "type": "double"
        },
        {
          "visibility": 2,
          "is_static": false,
          "name": "is_running",
          "type": "boolean"
        }
      ],
      "methods": [
        {
          "visibility": 1,
          "is_abstract": false,
          "is_static": false,
          "name": "start",
          "return_type": "boolean",
          "parameters": []
        },
        {
          "visibility": 1,
          "is_abstract": false,
          "is_static": false,
          "name": "stop",
          "return_type": "void",
          "parameters": []
        },
        {
          "visibility": 1,
          "is_abstract": false,
          "is_static": false,
          "name": "getHorsepower",
          "return_type": "int",
          "parameters": []
        },
        {
          "visibility": 2,
          "is_abstract": false,
          "is_static": false,
          "name": "performMaintenance",
          "return_type": "void",
          "parameters": []
        }
      ]
    },
    {
      "id": "driver_001",
      "name": "Driver",
      "relations": {
        "relation_infos": []
      },
      "attributes": [
        {
          "visibility": 2,
          "is_static": false,
          "name": "name",
          "type": "String"
        },
        {
          "visibility": 2,
          "is_static": false,
          "name": "license_number",
          "type": "String"
        },
        {
          "visibility": 2,
          "is_static": false,
          "name": "experience_years",
          "type": "int"
        }
      ],
      "methods": [
        {
          "visibility": 1,
          "is_abstract": false,
          "is_static": false,
          "name": "drive",
          "return_type": "void",
          "parameters": [
            {
              "visibility": null,
              "is_static": null,
              "name": "vehicle",
              "type": "Vehicle"
            }
          ]
        },
        {
          "visibility": 1,
          "is_abstract": false,
          "is_static": false,
          "name": "getName",
          "return_type": "String",
          "parameters": []
        },
        {
          "visibility": 1,
          "is_abstract": false,
          "is_static": false,
          "name": "isLicenseValid",
          "return_type": "boolean",
          "parameters": []
        }
      ]
    }
  ]
};