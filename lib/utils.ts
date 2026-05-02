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

export const getErrorMessage = (error: unknown): string => {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "Something went wrong";
  }

  return message;
};
