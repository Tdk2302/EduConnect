import React, { useEffect, useState } from "react";
import { Modal, Table, Input, Select, Button, Spin, Alert, message, Tabs, Row, Col } from "antd";
import { UserOutlined, CheckCircleOutlined, EditOutlined, BookOutlined, StarFilled } from "@ant-design/icons";
import { getToken } from "../../../services/apiServices";
import { updateCourseStatus } from "../../../services/apiServices";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const { Option } = Select;
const { TabPane } = Tabs;

const HOMEWORK_OPTIONS = [
  "Hoàn thành bài tốt",
  "Có chuẩn bị bài",
  "Cần cải thiện điểm",
  "Chưa chuẩn bị bài"
];
const FOCUS_OPTIONS = [
  "Tốt",
  "Rất tốt",
  "Trung Bình",
  "Kém"
];
const PARTICIPATION_OPTIONS = [
  "Vắng mặt",
  "Có mặt",
  "Đi muộn"
];
const STUDENT_IDS = [
  "stu001", "stu002", "stu003", "stu004",
  "stu005", "stu006", "stu007", "stu008"
];

// Danh sách học sinh theo từng lớp
const STUDENTS_BY_CLASS = {
  class01: [
    { studentId: 'stu001'},
    { studentId: 'stu002'},
    { studentId: 'stu003'},
    { studentId: 'stu004'},
    { studentId: 'stu005'},
    { studentId: 'stu006'},
    { studentId: 'stu007'},
    { studentId: 'stu008'},
    { studentId: 'stu009'},
    { studentId: 'stu010'},
  ],
  class02: [
    { studentId: 'stu011'},
    { studentId: 'stu012'},
    { studentId: 'stu013'},
    { studentId: 'stu014'},
    { studentId: 'stu015'},
    { studentId: 'stu016'},
    { studentId: 'stu017'},
    { studentId: 'stu018'},
    { studentId: 'stu019'},
    { studentId: 'stu020'},
  ],
  class03: [
    { studentId: 'stu021'},
    { studentId: 'stu022'},
    { studentId: 'stu023'},
    { studentId: 'stu024'},
    { studentId: 'stu025'},
    { studentId: 'stu026'},
    { studentId: 'stu027'},
    { studentId: 'stu028'},
    { studentId: 'stu029'},
    { studentId: 'stu030'},
  ],
  class04: [
    { studentId: 'stu031'},
    { studentId: 'stu032'},
    { studentId: 'stu033'},
    { studentId: 'stu034'},
    { studentId: 'stu035'},
    { studentId: 'stu036'},
    { studentId: 'stu037'},
    { studentId: 'stu038'},
    { studentId: 'stu039'},
    { studentId: 'stu040'},
  ],
  class05: [
    { studentId: 'stu041'},
    { studentId: 'stu042'},
    { studentId: 'stu043'},
    { studentId: 'stu044'},
    { studentId: 'stu045'},
    { studentId: 'stu046'},
    { studentId: 'stu047'},
    { studentId: 'stu048'},
    { studentId: 'stu049'},
    { studentId: 'stu050'},
  ],
};

function getClassIdFromCourse(courseId) {
  if (!courseId) return 'class01';
  if (courseId.toLowerCase().includes('class01')) return 'class01';
  if (courseId.toLowerCase().includes('class02')) return 'class02';
  if (courseId.toLowerCase().includes('class03')) return 'class03';
  return 'class01';
}

const SUBJECTS = [
  { label: 'Toán', value: 'SUB001' },
  { label: 'Văn', value: 'SUB002' },
  { label: 'Tiếng Anh', value: 'SUB003' },
  { label: 'Lý', value: 'SUB004' },
  { label: 'Hóa', value: 'SUB005' },
];

