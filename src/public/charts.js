import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/legend';

const splitLine = {
    show: 'true',
    interval: 'auto',
    lineStyle: {
        color: ['#727272'],
        type: 'dashed',
        opacity: 0.36
    }
}

const axisLine = {
    show: true,
    lineStyle: {
        type: 'solid',
        color: '#727272',
        opacity: 0.4
    }
}

//chartType=1代表是首页的图表，chartType=0代表是统计分析的图表
export const barCharts = (el, data, barColor, chartType, dataname) => {
    const barOption = {
        tooltip: {
            trigger: 'axis',
            // formatter: '{a}：{c}户'
        },
        grid: {
            left: '5%',
            right: '10%',
            bottom: '10%',
            top: '15%',
            containLabel: true
        },
        color: barColor[0],
        legend: {
            data: [{
                name: chartType === 1 ? '告警住户' : dataname,
                icon: 'roundRect'
            }],
            right: 50,
            itemHeight: 5,
            itemWidth: 15,
            borderRadius: 2.5,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 10
        },
        toolbox: {
            show: false,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {
                    readOnly: false
                },
                magicType: {
                    type: ['line', 'bar']
                },
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: true,
            axisLine,
            splitLine,
            data: data.dataX
        },
        yAxis: {
            type: 'value',
            axisLine,
            splitLine
        },
        series: [{
            name: chartType === 1 ? '告警住户' : dataname,
            type: 'bar',
            data: data.dataY,
            itemStyle: {
                normal: {
                    barBorderRadius: chartType === 1 ? [7.5, 7.5, 0, 0] : [0, 0, 0, 0],
                    color: new echarts.graphic.LinearGradient(
                        0, 1, 0, 0, [{
                            offset: 0,
                            color: barColor[0]
                        }, {
                            offset: 1,
                            color: barColor[1]
                        }]
                    )
                }
            },
            barWidth: 15
        }]
    }

    if (chartType == 1) {
        barOption.yAxis.axisLabel = {
            formatter: '{value}户'
        };
        barOption.tooltip.formatter = '{a}: {c}户';
        barOption.series[0].name = '告警住户';
    } else if (chartType == 0) {
        barOption.yAxis.axisLabel = {
            formatter: '{value} °C'
        };
        barOption.series[0].name = '温度(°C)';
    } else if (chartType == 2) {
        barOption.xAxis.axisLabel = {
            formatter: '{value} °C'
        };
        barOption.series[0].name = '户数';
    }

    const bar = echarts.init(el);
    bar.setOption(barOption);
    window.addEventListener('resize', () => {
        bar.resize();
    })
    return bar;
}

export const lineCharts = (el, grid, dataX, dataY1, dataY2, interval) => {
    const lineOption = {
        grid: grid,
        tooltip: {
            trigger: 'axis'
        },
        color: ['#FFA509', '#00A8FF'],
        legend: {
            data: [{
                    name: '室温',
                    icon: 'roundRect'
                },
                {
                    name: '气温',
                    icon: 'roundRect'
                },
            ],
            right: 50,
            itemHeight: 5,
            itemWidth: 15,
            borderRadius: 2.5,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 10
        },
        toolbox: {
            show: false,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {
                    readOnly: false
                },
                magicType: {
                    type: ['line', 'bar']
                },
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine,
            splitLine,
            data: dataX,
            axisLabel: {
                interval: interval ? interval : 'auto'
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} °C'
            },
            axisLine,
            splitLine
        },
        series: [{
                name: '室温',
                type: 'line',
                smooth: true,
                lineStyle: {
                    color: '#FFA509'
                },
                symbol: 'none',
                data: dataY1,
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: 'rgba(255,182,48,.8)'
                        }, {
                            offset: 0.5,
                            color: 'rgba(255,182,48,.4)'
                        }, {
                            offset: 1,
                            color: 'rgba(255,182,48,.1)'
                        }],
                        global: false
                    }
                }
            },
            {
                name: '气温',
                type: 'line',
                smooth: true,
                lineStyle: {
                    color: '#00A8FF'
                },
                symbol: 'none',
                data: dataY2,
            }
        ]
    }

    const line = echarts.init(el);
    window.addEventListener('resize', () => {
        line.resize();
    })
    line.setOption(lineOption);
    return line;
}

