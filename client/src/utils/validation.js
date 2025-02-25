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
    value: 6,
    message: 'Password must be at least 6 characters'
  },
  pattern: {
    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
    message: 'Password must contain at least one letter and one number'
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