export const emailValidation = {
  required: 'Email is required',
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Invalid email address'
  }
};

export const passwordValidation = {
  required: 'Password is required',
  minLength: {
    value: 8,
    message: 'Password must be at least 8 characters'
  },
  pattern: {
    // More comprehensive regex that requires:
    // - At least one uppercase letter
    // - At least one lowercase letter
    // - At least one number
    // - Length between 8-64 characters
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w\W]{8,64}$/,
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  },
  maxLength: {
    value: 64,
    message: 'Password cannot exceed 64 characters'
  },
  validate: {
    noSpaces: (value) => !value.includes(' ') || 'Password cannot contain spaces',
    noCommonPatterns: (value) => {
      const commonPatterns = ['password', '123456', 'qwerty'];
      return !commonPatterns.some(pattern => value.toLowerCase().includes(pattern)) || 
        'Password contains common unsafe patterns';
    }
  }
};

export const nameValidation = {
  required: 'Name is required',
  minLength: {
    value: 2,
    message: 'Name must be at least 2 characters'
  }
};

export const locationValidation = {
  required: 'Location is required'
};

export const termsValidation = {
  required: 'You must accept the terms and conditions'
};

export const validatePasswordMatch = (password, confirmPassword) => {
  return password === confirmPassword || 'Passwords do not match';
};

export const validateForm = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = emailValidation.required;
  } else if (!emailValidation.pattern.value.test(values.email)) {
    errors.email = emailValidation.pattern.message;
  }

  if (!values.password) {
    errors.password = passwordValidation.required;
  } else if (values.password.length < passwordValidation.minLength.value) {
    errors.password = passwordValidation.minLength.message;
  }

  return errors;
};