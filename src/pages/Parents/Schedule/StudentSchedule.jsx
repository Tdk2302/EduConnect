import React, { useState } from "react";
import { Button, Select } from "antd";

import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import Header from "../../../component/Header";
import "./StudentSchedule.css";
import Footer from "../../../component/Footer";
import { getUserInfo } from "../../../services/handleStorageApi";
import { getTeacherCourses } from "../../../services/apiServices";

const { Option } = Select;

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

const isToday = (dateStr) => {
  const today = new Date();
  const [day, month] = dateStr.split("/");
  return (
    today.getDate() === Number(day) && today.getMonth() + 1 === Number(month)
  );
};

const SLOTS = [
  "Slot 1",
  "Slot 2",
  "Slot 3",
  "Slot 4",
  "Slot 5",
  "Slot 6",
  "Slot 7",
  "Slot 8",
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const STATUS_COLORS = {
  "On-going": { bg: "#e5eaf1", color: "#22304a" },
  Finished: { bg: "#e6f4ea", color: "#1a7f37" },
  Canceled: { bg: "#fbeaea", color: "#b42318" },
  Completed: { bg: "#f1f5f9", color: "#22304a" },
  nostatus: { bg: "#f3f4f6", color: "#7a869a" },
};

const SLOT_TIMES = {
  "Slot 1": "7h - 7h45",
  "Slot 2": "7h50 - 8h35",
  "Slot 3": "8h50 - 9h35",
  "Slot 4": "9h40 - 10h25",
  "Slot 5": "10h30 - 11h15",
  "Slot 6": "13h30 - 14h15",
  "Slot 7": "14h30 - 15h15",
};

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

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState(getWeekDates(new Date()));
  const [scheduleData, setScheduleData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const userInfo = getUserInfo();
        if (!userInfo || !userInfo.userId || !userInfo.token) {
          setError("Không tìm thấy thông tin đăng nhập.");
          setLoading(false);
          return;
        }
        const res = await getTeacherCourses(userInfo.userId, userInfo.token);
        const courses = Array.isArray(res.data) ? res.data : [];
        const grid = {};
        SLOTS.forEach((slot) => {
          grid[slot] = {};
        });
        const weekDateMap = {};
        selectedWeek.forEach((date) => {
          weekDateMap[date] = true;
        });
        courses.forEach((course) => {
          const courseDate = course.startTime
            ? new Date(course.startTime)
            : null;
          if (!courseDate) return;
          const dateStr = courseDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
          });
          if (weekDateMap[dateStr]) {
            const slotName = course.slot || "Slot 1";
            grid[slotName][dateStr] = {
              subject: course.subjectName ?? null,
              subjectCode: course.subjectId || "-",
              class: course.classId || "-",
              time: `${course.startTime ? new Date(course.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""} - ${course.endTime ? new Date(course.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}`,
              status: course.status || "nostatus",
              link: course.link || "",
            };
          }
        });
        setScheduleData(grid);
      } catch (err) {
        setError(
          "Lỗi khi tải dữ liệu: " +
            (err?.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
        <Option key={i} value={String(i)}>
          {i}
        </Option>
      );
    }
    return years;
  };

  return (
    <>
      <Header />
      <div className="schedule-container office-style">
        <div className="schedule-header office-header">
          <div className="left">
            <Select
              value={selectedStudent}
              onChange={setSelectedStudent}
              className="schedule-select"
              style={{ marginRight: 8 }}
            >
              {students.length > 0 ? (
                students
                  .filter((student) => student.studentId != null)
                  .map((student, idx) => (
                    <Option
                      key={student.studentId ?? `student-${idx}`}
                      value={student.fullname}
                    >
                      {student.fullname}
                    </Option>
                  ))
              ) : (
                <Option value="" disabled>
                  No data
                </Option>
              )}
            </Select>
            <Select
              defaultValue={String(currentDate.getFullYear())}
              onChange={handleYearChange}
              className="schedule-select"
            >
              {generateYearOptions()}
            </Select>
            <span className="week-text">
              WEEK {selectedWeek[0]} to {selectedWeek[6]}
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
        <div className="schedule-content office-content">
          {error && (
            <Alert type="error" message={error} style={{ marginBottom: 16 }} />
          )}
          <Spin spinning={loading} tip="Đang tải dữ liệu...">
            <div className="table-scroll">
              <table className="schedule-table office-table">
                <thead>
                  <tr>
                    <th className="th-slot fixed-col office-slot">Slot</th>
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
                  {SLOTS.map((slot, slotIdx) => (
                    <tr key={slot}>
                      <td className="td-slot fixed-col office-slot">
                        <span className="slot-icon">
                          {String.fromCodePoint(0x2460 + slotIdx)}
                        </span>{" "}
                        {slot}
                      </td>
                      {selectedWeek.map((date) => {
                        const slotData = scheduleData[slot] || {};
                        const data = slotData[date];
                        const statusColor =
                          STATUS_COLORS[data?.status] || STATUS_COLORS.nostatus;
                        return (
                          <td
                            key={`${slot}-${date}`}
                            className={`td-cell office-cell ${isToday(date) ? "today-cell" : ""}`}
                            style={{
                              background: statusColor.bg,
                              cursor:
                                data && data.class ? "pointer" : "default",
                            }}
                            title={data && data.link ? data.link : ""}
                            onClick={() => handleCellClick(slot, date, data)}
                          >
                            {data ? (
                              <div className="cell-office-main">
                                {data.subject && (
                                  <div className="cell-office-subject">
                                    {data.subject}
                                  </div>
                                )}
                                {data.subjectCode && (
                                  <div className="cell-office-code">
                                    {data.subjectCode}
                                  </div>
                                )}
                                {data.class && (
                                  <div className="cell-office-class">
                                    Lớp: {data.class}
                                  </div>
                                )}
                                {data.time && (
                                  <div className="cell-office-time">
                                    {data.time}
                                  </div>
                                )}
                                <div
                                  className="office-status-badge"
                                  style={{
                                    background: statusColor.bg,
                                    color: statusColor.color,
                                    border: "none",
                                    fontWeight: 600,
                                    fontSize: 13,
                                    marginTop: 2,
                                  }}
                                >
                                  {getStatusText(data.status)}
                                </div>
                              </div>
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
          </Spin>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Schedule;
