const ExcelJs = require ('exceljs');
const { test, expect } = require('@playwright/test');

async function writeExcelFile(searchtext, replaceText, change, filePath) {

    const workbook = new ExcelJs.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet('Sheet1');
    output = await readExcelFile(worksheet, searchtext);
    const cell = worksheet.getCell(output.row + change.rowchange, output.column + change.columnchange);
    cell.value = replaceText;
    await workbook.xlsx.writeFile(filePath);
}


async function readExcelFile(worksheet, searchText) {
    let output = {row:-1, column:-1};
    worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      if(cell.value === searchText) {
        console.log(`Found ${searchText} at row ${rowNumber}, column ${colNumber}`);
        output.row = rowNumber;
        output.column = colNumber;
      }
    });
  });
  return output;
}

//writeExcelFile('Mango',350,{rowchange: 0, columnchange: 2},'C:/Users/aniket/Downloads/downloaded.xlsx');

test('Excel file should be updated with the new value', async ({page}) => {
  const textSearch = 'Apple';
  const updatedValue = 350;
  await page.goto("https://rahulshettyacademy.com/upload-download-test/");
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download' }).click();
  await downloadPromise;
  writeExcelFile(textSearch,updatedValue,{rowchange: 0, columnchange: 2},'/Users/aniket/Downloads/download.xlsx');
  await page.locator('#fileinput').click();
  await page.locator('#fileinput').setInputFiles('/Users/aniket/Downloads/download.xlsx');
  const textLocator = await page.getByText(textSearch);
  const desiredRow = await page.getByRole('row').filter({ has: textLocator });
  desiredRow.locator('#cell-4-undefined').toContainText('350');
});
