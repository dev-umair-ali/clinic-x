import { useCallback } from 'react';
import api from '../api/axios';

export const useApi = () => {
  const get = useCallback(async (url: string, config = {}) => {
    try {
      const response = await api.get(url, config);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.message || error.message || 'An error occurred' 
      };
    }
  }, []);

  const post = useCallback(async (url: string, data = {}, config = {}) => {
    try {
      const response = await api.post(url, data, config);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.message || error.message || 'An error occurred' 
      };
    }
  }, []);

  const put = useCallback(async (url: string, data = {}, config = {}) => {
    try {
      const response = await api.put(url, data, config);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.message || error.message || 'An error occurred' 
      };
    }
  }, []);

  const del = useCallback(async (url: string, config = {}) => {
    try {
      const response = await api.delete(url, config);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.message || error.message || 'An error occurred' 
      };
    }
  }, []);

  return { get, post, put, delete: del };
};
