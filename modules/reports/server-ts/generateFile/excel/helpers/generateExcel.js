import xl from 'excel4node';

const wb = new xl.Workbook();
const options = {
  sheetFormat: {
    defaultColWidth: 25
  }
};
const style = wb.createStyle({
  font: {
    color: '#000000',
    size: 12
  }
});

export default function generateBufferExcel(reports) {
  const ws = wb.addWorksheet('Report', options);
  const titles = Object.keys(reports[0]);

  titles.forEach((title, i) => {
    const capitalized = title[0].toUpperCase() + title.slice(1);
    ws.cell(1, i + 1)
      .string(capitalized)
      .style(style);
  });

  reports.forEach((report, i) => {
    const values = Object.values(report);
    values.forEach((value, j) => {
      ws.cell(i + 2, j + 1)
        .string(String(value))
        .style(style);
    });
  });

  return wb.writeToBuffer();
}
