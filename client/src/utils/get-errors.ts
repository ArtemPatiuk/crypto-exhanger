export interface ErrorValidator {
  location?: string;
  msg: string;
  path?: string;
  type?: string;
  value?: string;
}

export const getErrors = (error: any): ErrorValidator[] => {
  const errors: ErrorValidator[] = [];

  if (!error) {
    errors.push({ msg: "Невідома помилка" });

    return errors;
  }

  if (error.data?.message) {
    errors.push({ msg: error.data.message });
  }

  if (error.data?.errors && Array.isArray(error.data.errors)) {
    error.data.errors.forEach((item: ErrorValidator) => {
      errors.push(item);
    });
  }

  return errors;
}