"use strict";

Chart.defaults.groupableBar = Chart.helpers.clone(Chart.defaults.bar);

var helpers = Chart.helpers;
Chart.controllers.groupableBar = Chart.controllers.bar.extend({
    calculateBarX: function (index, datasetIndex) {
        // position the bars based on the stack index
        var stackIndex = this.getMeta().stackIndex;
        return Chart.controllers.bar.prototype.calculateBarX.apply(this, [index, stackIndex]);
    },

    hideOtherStacks: function (datasetIndex) {
        var meta = this.getMeta();
        var stackIndex = meta.stackIndex;

        this.hiddens = [];
        for (var i = 0; i < datasetIndex; i++) {
            var dsMeta = this.chart.getDatasetMeta(i);
            if (dsMeta.stackIndex !== stackIndex) {
                this.hiddens.push(dsMeta.hidden);
                dsMeta.hidden = true;
            }
        }
    },

    unhideOtherStacks: function (datasetIndex) {
        var meta = this.getMeta();
        var stackIndex = meta.stackIndex;

        for (var i = 0; i < datasetIndex; i++) {
            var dsMeta = this.chart.getDatasetMeta(i);
            if (dsMeta.stackIndex !== stackIndex) {
                dsMeta.hidden = this.hiddens.unshift();
            }
        }
    },

    calculateBarY: function (index, datasetIndex) {
        this.hideOtherStacks(datasetIndex);
        var barY = Chart.controllers.bar.prototype.calculateBarY.apply(this, [index, datasetIndex]);
        this.unhideOtherStacks(datasetIndex);
        return barY;
    },

    calculateBarBase: function (datasetIndex, index) {

        this.hideOtherStacks(datasetIndex);
        var barBase = Chart.controllers.bar.prototype.calculateBarBase.apply(this, [datasetIndex, index]);
        this.unhideOtherStacks(datasetIndex);
        return barBase;
    },

    getBarCount: function () {
        var stacks = [];

        // put the stack index in the dataset meta
        Chart.helpers.each(this.chart.data.datasets, function (dataset, datasetIndex) {
            var meta = this.chart.getDatasetMeta(datasetIndex);
            if (meta.bar && this.chart.isDatasetVisible(datasetIndex)) {
                var stackIndex = stacks.indexOf(dataset.stack);
                if (stackIndex === -1) {
                    stackIndex = stacks.length;
                    stacks.push(dataset.stack);
                }
                meta.stackIndex = stackIndex;
            }
        }, this);

        this.getMeta().stacks = stacks;
        return stacks.length;
    },
});

var data = {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    datasets: [
        {
            label: "Loading",
            backgroundColor: "rgb(102, 164, 251)",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            stack: 1
        },
    ]
};

var bar_chart_content = document.getElementById("chartjs").getContext("2d");
var bar_chart = new Chart(bar_chart_content, {
    type: 'groupableBar',
    data: data,
    options: {
        plugins: {datalabels: false},
        legend: {
            display: false,
            position: 'bottom',
            labels: {
                usePointStyle: true
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                stacked: true,
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                categoryPercentage: 0.4,
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                }
            }]
        }
    }
});

