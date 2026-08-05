"use client";

import { useState, useEffect, useRef } from "react";

// ---------- Toggle Component ----------
function Toggle({ checked, onChange }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="slider" />
    </label>
  );
}

// ---------- Role Multi-Select Component ----------
function RoleMultiSelect({ value, onChange, placeholder = "Select roles...", roleOptions }) {
  // ... (unchanged – keep your existing implementation)
  // I'll include the full code below for completeness.
}

// ---------- Channel Multi-Select Component ----------
function ChannelMultiSelect({ value, onChange, placeholder = "Select channels...", channelOptions }) {
  // ... (unchanged)
}

// ---------- Category Multi-Select Component ----------
function CategoryMultiSelect({ value, onChange, placeholder = "Select categories...", categoryOptions }) {
  // ... (unchanged)
}

// ---------- ApplicationsManager (unchanged) ----------
function ApplicationsManager({ guildId, apps, onAppsChange, roleOptions, channelOptions }) {
  // ... (keep your existing code)
}

// ---------- Main SettingsForm ----------
export default function SettingsForm({ guildId, initial }) {
  // ... (state and functions unchanged up to render)

  // I'll only change the return block to use inline styles for the layout.

  return (
    // Outer container: flex, wrap, full width
    <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", flexWrap: "wrap", width: "100%", position: "relative" }}>
      {/* Sidebar – fixed width, sticky */}
      <div
        style={{
          flex: "0 0 220px",
          position: "sticky",
          top: "90px",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          background: "rgba(255,255,255,.02)",
          border: "1px solid rgba(255,255,255,.06)",
          borderRadius: "14px",
          padding: "0.6rem",
          maxHeight: "calc(100vh - 120px)",
          overflowY: "auto",
          minWidth: 0,
          boxSizing: "border-box",
        }}
        className="desktop-sidebar" // keep class for potential CSS, but inline takes precedence
      >
        {navItems.map((item) => (
          <button
            key={item.section}
            className={`dash-sidebar-item ${activeSection === item.section ? "active" : ""}`}
            onClick={() => setActiveSection(item.section)}
            style={{
              textAlign: "left",
              background: "none",
              border: "none",
              color: activeSection === item.section ? "#d4af37" : "#a09890",
              padding: "0.65rem 0.9rem",
              borderRadius: "10px",
              fontSize: "0.88rem",
              fontWeight: activeSection === item.section ? "700" : "400",
              cursor: "pointer",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Content area – flexible */}
      <div style={{ flex: 1, minWidth: 0, width: "100%" }} className="dash-content">
        {/* Mobile header (hidden on desktop via media query – but we can also hide with inline style + media query) */}
        <div
          style={{
            display: "none", // hidden by default
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.75rem 1rem",
            background: "rgba(255,255,255,.02)",
            borderBottom: "1px solid rgba(255,255,255,.06)",
            marginBottom: "1rem",
            borderRadius: "14px",
          }}
          className="mobile-dash-header"
        >
          <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#e8e0d8" }}>Settings</h2>
          <button
            className="mobile-hamburger-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: "none",
              border: "none",
              color: "#e8e0d8",
              fontSize: "1.8rem",
              cursor: "pointer",
              padding: "0.2rem 0.5rem",
            }}
          >
            ☰
          </button>
        </div>

        {/* Slide-out menu (mobile) */}
        {isMobileMenuOpen && (
          <>
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                zIndex: 999,
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div
              ref={menuRef}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "280px",
                height: "100vh",
                background: "#1a1a2e",
                borderRight: "1px solid rgba(255,255,255,.06)",
                padding: "1.5rem 1rem",
                transform: "translateX(0)",
                transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                zIndex: 1000,
                overflowY: "auto",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ margin: 0, color: "#e8e0d8" }}>Settings</h3>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#a09890",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
              {navItems.map((item) => (
                <button
                  key={item.section}
                  className={`dash-sidebar-item ${activeSection === item.section ? "active" : ""}`}
                  onClick={() => {
                    setActiveSection(item.section);
                    setIsMobileMenuOpen(false);
                    if (contentRef.current) contentRef.current.scrollTop = 0;
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    width: "100%",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    color: activeSection === item.section ? "#d4af37" : "#a09890",
                    padding: "0.75rem 0.9rem",
                    borderRadius: "10px",
                    fontSize: "0.95rem",
                    fontWeight: activeSection === item.section ? "700" : "400",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontFamily: "inherit",
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Main content */}
        <div ref={contentRef} style={{ flex: 1, minWidth: 0 }}>
          <div className="dash-card" style={{ padding: "1.5rem" }}>
            {renderContent()}
          </div>

          {/* Save Bar */}
          <div
            className="save-bar"
            style={{
              position: "sticky",
              bottom: "1rem",
              display: "flex",
              justifyContent: "flex-end",
              gap: ".75rem",
              background: "rgba(10,10,20,.85)",
              backdropFilter: "blur(10px)",
              padding: "1rem",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,.06)",
              marginTop: "1.5rem",
            }}
          >
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div
          className="toast"
          style={{
            position: "fixed",
            bottom: "1.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(10,10,20,.95)",
            border: "1px solid rgba(212,175,55,.3)",
            color: "#e8e0d8",
            padding: ".8rem 1.4rem",
            borderRadius: "12px",
            fontSize: ".9rem",
            zIndex: 200,
            animation: "toastIn .3s ease",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
