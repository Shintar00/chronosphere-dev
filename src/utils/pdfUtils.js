import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generatePDF = async (reasoning) => {
  const doc = new jsPDF();
  
  // 日本語フォントを設定
  doc.addFont('https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap', 'Noto Sans JP', 'normal');
  doc.setFont('Noto Sans JP');

  // タイトルを追加
  doc.setFontSize(20);
  doc.text('クロノスフィア：時空を超えた洞察レポート', 14, 15);

  // タイムスタンプを追加
  doc.setFontSize(12);
  doc.text(`タイムスタンプ: ${reasoning.timestamp}`, 14, 25);

  const addSection = (title, content, startY) => {
    doc.setFontSize(14);
    doc.text(title, 14, startY);
    doc.setFontSize(12);
    
    if (Array.isArray(content)) {
      content.forEach((item, index) => {
        doc.text(`- ${item}`, 14, startY + 10 + (index * 7));
      });
      return startY + 10 + (content.length * 7);
    } else if (typeof content === 'object') {
      Object.entries(content).forEach(([key, value], index) => {
        doc.text(`${key}: ${value}`, 14, startY + 10 + (index * 7));
      });
      return startY + 10 + (Object.keys(content).length * 7);
    } else {
      const lines = doc.splitTextToSize(content, 180);
      doc.text(lines, 14, startY + 10);
      return startY + 10 + (lines.length * 7);
    }
  };

  let yPosition = 30;

  yPosition = addSection('最終回答', reasoning.最終回答, yPosition);
  yPosition = addSection('補足事項', reasoning.補足事項, yPosition);
  yPosition = addSection('時間的考察', reasoning.時間的考察, yPosition);
  yPosition = addSection('シナリオ分析', reasoning.シナリオ, yPosition);
  yPosition = addSection('整合性チェック', reasoning.整合性チェック, yPosition);
  yPosition = addSection('多角的考察', reasoning.多角的考察, yPosition);
  yPosition = addSection('究極的自己一致性分析', reasoning.究極的自己一致性分析, yPosition);
  yPosition = addSection('メタ分析', reasoning.メタ分析, yPosition);
  yPosition = addSection('自己修正プロセス', reasoning.自己修正プロセス, yPosition);
  yPosition = addSection('代替解釈', reasoning.代替解釈, yPosition);
  yPosition = addSection('次のステップ', reasoning.次のステップ, yPosition);

  // タイムラインの追加
  if (reasoning.timeline && reasoning.timeline.length > 0) {
    doc.addPage();
    doc.setFontSize(16);
    doc.text('タイムライン', 14, 20);
    doc.setFontSize(12);
    reasoning.timeline.forEach((item, index) => {
      const date = new Date(item.date).toLocaleDateString('ja-JP');
      doc.text(`${date}: ${item.event}`, 14, 30 + (index * 10));
    });
  }

  return doc.output('blob');
};