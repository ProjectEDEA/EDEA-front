import axios from 'axios';

export const client = {
    // APIのエンドポイントを定義
    // baseURL: 'http://edea.igameta.com',
    baseURL: 'http://localhost:3000',

    // ダイアグラム新規作成・保存
    postDiagram: async (data: any) => {
        try {
            const response = await axios.post(`${client.baseURL}/api_p1`, data);
            console.log('ダイアグラム作成:', response.data);
            return response.data;
        } catch (error) {
            console.error('ダイアグラム作成エラー:', error);
            throw error;
        }
    },

    // ダイアグラム取得
    getDiagram: async (id: string) => {
        try {
            const response = await axios.get(`${client.baseURL}/api_p1/${id}`);
            console.log('ダイアグラム取得:', response.data);
            return response;
        } catch (error) {
            console.error('ダイアグラム取得エラー:', error);
            throw error;
        }
    },

    // ダイアグラム削除
    deleteDiagram: async (id: string) => {
        try {
            const response = await axios.delete(`${client.baseURL}/api_p1/${id}`);
            console.log('ダイアグラム削除:', response.data);
            return response;
        } catch (error) {
            console.error('ダイアグラム削除エラー:', error);
            throw error;
        }
    },

};