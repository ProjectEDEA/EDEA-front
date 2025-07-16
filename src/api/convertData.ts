// =================================================================
// TARGET DATA STRUCTURE (As provided in the prompt)
// =================================================================

import {
  DiagramData,
  ClassData,
  Visibility,
  RelationType,
  // Multiplicity,
  Variable,
  Method,
  RelationInfo,
} from "../types/uml";
// import { mockDiagram, mockServerResponseJSON } from "../mocks/diagramData";

// =================================================================
// SOURCE DATA STRUCTURE (Inferred from the provided JSON)
// =================================================================

interface SourceMultiplicity {
  lower: number;
  upper: number | null;
}

interface SourceVariable {
  visibility: number | null;
  is_static: boolean | null;
  name: string;
  type: string;
}

interface SourceMethod {
  visibility: number;
  is_abstract: boolean;
  is_static: boolean;
  name: string;
  return_type: string;
  parameters: SourceVariable[];
}

interface SourceRelationInfo {
  target_class_id: string;
  relation: number;
  multiplicity_p: SourceMultiplicity;
  multiplicity_c: SourceMultiplicity;
  role_name_p: string;
  role_name_c: string;
}

interface SourceClass {
  id: string;
  name: string;
  relations: {
    relation_infos: SourceRelationInfo[];
  };
  attributes: SourceVariable[];
  methods: SourceMethod[];
}

interface SourceDiagram {
  last_modified: number;
  created_at: number;
  file_id: {
    id: string;
  };
  name: string;
  classes: SourceClass[];
}

// =================================================================
// MAPPING HELPERS
// =================================================================

// --- Visibility Mapping ---
const visibilityToTarget: { [key: number]: Visibility } = {
  1: "PUBLIC",
  2: "PRIVATE",
  3: "PROTECTED",
};
const visibilityToSource: { [key: string]: number } = {
  PUBLIC: 1,
  PRIVATE: 2,
  PROTECTED: 3,
  NON_MODIFIER: 4, // Assuming a value for NON_MODIFIER
};

// --- RelationType Mapping ---
const relationToTarget: { [key: number]: RelationType } = {
  1: "INHERITANCE",
  2: "IMPLEMENTATION",
  3: "ASSOCIATION",
  4: "AGGREGATION",
  5: "COMPOSITION",
};
const relationToSource: { [key: string]: number } = {
  INHERITANCE: 1,
  IMPLEMENTATION: 2,
  ASSOCIATION: 3,
  AGGREGATION: 4,
  COMPOSITION: 5,
  NONE: 0,
};

// =================================================================
// CONVERSION LOGIC
// =================================================================

/**
 * Converts the source diagram format to the target diagram format.
 * @param sourceData The data in the original format.
 * @returns The data in the new DiagramData format.
 */
export function convertSourceToTarget(sourceData: SourceDiagram): DiagramData {
  const targetClasses: ClassData[] = sourceData.classes.map(
    (sourceClass, index) => {
      // Convert attributes
      const attributes: Variable[] = sourceClass.attributes.map((attr) => ({
        name: attr.name,
        type: attr.type,
        // Use helper to map visibility number to string enum
        visibility:
          attr.visibility !== null
            ? visibilityToTarget[attr.visibility]
            : "NON_MODIFIER",
        is_static: attr.is_static ?? false,
      }));

      // Convert methods
      const methods: Method[] = sourceClass.methods.map((method) => ({
        name: method.name,
        return_type: method.return_type,
        visibility: visibilityToTarget[method.visibility],
        is_abstract: method.is_abstract ?? false,
        is_static: method.is_static ?? false,
        parameters: method.parameters.map((param) => ({
          name: param.name,
          type: param.type,
          // Parameters in the source don't have visibility/static, so we can omit them
        })),
      }));

      // Convert relations
      const relations: RelationInfo[] =
        sourceClass.relations.relation_infos.map((rel) => ({
          target_class_id: rel.target_class_id,
          relation: relationToTarget[rel.relation],
          multiplicity_p: {
            lower: rel.multiplicity_p.lower,
            // Handle optional 'upper' by checking for null
            ...(rel.multiplicity_p.upper !== null && {
              upper: rel.multiplicity_p.upper,
            }),
          },
          multiplicity_c: {
            lower: rel.multiplicity_c.lower,
            ...(rel.multiplicity_c.upper !== null && {
              upper: rel.multiplicity_c.upper,
            }),
          },
          role_name_p: rel.role_name_p,
          role_name_c: rel.role_name_c,
        }));

      return {
        id: sourceClass.id,
        name: sourceClass.name,
        attributes,
        methods,
        relations: relations.length > 0 ? relations : undefined,
        // Source format doesn't have position, so we generate a default layout.
        position: { x: 100, y: 100 + index * 250 },
      };
    }
  );

  return {
    id: sourceData.file_id.id,
    name: sourceData.name,
    classes: targetClasses,
  };
}

