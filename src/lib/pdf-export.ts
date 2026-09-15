import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportElementToPdf(
  element: HTMLElement,
  filename: string,
  orientation: 'landscape' | 'portrait' = 'landscape'
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2.5, // 2.5x high DPI for crisp print quality
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgProps = pdf.getImageProperties(imgData);
  const imgRatio = imgProps.width / imgProps.height;

  let renderWidth = pdfWidth - 10; // 5mm margin each side
  let renderHeight = renderWidth / imgRatio;

  if (renderHeight > pdfHeight - 10) {
    renderHeight = pdfHeight - 10;
    renderWidth = renderHeight * imgRatio;
  }

  const marginX = (pdfWidth - renderWidth) / 2;
  const marginY = (pdfHeight - renderHeight) / 2;

  pdf.addImage(imgData, 'PNG', marginX, marginY, renderWidth, renderHeight, undefined, 'FAST');
  pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}
