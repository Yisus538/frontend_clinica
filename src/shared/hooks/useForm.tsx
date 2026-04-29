import { useState } from "react";

type Errors<T> = Partial<Record<keyof T, string>>;
type ValidateFn<T> = (data: T) => Errors<T>;

interface UseFormOptions<T> {
  initialValues: T;
  validate?: ValidateFn<T>;
  onSubmit: (data: T) => Promise<void>;
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Limpia el error del campo al modificarlo
    if (errors[name as keyof T]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate) {
      const validationErrors = validate(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }
    setIsLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialValues);
    setErrors({});
  };

  return {
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
    resetForm,
    setErrors,
  };
}