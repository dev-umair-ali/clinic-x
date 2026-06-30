/**
 * File Utility Functions
 * Handles file conversion for MongoDB storage
 */

/**
 * Compress an image file to reduce size
 * @param file - The image File object to compress
 * @param maxSizeMB - Maximum size in MB (default 0.5MB = 500KB)
 * @param quality - Compression quality 0-1 (default 0.7)
 * @returns Promise<File> - Compressed File object
 */
export const compressImage = (
  file: File,
  maxSizeMB: number = 0.5,
  quality: number = 0.7
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions to reduce file size
        const maxDimension = 1920; // Max width or height
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            
            // Check if compressed size is acceptable
            const compressedSizeMB = blob.size / (1024 * 1024);
            
            // Create new File from blob
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
};

/**
 * Convert a File object to Base64 string (with automatic compression for images)
 * @param file - The File object to convert
 * @param compress - Whether to compress images (default true)
 * @returns Promise<string> - Base64 encoded string
 */
export const fileToBase64 = async (
  file: File,
  compress: boolean = true
): Promise<string> => {
  let fileToConvert = file;
  
  // Compress image files if needed
  if (compress && file.type.startsWith('image/')) {
    const originalSizeMB = file.size / (1024 * 1024);
    
    // Only compress if larger than 500KB
    if (originalSizeMB > 0.5) {
      try {
        fileToConvert = await compressImage(file);
      } catch (error) {
        console.warn('⚠️ Compression failed, using original file:', error);
        fileToConvert = file;
      }
    }
  }
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileToConvert);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Convert multiple files to Base64 strings
 * @param files - Object containing File objects
 * @returns Promise<Record<string, string>> - Object with Base64 strings
 */
export const filesToBase64 = async (
  files: Record<string, File | null>
): Promise<Record<string, string>> => {
  const result: Record<string, string> = {};
  
  for (const [key, file] of Object.entries(files)) {
    if (file && file instanceof File) {
      try {
        result[key] = await fileToBase64(file);
      } catch (error) {
        console.error(`Error converting ${key} to base64:`, error);
        result[key] = '';
      }
    } else {
      result[key] = '';
    }
  }
  
  return result;
};

/**
 * Extract file metadata
 * @param file - The File object
 * @returns Object with file metadata
 */
export const getFileMetadata = (file: File) => {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  };
};

/**
 * Validate file size (in MB)
 * @param file - The File object
 * @param maxSizeMB - Maximum size in MB (default 10MB)
 * @returns boolean
 */
export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Validate file type
 * @param file - The File object
 * @param allowedTypes - Array of allowed MIME types
 * @returns boolean
 */
export const validateFileType = (
  file: File,
  allowedTypes: string[]
): boolean => {
  return allowedTypes.some((type) => {
    if (type.endsWith('/*')) {
      // Handle wildcards like 'image/*'
      const prefix = type.replace('/*', '');
      return file.type.startsWith(prefix);
    }
    return file.type === type;
  });
};
