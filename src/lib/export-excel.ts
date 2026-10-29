import type { EnquiryRow } from "./enquiry.functions";
import { statusLabels, roleLabels, type EnquiryRole } from "./enquiry";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Neutralizes spreadsheet formula trigger characters (=, +, -, @, \t, \r)
 * to prevent Formula Injection (CWE-1236) when opened in Excel or Calc.
 */
export function sanitizeSpreadsheetValue(val: string | null | undefined): string {
  if (!val) return "";
  if (/^[=+\-@\t\r]/.test(val)) {
    return "'" + val;
  }
  return val;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function getRoleDisplay(role: string | null | undefined): string {
  if (!role) return "Student";
  const r = role.toLowerCase() as EnquiryRole;
  return roleLabels[r] ?? role.charAt(0).toUpperCase() + role.slice(1);
}

/**
 * Generates and downloads a rich, formatted Excel spreadsheet (.xls / Excel XML)
 * containing student and partner enquiries with role-specific fields, consent, and remarks.
 */
export function exportStudentsToExcel(rows: EnquiryRow[], customFilename?: string): void {
  const dateStr = new Date().toISOString().split("T")[0];
  const filename = customFilename || `EduArc_Enquiries_${dateStr}.xls`;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>EduArc Enquiries &amp; Leads</Title>
  <Subject>Role-Based Counselling Inquiries</Subject>
  <Author>EduArc Reception Desk</Author>
  <Created>${new Date().toISOString()}</Created>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1E293B"/>
   <Interior/>
  </Style>
  <Style ss:ID="TitleStyle">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="14" ss:Bold="1" ss:Color="#142744"/>
  </Style>
  <Style ss:ID="SubtitleStyle">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Italic="1" ss:Color="#64748B"/>
  </Style>
  <Style ss:ID="HeaderStyle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#142744" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="CellLeft">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F1F5F9"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F1F5F9"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F1F5F9"/>
   </Borders>
  </Style>
  <Style ss:ID="CellCenter">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F1F5F9"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F1F5F9"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F1F5F9"/>
   </Borders>
  </Style>
  <Style ss:ID="StatusDone">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#15803D"/>
   <Interior ss:Color="#DCFCE7" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BBF7D0"/>
   </Borders>
  </Style>
  <Style ss:ID="StatusFollowUp">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#B45309"/>
   <Interior ss:Color="#FEF3C7" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FDE68A"/>
   </Borders>
  </Style>
  <Style ss:ID="StatusResolved">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#0369A1"/>
   <Interior ss:Color="#E0F2FE" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BAE6FD"/>
   </Borders>
  </Style>
  <Style ss:ID="StatusNew">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#6B7280"/>
   <Interior ss:Color="#F3F4F6" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
  </Style>
 </Styles>
 <Worksheet ss:Name="Enquiries">
  <Table ss:ExpandedColumnCount="17" x:FullColumns="1" x:FullRows="1" ss:DefaultRowHeight="20">
   <Column ss:AutoFitWidth="0" ss:Width="45"/>
   <Column ss:AutoFitWidth="0" ss:Width="140"/>
   <Column ss:AutoFitWidth="0" ss:Width="110"/>
   <Column ss:AutoFitWidth="0" ss:Width="105"/>
   <Column ss:AutoFitWidth="0" ss:Width="105"/>
   <Column ss:AutoFitWidth="0" ss:Width="160"/>
   <Column ss:AutoFitWidth="0" ss:Width="110"/>
   <Column ss:AutoFitWidth="0" ss:Width="110"/>
   <Column ss:AutoFitWidth="0" ss:Width="160"/>
   <Column ss:AutoFitWidth="0" ss:Width="120"/>
   <Column ss:AutoFitWidth="0" ss:Width="130"/>
   <Column ss:AutoFitWidth="0" ss:Width="200"/>
   <Column ss:AutoFitWidth="0" ss:Width="120"/>
   <Column ss:AutoFitWidth="0" ss:Width="110"/>
   <Column ss:AutoFitWidth="0" ss:Width="110"/>
   <Column ss:AutoFitWidth="0" ss:Width="130"/>
   <Column ss:AutoFitWidth="0" ss:Width="130"/>

   <!-- Report Title Row -->
   <Row ss:Height="26">
    <Cell ss:MergeAcross="16" ss:StyleID="TitleStyle">
     <Data ss:Type="String">EduArc — Role-Based Counselling &amp; Partnership Enquiries</Data>
    </Cell>
   </Row>

   <!-- Export Meta Row -->
   <Row ss:Height="18">
    <Cell ss:MergeAcross="16" ss:StyleID="SubtitleStyle">
     <Data ss:Type="String">Exported on: ${new Date().toLocaleString("en-IN")} | Total Records: ${rows.length}</Data>
    </Cell>
   </Row>

   <!-- Empty spacer row -->
   <Row ss:Height="8"/>

   <!-- Table Headers -->
   <Row ss:Height="25">
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Sl. No.</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Full Name</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Role</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Phone</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">WhatsApp</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Email</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Education Level</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Child Name</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Institution Name</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Designation</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Mentor Expertise</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Remarks</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Privacy Consent</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Marketing Consent</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Status</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Submitted At</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Status Updated</Data></Cell>
   </Row>`;

  rows.forEach((row, idx) => {
    let statusStyle = "StatusNew";
    let statusText = "New";
    if (row.status === "contacted" || row.status === "done") {
      statusStyle = "StatusDone";
      statusText = "Contacted";
    } else if (row.status === "follow_up" || row.status === "contact_again") {
      statusStyle = "StatusFollowUp";
      statusText = "Follow-up Required";
    } else if (row.status === "resolved") {
      statusStyle = "StatusResolved";
      statusText = "Resolved";
    } else if (row.status === "not_available") {
      statusStyle = "StatusNew";
      statusText = "Not Available";
    }

    xml += `
   <Row ss:Height="22">
    <Cell ss:StyleID="CellCenter"><Data ss:Type="Number">${idx + 1}</Data></Cell>
    <Cell ss:StyleID="CellLeft"><Data ss:Type="String">${escapeXml(sanitizeSpreadsheetValue(row.full_name))}</Data></Cell>
    <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${escapeXml(getRoleDisplay(row.role))}</Data></Cell>
    <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${escapeXml(sanitizeSpreadsheetValue(row.phone))}</Data></Cell>
    <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${escapeXml(sanitizeSpreadsheetValue(row.whatsapp))}</Data></Cell>
    <Cell ss:StyleID="CellLeft"><Data ss:Type="String">${escapeXml(sanitizeSpreadsheetValue(row.email))}</Data></Cell>
    <Cell ss:StyleID="CellLeft"><Data ss:Type="String">${escapeXml(sanitizeSpreadsheetValue(row.education))}</Data></Cell>
    <Cell ss:StyleID="CellLeft"><Data ss:Type="String">${escapeXml(sanitizeSpreadsheetValue(row.child_name))}</Data></Cell>
    <Cell ss:StyleID="CellLeft"><Data ss:Type="String">${escapeXml(sanitizeSpreadsheetValue(row.college))}</Data></Cell>
    <Cell ss:StyleID="CellLeft"><Data ss:Type="String">${escapeXml(sanitizeSpreadsheetValue(row.designation))}</Data></Cell>
    <Cell ss:StyleID="CellLeft"><Data ss:Type="String">${escapeXml(sanitizeSpreadsheetValue(row.mentor_expertise))}</Data></Cell>
    <Cell ss:StyleID="CellLeft"><Data ss:Type="String">${escapeXml(sanitizeSpreadsheetValue(row.remarks))}</Data></Cell>
    <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${escapeXml(row.consent_given ? `Yes (${row.consent_version || "2026.1"})` : "—")}</Data></Cell>
    <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${escapeXml(row.marketing_consent ? "Opted In" : "No")}</Data></Cell>
    <Cell ss:StyleID="${statusStyle}"><Data ss:Type="String">${escapeXml(statusText)}</Data></Cell>
    <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${escapeXml(formatDate(row.created_at))}</Data></Cell>
    <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${escapeXml(formatDate(row.status_updated_at))}</Data></Cell>
   </Row>`;
  });

  xml += `
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8" });
  triggerDownload(blob, filename);
}

/**
 * Generates and downloads a clean CSV file with UTF-8 BOM so Excel opens it with perfect encoding.
 */
export function exportStudentsToCsv(rows: EnquiryRow[], customFilename?: string): void {
  const dateStr = new Date().toISOString().split("T")[0];
  const filename = customFilename || `EduArc_Enquiries_${dateStr}.csv`;

  const headers = [
    "Sl No",
    "Full Name",
    "Role",
    "Phone",
    "WhatsApp",
    "Email",
    "Education Level",
    "Child Name",
    "Institution Name",
    "Designation",
    "Mentor Expertise",
    "Remarks",
    "Privacy Consent",
    "Marketing Consent",
    "Status",
    "Submitted At",
    "Status Updated",
  ];

  /**
   * Escapes quotes and neutralizes spreadsheet formula injection (CWE-1236)
   * for CSV export by prefixing formula indicators (=, +, -, @, \t, \r) with a single quote (').
   */
  const escapeCsv = (val: string | null | undefined): string => {
    if (!val) return '""';
    let s = val.replace(/"/g, '""');
    if (/^[=+\-@\t\r]/.test(s)) {
      s = "'" + s;
    }
    return `"${s}"`;
  };

  const csvRows = rows.map((r, i) => [
    i + 1,
    escapeCsv(r.full_name),
    escapeCsv(getRoleDisplay(r.role)),
    escapeCsv(r.phone),
    escapeCsv(r.whatsapp),
    escapeCsv(r.email),
    escapeCsv(r.education),
    escapeCsv(r.child_name),
    escapeCsv(r.college),
    escapeCsv(r.designation),
    escapeCsv(r.mentor_expertise),
    escapeCsv(r.remarks),
    escapeCsv(r.consent_given ? `Yes (${r.consent_version || "2026.1"})` : "—"),
    escapeCsv(r.marketing_consent ? "Opted In" : "No"),
    escapeCsv(r.status ? (statusLabels[r.status] ?? r.status) : "New"),
    escapeCsv(formatDate(r.created_at)),
    escapeCsv(formatDate(r.status_updated_at)),
  ]);

  const csvContent =
    "\uFEFF" + [headers.join(","), ...csvRows.map((row) => row.join(","))].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  triggerDownload(blob, filename);
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