const AttendancePage = ({ courseId, classId, visible, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState([]); // danh sách attendance đã có
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("create");
  const [scoreTabSubject, setScoreTabSubject] = useState('SUB001');
  const [scoreRows, setScoreRows] = useState([]); // {studentId, name, score1}
  const [savingScore, setSavingScore] = useState(false);
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
        // Lấy danh sách học sinh theo class (ưu tiên prop classId nếu có)
        const usedClassId = classId || getClassIdFromCourse(courseId);
        const students = STUDENTS_BY_CLASS[usedClassId] || [];
        setEditRows(
          attendances.filter(a => attendedIds.includes(a.studentId))
        );
        setCreateRows(
          students.filter(stu => !attendedIds.includes(stu.studentId)).map(stu => ({
            studentId: stu.studentId,
            participation: "",
            note: "",
            homework: "",
            focus: ""
          }))
        );
        // Chuẩn bị dữ liệu nhập điểm
        setScoreRows(
          students.map(stu => ({ studentId: stu.studentId, name: stu.name, score1: '' }))
        );
      } catch (err) {
        setError("Lỗi khi tải dữ liệu điểm danh: " + (err?.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [courseId, visible, classId]);

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

      if (courseId) {
        try {
          await updateCourseStatus(courseId, 'present');
        } catch (e) {
          message.warning('Tạo điểm danh thành công nhưng cập nhật trạng thái khoá học thất bại!');
        }
      }
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
      // Update course status to 'present' after attendance update
      if (courseId) {
        try {
          await updateCourseStatus(courseId, 'present', token);
        } catch (e) {
          message.warning('Cập nhật điểm danh thành công nhưng cập nhật trạng thái khoá học thất bại!');
        }
      }
      message.success("Cập nhật điểm danh thành công!");
      onClose(true);
    } catch (err) {
      setError("Lỗi khi lưu điểm danh: " + (err?.response?.data?.message || err.message));
      message.error("Lỗi khi lưu điểm danh: " + (err?.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // Hàm áp dụng giá trị cho tất cả các dòng
  const applyAll = (rows, setRows, values) => {
    setRows(prev => prev.map(row => ({ ...row, ...values })));
  };

  // State cho control áp dụng tất cả
  const [bulkCreate, setBulkCreate] = useState({ participation: '', homework: '', focus: '' });
  const [bulkEdit, setBulkEdit] = useState({ participation: '', homework: '', focus: '' });

  // Xử lý thay đổi điểm số
  const handleScoreChange = (idx, value) => {
    setScoreRows(prev => prev.map((row, i) => i === idx ? { ...row, score1: value } : row));
  };

  // Gửi điểm lên API
  const handleSaveScores = async () => {
    setSavingScore(true);
    setError("");
    try {
      const token = getToken();
      await Promise.all(
        scoreRows.map(row =>
          axios.post(
            `https://localhost:7064/api/Score`,
            {
              studentId: row.studentId,
              subjectId: scoreTabSubject,
              score1: Number(row.score1) || 0,
            },
            {
              withCredentials: true,
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
          )
        )
      );
      message.success("Lưu điểm thành công!");
      setTab('create');
    } catch (err) {
      setError("Lỗi khi lưu điểm: " + (err?.response?.data?.message || err.message));
      message.error("Lỗi khi lưu điểm: " + (err?.response?.data?.message || err.message));
    } finally {
      setSavingScore(false);
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
        <Input.TextArea
          value={text}
          onChange={(e) => handleChange(rows, setRows, idx, "note", e.target.value)}
          placeholder="Nhập ghi chú"
          autoSize={false}
          style={{ resize: 'none', minWidth: 180, maxWidth: 220, minHeight: 32, height: 32 }}
        />
      ),
    },
    {
      title: <span><BookOutlined style={{ color: '#6366f1', marginRight: 6 }} />Bài tập về nhà</span>,
      dataIndex: "homework",
      key: "homework",
      align: "center",
      render: (text, row, idx) => (
        <Select
          value={text}
          onChange={(value) => handleChange(rows, setRows, idx, "homework", value)}
          style={{ width: 180 }}
          placeholder="Chọn trạng thái bài tập"
        >
          {HOMEWORK_OPTIONS.map((opt) => (
            <Option key={opt} value={opt}>
              {opt}
            </Option>
          ))}
        </Select>
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
          placeholder="Chọn mức độ tập trung"
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

  // Sắp xếp editRows theo studentId tăng dần trước khi render bảng sửa điểm danh
  const sortedEditRows = [...editRows].sort((a, b) => {
    // So sánh số sau 'stu' để đảm bảo đúng thứ tự số
    const numA = parseInt(a.studentId.replace('stu', ''), 10);
    const numB = parseInt(b.studentId.replace('stu', ''), 10);
    return numA - numB;
  });

  return (
    <Modal
      open={visible}
      onCancel={() => onClose(false)}
      title={<span style={{ fontWeight: 700, color: '#2563eb', fontSize: 20 }}>Điểm danh lớp học</span>}
      width={1200}
      footer={null}
      bodyStyle={{ padding: 24, background: '#f8fafc', borderRadius: 12 }}
      style={{ top: 40 }}
      destroyOnClose
    >
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
      <div style={{ maxHeight: 600, overflow: 'auto' }}>
        <Spin spinning={loading || saving} tip={saving ? "Đang lưu..." : "Đang tải..."}>
          <Tabs activeKey={tab} onChange={setTab} style={{ marginBottom: 16 }}>
            <TabPane tab="Tạo điểm danh" key="create">
              {/* Control áp dụng tất cả */}
              <Row gutter={12} style={{ marginBottom: 12 }}>
                <Col>
                  <Select
                    value={bulkCreate.participation}
                    onChange={v => setBulkCreate(b => ({ ...b, participation: v }))}
                    style={{ width: 150 }}
                    placeholder="Tham gia (tất cả)"
                  >
                    {PARTICIPATION_OPTIONS.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
                  </Select>
                </Col>
                <Col>
                  <Select
                    value={bulkCreate.homework}
                    onChange={v => setBulkCreate(b => ({ ...b, homework: v }))}
                    style={{ width: 170 }}
                    placeholder="Bài tập (tất cả)"
                  >
                    {HOMEWORK_OPTIONS.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
                  </Select>
                </Col>
                <Col>
                  <Select
                    value={bulkCreate.focus}
                    onChange={v => setBulkCreate(b => ({ ...b, focus: v }))}
                    style={{ width: 150 }}
                    placeholder="Tập trung (tất cả)"
                  >
                    {FOCUS_OPTIONS.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
                  </Select>
                </Col>
                <Col>
                  <Button
                    onClick={() => applyAll(createRows, setCreateRows, bulkCreate)}
                    type="primary"
                    disabled={createRows.length === 0 || (!bulkCreate.participation && !bulkCreate.homework && !bulkCreate.focus)}
                  >
                    Áp dụng cho tất cả
                  </Button>
                </Col>
              </Row>
              <Table
                columns={getColumns(createRows, setCreateRows, false)}
                dataSource={createRows}
                rowKey="studentId"
                pagination={false}
                bordered
                style={{ background: '#fff', borderRadius: 12 }}
                scroll={{ y: 350 }}
              />
              <div style={{ textAlign: 'right', marginTop: 24 }}>
                <Button type="primary" onClick={handleCreate} loading={saving} style={{ minWidth: 120, fontWeight: 600, fontSize: 16 }} disabled={createRows.length === 0}>
                  Tạo điểm danh
                </Button>
              </div>
            </TabPane>
            <TabPane tab="Sửa điểm danh" key="edit">
              {/* Control áp dụng tất cả */}
              <Row gutter={12} style={{ marginBottom: 12 }}>
                <Col>
                  <Select
                    value={bulkEdit.participation}
                    onChange={v => setBulkEdit(b => ({ ...b, participation: v }))}
                    style={{ width: 150 }}
                    placeholder="Tham gia (tất cả)"
                  >
                    {PARTICIPATION_OPTIONS.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
                  </Select>
                </Col>
                <Col>
                  <Select
                    value={bulkEdit.homework}
                    onChange={v => setBulkEdit(b => ({ ...b, homework: v }))}
                    style={{ width: 170 }}
                    placeholder="Bài tập (tất cả)"
                  >
                    {HOMEWORK_OPTIONS.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
                  </Select>
                </Col>
                <Col>
                  <Select
                    value={bulkEdit.focus}
                    onChange={v => setBulkEdit(b => ({ ...b, focus: v }))}
                    style={{ width: 150 }}
                    placeholder="Tập trung (tất cả)"
                  >
                    {FOCUS_OPTIONS.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
                  </Select>
                </Col>
                <Col>
                  <Button
                    onClick={() => applyAll(editRows, setEditRows, bulkEdit)}
                    type="primary"
                    disabled={editRows.length === 0 || (!bulkEdit.participation && !bulkEdit.homework && !bulkEdit.focus)}
                  >
                    Áp dụng cho tất cả
                  </Button>
                </Col>
              </Row>
              <Table
                columns={getColumns(editRows, setEditRows, true)}
                dataSource={sortedEditRows}
                rowKey="studentId"
                pagination={false}
                bordered
                style={{ background: '#fff', borderRadius: 12 }}
                scroll={{ y: 350 }}
              />
              <div style={{ textAlign: 'right', marginTop: 24 }}>
                <Button type="primary" onClick={handleSave} loading={saving} style={{ minWidth: 120, fontWeight: 600, fontSize: 16 }} disabled={editRows.length === 0}>
                  Lưu điểm danh
                </Button>
              </div>
            </TabPane>
            {/* <TabPane tab="Nhập điểm" key="score">
              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontWeight: 600 }}>Môn học:</span>
                <Select
                  value={scoreTabSubject}
                  onChange={setScoreTabSubject}
                  style={{ width: 180 }}
                  options={SUBJECTS}
                />
              </div>
              <Table
                columns={[
                  { title: 'Mã học sinh', dataIndex: 'studentId', key: 'studentId', align: 'center', width: 120 },
                  { title: 'Họ tên', dataIndex: 'name', key: 'name', align: 'center', width: 180 },
                  {
                    title: 'Điểm',
                    dataIndex: 'score1',
                    key: 'score1',
                    align: 'center',
                    render: (text, row, idx) => (
                      <Input
                        value={text}
                        type="number"
                        min={0}
                        max={10}
                        step={0.1}
                        onChange={e => handleScoreChange(idx, e.target.value)}
                        placeholder="Nhập điểm"
                        style={{ width: 100 }}
                      />
                    ),
                  },
                ]}
                dataSource={scoreRows}
                rowKey="studentId"
                pagination={false}
                bordered
                style={{ background: '#fff', borderRadius: 12 }}
              />
              <div style={{ textAlign: 'right', marginTop: 24 }}>
                <Button type="primary" onClick={handleSaveScores} loading={savingScore} style={{ minWidth: 120, fontWeight: 600, fontSize: 16 }}>
                  Lưu điểm
                </Button>
              </div>
            </TabPane> */}
          </Tabs>
        </Spin>
      </div>
    </Modal>
  );
};

export default AttendancePage; 