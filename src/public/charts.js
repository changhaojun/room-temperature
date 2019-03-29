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
        color: ['#ccc'],
        type: 'dashed',
        opacity: 0.5
    }
}

const axisLine = {
    show: true,
    lineStyle: {
        type: 'solid',
        color: '#ccc',
        opacity: 1
    }
}

export const barCharts = (el, data, barColor) => {
    const barOption = {
        tooltip: {
            trigger: 'axis'
        },
        color: barColor[0],
        legend: {
            data:[
                {
                    name: '室温',
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
                dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis:  {
            type: 'category',
            boundaryGap: true,
            axisLine,
            splitLine,
            data: data.dataX
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} °C'
            },
            axisLine,
            splitLine
        },
        series: [
            {
                name: '室温',
                type: 'bar',
                data: data.dataY,
                itemStyle: {
                    normal: {
                        barBorderRadius: [7.5, 7.5, 0, 0],
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
            }
        ]
    }

    const bar = echarts.init(el);
    bar.setOption(barOption);
    window.addEventListener('resize', () => {
        bar.resize();
    })
    return bar;
}

export const lineCharts = (el, grid, dataX, dataY1, dataY2) => {
    const lineOption = {
        grid: grid,
        tooltip: {
            trigger: 'axis'
        },
        color: ['#FFA509', '#00A8FF'],
        legend: {
            data:[
                {
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
                dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis:  {
            type: 'category',
            boundaryGap: false,
            axisLine,
            splitLine,
            data: dataX
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} °C'
            },
            axisLine,
            splitLine
        },
        series: [
            {
                name:'室温',
                type:'line',
                smooth: true,
                lineStyle: {
                    color: '#FFA509'
                },
                symbol: 'none',
                data:dataY1,
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'rgba(255,182,48,.8)'
                        }, {
                            offset: 0.5, color: 'rgba(255,182,48,.4)'
                        },{
                            offset: 1, color: 'rgba(255,182,48,.1)'
                        }],
                        global: false
                    }
                }
            },
            {
                name:'气温',
                type:'line',
                smooth: true,
                lineStyle: {
                    color: '#00A8FF'
                },
                symbol: 'none',
                data:dataY2,
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