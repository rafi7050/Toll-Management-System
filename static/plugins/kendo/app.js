function ExportPdf() {
        kendo.drawing
            .drawDOM("#PDFGen",
                {
                    paperSize: "A4",
                    margin: {top: "1cm", bottom: "1cm"},
                    scale: 0.8,
                    height: 500
                })
            .then(function (group) {
                kendo.drawing.pdf.saveAs(group, "Exported.pdf")
            });
    }

    function withPageTemplate() {
        kendo.drawing
            .drawDOM("#PDFGen",
                {
                    forcePageBreak: ".page-break", // add this class to each element where you want manual page break
                    paperSize: "A4",
                    margin: {top: "1cm", bottom: "1cm"},
                    scale: 0.8,
                    height: 500,
                    template: $("#page-template").html()
                })
            .then(function (group) {
                kendo.drawing.pdf.saveAs(group, "Exported.pdf")
            });
    }

    kendo.pdf.defineFont({
        "Montserrat-Regular": "../../fonts/montserrat/Montserrat-Regular.ttf",
        "Montserrat-Light": "../../fonts/montserrat/Montserrat-Light.ttf",
        "Montserrat-SemiBold": "../../fonts/montserrat/Montserrat-SemiBold.ttf",
        "Montserrat-Medium": "../../fonts/montserrat/Montserrat-Medium.ttf",
        "DejaVu Sans":
            "http://cdn.kendostatic.com/2017.2.621/styles/fonts/DejaVu/DejaVuSans.ttf"
    });