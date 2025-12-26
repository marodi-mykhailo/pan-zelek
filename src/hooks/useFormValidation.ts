import { useState } from 'react';
import { ZodSchema, ZodError } from 'zod';

export function useFormValidation<T>(schema: ZodSchema<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (data: unknown): data is T => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err: any) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const validateField = (field: string, value: unknown) => {
    try {
      const fieldSchema = (schema as any).shape?.[field];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors((prev) => ({
          ...prev,
          [field]: error.issues[0]?.message || 'Nieprawidłowa wartość',
        }));
      }
    }
  };

  const setFieldTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field: string) => {
    return touched[field] ? errors[field] : undefined;
  };

  const hasErrors = Object.keys(errors).length > 0;

  return {
    validate,
    validateField,
    setFieldTouched,
    getFieldError,
    errors,
    touched,
    hasErrors,
    clearErrors: () => setErrors({}),
  };
}
