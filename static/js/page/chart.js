// var options = {
//     chart: {
//         height: 350,
//         type: "line",
//         stacked: false,
//         toolbar: {
//             show: false,
//         },
//         zoom: {
//             enabled: false,
//         }
//     },
//     stroke: {
//         width: [1, 2, 3, 5],
//         curve: "smooth"
//     },
//     plotOptions: {
//         bar: {
//             columnWidth: "25%"
//         }
//     },
//     colors: ["#65e0e0", "#e4eaff", "#66a4fb", "#f49917"],
//     series: [{
//         name: "Credit Card",
//         type: "column",
//         data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 90]
//     }, {
//         name: "Personal Loan",
//         type: "area",
//         data: [44, 155, 41, 67, 22, 43, 21, 41, 56, 27, 43, 70]
//     }, {
//         name: "Home Loan",
//         type: "bar",
//         data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43, 40]
//     }, {
//         name: "Car Loan",
//         type: "line",
//         data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 80]
//     }],
//     fill: {
//         opacity: [0.85, 0.25, 1],
//         gradient: {
//             inverseColors: false,
//             shade: "light",
//             type: "vertical",
//             opacityFrom: 0.85,
//             opacityTo: 0.55,
//             stops: [0, 100, 100, 100]
//         }
//     },
//     labels: ["01/01/2003", "02/01/2003", "03/01/2003", "04/01/2003", "05/01/2003", "06/01/2003", "07/01/2003", "08/01/2003", "09/01/2003", "10/01/2003", "11/01/2003", "12/01/2003"],
//     markers: {
//         size: 0
//     },
//     xaxis: {
//         type: "datetime"
//     },
//     yaxis: {
//         min: 0
//     },
//     tooltip: {
//         shared: true,
//         intersect: false,
//         // y: {
//         //     formatter: function (i) {
//         //         if (typeof i !== "undefined") {
//         //             return i.toFixed(0) + " views";
//         //         }
//         //         return i
//         //     }
//         // }
//     },
//     legend: {
//         labels: {
//             useSeriesColors: true
//         },
//     }
// };
// var chart = new ApexCharts(
//     document.querySelector("#chart"),
//     options
// );
// chart.render();

var donut_options = {
    chart: {
        type: 'donut',
    },
    plotOptions: {
        pie: {
            donut: {
                labels: {
                    show: true,
                    name: {
                        show: false
                    },
                    value: {
                        offsetY: -1,
                        show: true
                    },
                    total: {
                        show: true
                    }
                }
            }
        }
    },
    tooltip: {
        enabled: false
    },
    colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A'],
    legend: {
        show: false,
    },
    series: [21, 22, 10, 28, 16, 21],
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            }
        }
    }]
}

var aamartaka_applicaiton = new ApexCharts(
    document.querySelector("#aamartaka_applicaiton"),
    donut_options
);

aamartaka_applicaiton.render();


var application_bar_options = {
    chart: {
        height: 350,
        type: 'bar',
        toolbar: {
            show: false,
        },
    },
    tooltip: {
        enabled: false
    },
    colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A'],
    plotOptions: {
        bar: {
            columnWidth: '45%',
            distributed: true
        }
    },
    dataLabels: {
        enabled: true,
    },
    series: [{
        data: [21, 22, 10, 28, 16, 21]
    }],
    xaxis: {
        categories: ['New', 'In Progress', 'Document Preparation', 'File Collection', 'File Submitted', 'Reject'],
        labels: {
            style: {
                colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A'],
                fontSize: '14px'
            }
        }
    }
}

var application_bar_chart = new ApexCharts(
    document.querySelector("#application_bar"),
    application_bar_options
);

application_bar_chart.render();

var bankapplication_bar_options = {
    chart: {
        height: 350,
        type: 'bar',
        toolbar: {
            show: false,
        },
    },
    tooltip: {
        enabled: false
    },
    colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'],
    plotOptions: {
        bar: {
            columnWidth: '45%',
            distributed: true
        }
    },
    dataLabels: {
        enabled: true,
    },
    series: [{
        data: [21, 22, 10, 28, 16]
    }],
    xaxis: {
        categories: ['New', 'In Progress', 'Disbursed', 'Hold', 'Reject'],
        labels: {
            style: {
                colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'],
                fontSize: '14px'
            }
        }
    }
}

var bankapplication_bar_chart = new ApexCharts(
    document.querySelector("#bank_application"),
    bankapplication_bar_options
);

bankapplication_bar_chart.render();