"use client";

import { useState, useEffect } from "react";

const pad = (num, length = 2) => String(num).padStart(length, "0");

function FlipDigit({ digit }) {
  return (
    <div className="flip-digit">
      <div className="digit-top">{digit}</div>
      <div className="digit-bottom">{digit}</div>
    </div>
  );
}

export default function UptimeCounter() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [startTimestamp, setStartTimestamp] = useState(null);

  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        const start = Date.now() - (data.uptime_seconds ?? 0) * 1000;
        setStartTimestamp(start);
      })
      .catch(() => {
        const fallback = Date.now() - 10 * 24 * 60 * 60 * 1000;
        setStartTimestamp(fallback);
      });
  }, []);

  useEffect(() => {
    if (!startTimestamp) return;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimestamp;
      const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
      const hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
      setTime({ days, hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(interval);
  }, [startTimestamp]);

  const daysStr = pad(time.days, 3);
  const hoursStr = pad(time.hours);
  const minutesStr = pad(time.minutes);
  const secondsStr = pad(time.seconds);

  return (
    // ↓ inline style guarantees one row before styled-jsx loads
    <div
      className="uptime-counter"
      style={{ display: "flex", flexWrap: "nowrap", overflowX: "auto", gap: "0.8rem", justifyContent: "center", alignItems: "center" }}
    >
      <div className="clock-group">
        <span className="clock-label">DAYS</span>
        <div className="clock-digits">
          {daysStr.split("").map((d, i) => <FlipDigit key={`d-${i}`} digit={d} />)}
        </div>
      </div>
      <div className="clock-group">
        <span className="clock-label">HOURS</span>
        <div className="clock-digits">
          {hoursStr.split("").map((d, i) => <FlipDigit key={`h-${i}`} digit={d} />)}
        </div>
      </div>
      <div className="clock-group">
        <span className="clock-label">MINUTES</span>
        <div className="clock-digits">
          {minutesStr.split("").map((d, i) => <FlipDigit key={`m-${i}`} digit={d} />)}
        </div>
      </div>
      <div className="clock-group">
        <span className="clock-label">SECONDS</span>
        <div className="clock-digits">
          {secondsStr.split("").map((d, i) => <FlipDigit key={`s-${i}`} digit={d} />)}
        </div>
      </div>

      <style jsx>{`
        .uptime-counter {
          padding: 0.25rem 0;
          width: 100%;
        }
        .clock-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
        }
        .clock-label {
          font-size: 0.6rem;
          color: #808098;
          text-transform: uppercase;
          letter-spacing: 0.08rem;
          margin-bottom: 0.15rem;
        }
        .clock-digits {
          display: flex;
          gap: 0.12rem;
        }
        .flip-digit {
          position: relative;
          width: 1.6rem;
          height: 2.4rem;
          perspective: 300px;
          display: inline-block;
          flex-shrink: 0;
        }
        .flip-digit > div {
          position: absolute;
          left: 0;
          right: 0;
          height: 50%;
          overflow: hidden;
          background: #1a1a2e;
          border-radius: 3px;
          font-size: 1.5rem;
          font-weight: 600;
          color: #e8e0d8;
          text-align: center;
          line-height: 2.4rem;
          font-variant-numeric: tabular-nums;
        }
        .flip-digit .digit-top {
          top: 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          border-radius: 3px 3px 0 0;
          background: #1a1a2e;
          line-height: 2.4rem;
        }
        .flip-digit .digit-bottom {
          bottom: 0;
          border-radius: 0 0 3px 3px;
          background: #1e1f2e;
          line-height: 0;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .flip-digit .digit-bottom::before {
          content: "";
          position: absolute;
          top: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(0,0,0,0.4);
        }
        @media (max-width: 600px) {
          .clock-label { font-size: 0.5rem; }
          .flip-digit { width: 1.1rem; height: 1.7rem; }
          .flip-digit > div { font-size: 1rem; line-height: 1.7rem; }
        }
        @media (max-width: 420px) {
          .flip-digit { width: 0.9rem; height: 1.4rem; }
          .flip-digit > div { font-size: 0.8rem; line-height: 1.4rem; }
          .clock-label { font-size: 0.4rem; }
        }
      `}</style>
    </div>
  );
      }
