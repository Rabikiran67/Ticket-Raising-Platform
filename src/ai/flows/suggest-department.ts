// Mock AI department suggestion function
export async function suggestDepartment({ description }: { description: string }) {
  // Simple mock: always suggest IT Support with a justification
  return {
    department: "IT Support",
    justification: "Based on the description, IT Support is the most relevant department."
  };
} 