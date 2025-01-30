import { FormData } from '../interfaces/formdata';

export const saveFormData = (formdata: FormData): void => {
  localStorage.setItem('formData', JSON.stringify(formdata));
};

export const loadFormData = (): FormData | null => {
  const storedFormData = localStorage.getItem('formData');
  return storedFormData ? JSON.parse(storedFormData) : null;
};

