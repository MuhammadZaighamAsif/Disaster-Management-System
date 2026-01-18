// Validation utility functions

// Email validation - RFC standard
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getEmailError = (email) => {
  if (!email) return 'Email is required';
  if (!validateEmail(email)) return 'Please enter a valid email address';
  return '';
};

// Password validation
export const validatePassword = (password) => {
  return password.length >= 6;
};

export const getPasswordError = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return '';
};

// Name validation
export const validateName = (name) => {
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  return nameRegex.test(name);
};

export const getNameError = (name) => {
  if (!name) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters';
  if (name.length > 50) return 'Name cannot exceed 50 characters';
  if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name can only contain letters and spaces';
  return '';
};

// Phone validation - Pakistan format
export const validatePhone = (phone) => {
  // Accept various formats: +92-XXXX-XXXXXX, 03XXXXXXXXX, +923XXXXXXXXX, etc.
  const phoneRegex = /^(\+92|0)?[3-5]\d{8,9}$/;
  return phoneRegex.test(phone.replace(/[-\s]/g, ''));
};

export const getPhoneError = (phone) => {
  if (!phone) return 'Phone number is required';
  if (!validatePhone(phone)) return 'Please enter a valid phone number (e.g., +92-XXX-XXXXXXX or 03XX-XXXXXXX)';
  return '';
};

// CNIC validation - Pakistan format: XXXXX-XXXXXXX-X
export const validateCNIC = (cnic) => {
  const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
  return cnicRegex.test(cnic);
};

export const getCNICError = (cnic) => {
  if (!cnic) return 'CNIC is required';
  if (!validateCNIC(cnic)) return 'Please enter a valid CNIC (format: XXXXX-XXXXXXX-X)';
  return '';
};

// Address validation
export const validateAddress = (address) => {
  return address.length >= 5 && address.length <= 200;
};

export const getAddressError = (address) => {
  if (!address) return 'Address is required';
  if (address.length < 5) return 'Address must be at least 5 characters';
  if (address.length > 200) return 'Address cannot exceed 200 characters';
  return '';
};

// Username validation
export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

// Area code validation
export const validateAreaCode = (areaCode) => {
  const areaCodeRegex = /^[0-9]{5}$/;
  return areaCodeRegex.test(areaCode);
};

// Skills validation
export const validateSkills = (skills) => {
  return skills.length <= 500;
};

export const getSkillsError = (skills) => {
  if (skills && skills.length > 500) return 'Skills cannot exceed 500 characters';
  return '';
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  return password === confirmPassword;
};

export const getConfirmPasswordError = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (!validateConfirmPassword(password, confirmPassword)) return 'Passwords do not match';
  return '';
};

// Validate input to prevent special characters for critical fields (NFR 2.2.1)
export const validateNoSpecialChars = (input) => {
  const specialCharsRegex = /[\/\\^%]/;
  return !specialCharsRegex.test(input);
};

// Donor type validation
export const validateDonorType = (donorType, role) => {
  if (role !== 'DONOR') return true;
  return donorType === 'individual' || donorType === 'organization';
};

export const getDonorTypeError = (donorType, role) => {
  if (role === 'DONOR' && !donorType) return 'Please select a donor type';
  return '';
};

// Volunteer role validation
export const validateVolunteerRole = (volunteerRole, role) => {
  if (role !== 'VOLUNTEER') return true;
  return volunteerRole === 'on-field' || volunteerRole === 'off-field';
};

export const getVolunteerRoleError = (volunteerRole, role) => {
  if (role === 'VOLUNTEER' && !volunteerRole) return 'Please select a volunteer role';
  return '';
};

// Number validation
export const validatePositiveNumber = (num) => {
  return !isNaN(num) && Number(num) > 0;
};

export const getNumberError = (num, fieldName = 'Number') => {
  if (!num && num !== 0) return `${fieldName} is required`;
  if (isNaN(num)) return `${fieldName} must be a number`;
  if (Number(num) <= 0) return `${fieldName} must be greater than 0`;
  return '';
};

