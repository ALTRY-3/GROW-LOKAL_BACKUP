"use client";

import React, { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MdNotifications, MdNotificationsActive } from "react-icons/md";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./events.css";

export default function EventsPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [reminders, setReminders] = useState<number[]>([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof events>([]);
  const [calendarReminder, setCalendarReminder] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);

  const events = [
    {
      date: "2025-09-15",
      title: "Artisan Fair",
      image: "/event1.jpg",
      dateText: "Fri, Sept. 15th 2025",
      location: "SM City Olongapo",
      details:
        "A four-day artisan fair held at SM City Olongapo, featuring a diverse range of Filipino crafts and handmade products from local artisans.",
    },
    {
      date: "2026-02-17",
      title: "Alab Sining 2026",
      image: "/event2.jpg",
      dateText: "Fri, Feb. 27th 2026",
      location: "SM City Olongapo Central",
      details:
        "An art exhibit held at SM City Olongapo Central, showcasing traditional and contemporary artworks by artists from Olongapo, Zambales, and Bataan.",
    },
    {
      date: "2025-10-25",
      title: "This Is Not Art Escape",
      image: "/event3.png",
      dateText: "Sat, Oct. 25th 2025",
      location: "Ayala Malls Harbor Point",
      details:
        "A two-day art market at Ayala Malls Harbor Point, offering handmade crafts, original artworks, and unique creations from local artists.",
    },
    {
      date: "2026-06-22",
      title: "Crft PINAY Pottery Experience",
      image: "/event4.png",
      dateText: "Sat, June 22nd 2026",
      location: "Sibul Kapihan, SBFZ",
      details:
        "A pottery workshop held at Ianthe, providing participants with hands-on experience in traditional Filipino pottery-making techniques.",
    },
    {
      date: "2025-09-16",
      title: "My City, My SM, My Crafts",
      image: "/event5.png",
      dateText: "Sat, Sept. 16th 2025",
      location: "SM City Olongapo",
      details:
        "An initiative by SM City Olongapo to showcase and celebrate the craftsmanship and artistry of local Filipino artisans.",
    },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setSuggestions([]);
    } else {
      const filtered = events.filter(
        (event) =>
          event.title.toLowerCase().includes(value.toLowerCase()) ||
          event.location.toLowerCase().includes(value.toLowerCase()) ||
          event.dateText.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    }
  };

  const handleSuggestionClick = (index: number) => {
    setQuery("");
    setSuggestions([]);
    eventRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const toggleReminder = (idx: number) => {
    setReminders((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleDateClick = (clickedDate: Date) => {
    setDate(clickedDate);
    const foundEvent = events.find(
      (event) =>
        new Date(event.date).toDateString() === clickedDate.toDateString()
    );
    setSelectedEvent(foundEvent || null);
  };

  return (
    <div className="events-page">
      <Navbar />

      <div className="events-search-bar-container">
        <div className="events-search-bar">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search for Olongapo's events"
            className="events-search-input"
            value={query}
            onChange={handleSearchChange}
          />
        </div>

        {suggestions.length > 0 && (
          <ul className="events-suggestions-box">
            {suggestions.map((event, idx) => {
              const eventIndex = events.findIndex(
                (e) => e.title === event.title
              );
              return (
                <li key={idx} onClick={() => handleSuggestionClick(eventIndex)}>
                  <img src={event.image} alt={event.title} />
                  <span>{event.title}</span>
                  <span className="events-suggestion-location">
                    {event.location}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="events-content">
        <div className="events-left">
          {events.map((event, idx) => (
            <div
              className="event-card"
              key={idx}
              ref={(el) => {
                eventRefs.current[idx] = el;
              }}
            >
              <img
                src={event.image}
                alt={event.title}
                className="event-image"
              />
              <div className="event-info">
                <div className="event-date">{event.dateText}</div>
                <div className="event-title">{event.title}</div>
                <div className="event-location">
                  <svg
                    className="location-icon"
                    width="9.92"
                    height="13.33"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"
                      fill="#AF7928"
                    />
                  </svg>
                  <span className="location-text">{event.location}</span>
                </div>
                <div className="event-details">{event.details}</div>
              </div>

              <div className="event-actions">
                <div
                  className={`action-box ${
                    reminders.includes(idx) ? "active" : ""
                  }`}
                  onClick={() => toggleReminder(idx)}
                >
                  {reminders.includes(idx) ? (
                    <>
                      <MdNotificationsActive className="icon-ringing" />
                      <span>Reminder Set</span>
                    </>
                  ) : (
                    <>
                      <MdNotifications />
                      <span>Set a Reminder</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="calendar-box">
          <div className="calendar-header">
            <span className="calendar-title">Calendar</span>
            <div className="calendar-actions">
              <div
                className={`calendar-icon-box ${
                  calendarReminder ? "active" : ""
                }`}
                onClick={() => setCalendarReminder(!calendarReminder)}
              >
                {calendarReminder ? (
                  <MdNotificationsActive className="icon-ringing" />
                ) : (
                  <MdNotifications />
                )}
              </div>
            </div>
          </div>

          <div className="calendar-body">
            <Calendar
              value={date}
              onChange={(value) =>
                value instanceof Date && handleDateClick(value)
              }
              locale="en-US"
              tileClassName={({ date }) => {
                const hasCardReminder = events.some(
                  (event, idx) =>
                    new Date(event.date).toDateString() ===
                      date.toDateString() && reminders.includes(idx)
                );

                const hasCalendarReminder =
                  calendarReminder &&
                  events.some(
                    (event) =>
                      new Date(event.date).toDateString() ===
                      date.toDateString()
                  );

                return hasCardReminder || hasCalendarReminder
                  ? "react-calendar__tile--reminder"
                  : "";
              }}
              tileContent={({ date }) => {
                const hasEvent = events.some(
                  (event) =>
                    new Date(event.date).toDateString() === date.toDateString()
                );
                return hasEvent ? (
                  <div
                    style={{
                      marginTop: "2px",
                      width: "4px",
                      height: "5px",
                      borderRadius: "50%",
                      background: "#AF7928",
                      marginInline: "auto",
                    }}
                  />
                ) : null;
              }}
            />
          </div>

          {selectedEvent && (
            <div className="calendar-event-details">
              <div className="calendar-event-title">{selectedEvent.title}</div>
              <div className="calendar-event-divider"></div>
              <div className="calendar-event-location">
                <svg
                  className="location-icon"
                  width="12"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                </svg>
                <span>{selectedEvent.location}</span>
              </div>
              <div className="calendar-event-description">
                {selectedEvent.details}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
