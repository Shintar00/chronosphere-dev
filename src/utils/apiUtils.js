import axios from 'axios';
import { toast } from "@/components/ui/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const apiCall = async (endpoint, method, data = null) => {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
      timeout: 180000, // タイムアウトを3分に延長
    });
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data;
  } catch (error) {
    console.error(`API呼び出し中にエラーが発生しました: ${endpoint}`, error);
    let errorMessage = error.message;
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage = error.response.data.error;
    }
    throw new Error(errorMessage);
  }
};

export const fetchSearchResults = async (query) => {
  try {
    const result = await apiCall('/api/search', 'post', { query });
    if (!result.results || result.results.length === 0) {
      throw new Error('検索結果が見つかりませんでした。');
    }
    return result.results;
  } catch (error) {
    console.error(`検索結果の取得中にエラーが発生しました: ${error.message}`);
    toast({
      title: "警告",
      description: `検索結果の取得に失敗しました: ${error.message}`,
      variant: "warning",
    });
    return [];
  }
};

export const performGPTReasoning = async (prompt) => {
  try {
    const result = await apiCall('/api/reason', 'post', { prompt });
    if (!result.result) {
      throw new Error('GPT推論の結果が空でした。');
    }
    return result.result;
  } catch (error) {
    console.error(`GPT推論中にエラーが発生しました: ${error.message}`);
    toast({
      title: "警告",
      description: `GPT推論中にエラーが発生しました: ${error.message}`,
      variant: "warning",
    });
    return null;
  }
};

export const fetchNews = async (query) => {
  return fetchSearchResults(query);
};