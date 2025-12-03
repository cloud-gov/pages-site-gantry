// Helper to flatten text from node children
export const getTextContent = (child: any): string => {
  if (!child) return "";
  if (child.text) return child.text;
  if (Array.isArray(child.children))
    return child.children.map(getTextContent).join("");
  return "";
};
