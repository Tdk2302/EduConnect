import React, { useEffect, useState } from "react";
import { Modal, Table, Input, Select, Button, Spin, Alert, message, Tabs } from "antd";
import { UserOutlined, CheckCircleOutlined, EditOutlined, BookOutlined, StarFilled } from "@ant-design/icons";
import { getToken } from "../../../services/apiServices";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const { Option } = Select;
const { TabPane } = Tabs;

const FOCUS_OPTIONS = ["Kém", "Trung bình", "Rất tốt"];
const PARTICIPATION_OPTIONS = ["Có tham gia", "Không tham gia"];
const STUDENT_IDS = [
  "stu001", "stu002", "stu003", "stu004",
  "stu005", "stu006", "stu007", "stu008"
];

const AttendancePage = ({ courseId, visible, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState([]); // danh sách attendance đã có
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("create");
  const [createRows, setCreateRows] = useState([]); // học sinh chưa có attendance
  const [editRows, setEditRows] = useState([]); // học sinh đã có attendance

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
        const attendances = res.data || [];
        setData(attendances);
        // Phân loại học sinh đã/ chưa có attendance
        const attendedIds = attendances
          .filter(a => a.participation || a.note || a.homework || a.focus)
          .map(a => a.studentId);
        setEditRows(
          attendances.filter(a => attendedIds.includes(a.studentId))
        );
        setCreateRows(
          STUDENT_IDS.filter(id => !attendedIds.includes(id)).map(id => ({
            studentId: id,
            participation: "",
            note: "",
            homework: "",
            focus: ""
          }))
        );
      } catch (err) {
        setError("Lỗi khi tải dữ liệu điểm danh: " + (err?.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [courseId, visible]);

  // Xử lý thay đổi cho từng dòng
  const handleChange = (rows, setRows, idx, field, value) => {
    setRows(prev => prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));
  };

  // POST cho học sinh chưa có attendance
  const handleCreate = async () => {
    setSaving(true);
    setError("");
    try {
      const token = getToken();
      await axios.post(
        `https://localhost:7064/api/Attendance`,
        createRows.map(row => ({
          atID: "",
          studentId: row.studentId,
          courseId: courseId,
          participation: row.participation || "",
          note: row.note || "",
          homework: row.homework || "",
          focus: row.focus || "",
        })),
        {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      message.success("Tạo điểm danh thành công!");
      onClose(true);
    } catch (err) {
      setError("Lỗi khi tạo điểm danh: " + (err?.response?.data?.message || err.message));
      message.error("Lỗi khi tạo điểm danh: " + (err?.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // PUT cho học sinh đã có attendance
  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const token = getToken();
      await Promise.all(
        editRows.map(row =>
          axios.put(
            `https://localhost:7064/api/Attendance`,
            {
              atID: row.atID,
              studentId: row.studentId,
              courseId: courseId,
              participation: row.participation || "",
              note: row.note || "",
              homework: row.homework || "",
              focus: row.focus || "",
            },
            {
              withCredentials: true,
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
          )
        )
      );
      message.success("Cập nhật điểm danh thành công!");
      onClose(true);
    } catch (err) {
      setError("Lỗi khi lưu điểm danh: " + (err?.response?.data?.message || err.message));
      message.error("Lỗi khi lưu điểm danh: " + (err?.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // Cột chung cho cả 2 tab
  const getColumns = (rows, setRows, isEdit) => [
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
        <Select
          value={text}
          onChange={(value) => handleChange(rows, setRows, idx, "participation", value)}
          style={{ width: 180 }}
          placeholder="Chọn trạng thái"
        >
          {PARTICIPATION_OPTIONS.map((opt) => (
            <Option key={opt} value={opt}>
              {opt}
            </Option>
          ))}
        </Select>
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
          onChange={(e) => handleChange(rows, setRows, idx, "note", e.target.value)}
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
          onChange={(e) => handleChange(rows, setRows, idx, "homework", e.target.value)}
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
          onChange={(value) => handleChange(rows, setRows, idx, "focus", value)}
          style={{ width: 180 }}
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
        <Tabs activeKey={tab} onChange={setTab} style={{ marginBottom: 16 }}>
          <TabPane tab="Tạo điểm danh" key="create">
            <Table
              columns={getColumns(createRows, setCreateRows, false)}
              dataSource={createRows}
              rowKey="studentId"
              pagination={false}
              bordered
              style={{ background: '#fff', borderRadius: 12 }}
            />
            <div style={{ textAlign: 'right', marginTop: 24 }}>
              <Button type="primary" onClick={handleCreate} loading={saving} style={{ minWidth: 120, fontWeight: 600, fontSize: 16 }} disabled={createRows.length === 0}>
                Tạo điểm danh
              </Button>
            </div>
          </TabPane>
          <TabPane tab="Sửa điểm danh" key="edit">
            <Table
              columns={getColumns(editRows, setEditRows, true)}
              dataSource={editRows}
              rowKey="studentId"
              pagination={false}
              bordered
              style={{ background: '#fff', borderRadius: 12 }}
            />
            <div style={{ textAlign: 'right', marginTop: 24 }}>
              <Button type="primary" onClick={handleSave} loading={saving} style={{ minWidth: 120, fontWeight: 600, fontSize: 16 }} disabled={editRows.length === 0}>
                Lưu điểm danh
              </Button>
            </div>
          </TabPane>
        </Tabs>
      </Spin>
    </Modal>
  );
};

export default AttendancePage; 