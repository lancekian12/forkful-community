export default function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
      {errors[0]}
    </p>
  );
}
