export const validateString = (
  value: unknown,
  maxLength: number
): value is string => {
  return (
    typeof value === "string" && value.trim().length > 0 && value.length <= maxLength
  );
};

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;
export const isValidObjectId = (id: unknown): id is string => {
  return typeof id === "string" && OBJECT_ID_RE.test(id);
};
