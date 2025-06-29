import React, { useState } from "react";
import { Button, Select, Tooltip } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./Schedule.css";

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

const getStatusColor = (status) => {
  switch (status) {
    case "On-going":
      return "ongoing";
    case "Finished":
      return "finished";
    case "Canceled":
      return "canceled";
    case "Completed":
      return "completed";
    default:
      return "nostatus";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "On-going":
      return "On-going";
    case "Finished":
      return "Finished";
    case "Canceled":
      return "Canceled";
    case "Completed":
      return "Completed";
    default:
      return "Chưa có";
  }
};

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

const STATUS_ICONS = {
  "On-going": "⏳",
  Finished: "✔️",
  Canceled: "❌",
  Completed: "🏁",
  nostatus: "•",
};

const STATUS_COLORS = {
  "On-going": { bg: "#e5eaf1", color: "#22304a" },
  Finished: { bg: "#e6f4ea", color: "#1a7f37" },
  Canceled: { bg: "#fbeaea", color: "#b42318" },
  Completed: { bg: "#f1f5f9", color: "#22304a" },
  nostatus: { bg: "#f3f4f6", color: "#7a869a" },
};

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState(getWeekDates(new Date()));
  const [scheduleData, setScheduleData] = useState({
    "Slot 1": {
      "16/06": {
        subject: "Giải tích 1",
        subjectCode: "MATH101",
        class: "A1",
        time: "7:00-9:15",
        status: "On-going",
        link: "meetURL1",
      },
      "17/06": {
        subject: "Lập trình C",
        subjectCode: "CSD201",
        class: "B2",
        time: "7:00-9:15",
        status: "Finished",
        link: "meetURL2",
      },
      "18/06": {
        subject: "Lập trình C",
        subjectCode: "CSD201",
        class: "B2",
        time: "7:00-9:15",
        status: "Canceled",
        link: "meetURL3",
      },
      "19/06": {
        subject: "Lập trình C",
        subjectCode: "CSD201",
        class: "B2",
        time: "7:00-9:15",
        status: "Completed",
        link: "meetURL4",
      },
      "20/06": {
        subject: "Lập trình C",
        subjectCode: "CSD201",
        class: "B2",
        time: "7:00-9:15",
        status: "On-going",
        link: "meetURL5",
      },
      "21/06": {
        subject: "Cơ sở dữ liệu",
        subjectCode: "DBI202",
        class: "C3",
        time: "7:00-9:15",
        status: "On-going",
        link: "meetURL6",
      },
      "22/06": {
        subject: "Cơ sở dữ liệu",
        subjectCode: "DBI202",
        class: "C3",
        time: "7:00-9:15",
        status: "On-going",
        link: "meetURL7",
      },
    },
    "Slot 2": {
      "16/06": {
        subject: "Cơ sở dữ liệu",
        subjectCode: "DBI202",
        class: "C3",
        time: "9:30-11:45",
        status: "Finished",
        link: "meetURL8",
      },
      "17/06": {
        subject: "Xác suất TK",
        subjectCode: "STA201",
        class: "D4",
        time: "9:30-11:45",
        status: "Completed",
        link: "meetURL9",
      },
      "18/06": {
        subject: "Xác suất TK",
        subjectCode: "STA201",
        class: "D4",
        time: "9:30-11:45",
        status: "On-going",
        link: "meetURL10",
      },
      "19/06": {
        subject: "Xác suất TK",
        subjectCode: "STA201",
        class: "D4",
        time: "9:30-11:45",
        status: "Canceled",
        link: "meetURL11",
      },
      "20/06": {
        subject: "Xác suất TK",
        subjectCode: "STA201",
        class: "D4",
        time: "9:30-11:45",
        status: "On-going",
        link: "meetURL12",
      },
      "21/06": {
        subject: "Cơ sở dữ liệu",
        subjectCode: "DBI202",
        class: "C3",
        time: "9:30-11:45",
        status: "On-going",
        link: "meetURL13",
      },
      "22/06": {
        subject: "Cơ sở dữ liệu",
        subjectCode: "DBI202",
        class: "C3",
        time: "9:30-11:45",
        status: "On-going",
        link: "meetURL14",
      },
    },
    "Slot 3": {
      "16/06": {
        subject: "Cấu trúc DL",
        subjectCode: "DSA201",
        class: "E5",
        time: "12:30-14:45",
        status: "Canceled",
        link: "meetURL15",
      },
      "17/06": {
        subject: "Hệ điều hành",
        subjectCode: "OSG202",
        class: "F6",
        time: "12:30-14:45",
        status: "Finished",
        link: "meetURL16",
      },
      "18/06": {
        subject: "Hệ điều hành",
        subjectCode: "OSG202",
        class: "F6",
        time: "12:30-14:45",
        status: "On-going",
        link: "meetURL17",
      },
      "19/06": {
        subject: "Hệ điều hành",
        subjectCode: "OSG202",
        class: "F6",
        time: "12:30-14:45",
        status: "Completed",
        link: "meetURL18",
      },
      "20/06": {
        subject: "Hệ điều hành",
        subjectCode: "OSG202",
        class: "F6",
        time: "12:30-14:45",
        status: "On-going",
        link: "meetURL19",
      },
      "21/06": {
        subject: "Cấu trúc DL",
        subjectCode: "DSA201",
        class: "E5",
        time: "12:30-14:45",
        status: "On-going",
        link: "meetURL20",
      },
      "22/06": {
        subject: "Cấu trúc DL",
        subjectCode: "DSA201",
        class: "E5",
        time: "12:30-14:45",
        status: "On-going",
        link: "meetURL21",
      },
    },
    "Slot 4": {
      "16/06": { status: "On-going", time: "15:00-16:30" },
      "17/06": { status: "On-going", time: "15:00-16:30" },
      "18/06": { status: "On-going", time: "15:00-16:30" },
      "19/06": { status: "On-going", time: "15:00-16:30" },
      "20/06": { status: "On-going", time: "15:00-16:30" },
      "21/06": { status: "On-going", time: "15:00-16:30" },
      "22/06": { status: "On-going", time: "15:00-16:30" },
    },
    "Slot 5": {
      "16/06": { status: "Finished", time: "16:45-18:00" },
      "17/06": { status: "Finished", time: "16:45-18:00" },
      "18/06": { status: "Finished", time: "16:45-18:00" },
      "19/06": { status: "Finished", time: "16:45-18:00" },
      "20/06": { status: "Finished", time: "16:45-18:00" },
      "21/06": { status: "Finished", time: "16:45-18:00" },
      "22/06": { status: "Finished", time: "16:45-18:00" },
    },
    "Slot 6": {
      "16/06": { status: "Canceled", time: "18:15-19:30" },
      "17/06": { status: "Canceled", time: "18:15-19:30" },
      "18/06": { status: "Canceled", time: "18:15-19:30" },
      "19/06": { status: "Canceled", time: "18:15-19:30" },
      "20/06": { status: "Canceled", time: "18:15-19:30" },
      "21/06": { status: "Canceled", time: "18:15-19:30" },
      "22/06": { status: "Canceled", time: "18:15-19:30" },
    },
    "Slot 7": {
      "16/06": { status: "Completed", time: "19:45-21:00" },
      "17/06": { status: "Completed", time: "19:45-21:00" },
      "18/06": { status: "Completed", time: "19:45-21:00" },
      "19/06": { status: "Completed", time: "19:45-21:00" },
      "20/06": { status: "Completed", time: "19:45-21:00" },
      "21/06": { status: "Completed", time: "19:45-21:00" },
      "22/06": { status: "Completed", time: "19:45-21:00" },
    },
    "Slot 8": {
      "16/06": { status: "On-going", time: "21:15-22:30" },
      "17/06": { status: "Finished", time: "21:15-22:30" },
      "18/06": { status: "Canceled", time: "21:15-22:30" },
      "19/06": { status: "Completed", time: "21:15-22:30" },
      "20/06": { status: "On-going", time: "21:15-22:30" },
      "21/06": { status: "On-going", time: "21:15-22:30" },
      "22/06": { status: "On-going", time: "21:15-22:30" },
    },
  });

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

  // Chỉ toggle giữa 4 trạng thái khi click cell KHÔNG có subject (nếu muốn toggle cả subject thì sửa chỗ này)
  const handleAttendanceToggle = (slot, date) => {
    setScheduleData((prev) => {
      const newData = { ...prev };
      const current = newData[slot][date]?.status;
      const nextStatus = {
        "On-going": "Finished",
        Finished: "Canceled",
        Canceled: "Completed",
        Completed: "On-going",
      };
      newData[slot][date].status = nextStatus[current] || "On-going";
      return newData;
    });
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
                    const data = scheduleData[slot][date];
                    const statusColor =
                      STATUS_COLORS[data?.status] || STATUS_COLORS.nostatus;
                    return (
                      <td
                        key={`${slot}-${date}`}
                        className={`td-cell office-cell ${isToday(date) ? "today-cell" : ""}`}
                        style={{ background: statusColor.bg }}
                        title={data && data.link ? data.link : ""}
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
      </div>
    </div>
  );
};

export default Schedule;
