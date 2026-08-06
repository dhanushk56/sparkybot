"use client";

import { useState, useEffect } from "react";

// Helper to pad number with leading zeros
const pad = (num, length = 2) => String(num).padStart(length, "0");

// Single digit with flip animation
function FlipDigit({ digit, nextDigit, isActive }) {
  return (
    <div className="flip-digit" data-active={isActive}>
      <div className="digit-top">{digit}</div>
      <div className="digit-bottom">{digit}</div>
      <div className="digit-flip">
        <div className="digit-top">{digit}</div>
        <div className="digit-bottom">{nextDigit}</div>
      </div>
    </div>
  );
}

export default function UptimeCounter() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [startTimestamp, setStartTimestamp] = useState(null);

  // Fetch the start time from the bot API (or use a fixed date)
  useEffect(() => {
    // Replace with your actual API endpoint
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        // Assuming the API returns { startTime: timestamp } or { uptime: seconds }
        // If uptime is in seconds, we can compute startTime = Date.now() - uptime*1000
        const start = Date.now() - data.uptime * 1000;
        setStartTimestamp(start);
      })
      .catch(() => {
        // Fallback: use a mock start time (e.g., 10 days ago for demo)
        const fallback = Date.now() - 10 * 24 * 60 * 60 * 1000;
        setStartTimestamp(fallback);
      });
  }, []);

  // Update time every second
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

  // Prepare digit arrays
  const daysStr = pad(time.days, 3);
  const hoursStr = pad(time.hours);
  const minutesStr = pad(time.minutes);
  const secondsStr = pad(time.seconds);

  // We'll use the previous digit for the flip effect
  // For simplicity, we'll just show digits without flip (but CSS will handle the flip)
  // We'll use the current digits and assume nextDigit is the same (we'll animate only on change)
  // We'll store previous digits in state to animate.

  const [prevDigits, setPrevDigits] = useState({
    days: "000",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  // When time changes, update prev and trigger flip
  useEffect(() => {
    const newDigits = {
      days: daysStr,
      hours: hoursStr,
      minutes: minutesStr,
      seconds: secondsStr,
    };
    setPrevDigits(newDigits);
  }, [daysStr, hoursStr, minutesStr, secondsStr]);

  // We'll implement a simple render with flip effect using CSS transition
  // For each digit, we'll show the current digit and use CSS to flip

  return (
    <div className="uptime-counter">
      <div className="clock-group">
        <span className="clock-label">DAYS</span>
        <div className="clock-digits">
          {daysStr.split("").map((digit, i) => (
            <FlipDigit key={`d-${i}`} digit={digit} nextDigit={digit} isActive={true} />
          ))}
        </div>
      </div>
      <div className="clock-group">
        <span className="clock-label">HOURS</span>
        <div className="clock-digits">
          {hoursStr.split("").map((digit, i) => (
            <FlipDigit key={`h-${i}`} digit={digit} nextDigit={digit} isActive={true} />
          ))}
        </div>
      </div>
      <div className="clock-group">
        <span className="clock-label">MINUTES</span>
        <div className="clock-digits">
          {minutesStr.split("").map((digit, i) => (
            <FlipDigit key={`m-${i}`} digit={digit} nextDigit={digit} isActive={true} />
          ))}
        </div>
      </div>
      <div className="clock-group">
        <span className="clock-label">SECONDS</span>
        <div className="clock-digits">
          {secondsStr.split("").map((digit, i) => (
            <FlipDigit key={`s-${i}`} digit={digit} nextDigit={digit} isActive={true} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .uptime-counter {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          align-items: center;
          padding: 1rem 0;
          flex-wrap: wrap;
        }
        .clock-group {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .clock-label {
          font-size: 0.7rem;
          color: #808098;
          text-transform: uppercase;
          letter-spacing: 0.1rem;
          margin-bottom: 0.25rem;
        }
        .clock-digits {
          display: flex;
          gap: 0.2rem;
        }
        .flip-digit {
          position: relative;
          width: 2rem;
          height: 3rem;
          perspective: 300px;
          display: inline-block;
        }
        .flip-digit > div {
          position: absolute;
          left: 0;
          right: 0;
          height: 50%;
          overflow: hidden;
          background: #1a1a2e;
          border-radius: 4px;
          font-size: 2rem;
          font-weight: 600;
          color: #e8e0d8;
          text-align: center;
          line-height: 3rem;
          font-variant-numeric: tabular-nums;
        }
        .flip-digit .digit-top {
          top: 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          border-radius: 4px 4px 0 0;
          background: #1a1a2e;
          line-height: 3rem;
        }
        .flip-digit .digit-bottom {
          bottom: 0;
          border-radius: 0 0 4px 4px;
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
        /* Flip animation – we'll trigger it on digit change by adding a class */
        .flip-digit .digit-flip {
          display: none;
        }
        /* For simplicity we'll use a CSS animation on the digit when it changes */
        /* In a real implementation you'd have a more complex flip, but we'll just do a quick slide */
        .flip-digit.flipping .digit-top {
          animation: flipTop 0.4s ease-in-out;
        }
        .flip-digit.flipping .digit-bottom {
          animation: flipBottom 0.4s ease-in-out;
        }
        @keyframes flipTop {
          0% { transform: rotateX(0deg); }
          50% { transform: rotateX(-90deg); }
          100% { transform: rotateX(0deg); }
        }
        @keyframes flipBottom {
          0% { transform: rotateX(0deg); }
          50% { transform: rotateX(90deg); }
          100% { transform: rotateX(0deg); }
        }
        /* Fallback: just a subtle scale */
        .flip-digit.flipping {
          animation: pulse 0.4s ease;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}