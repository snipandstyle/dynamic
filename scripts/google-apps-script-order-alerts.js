/**
 * =========================================================================
 * SNIP & STYLE PET RESORT & SPA - GOOGLE APPS SCRIPT ORDER ALERT WEBHOOK
 * =========================================================================
 * 
 * HOW TO DEPLOY IN 2 MINUTES:
 * 1. Open https://script.google.com/ or create a new Google Sheet and click:
 *    Extensions > Apps Script
 * 2. Delete any existing code, paste this entire file, and click Save (disk icon).
 * 3. Change RECIPIENT_EMAIL below to your email address (where you want alerts).
 * 4. Click "Deploy" (top right) > "New deployment".
 * 5. Select type: "Web app".
 * 6. Set Description: "Snip & Style Order Alerts".
 * 7. Set "Execute as": "Me".
 * 8. Set "Who has access": "Anyone" (IMPORTANT).
 * 9. Click "Deploy" and authorize permissions.
 * 10. Copy the Web App URL (starts with https://script.google.com/macros/s/...)
 * 11. Add it to your .env file as:
 *     GOOGLE_SCRIPT_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
 * =========================================================================
 */

// CONFIGURE YOUR NOTIFICATION RECIPIENT EMAIL HERE:
const RECIPIENT_EMAIL = "narasimhan10042006@gmail.com"; // Change to your preferred notification email

/**
 * Handles incoming HTTP POST requests from Snip & Style website
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "No POST body received."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const data = JSON.parse(e.postData.contents);

    // 1. Send Email Notification
    sendOrderEmail(data);

    // 2. Optionally Log to Google Sheet (if script is bound to a Sheet)
    try {
      logToSheet(data);
    } catch (sheetErr) {
      Logger.log("Sheet log skipped or error: " + sheetErr.message);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Order alert email sent successfully.",
      bookingRef: data.bookingRef || "N/A"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log("doPost Error: " + err.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Health check handler for GET requests
 */
function doGet(e) {
  return ContentService.createTextOutput(
    "🟢 Snip & Style Order Alert Webhook is ACTIVE and ready to receive orders."
  );
}

/**
 * Formats and dispatches a rich HTML email to the owner
 */
function sendOrderEmail(d) {
  const ref = d.bookingRef || "SNS-" + Math.floor(100000 + Math.random() * 900000);
  const pet = d.petName || "Companion";
  const parent = d.customerName || "Pet Parent";
  const phone = d.customerPhone || d.phone || "N/A";
  const service = d.serviceType || "Boarding / Grooming";
  const checkIn = d.checkInDate || "Immediate";
  const timeSlot = d.dropOffTime || "Morning";
  const amount = d.totalAmount ? "₹" + Number(d.totalAmount).toLocaleString('en-IN') : "₹0";
  const payStatus = d.paymentStatus === 'paid' ? '✅ PAID ONLINE (Razorpay)' : '⏳ PAY AT STUDIO';
  const payMethod = (d.paymentMethod || 'Online').replace('_', ' ').toUpperCase();
  const notes = d.specialInstructions || d.notes || "None";
  const coupon = d.appliedOfferCode || "None";

  const subject = "🐾 [NEW ORDER] Snip & Style • Ref: " + ref + " (" + amount + ")";

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF8F5; border-radius: 16px; overflow: hidden; border: 1px solid #E2DCD5;">
      
      <!-- Header -->
      <div style="background-color: #0B1A14; padding: 24px; text-align: center; border-bottom: 3px solid #D99B43;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">
          Snip & Style
        </h1>
        <p style="color: #D99B43; margin: 4px 0 0 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">
          New Booking Notification
        </p>
      </div>

      <!-- Main Body -->
      <div style="padding: 24px; color: #0C1117;">
        
        <div style="background-color: #ffffff; border-radius: 12px; padding: 18px; border: 1px solid #EAE5DE; margin-bottom: 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #f0ede8; pb-2;">
            <span style="font-family: monospace; font-size: 14px; font-weight: 800; color: #0B1A14;">
              REF: ${ref}
            </span>
            <span style="font-size: 11px; font-weight: 800; background-color: #E9F1ED; color: #142E24; padding: 4px 10px; rounded-full;">
              ${payStatus}
            </span>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 6px 0; color: #666; width: 35%;"><strong>Companion:</strong></td>
              <td style="padding: 6px 0; color: #0B1A14; font-weight: 700;">🐾 ${pet} (${d.petBreed || 'Standard'}, ${d.petWeightKg || '15'} kg)</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #666;"><strong>Pet Parent:</strong></td>
              <td style="padding: 6px 0; color: #0B1A14; font-weight: 700;">${parent}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #666;"><strong>Parent Mobile:</strong></td>
              <td style="padding: 6px 0;">
                <a href="tel:${phone}" style="color: #0B1A14; font-weight: 800; text-decoration: underline;">
                  📞 ${phone}
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #666;"><strong>Service Booked:</strong></td>
              <td style="padding: 6px 0; color: #0B1A14; font-weight: 700;">${service}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #666;"><strong>Check-In Date:</strong></td>
              <td style="padding: 6px 0; color: #0B1A14; font-weight: 700;">📅 ${checkIn} (${timeSlot})</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #666;"><strong>Total Amount:</strong></td>
              <td style="padding: 6px 0; color: #0B1A14; font-size: 16px; font-weight: 900;">${amount}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #666;"><strong>Payment Mode:</strong></td>
              <td style="padding: 6px 0; color: #444;">${payMethod}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #666;"><strong>Coupon Code:</strong></td>
              <td style="padding: 6px 0; color: #142E24; font-weight: 700;">${coupon}</td>
            </tr>
          </table>
        </div>

        <!-- Special Notes -->
        ${notes && notes !== 'None' ? `
          <div style="background-color: #FFF9E6; border: 1px solid #FFE082; padding: 12px; border-radius: 10px; font-size: 12px; color: #7A5800; margin-bottom: 18px;">
            <strong>Parent Notes:</strong> ${notes}
          </div>
        ` : ''}

        <!-- Call to Action -->
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://snipandstyle.pet/admin" style="background-color: #0B1A14; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
            Open Admin Management Console &rarr;
          </a>
        </div>

      </div>

      <!-- Footer -->
      <div style="background-color: #F2EDE4; padding: 16px; text-align: center; font-size: 11px; color: #777; border-top: 1px solid #E2DCD5;">
        Snip & Style Pet Boarding & Grooming Studio • Kanakapura Highway (NH 948), Bengaluru<br>
        Direct Studio Line: 9739887770
      </div>

    </div>
  `;

  MailApp.sendEmail({
    to: RECIPIENT_EMAIL,
    subject: subject,
    htmlBody: htmlBody
  });
}

/**
 * Helper to log order row into the attached spreadsheet
 */
function logToSheet(d) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getLastRow() === 0) {
    // Add header row if empty
    sheet.appendRow([
      "Timestamp", "Booking Ref", "Parent Name", "Phone", "Pet Name",
      "Breed", "Service", "Check-in Date", "Time Slot", "Total Amount (₹)", "Payment Status", "Notes"
    ]);
  }

  sheet.appendRow([
    new Date(),
    d.bookingRef || "",
    d.customerName || "",
    d.customerPhone || d.phone || "",
    d.petName || "",
    d.petBreed || "",
    d.serviceType || "",
    d.checkInDate || "",
    d.dropOffTime || "",
    d.totalAmount || "",
    d.paymentStatus || "",
    d.specialInstructions || ""
  ]);
}