export const moreLineCharts = (el, grid, dataX, dataY1, dataY2, dataY3) => {
    const lineOption = {
        grid: grid,
        tooltip: {
            trigger: 'axis'
        },
        color: ['#FFA509', '#00A8FF', '#8AE064'],
        legend: {
            data: [{
                    name: '室温',
                    icon: 'roundRect'
                },
                {
                    name: '气温',
                    icon: 'roundRect'
                },
                {
                    name: '湿度',
                    icon: 'roundRect'
                }
            ],
            right: 50,
            itemHeight: 5,
            itemWidth: 15,
            borderRadius: 2.5,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 10
        },
        toolbox: {
            show: false,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {
                    readOnly: false
                },
                magicType: {
                    type: ['line', 'bar']
                },
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine,
            splitLine,
            data: dataX
        },
        yAxis: [{
                type: 'value',
                axisLabel: {
                    formatter: '{value} °C'
                },
                axisLine,
                splitLine
            },
            {
                type: 'value',
                axisLabel: {
                    formatter: '{value} %'
                },
                axisLine,
                splitLine
            },
        ],
        series: [{
                name: '室温',
                type: 'line',
                yAxisIndex: 0,
                smooth: true,
                lineStyle: {
                    color: '#FFA509'
                },
                symbol: 'none',
                data: dataY1,
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: 'rgba(255,182,48,.8)'
                        }, {
                            offset: 0.5,
                            color: 'rgba(255,182,48,.4)'
                        }, {
                            offset: 1,
                            color: 'rgba(255,182,48,.1)'
                        }],
                        global: false
                    }
                }
            },
            {
                name: '气温',
                type: 'line',
                yAxisIndex: 0,
                smooth: true,
                lineStyle: {
                    color: '#00A8FF'
                },
                symbol: 'none',
                data: dataY2,
            },
            {
                name: '湿度',
                type: 'line',
                yAxisIndex: 1,
                smooth: true,
                lineStyle: {
                    color: '#8AE064'
                },
                symbol: 'none',
                data: dataY3,
            }
        ]
    }

    const moreLine = echarts.init(el);
    window.addEventListener('resize', () => {
        moreLine.resize();
    })
    moreLine.setOption(lineOption);
    return moreLine;
}

export const pieCharts = (el, data1, data2, data3) => {
    const pieOption = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [{
            name: '数据统计',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [{
                    value: data1.value,
                    name: data1.name,
                    itemStyle: {
                        color: data1.color
                    }
                },
                {
                    value: data2.value,
                    name: data2.name,
                    itemStyle: {
                        color: data2.color
                    }
                },
                {
                    value: data3.value,
                    name: data3.name,
                    itemStyle: {
                        color: data3.color
                    }
                },
            ]
        }]
    }
    const pie = echarts.init(el);
    window.addEventListener('resize', () => {
        pie.resize();
    })
    pie.setOption(pieOption);
    return pie;
}


export const pieCharts2 = (el, data1, data2) => {
    const pieOption = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} {c} ({d}%)"
        },
        series: [{
            name: '设备在线率',
            type: 'pie',
            radius: ['60%', '80%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [{
                    value: data1.value,
                    name: data1.name,
                    itemStyle: {
                        color: {
                            type: 'radial',
                            x: 1,
                            y: 1,
                            r: 1,
                            colorStops: [{
                                offset: 0,
                                color: '#f0a938' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#fac166' // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                        }
                    }
                },
                {
                    value: data2.value,
                    name: data2.name,
                    itemStyle: {
                        color: {
                            type: 'radial',
                            x: 0.5,
                            y: 0.5,
                            r: 1,
                            colorStops: [{
                                offset: 0,
                                color: '#b8b8b8' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: 'rgba(0,0,0,.5)' // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                        }
                    }
                }
            ]
        }]
    }
    const pie = echarts.init(el);
    window.addEventListener('resize', () => {
        pie.resize();
    })
    pie.setOption(pieOption);
    return pie;
}