var aamartakaElement = document.getElementById("aamartaka_applicaiton")
if (aamartakaElement) {
    var aamartaka_application_donut_content = aamartakaElement.getContext("2d");
    var donut_chart = new Chart(aamartaka_application_donut_content, {
        type: 'pie',
        data: {
            labels: ['New', 'In Progress', 'Document Preparation', 'File Collection', 'File Submitted', 'Reject'],
            datasets: [{
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A'],
                borderWidth: 0
            }]
        },
        options: {
            cutoutPercentage: 50,
            tooltips: {
                custom: function (tooltip) {
                    if (!tooltip) return;
                    tooltip.displayColors = false;
                },
                callbacks: {
                    label: function (tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                            return previousValue + currentValue;
                        });
                        var currentValue = dataset.data[tooltipItem.index];
                        var percentage = Math.floor(((currentValue / total) * 100) + 0.5);
                        return percentage + "%";
                    }
                }
            },
            responsive: true,
            legend: {
                display: false
            },
            title: {
                display: false
            },
            plugins: {
                // datalabels: {
                //     formatter: (value, ctx) => {
                //         let sum = 0;
                //         let dataArr = ctx.chart.data.datasets[0].data;
                //         dataArr.map(data => {
                //             sum += data;
                //         });
                //         let percentage = (value * 100 / sum).toFixed(2) + "%";
                //         return percentage;
                //     },
                //     color: '#fff',
                // }
                datalabels: false,
            }

        }
    });
}
/*
var aamartaka_application_bar_content = document.getElementById("application_bar").getContext("2d");
var application_bar_chart = new Chart(aamartaka_application_bar_content, {
    type: 'horizontalBar',
    data: {
        labels: ['New', 'In Progress', 'Document Preparation', 'File Collection', 'File Submitted', 'Reject'],
        datasets: [{
            label: '',
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A'],
            borderWidth: 0
        }]
    },
    options: {

        tooltips: {
            enabled: false
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false,
        },
        // scales: {
        //     xAxes: [{
        //         ticks: {
        //             beginAtZero: true
        //         }
        //     }],
        // },
        scales: {
            xAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontFamily: "'Open Sans Bold', sans-serif",
                    fontSize: 11
                },
                scaleLabel: {
                    display: false
                },
                gridLines: {
                    drawOnChartArea: false,
                    color: "black",
                    zeroLineColor: "black"
                },
                stacked: true
            }],
            yAxes: [{
                gridLines: {
                    display: false,
                    color: "black",
                    zeroLineColor: "#fff",
                    zeroLineWidth: 0
                },
                ticks: {
                    fontFamily: "'Open Sans Bold', sans-serif",
                    fontSize: 11
                },
                stacked: true
            }]
        },
        animation: {
            onComplete: function () {
                var chartInstance = this.chart;
                var ctx = chartInstance.ctx;
                ctx.textAlign = "center";
                ctx.font = "9px Open Sans";
                ctx.fillStyle = "#fff";

                // Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
                //     var meta = chartInstance.controller.getDatasetMeta(i);
                //     Chart.helpers.each(meta.data.forEach(function (bar, index) {
                //         var data = dataset.data[index];
                //         var barWidth = bar._model.x - bar._model.base;
                //         var centerX = bar._model.base + barWidth / 2;
                //         if (i == 0) {
                //             ctx.fillText(data, centerX, bar._model.y + 4);
                //         } else {
                //             ctx.fillText(data, centerX, bar._model.y + 4);
                //         }
                //     }), this);
                // }), this);

                // draw total count
                // this.data.datasets[0].data.forEach(function (data, index) {
                //     var total = data;
                //     var meta = chartInstance.controller.getDatasetMeta(1);
                //     var posX = meta.data[index]._model.x;
                //     var posY = meta.data[index]._model.y;
                //
                //     ctx.textAlign = 'left';
                //     ctx.fillStyle = "black";
                //     ctx.fillText(total, posX + 4, posY + 4);
                // }, this);

                this.data.datasets.forEach(function (dataset, i) {
                    var meta = chartInstance.controller.getDatasetMeta(i);
                    meta.data.forEach(function (bar, index) {
                        var data = dataset.data[index];
                        ctx.textAlign = 'left';
                        ctx.fillStyle = 'black';
                        ctx.fillText(data, bar._model.x, bar._model.y - 5);
                    });
                });
            }
        },
        pointLabelFontFamily: "Quadon Extra Bold",
        scaleFontFamily: "Quadon Extra Bold"
    }
});
*/
var bank_application_bar_content = document.getElementById("bank_application").getContext("2d");
var bank_application_bar_chart = new Chart(bank_application_bar_content, {
    type: 'pie',
    data: {
        labels: ['New', 'In Progress', 'Disbursed', 'Hold', 'Reject'],
        datasets: [{
            label: '',
            data: [0, 0, 0, 0, 0],
            backgroundColor: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'],
            borderWidth: 0
        }]
    },
    options: {
        cutoutPercentage: 50,
        tooltips: {
            custom: function (tooltip) {
                if (!tooltip) return;
                tooltip.displayColors = false;
            },
            callbacks: {
                label: function (tooltipItem, data) {
                    var dataset = data.datasets[tooltipItem.datasetIndex];
                    var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                        return previousValue + currentValue;
                    });
                    var currentValue = dataset.data[tooltipItem.index];
                    var percentage = Math.floor(((currentValue / total) * 100) + 0.5);
                    return percentage + "%";
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false,
        },
        plugins: {
            // datalabels: {
            //     formatter: (value, ctx) => {
            //         let sum = 0;
            //         let dataArr = ctx.chart.data.datasets[0].data;
            //         dataArr.map(data => {
            //             sum += data;
            //         });
            //         let percentage = (value * 100 / sum).toFixed(2) + "%";
            //         return percentage;
            //     },
            //     color: '#fff',
            // }
            datalabels: false,
        },
        // scales: {
        //     xAxes: [{
        //         categoryPercentage: 0.2,
        //     }],
        //     yAxes: [{
        //         ticks: {
        //             beginAtZero: true
        //         }
        //     }],
        // }
    }
});

function chartGenerate(chart, data) {
    chart.data = data;
    chart.update();
}
