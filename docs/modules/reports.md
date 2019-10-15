# Apollo Universal Starter Kit &ndash; Reports

The module Reports in Apollo Universal Starter Kit implements the functionality to render, download, and print reports. 
The following image demonstrates the client side of the Reports module:

![reports-module](https://user-images.githubusercontent.com/21691607/56416135-9d974b80-6298-11e9-9366-406d7abea460.png)

## Getting Started

To test the Reports module yourself, follow the steps below:

1. Clone the repository and enter the project root directory:

```bash
git clone https://github.com/sysgears/apollo-universal-starter-kit.git
cd apollo-universal-starter-kit
```

2. Run `yarn` from the root directory to install the dependencies.

3. Run `yarn seed` from the root to create a default report in the database.

**NOTE**: If you're already using the starter kit, and your project is already connected to a database, the `yarn seed`
command will overwrite the data that was already created in the database. In order not to overwrite the data, you need 
to run `yarn migrate` instead of `yarn seed`.

4. Run `yarn watch` to launch the project. It may take a couple of minutes to build and run the project the first time.

5. Visit the reports page [http://localhost:8080/report]. The user data for the report will be generated on the backend 
and sent to the client.

## Available Features

The Reports module provides the following features:

* Printing reports from the React component
* Downloading reports in the PDF format
* Downloading reports in the Excel format

## Implementation

The Reports module is located in the `modules/reports` folder, where you can find the module implementations for the 
server and client in the `modules/reports/server-ts` and `modules/reports/client-react` folders respectively.

The server module seeds some default report data to the database and uses the [excel4node] and [pdfmake] libraries to 
generate the Excel and PDF documents upon a respective request from the client React application.

The client module only provides an interface to render and download reports or to print them using the built-in 
printing functionality in browsers.

The Reports module also uses the functionality provided by `i18next` to translate the data depending on the language 
used in the application. The translations are located in the `locales` directory.

## The Reports Module Configurations

Currently, the Reports module doesn't require any configuration. You also may not need to change the code that generates
XLSX documents. However, if you want to change how PDF files are generated, you may re-work the implementation in the 
`modules/reports/server-ts/pdf` directory.

The Reports module has a class `PDFBuilder` and a module `generator` to create PDF files. Both `PDFBuilder.ts` and 
`generator.ts` are located in `modules/reports/server-ts/pdf/helpers`.

### `PDFBuilder`

`PDFBuilder` provides the functionality to generate PDF files from the data you feed to it. This class uses the 
functionality provided by `pdfmake`, in particular, `PdfPrinter`, `Content`, and `Style`. You can completely re-work 
`PDFBuilder` or use the methods it provides to generate your PDF files. Consult the [pdfmake documentation] for 
more information about how the library works.

`PDFBuilder` provides the following methods:

* `getDocument()` Returns a new PDF document.
* `addImage()`, adds a new image to a PDF.
* `addList()`, adds a new ordered or unordered list to a PDF document.
* `addStyle()`, adds global styles to a PDF document.
* `addTable()`, adds a table to a PDF document.
* `addText()`, adds new text with optional styles and alignment to a PDF document.

### `generator`

`generator` actually creates a PDF document using `PDFBuilder`. There are two functions defined in `generator.ts`: 

* `createPDF()`, creates a new `PDFBuilder` instance, adds default styles, and content to a PDF document.
* `generator()`, synchronously creates a new `Buffer` object and transforms a PDF into a string to be returned to the
client application.

[http://localhost:8080/reports]: http://localhost:8080/report
[excel4node]: https://www.npmjs.com/package/excel4node
[pdfmake]: https://www.npmjs.com/package/pdfmake
[pdfmake documentation]: https://pdfmake.github.io/docs/
