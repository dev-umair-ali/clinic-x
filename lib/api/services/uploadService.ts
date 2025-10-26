import api from '../axios';

export interface UploadResponse {
  success: boolean;
  data: {
    url: string;
    filename: string;
    size: number;
    type: string;
  };
  message?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export const uploadService = {
  async uploadImage(file: File, onProgress?: (progress: UploadProgress) => void): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/api/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
            });
          }
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  async uploadVideo(file: File, onProgress?: (progress: UploadProgress) => void): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/api/upload/video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
            });
          }
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error uploading video:', error);
      throw error;
    }
  },

  async uploadAudio(file: File, onProgress?: (progress: UploadProgress) => void): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/api/upload/audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
            });
          }
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error uploading audio:', error);
      throw error;
    }
  },

  async uploadFile(file: File, type: 'image' | 'video' | 'audio', onProgress?: (progress: UploadProgress) => void): Promise<UploadResponse> {
    switch (type) {
      case 'image':
        return this.uploadImage(file, onProgress);
      case 'video':
        return this.uploadVideo(file, onProgress);
      case 'audio':
        return this.uploadAudio(file, onProgress);
      default:
        throw new Error(`Unsupported file type: ${type}`);
    }
  }
};
