import React, { useEffect, useState } from "react";
import { Modal, Table, Input, Select, Button, Spin, Alert, message } from "antd";
import { UserOutlined, CheckCircleOutlined, EditOutlined, BookOutlined, StarFilled } from "@ant-design/icons";
import { getToken } from "../../../services/apiServices";
import axios from "axios";

const { Option } = Select;

const FOCUS_OPTIONS = ["Kém", "Trung bình", "Rất tốt"];

const AttendancePage = ({ courseId, visible, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const fetchAttendance = async () => {
      setLoading(true);
      setError("");
      try {
        const token = getToken();
        const res = await axios.get(
          `https://localhost:7064/api/Attendance/course/${courseId}`,
          {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        setData(res.data || []);
      } catch (err) {
        setError("Lỗi khi tải dữ liệu điểm danh: " + (err?.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [courseId, visible]);

  const handleChange = (idx, field, value) => {
    setData((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const token = getToken();
      await Promise.all(
        data.map((row) =>
          axios.put(
            `https://localhost:7064/api/Attendance`,
            {
              atID: row.atID,
              studentId: row.studentId,
              courseId: courseId,
              participation: row.participation,
              note: row.note,
              homework: row.homework,
              focus: row.focus,
            },
            {
              withCredentials: true,
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
          )
        )
      );
      message.success("Lưu điểm danh thành công!");
      onClose(true);
    } catch (err) {
      setError("Lỗi khi lưu điểm danh: " + (err?.response?.data?.message || err.message));
      message.error("Lỗi khi lưu điểm danh: " + (err?.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: <span><UserOutlined style={{ color: '#2563eb', marginRight: 6 }} />Mã học sinh</span>,
      dataIndex: "studentId",
      key: "studentId",
      align: "center",
      width: 120,
    },
    {
      title: <span><CheckCircleOutlined style={{ color: '#10B981', marginRight: 6 }} />Tham gia</span>,
      dataIndex: "participation",
      key: "participation",
      align: "center",
      render: (text, row, idx) => (
        <Input
          value={text}
          onChange={(e) => handleChange(idx, "participation", e.target.value)}
          placeholder="Nhập tham gia"
        />
      ),
    },
    {
      title: <span><EditOutlined style={{ color: '#f59e0b', marginRight: 6 }} />Ghi chú</span>,
      dataIndex: "note",
      key: "note",
      align: "center",
      render: (text, row, idx) => (
        <Input
          value={text}
          onChange={(e) => handleChange(idx, "note", e.target.value)}
          placeholder="Nhập ghi chú"
        />
      ),
    },
    {
      title: <span><BookOutlined style={{ color: '#6366f1', marginRight: 6 }} />Bài tập về nhà</span>,
      dataIndex: "homework",
      key: "homework",
      align: "center",
      render: (text, row, idx) => (
        <Input
          value={text}
          onChange={(e) => handleChange(idx, "homework", e.target.value)}
          placeholder="Nhập bài tập"
        />
      ),
    },
    {
      title: <span><StarFilled style={{ color: '#facc15', marginRight: 6 }} />Tập trung</span>,
      dataIndex: "focus",
      key: "focus",
      align: "center",
      render: (text, row, idx) => (
        <Select
          value={text}
          onChange={(value) => handleChange(idx, "focus", value)}
          style={{ width: 120 }}
        >
          {FOCUS_OPTIONS.map((opt) => (
            <Option key={opt} value={opt}>
              {opt}
            </Option>
          ))}
        </Select>
      ),
    },
  ];

  return (
    <Modal
      open={visible}
      onCancel={() => onClose(false)}
      title={<span style={{ fontWeight: 700, color: '#2563eb', fontSize: 20 }}>Điểm danh lớp học</span>}
      width={900}
      footer={null}
      bodyStyle={{ padding: 24, background: '#f8fafc', borderRadius: 12 }}
      style={{ top: 40 }}
      destroyOnClose
    >
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
      <Spin spinning={loading || saving} tip={saving ? "Đang lưu..." : "Đang tải..."}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="studentId"
          pagination={false}
          bordered
          style={{ background: '#fff', borderRadius: 12 }}
        />
        <div style={{ textAlign: 'right', marginTop: 24 }}>
          <Button type="primary" onClick={handleSave} loading={saving} style={{ minWidth: 120, fontWeight: 600, fontSize: 16 }}>
            Lưu điểm danh
          </Button>
        </div>
      </Spin>
    </Modal>
  );
};

export default AttendancePage; 