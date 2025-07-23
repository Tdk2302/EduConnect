import React, { useEffect, useState } from "react";
import { Spin, Alert, Button, Select, message } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { getUserInfo } from "../../../services/handleStorageApi";
import {
  getTeacherDetail,
  getTeacherCourses,
} from "../../../services/apiServices";
import "./TeacherSchedule.css";
import AttendancePage from "./AttendancePage";

const SLOTS = [
  "Slot 1",
  "Slot 2",
  "Slot 3",
  "Slot 4",
  "Slot 5",
  "Slot 6",
  "Slot 7",
];

const SLOT_TIMES = {
  "Slot 1": "7h - 7h45",
  "Slot 2": "7h50 - 8h35",
  "Slot 3": "8h50 - 9h35",
  "Slot 4": "9h40 - 10h25",
  "Slot 5": "10h30 - 11h15",
  "Slot 6": "13h30 - 14h15",
  "Slot 7": "14h30 - 15h15",
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeekDates(date) {
  const week = [];
  const startOfWeek = new Date(date);
  startOfWeek.setDate(
    date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)
  );
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    week.push(
      day.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" })
    );
  }
  return week;
}

const STATUS_COLORS = {
  "On-going": { bg: "#e0f2fe", color: "#0284c7" },
  Finished: { bg: "#fee2e2", color: "#dc2626" },
  Canceled: { bg: "#fef9c3", color: "#eab308" },
  Completed: { bg: "#bbf7d0", color: "#16a34a" },
  nostatus: { bg: "#f3f4f6", color: "#64748b" },
};

const getStatusText = (status) => {
  switch (status) {
    case "On-going":
      return "Đang diễn ra";
    case "Finished":
      return "Đã kết thúc";
    case "Canceled":
      return "Đã hủy";
    case "Completed":
      return "Hoàn thành";
    default:
      return "Chưa diễn ra";
  }
};

// Thêm hàm xác định slot theo thời gian bắt đầu (theo slot mới)
function getSlotNameByTime(startTime) {
  if (!startTime) return "Slot 1";
  const date = new Date(startTime);
  const hour = date.getHours();
  const minute = date.getMinutes();
  const total = hour * 60 + minute;
  if (total >= 420 && total < 465) return "Slot 1"; // 7:00 - 7:45
  if (total >= 470 && total < 515) return "Slot 2"; // 7:50 - 8:35
  if (total >= 530 && total < 575) return "Slot 3"; // 8:50 - 9:35
  if (total >= 580 && total < 625) return "Slot 4"; // 9:40 - 10:25
  if (total >= 630 && total < 675) return "Slot 5"; // 10:30 - 11:15
  if (total >= 810 && total < 855) return "Slot 6"; // 13:30 - 14:15
  if (total >= 870 && total < 915) return "Slot 7"; // 14:30 - 15:15
  return "Slot 1";
}

