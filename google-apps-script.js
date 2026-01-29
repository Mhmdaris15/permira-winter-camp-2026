/**
 * Google Apps Script for Winter Camp Registration
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire script
 * 4. Save the project (Ctrl+S or Cmd+S)
 * 5. Click "Deploy" > "New deployment"
 * 6. Select type: "Web app"
 * 7. Set "Execute as": "Me"
 * 8. Set "Who has access": "Anyone"
 * 9. Click "Deploy" and authorize the app
 * 10. Copy the Web App URL and paste it in your React app's
 *     RegistrationFormNew.jsx file (replace YOUR_GOOGLE_APPS_SCRIPT_URL)
 */

// Configuration
const SHEET_NAME = 'Registrations';
const HEADERS = [
  'Timestamp',
  'Full Name',
  'Email',
  'Phone Number',
  'Citizenship',
  'University/Institution',
  'Gender',
  'Age',
  'Instagram',
  'Twitter',
  'LinkedIn',
  'How Did You Hear About Us',
  'Dietary Restrictions',
  'Allergies',
  'Willing to Participate',
  'Reason for Joining'
];

/**
 * Handles GET requests (for testing)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Winter Camp Registration API is running!'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handles POST requests from the registration form
 */
function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    const data = JSON.parse(e.postData.contents);

    // Add row to sheet
    const row = [
      data.timestamp || new Date().toISOString(),
      data.fullName || '',
      data.email || '',
      data.phoneNumber || '',
      data.citizenship || '',
      data.university || '',
      data.gender || '',
      data.age || '',
      data.instagram || '-',
      data.twitter || '-',
      data.linkedin || '-',
      data.hearAboutUs || '',
      data.dietaryRestrictions || '-',
      data.allergies || '-',
      data.willingToParticipate || '',
      data.reasonForJoining || ''
    ];

    sheet.appendRow(row);

    // Optional: Send confirmation email
    // sendConfirmationEmail(data);

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Registration submitted successfully!'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Gets existing sheet or creates a new one with headers
 */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Add headers
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    // Format headers
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setBackground('#1a365d')
      .setFontColor('#ffffff')
      .setFontWeight('bold');
    // Freeze header row
    sheet.setFrozenRows(1);
    // Auto-resize columns
    for (let i = 1; i <= HEADERS.length; i++) {
      sheet.autoResizeColumn(i);
    }
  }

  return sheet;
}

/**
 * Optional: Send confirmation email to registrant
 */
function sendConfirmationEmail(data) {
  if (!data.email) return;

  const subject = '❄️ Winter Camp 2026 - Registration Confirmed!';
  const body = `
Dear ${data.fullName},

Thank you for registering for Winter Camp 2026! 🏔️

We have received your registration with the following details:

📅 Event: February 12-14, 2026
📍 Location: Центр «Молодёжный», Saint Petersburg, Russia

Your Registration Details:
- Name: ${data.fullName}
- Email: ${data.email}
- Phone: ${data.phoneNumber}
- University: ${data.university}

We will contact you soon with more information about the event.

Get ready for an amazing winter adventure!

Best regards,
Winter Camp 2026 Team

⛷️🏂❄️
  `;

  try {
    MailApp.sendEmail(data.email, subject, body);
  } catch (e) {
    console.log('Failed to send email: ' + e.toString());
  }
}

/**
 * Test function - run this to verify setup
 */
function testSetup() {
  const sheet = getOrCreateSheet();
  Logger.log('Sheet setup complete: ' + sheet.getName());
  Logger.log('Headers: ' + HEADERS.join(', '));
}
