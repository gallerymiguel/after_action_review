import { FormData } from '../interfaces/formdata';

export const saveFormData = (formData: FormData): void => {
  localStorage.setItem('formData', JSON.stringify(formData));
};

export const loadFormData = (): FormData | null => {
  const storedFormData = localStorage.getItem('formData');
  return storedFormData ? JSON.parse(storedFormData) : null;
};
