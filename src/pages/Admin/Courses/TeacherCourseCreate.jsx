import React, { useState } from "react";
import { Form, Select, Button, DatePicker, message, Card } from "antd";
import { postCourse, getToken } from "../../../services/apiServices";
import { useNavigate } from "react-router-dom";

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

const TeacherCourseCreate = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSlotOrDateChange = () => {
    const date = form.getFieldValue("date");
    const slot = form.getFieldValue("slot");
    if (date && slot) {
      const [startHour, endHour] = slot.split("-");
      setStartTime(date.format("YYYY-MM-DD") + "T" + startHour + ":00Z");
      setEndTime(date.format("YYYY-MM-DD") + "T" + endHour + ":00Z");
    } else {
      setStartTime("");
      setEndTime("");
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const token = getToken();
      const courseRes = await postCourse(
        {
          classId: values.classId,
          teacherId: values.teacherId,
          semeId: values.semeId,
          startTime,
          endTime,
          dayOfWeek: "1",
          status: values.status,
          subjectName: values.subjectName,
        },
        token
      );
      const courseId = courseRes.data.courseId;
      message.success("Tạo thời khóa biểu thành công!");
      navigate(`/admin/create-attendance/${courseId}`);
    } catch (err) {
      message.error(
        "Có lỗi xảy ra: " + (err?.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Tạo TKB Giáo viên"
      style={{ maxWidth: 500, margin: "32px auto" }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="teacherId"
          label="Giáo viên"
          rules={[{ required: true }]}
        >
          <Select
            options={TEACHER_IDS.map((id) => ({ label: id, value: id }))}
            placeholder="Chọn giáo viên"
          />
        </Form.Item>
        <Form.Item name="classId" label="Lớp" rules={[{ required: true }]}>
          <Select
            options={CLASS_IDS.map((id) => ({ label: id, value: id }))}
            placeholder="Chọn lớp"
          />
        </Form.Item>
        <Form.Item name="semeId" label="Học kỳ" rules={[{ required: true }]}>
          <Select
            options={SEME_IDS.map((id) => ({ label: id, value: id }))}
            placeholder="Chọn học kỳ"
          />
        </Form.Item>
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true }]}
        >
          <Select
            options={STATUS_OPTIONS.map((id) => ({ label: id, value: id }))}
            placeholder="Chọn trạng thái"
          />
        </Form.Item>
        <Form.Item
          name="subjectName"
          label="Môn học"
          rules={[{ required: true }]}
        >
          <Select
            options={SUBJECTS.map((id) => ({ label: id, value: id }))}
            placeholder="Chọn môn học"
          />
        </Form.Item>
        <Form.Item name="slot" label="Khung giờ" rules={[{ required: true }]}>
          <Select
            options={SLOTS}
            placeholder="Chọn khung giờ"
            onChange={handleSlotOrDateChange}
          />
        </Form.Item>
        <Form.Item name="date" label="Ngày học" rules={[{ required: true }]}>
          <DatePicker
            style={{ width: "100%" }}
            format="YYYY-MM-DD"
            onChange={handleSlotOrDateChange}
          />
        </Form.Item>
        {startTime && endTime && (
          <div style={{ marginBottom: 16 }}>
            <b>Thời gian bắt đầu:</b> {startTime}
            <br />
            <b>Thời gian kết thúc:</b> {endTime}
          </div>
        )}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            disabled={!startTime || !endTime}
          >
            Tạo thời khóa biểu
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default TeacherCourseCreate;
