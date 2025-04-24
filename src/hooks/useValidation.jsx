export default function useValidation(errors, field) {
  if (!errors?.[field]?.length) return null;

  return errors[field].map((error, index) => (
    <div key={index} className="text-sm text-red-500 mt-1">
      {error}
    </div>
  ));
}
