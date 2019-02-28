import * as xl from 'excel4node';

interface UserContact {
  id: number;
  name: string;
  phone: string;
  email: string;
}

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

export default function generateBufferExcel(contacts: UserContact[]) {
  const ws = wb.addWorksheet('Report', options);
  const titles = Object.keys(contacts[0]);

  titles.forEach((title, i) => {
    const capitalized = title[0].toUpperCase() + title.slice(1);
    ws.cell(1, i + 1)
      .string(capitalized)
      .style(style);
  });

  contacts.forEach((item, i) => {
    const values = Object.values(item);
    values.forEach((value, j) => {
      ws.cell(i + 2, j + 1)
        .string(String(value))
        .style(style);
    });
  });

  return wb.writeToBuffer();
}
