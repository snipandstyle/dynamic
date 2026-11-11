import React from "react";

export default function SuspendedNotice() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#090d16",
        color: "#f1f5f9",
        fontFamily:
          "var(--font-jakarta), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: "24px 16px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "640px",
          backgroundColor: "#111827",
          border: "1px solid rgba(239, 68, 68, 0.35)",
          borderRadius: "16px",
          padding: "40px 32px",
          boxShadow:
            "0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 50px -10px rgba(239, 68, 68, 0.15)",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        {/* Status Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            padding: "6px 14px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#f87171",
            marginBottom: "24px",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#ef4444",
              display: "inline-block",
              boxShadow: "0 0 8px #ef4444",
            }}
          />
          Website Suspended · Non-Payment
        </div>

        {/* Warning Icon */}
        <div
          style={{
            width: "64px",
            height: "64px",
            margin: "0 auto 20px",
            borderRadius: "50%",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ef4444",
            fontSize: "32px",
          }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 800,
            lineHeight: "1.2",
            margin: "0 0 12px",
            color: "#ffffff",
          }}
        >
          Website Temporarily Suspended
        </h1>

        <p
          style={{
            fontSize: "15px",
            lineHeight: "1.6",
            color: "#94a3b8",
            margin: "0 0 24px",
          }}
        >
          This website and all associated booking services have been suspended
          due to <strong>unpaid service invoices and overdue bills</strong>.
        </p>

        {/* Notice Card */}
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(148, 163, 184, 0.15)",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "left",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#cbd5e1",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Notice to Business Owner / Management
          </div>
          <p
            style={{
              fontSize: "14px",
              lineHeight: "1.6",
              color: "#94a3b8",
              margin: 0,
            }}
          >
            Outstanding development, maintenance, and hosting fees for this
            platform have not been settled. To restore full access to the
            website, client booking system, and admin portal, please contact the
            developer / web administrator immediately to clear the pending
            balance.
          </p>
        </div>

        {/* Meta / Details Table */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "28px",
            fontSize: "13px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              padding: "12px 14px",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <div style={{ color: "#64748b", fontSize: "11px", marginBottom: "4px" }}>
              REASON CODE
            </div>
            <div style={{ color: "#f87171", fontWeight: 600 }}>
              BILLING_OVERDUE_SUSPENSION
            </div>
          </div>
          <div
            style={{
              padding: "12px 14px",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <div style={{ color: "#64748b", fontSize: "11px", marginBottom: "4px" }}>
              REINSTATEMENT
            </div>
            <div style={{ color: "#e2e8f0", fontWeight: 600 }}>
              Upon Invoice Payment
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div
          style={{
            fontSize: "12px",
            color: "#64748b",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            paddingTop: "18px",
          }}
        >
          Snip &amp; Style Pet Care Services · Technical &amp; Billing Administration
        </div>
      </div>
    </div>
  );
}