/**
 * Converts the target diagram format back to the source diagram format.
 * @param targetData The data in the DiagramData format.
 * @returns The data in the original SourceDiagram format.
 */
export function convertTargetToSource(targetData: DiagramData): SourceDiagram {
  const sourceClasses: SourceClass[] = targetData.classes.map((targetClass) => {
    // Convert attributes back to source format
    const attributes: SourceVariable[] = targetClass.attributes.map((attr) => ({
      name: attr.name,
      type: attr.type,
      visibility: attr.visibility ? visibilityToSource[attr.visibility] : null,
      is_static: attr.is_static ?? false,
    }));

    // Convert methods back to source format
    const methods: SourceMethod[] = targetClass.methods.map((method) => ({
      name: method.name,
      return_type: method.return_type,
      visibility: visibilityToSource[method.visibility],
      is_abstract: method.is_abstract ?? false,
      is_static: method.is_static ?? false,
      parameters: method.parameters.map((param) => ({
        name: param.name,
        type: param.type,
        visibility: null, // Source parameters have null visibility
        is_static: null, // and null static flag
      })),
    }));

    // Convert relations back to source format
    const relation_infos: SourceRelationInfo[] = (
      targetClass.relations ?? []
    ).map((rel) => ({
      target_class_id: rel.target_class_id,
      relation: relationToSource[rel.relation],
      multiplicity_p: {
        lower: rel.multiplicity_p?.lower ?? 1,
        upper: rel.multiplicity_p?.upper ?? null,
      },
      multiplicity_c: {
        lower: rel.multiplicity_c?.lower ?? 0,
        upper: rel.multiplicity_c?.upper ?? null,
      },
      role_name_p: rel.role_name_p ?? "parent",
      role_name_c: rel.role_name_c ?? "child",
    }));

    return {
      id: targetClass.id,
      name: targetClass.name,
      attributes,
      methods,
      relations: {
        relation_infos,
      },
    };
  });

  const now = Math.floor(Date.now() / 1000);

  return {
    file_id: { id: targetData.id },
    name: targetData.name, // Name is lost in conversion, so we restore a default
    classes: sourceClasses,
    created_at: now, // Timestamps are lost, so generate new ones
    last_modified: now,
  };
}

// =================================================================
// USAGE EXAMPLE
// =================================================================

