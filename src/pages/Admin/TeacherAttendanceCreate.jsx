import React, { useState } from "react";
import { Button, message, Card, List, Checkbox } from "antd";
import { postAttendance, getToken } from "../../services/apiServices";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const STUDENT_IDS = [
  "stu001", "stu002", "stu003", "stu004",
  "stu005", "stu006", "stu007", "stu008"
];

const TeacherAttendanceCreate = () => {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [selected, setSelected] = useState([]);

  const handleCheck = (studentId, checked) => {
    setSelected((prev) =>
      checked ? [...prev, studentId] : prev.filter((id) => id !== studentId)
    );
  };

  const handleCreateAttendance = async () => {
    setLoading(true);
    try {
      const token = getToken();
      await Promise.all(
        selected.map((studentId) =>
          postAttendance({
            atID: uuidv4(),
            studentId,
            courseId,
            participation: "",
            note: "",
            homework: "",
            focus: "",
          }, token)
        )
      );
      setDone(true);
      message.success("Tạo điểm danh thành công cho học sinh đã chọn!");
    } catch (err) {
      message.error("Có lỗi xảy ra: " + (err?.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={`Tạo điểm danh cho Course: ${courseId}`} style={{ maxWidth: 500, margin: "32px auto" }}>
      <List
        header={<div>Chọn học sinh để tạo điểm danh</div>}
        bordered
        dataSource={STUDENT_IDS}
        renderItem={item => (
          <List.Item>
            <Checkbox
              checked={selected.includes(item)}
              onChange={e => handleCheck(item, e.target.checked)}
              disabled={done}
            >
              {item}
            </Checkbox>
          </List.Item>
        )}
        style={{ marginBottom: 24 }}
      />
      <Button type="primary" onClick={handleCreateAttendance} loading={loading} block disabled={done || selected.length === 0}>
        Tạo điểm danh cho học sinh đã chọn
      </Button>
    </Card>
  );
};

export default TeacherAttendanceCreate; 