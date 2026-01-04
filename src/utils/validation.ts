// Input validation utilities

export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true };
}

export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
  }

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!strongPasswordRegex.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain uppercase, lowercase, number, and special character',
    };
  }

  return { isValid: true };
}

export function validateFileName(fileName: string): { isValid: boolean; error?: string } {
  if (!fileName) {
    return { isValid: false, error: 'File name is required' };
  }

  // Prevent directory traversal and dangerous characters
  const dangerousChars = /[<>:"|?*\x00-\x1f]/;
  if (dangerousChars.test(fileName)) {
    return { isValid: false, error: 'Invalid file name' };
  }

  // Prevent executable file extensions
  const executableExtensions = ['.exe', '.bat', '.cmd', '.sh', '.php', '.js', '.py', '.jar'];
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  if (executableExtensions.includes(extension)) {
    return { isValid: false, error: 'Executable files are not allowed' };
  }

  return { isValid: true };
}

export function validateFileSize(fileSize: number, maxSizeMB: number = 10): { isValid: boolean; error?: string } {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (fileSize > maxSizeBytes) {
    return { isValid: false, error: `File size must be less than ${maxSizeMB}MB` };
  }
  return { isValid: true };
}

export function validateFileType(fileName: string, allowedTypes: string[] = ['.pdf', '.doc', '.docx', '.txt']): { isValid: boolean; error?: string } {
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  if (!allowedTypes.includes(extension)) {
    return {
      isValid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }
  return { isValid: true };
}

export function sanitizeFileName(fileName: string): string {
  // Remove dangerous characters and normalize
  return fileName
    .replace(/[<>:"|?*\x00-\x1f]/g, '_')
    .replace(/\.\./g, '_')
    .replace(/^\.+/, '')
    .trim();
}

export function sanitizeInput(input: string, maxLength: number = 1000): string {
  // Remove HTML tags and dangerous characters
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .substring(0, maxLength);
}