const TeacherSchedule = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [scheduleData, setScheduleData] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState(getWeekDates(new Date()));
  const [attendanceModal, setAttendanceModal] = useState({
    open: false,
    courseId: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const userInfo = getUserInfo();
        if (!userInfo || !userInfo.userId || !userInfo.token) {
          setError("Không tìm thấy thông tin đăng nhập.");
          message.error("Không tìm thấy thông tin đăng nhập.");
          setLoading(false);
          return;
        }
        // Lấy thông tin giáo viên
        const teacherRes = await getTeacherDetail(
          userInfo.userId
        );
        const teacher = teacherRes.data;
        setTeacherInfo(teacher);
        if (!teacher.teacherId) {
          setError("Không tìm thấy mã giáo viên.");
          message.error("Không tìm thấy mã giáo viên.");
          setLoading(false);
          return;
        }
        const teacherID = teacher.teacherId;
        console.log(teacherID);
        // Lấy lịch dạy
        const scheduleRes = await getTeacherCourses(teacherID);
        console.log(scheduleRes);
        let courses = Array.isArray(scheduleRes.data) ? scheduleRes.data : [];
        // Mapping dữ liệu thành lưới slot/ngày, mỗi ô là mảng course
        const grid = {};
        SLOTS.forEach((slot) => {
          grid[slot] = {};
        });
        // Tạo map ngày (dd/MM) -> index trong tuần
        const weekDateMap = {};
        selectedWeek.forEach((date, idx) => {
          weekDateMap[date] = idx;
        });
        courses.forEach((course) => {
          // Lấy ngày của course (dd/MM)
          const courseDate = course.startTime
            ? new Date(course.startTime + "Z")
            : null;
          if (!courseDate) return;
          const dateStr = courseDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
          });
          // Nếu ngày nằm trong tuần đang xem
          if (weekDateMap[dateStr] !== undefined) {
            const slotName = getSlotNameByTime(course.startTime);
            if (!grid[slotName][dateStr]) grid[slotName][dateStr] = [];
            grid[slotName][dateStr].push({
              subject: course.subjectName ?? null,
              subjectCode: course.subjectId || "-",
              class: course.classId || "-",
              time: `${course.startTime ? new Date(course.startTime + "Z").toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""} - ${course.endTime ? new Date(course.endTime + "Z").toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}`,
              status: course.status || "nostatus",
              courseId: course.courseId,
            });
          }
        });
        setScheduleData(grid);
      } catch (err) {
        setError(
          "Lỗi khi tải dữ liệu: " +
            (err?.response?.data?.message || err.message)
        );
        message.error(
          "Lỗi khi tải dữ liệu: " +
            (err?.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [selectedWeek]);

  const handleWeekChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === "prev" ? -7 : 7));
    setCurrentDate(newDate);
    setSelectedWeek(getWeekDates(newDate));
  };

  const handleYearChange = (value) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(Number(value));
    setCurrentDate(newDate);
    setSelectedWeek(getWeekDates(newDate));
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(
        <Select.Option key={i} value={String(i)}>
          {i}
        </Select.Option>
      );
    }
    return years;
  };

  const isToday = (dateStr) => {
    const today = new Date();
    const [day, month] = dateStr.split("/");
    return (
      today.getDate() === Number(day) && today.getMonth() + 1 === Number(month)
    );
  };

  return (
    <div className="schedule-container office-style">
      <div className="schedule-header office-header">
        <div className="left">
          <Select
            defaultValue={String(currentDate.getFullYear())}
            onChange={handleYearChange}
            className="schedule-select"
          >
            {generateYearOptions()}
          </Select>
          <span className="week-text">
            Tuần: {selectedWeek[0]} - {selectedWeek[6]}
          </span>
        </div>
        <div className="right">
          <Button
            icon={<LeftOutlined />}
            onClick={() => handleWeekChange("prev")}
            className="nav-btn"
          />
          <Button
            icon={<RightOutlined />}
            onClick={() => handleWeekChange("next")}
            className="nav-btn"
          />
        </div>
      </div>
      {teacherInfo && (
        <div style={{ marginBottom: 16, textAlign: "center" }}>
          <b>Họ tên:</b> {teacherInfo.fullName} &nbsp;|&nbsp;
          <b>Email:</b> {teacherInfo.email} &nbsp;|&nbsp;
          <b>Trạng thái:</b> {teacherInfo.status}
        </div>
      )}
      {error && (
        <Alert type="error" message={error} style={{ marginBottom: 16 }} />
      )}
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <div className="schedule-content office-content">
          <div className="table-scroll">
            <table className="schedule-table office-table">
              <thead>
                <tr>
                  <th className="th-slot office-slot">Slot</th>
                  {selectedWeek.map((date, idx) => (
                    <th
                      key={date}
                      className={`th-date office-date ${isToday(date) ? "today-header" : ""}`}
                    >
                      {DAYS[idx]}
                      <br />
                      {date}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SLOTS.map((slot) => (
                  <tr key={slot}>
                    <td className="td-slot office-slot">
                      <span className="slot-icon">{slot}</span>
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        {SLOT_TIMES[slot]}
                      </div>
                    </td>
                    {selectedWeek.map((date) => {
                      const dataArr = scheduleData[slot]?.[date];
                      return (
                        <td
                          key={`${slot}-${date}`}
                          className={`td-cell office-cell ${isToday(date) ? "today-cell" : ""}`}
                        >
                          {Array.isArray(dataArr) && dataArr.length > 0 ? (
                            dataArr.map((data, idx) => {
                              const statusColor =
                                STATUS_COLORS[data?.status] ||
                                STATUS_COLORS.nostatus;
                              return (
                                <div
                                  key={idx}
                                  className="cell-office-main"
                                  style={{
                                    marginBottom: 6,
                                    cursor: "pointer",
                                    borderRadius: 8,
                                    transition: "background 0.2s",
                                  }}
                                  onClick={() =>
                                    data.courseId &&
                                    setAttendanceModal({
                                      open: true,
                                      courseId: data.courseId,
                                    })
                                  }
                                  title="Bấm để điểm danh"
                                >
                                  <div className="cell-office-subject">
                                    <b>Tên môn:</b> {data.subject ?? "Null"}
                                  </div>
                                  <div className="cell-office-class">
                                    Lớp: {data.class}
                                  </div>
                                  <div className="cell-office-time">
                                    {data.time}
                                  </div>
                                  <div
                                    className={`office-status-badge ${data.status?.toLowerCase() || "nostatus"}`}
                                    style={{
                                      color: statusColor.color,
                                      background: statusColor.bg,
                                    }}
                                  >
                                    {getStatusText(data.status)}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <span className="nodata">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Spin>
      <AttendancePage
        courseId={attendanceModal.courseId}
        visible={attendanceModal.open}
        onClose={() => setAttendanceModal({ open: false, courseId: null })}
      />
    </div>
  );
};

export default TeacherSchedule;