// Disaster form validation helpers
export const validateDisasterName = (name) => {
  return name.length >= 3 && name.length <= 100;
};

export const getDisasterNameError = (name) => {
  if (!name) return 'Disaster name is required';
  if (name.length < 3) return 'Disaster name must be at least 3 characters';
  if (name.length > 100) return 'Disaster name cannot exceed 100 characters';
  return '';
};

export const validateDescription = (description) => {
  return description.length >= 10 && description.length <= 1000;
};

export const getDescriptionError = (description) => {
  if (!description) return 'Description is required';
  if (description.length < 10) return 'Description must be at least 10 characters';
  if (description.length > 1000) return 'Description cannot exceed 1000 characters';
  return '';
};

export const validateLocation = (location) => {
  return location.length >= 3 && location.length <= 100;
};

export const getLocationError = (location) => {
  if (!location) return 'Location is required';
  if (location.length < 3) return 'Location must be at least 3 characters';
  if (location.length > 100) return 'Location cannot exceed 100 characters';
  return '';
};

export const validateCity = (city) => {
  return city.length >= 2 && city.length <= 50;
};

export const getCityError = (city) => {
  if (!city) return 'City is required';
  if (city.length < 2) return 'City must be at least 2 characters';
  if (city.length > 50) return 'City cannot exceed 50 characters';
  return '';
};

export const validateDisasterForm = (formData) => {
  const errors = {};
  
  errors.name = getDisasterNameError(formData.name);
  errors.location = getLocationError(formData.location);
  errors.city = getCityError(formData.city);
  errors.description = getDescriptionError(formData.description);
  
  if (formData.estimatedVictims) {
    if (isNaN(formData.estimatedVictims) || Number(formData.estimatedVictims) < 0) {
      errors.estimatedVictims = 'Estimated victims must be a positive number';
    }
  }
  
  return errors;
};

// Report Disaster validation
export const validateReportDisasterForm = (formData) => {
  const errors = {};
  
  errors.name = getDisasterNameError(formData.name);
  errors.location = getLocationError(formData.location);
  errors.city = getCityError(formData.city);
  errors.description = getDescriptionError(formData.description);
  
  return errors;
};

// Donation validation
export const getQuantityError = (quantity, fieldName = 'Quantity') => {
  if (!quantity) return `${fieldName} is required`;
  if (isNaN(quantity) || Number(quantity) <= 0) return `${fieldName} must be greater than 0`;
  return '';
};

// Shelter validation
export const getBedsError = (beds) => {
  if (!beds) return 'Number of beds is required';
  if (isNaN(beds) || Number(beds) <= 0) return 'Number of beds must be greater than 0';
  return '';
};

// Contact phone for shelter
export const getContactPhoneError = (phone) => {
  if (!phone) return 'Contact phone is required';
  if (!validatePhone(phone)) return 'Please enter a valid phone number';
  return '';
};

// Validate complete signup form
export const validateSignupForm = (formData) => {
  const errors = {};
  
  errors.name = getNameError(formData.name);
  errors.email = getEmailError(formData.email);
  errors.phone = getPhoneError(formData.phone);
  errors.cnic = getCNICError(formData.cnic);
  errors.address = getAddressError(formData.address);
  errors.password = getPasswordError(formData.password);
  errors.confirmPassword = getConfirmPasswordError(formData.password, formData.confirmPassword);
  
  if (formData.role === 'DONOR') {
    errors.donorType = getDonorTypeError(formData.donorType, formData.role);
  }
  
  if (formData.role === 'VOLUNTEER') {
    errors.volunteerRole = getVolunteerRoleError(formData.volunteerRole, formData.role);
    errors.volunteerSkills = getSkillsError(formData.volunteerSkills);
  }
  
  return errors;
};

// Check if form has any errors
export const hasErrors = (errors) => {
  return Object.values(errors).some(error => error !== '');
};