// 1. Define the source data from the prompt
export const sourceData: SourceDiagram = {
  last_modified: 1752497946,
  created_at: 1752497946,
  file_id: { id: "vehicle_diagram_001" },
  name: "Vehicle Management System",
  classes: [
    {
      id: "vehicle_001",
      name: "Vehicle",
      relations: { relation_infos: [] },
      attributes: [
        { visibility: 3, is_static: false, name: "id", type: "String" },
        { visibility: 3, is_static: false, name: "brand", type: "String" },
        { visibility: 3, is_static: false, name: "year", type: "int" },
        { visibility: 2, is_static: true, name: "total_vehicles", type: "int" },
      ],
      methods: [
        {
          visibility: 1,
          is_abstract: true,
          is_static: false,
          name: "start",
          return_type: "void",
          parameters: [],
        },
        {
          visibility: 1,
          is_abstract: true,
          is_static: false,
          name: "stop",
          return_type: "void",
          parameters: [],
        },
        {
          visibility: 1,
          is_abstract: false,
          is_static: false,
          name: "getBrand",
          return_type: "String",
          parameters: [],
        },
        {
          visibility: 1,
          is_abstract: false,
          is_static: true,
          name: "getTotalVehicles",
          return_type: "int",
          parameters: [],
        },
      ],
    },
    {
      id: "car_001",
      name: "Car",
      relations: {
        relation_infos: [
          {
            target_class_id: "vehicle_001",
            relation: 1,
            multiplicity_p: { lower: 1, upper: 1 },
            multiplicity_c: { lower: 0, upper: null },
            role_name_p: "parent",
            role_name_c: "child",
          },
          {
            target_class_id: "engine_001",
            relation: 5,
            multiplicity_p: { lower: 1, upper: 1 },
            multiplicity_c: { lower: 1, upper: 1 },
            role_name_p: "owner",
            role_name_c: "part",
          },
          {
            target_class_id: "driver_001",
            relation: 3,
            multiplicity_p: { lower: 1, upper: 1 },
            multiplicity_c: { lower: 0, upper: 5 },
            role_name_p: "vehicle",
            role_name_c: "driver",
          },
        ],
      },
      attributes: [
        { visibility: 2, is_static: false, name: "doors", type: "int" },
        { visibility: 2, is_static: false, name: "fuel_type", type: "String" },
        { visibility: 2, is_static: false, name: "engine", type: "Engine" },
      ],
      methods: [
        {
          visibility: 1,
          is_abstract: false,
          is_static: false,
          name: "start",
          return_type: "void",
          parameters: [],
        },
        {
          visibility: 1,
          is_abstract: false,
          is_static: false,
          name: "stop",
          return_type: "void",
          parameters: [],
        },
        {
          visibility: 1,
          is_abstract: false,
          is_static: false,
          name: "openDoor",
          return_type: "void",
          parameters: [
            {
              visibility: null,
              is_static: null,
              name: "door_number",
              type: "int",
            },
          ],
        },
        {
          visibility: 2,
          is_abstract: false,
          is_static: false,
          name: "checkEngine",
          return_type: "boolean",
          parameters: [],
        },
      ],
    },
    {
      id: "engine_001",
      name: "Engine",
      relations: { relation_infos: [] },
      attributes: [
        { visibility: 2, is_static: false, name: "horsepower", type: "int" },
        {
          visibility: 2,
          is_static: false,
          name: "displacement",
          type: "double",
        },
        {
          visibility: 2,
          is_static: false,
          name: "is_running",
          type: "boolean",
        },
      ],
      methods: [
        {
          visibility: 1,
          is_abstract: false,
          is_static: false,
          name: "start",
          return_type: "boolean",
          parameters: [],
        },
        {
          visibility: 1,
          is_abstract: false,
          is_static: false,
          name: "stop",
          return_type: "void",
          parameters: [],
        },
        {
          visibility: 1,
          is_abstract: false,
          is_static: false,
          name: "getHorsepower",
          return_type: "int",
          parameters: [],
        },
        {
          visibility: 2,
          is_abstract: false,
          is_static: false,
          name: "performMaintenance",
          return_type: "void",
          parameters: [],
        },
      ],
    },
    {
      id: "driver_001",
      name: "Driver",
      relations: { relation_infos: [] },
      attributes: [
        { visibility: 2, is_static: false, name: "name", type: "String" },
        {
          visibility: 2,
          is_static: false,
          name: "license_number",
          type: "String",
        },
        {
          visibility: 2,
          is_static: false,
          name: "experience_years",
          type: "int",
        },
      ],
      methods: [
        {
          visibility: 1,
          is_abstract: false,
          is_static: false,
          name: "drive",
          return_type: "void",
          parameters: [
            {
              visibility: null,
              is_static: null,
              name: "vehicle",
              type: "Vehicle",
            },
          ],
        },
        {
          visibility: 1,
          is_abstract: false,
          is_static: false,
          name: "getName",
          return_type: "String",
          parameters: [],
        },
        {
          visibility: 1,
          is_abstract: false,
          is_static: false,
          name: "isLicenseValid",
          return_type: "boolean",
          parameters: [],
        },
      ],
    },
  ],
};