import type { EnquiryRow } from "./enquiry.functions";
import { statusLabels } from "./enquiry";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
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

/**
 * Generates and downloads a rich, formatted Excel spreadsheet (.xls / Excel XML)
 * containing student leads. Fully compatible with Microsoft Excel, Google Sheets,
 * and Apple Numbers without requiring heavy external dependencies.
 */
export function exportStudentsToExcel(
  rows: EnquiryRow[],
  customFilename?: string,
): void {
  const dateStr = new Date().toISOString().split("T")[0];
  const filename = customFilename || `EduArc_Student_Enquiries_${dateStr}.xls`;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>EduArc Student Enquiries</Title>
  <Subject>Counselling &amp; Leads</Subject>
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
   <Font ss:FontName="Segoe UI" ss:Size="14" ss:Bold="1" ss:Color="#033461"/>
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
   <Interior ss:Color="#033461" ss:Pattern="Solid"/>
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
  <Style ss:ID="StatusContactAgain">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#B45309"/>
   <Interior ss:Color="#FEF3C7" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FDE68A"/>
   </Borders>
  </Style>
  <Style ss:ID="StatusNotAvailable">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#64748B"/>
   <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="StatusNew">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#0369A1"/>
   <Interior ss:Color="#E0F2FE" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BAE6FD"/>
   </Borders>
  </Style>
 </Styles>
 <Worksheet ss:Name="Students Enquiries">
  <Table ss:ExpandedColumnCount="10" x:FullColumns="1" x:FullRows="1" ss:DefaultRowHeight="20">
   <Column ss:AutoFitWidth="0" ss:Width="45"/>
   <Column ss:AutoFitWidth="0" ss:Width="140"/>
   <Column ss:AutoFitWidth="0" ss:Width="105"/>
   <Column ss:AutoFitWidth="0" ss:Width="105"/>
   <Column ss:AutoFitWidth="0" ss:Width="160"/>
   <Column ss:AutoFitWidth="0" ss:Width="160"/>
   <Column ss:AutoFitWidth="0" ss:Width="110"/>
   <Column ss:AutoFitWidth="0" ss:Width="100"/>
   <Column ss:AutoFitWidth="0" ss:Width="130"/>
   <Column ss:AutoFitWidth="0" ss:Width="130"/>

   <!-- Report Title Row -->
   <Row ss:Height="26">
    <Cell ss:MergeAcross="9" ss:StyleID="TitleStyle">
     <Data ss:Type="String">EduArc — Student Partnership &amp; Counselling Inquiries</Data>
    </Cell>
   </Row>

   <!-- Export Meta Row -->
   <Row ss:Height="18">
    <Cell ss:MergeAcross="9" ss:StyleID="SubtitleStyle">
     <Data ss:Type="String">Exported on: ${new Date().toLocaleString("en-IN")} | Total Records: ${rows.length}</Data>
    </Cell>
   </Row>

   <!-- Empty spacer row -->
   <Row ss:Height="8"/>

   <!-- Table Headers -->
   <Row ss:Height="25">
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Sl. No.</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Full Name</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Phone</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">WhatsApp</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Email</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">College / Institution</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Education</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Status</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Submitted At</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Status Updated</Data></Cell>
   </Row>`;

  rows.forEach((row, idx) => {
    let statusStyle = "StatusNew";
    let statusText = "New";
    if (row.status === "done") {
      statusStyle = "StatusDone";
      statusText = statusLabels.done;
    } else if (row.status === "contact_again") {
      statusStyle = "StatusContactAgain";
      statusText = statusLabels.contact_again;
    } else if (row.status === "not_available") {
      statusStyle = "StatusNotAvailable";
      statusText = statusLabels.not_available;
    }

    xml += `
   <Row ss:Height="22">
    <Cell ss:StyleID="CellCenter"><Data ss:Type="Number">${idx + 1}</Data></Cell>
    <Cell ss:StyleID="CellLeft"><Data ss:Type="String">${escapeXml(row.full_name || "")}</Data></Cell>
    <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${escapeXml(row.phone || "")}</Data></Cell>
    <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${escapeXml(row.whatsapp || "")}</Data></Cell>
    <Cell ss:StyleID="CellLeft"><Data ss:Type="String">${escapeXml(row.email || "")}</Data></Cell>
    <Cell ss:StyleID="CellLeft"><Data ss:Type="String">${escapeXml(row.college || "")}</Data></Cell>
    <Cell ss:StyleID="CellLeft"><Data ss:Type="String">${escapeXml(row.education || "")}</Data></Cell>
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
export function exportStudentsToCsv(
  rows: EnquiryRow[],
  customFilename?: string,
): void {
  const dateStr = new Date().toISOString().split("T")[0];
  const filename = customFilename || `EduArc_Student_Enquiries_${dateStr}.csv`;

  const headers = [
    "Sl No",
    "Full Name",
    "Phone",
    "WhatsApp",
    "Email",
    "College / Institution",
    "Education",
    "Status",
    "Submitted At",
    "Status Updated At",
  ];

  const escapeCsv = (val: string | null | undefined) => {
    if (val === null || val === undefined) return '""';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };

  const csvRows = [
    headers.join(","),
    ...rows.map((r, i) => {
      const statusLabel = r.status ? statusLabels[r.status] : "New";
      return [
        i + 1,
        escapeCsv(r.full_name),
        escapeCsv(r.phone),
        escapeCsv(r.whatsapp),
        escapeCsv(r.email),
        escapeCsv(r.college),
        escapeCsv(r.education),
        escapeCsv(statusLabel),
        escapeCsv(formatDate(r.created_at)),
        escapeCsv(formatDate(r.status_updated_at)),
      ].join(",");
    }),
  ];

  // UTF-8 BOM (\uFEFF) ensures Excel decodes special characters correctly
  const csvContent = "\uFEFF" + csvRows.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, filename);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
