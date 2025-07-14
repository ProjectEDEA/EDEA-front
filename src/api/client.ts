import axios from "axios";
import type { DiagramData } from "../types/uml";

// バックエンドサーバーのアドレス
// 環境変数などから取得するのが望ましい
const apiClient = axios.create({
  baseURL: "http://localhost:8080/api", // Rust/Scalaサーバーのアドレス
  headers: {
    "Content-Type": "application/json",
  },
});

// GET: 指定したIDのダイアグラムを取得するAPI
export const fetchDiagram = async (diagramId: string): Promise<DiagramData> => {
  const response = await apiClient.get(`/diagrams/${diagramId}`);
  return response.data;
};

// PUT: ダイアグラム全体を更新（保存）するAPI
export const updateDiagram = async (
  diagramData: DiagramData
): Promise<void> => {
  await apiClient.put(`/diagrams/${diagramData.id}`, diagramData);
};

// 他にも POST /diagrams (新規作成) などが必要に応じて追加される
