import React, { useState } from "react";
import { Form, Select, Button, DatePicker, message, Card } from "antd";
import { postCourse, postAttendance, getToken } from "../../services/apiServices";

const TEACHER_IDS = ["T001", "T002", "T003"];
const CLASS_IDS = ["class01", "class02", "class03"];
const SEME_IDS = ["SEM001", "SEM002"];
const STATUS_OPTIONS = ["Active", "Planned"];
const SUBJECTS = ["Maths", "Literature", "English"];
const SLOTS = [
  { label: "07:00-09:15 Slot 1", value: "07:00-09:15" },
  { label: "09:30-11:45 Slot 2", value: "09:30-11:45" },
  { label: "12:30-14:45 Slot 3", value: "12:30-14:45" },
  { label: "15:00-17:15 Slot 4", value: "15:00-17:15" },
];
const STUDENT_IDS = [
  "stu001", "stu002", "stu003", "stu004",
  "stu005", "stu006", "stu007", "stu008"
];

const TeacherScheduleCreate = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const token = getToken();
      // Tạo Course
      const courseRes = await postCourse({
        classId: values.classId,
        teacherId: values.teacherId,
        semeId: values.semeId,
        startTime: values.startDate.format("YYYY-MM-DDT") + values.slot.split(" ")[0] + ":00.000Z",
        endTime: values.endDate.format("YYYY-MM-DDT") + values.slot.split(" ")[1] + ":00.000Z",
        dayOfWeek: "1",
        status: values.status,
        subjectName: values.subjectName,
      }, token);
      const courseId = courseRes.data.courseId;
      // Gọi API Attendance cho từng học sinh
      await Promise.all(
        STUDENT_IDS.map((studentId) =>
          postAttendance({
            atID: "", // để trống, backend tự gen
            studentId,
            courseId,
            participation: "",
            note: "",
            homework: "",
            focus: "",
          }, token)
        )
      );
      message.success("Tạo thời khóa biểu và điểm danh thành công!");
    } catch (err) {
      message.error("Có lỗi xảy ra: " + (err?.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Tạo TKB Giáo viên" style={{ maxWidth: 500, margin: "32px auto" }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="teacherId" label="Giáo viên" rules={[{ required: true }]}> 
          <Select options={TEACHER_IDS.map(id => ({ label: id, value: id }))} placeholder="Chọn giáo viên" />
        </Form.Item>
        <Form.Item name="classId" label="Lớp" rules={[{ required: true }]}> 
          <Select options={CLASS_IDS.map(id => ({ label: id, value: id }))} placeholder="Chọn lớp" />
        </Form.Item>
        <Form.Item name="semeId" label="Học kỳ" rules={[{ required: true }]}> 
          <Select options={SEME_IDS.map(id => ({ label: id, value: id }))} placeholder="Chọn học kỳ" />
        </Form.Item>
        <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}> 
          <Select options={STATUS_OPTIONS.map(id => ({ label: id, value: id }))} placeholder="Chọn trạng thái" />
        </Form.Item>
        <Form.Item name="subjectName" label="Môn học" rules={[{ required: true }]}> 
          <Select options={SUBJECTS.map(id => ({ label: id, value: id }))} placeholder="Chọn môn học" />
        </Form.Item>
        <Form.Item name="slot" label="Khung giờ" rules={[{ required: true }]}> 
          <Select options={SLOTS} placeholder="Chọn khung giờ" />
        </Form.Item>
        <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true }]}> 
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true }]}> 
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Tạo thời khóa biểu
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default TeacherScheduleCreate; 