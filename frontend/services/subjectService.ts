export interface Subject {
  subject_id: number;
  name: string;
  description: string;
  created_at?: string;
}

const BASE_URL = "http://10.0.2.2:3000/api/subjects"; // hoặc IP backend

// Lấy tất cả môn học
export async function fetchSubjects(): Promise<Subject[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch subjects");
  return res.json();
}

// Lấy môn học theo ID
export async function fetchSubjectById(id: number): Promise<Subject> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Subject not found");
  return res.json();
}

// Thêm môn học mới
export async function addSubject(
  subject: Omit<Subject, "subject_id">
): Promise<Subject> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subject),
  });
  if (!res.ok) throw new Error("Failed to add subject");
  return res.json();
}

// Cập nhật môn học
export async function updateSubject(
  id: number,
  subject: Partial<Subject>
): Promise<Subject> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subject),
  });
  if (!res.ok) throw new Error("Failed to update subject");
  return res.json();
}

// Xóa môn học
export async function deleteSubject(id: number): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete subject");
  return res.json();
}
