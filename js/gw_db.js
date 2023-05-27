var url_id = '046e-158-140-182-90';   
var id_list = [];     
$(document).ready(function(){
    // get_data_chart();
    create_chart();
    var dataSet = [];
    var chart;
    $('#example').DataTable({
        lengthChange: false,
        searching: false,
        data: dataSet,
        columns: [
            { title: 'Name' },
            { title: 'Guild ID' },
            { title: 'Point' },
            { title: 'Ranking' },
            { title: ' ' },
        ],
    });
    // $('#sort_filter').selectpicker();
    // get_top_category('container');
    // get_top_product('container2')
    // get_data_summary();
    $("#search_btn").click(function() {
        search();
    });
    $("#searchbar").keypress(function(event) {
        if (event.keyCode == 13) {
            search();
        }
    });
});
function loading() {
  document.getElementById("overlay").style.display = "flex";
}

function close_load() {
  document.getElementById("overlay").style.display = "none";
}
function search() {
    // loading();
    $('#example').hide();
    $('#loading_modal').show();
    $('#example').DataTable().destroy();
    $('#search_res_modal').modal('show')
    var keyword = $("#searchbar").val();
    var type = $("#sort_filter").val();
    var gw = $("#filter_gw").val();
    jQuery.ajax({
        type: "POST",
        url: "https://"+url_id+".ngrok-free.app/gw_db/index.php/GetData/get_crew_data",
        data: {
            keyword : keyword,
            type : type,
            gw:gw
        },
        dataType: 'json',
        success: function(response) {

            $('#example').show();
            $('#loading_modal').hide();
            console.log(response);
            var dataSet = response;
            $('#example').DataTable({
                lengthChange: false,
                searching: false,
                data: dataSet,
                columns: [
                    {
                        data: 'name',
                    },
                    {
                        data: 'guild_id',
                    },
                    {
                        data: 'point',
                    },
                    {
                        data: 'ranking',
                    },
                    {
                        render: function ( data, type, row) {
                          return '<button type="button" class="btn btn-success btn-sm" onclick="pre_get_details('+row.guild_id+')">+</button>';
                        },
                    }
                ],
            });

        },
        error: function(response){
            console.log(response);
        },
        complete: function(){
            close_load();
        }
    });
    // openUrl("<?php echo base_url(); ?>App/search?keyword="+keyword)
}
function reset(){
    chart_series = [];
    id_list = [];
    create_chart();
}
function change_day(){
    chart_series = [];
    for (let i = 0; i < id_list.length; i++) {
        setTimeout(function() {
            get_details(id_list[i]);
        },100);
    }



}
function create_chart(){
    pre_create_chart();
    $('#container').width('95vw');
    setTimeout(function() {
        $("#container").removeAttr("style");
        chart.reflow();
    }, 10);
}
// function loading(){
//     Swal.fire({
//         showCancelButton: false,
//         showConfirmButton: false,
//     willOpen: () => {
//       Swal.showLoading()
//     },
//     allowOutsideClick: () => !Swal.isLoading(),
//     didClose: () => $('html, body').animate({ scrollTop: 0 }, 'fast')
//     })
// }
// function close_load(){
//     Swal.close()
// }
var colors = Highcharts.getOptions().colors;
var counter_color = 0;
var chart_series = [];
function pre_get_details(id){
    id_list.push(id);
    setTimeout(function() {
        get_details(id);
    },100);
}
function get_details(id) {
    loading();
    var day = document.querySelector("#day_gw input:checked").getAttribute("val");
    var gw = $("#filter_gw").val();
    console.log(id);
    console.log(day);
    console.log(gw);
    jQuery.ajax({
        type: "POST",
        url: "https://"+url_id+".ngrok-free.app/gw_db/index.php/GetData/get_crew_detail",
        data: {
            id: id,
            day: day,
            gw:gw
        },
       dataType: 'json',
       success: function(response) {
            console.log(response);
            var temp_arr = {
                                name: response['name']+' Total Honor',
                                type: 'spline',
                                yAxis: 1,
                                data: response['honor_total'],
                                color: colors[counter_color],
                            }
            var temp_arr2 ={
                                name: response['name']+' Honor Gain',
                                type: 'spline',
                                dashStyle: 'ShortDashDot',
                                data: response['honor_gain'],
                                color: colors[counter_color],
                            }  
            chart_series.push(temp_arr);
            chart_series.push(temp_arr2);
            create_chart();
            counter_color++;
            console.log(temp_arr);
            console.log(chart_series);
       },
       error: function(response){
            create_chart();
            console.log(response);
            close_load();
       },
       complete: function(){
            close_load();
       }
    });
}
function openUrl(url) {
    window.open(url, '_blank');
}
function pre_create_chart(){
    close_load();
    Highcharts.createElement('link', {
      href: 'https://fonts.googleapis.com/css?family=Roboto',
      rel: 'stylesheet',
      type: 'text/css'
    }, null, document.getElementsByTagName('head')[0]);

    Highcharts.theme = {
      colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
        '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'
      ],
      chart: {
        backgroundColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 1,
            y2: 1
          },
          stops: [
            [0, '#2a2a2b'],
            [1, '#3e3e40']
          ]
        },
        style: {
          fontFamily: '\'Unica One\', sans-serif'
        },
        plotBorderColor: '#606063'
      },
      title: {
        style: {
          color: '#E0E0E3',
          textTransform: 'uppercase',
          fontSize: '20px'
        }
      },
      subtitle: {
        style: {
          color: '#E0E0E3',
          textTransform: 'uppercase'
        }
      },
      xAxis: {
        gridLineColor: '#707073',
        labels: {
          style: {
            color: '#E0E0E3'
          }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        title: {
          style: {
            color: '#A0A0A3'

          }
        }
      },
      yAxis: {
        gridLineColor: '#707073',
        labels: {
          style: {
            color: '#E0E0E3'
          }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        tickWidth: 1,
        title: {
          style: {
            color: '#A0A0A3'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        style: {
          color: '#F0F0F0'
        }
      },
      plotOptions: {
        series: {
          dataLabels: {
            color: '#F0F0F3',
            style: {
              fontSize: '13px'
            }
          },
          marker: {
            lineColor: '#333'
          }
        },
        boxplot: {
          fillColor: '#505053'
        },
        candlestick: {
          lineColor: 'white'
        },
        errorbar: {
          color: 'white'
        }
      },
      legend: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        itemStyle: {
          color: '#E0E0E3'
        },
        itemHoverStyle: {
          color: '#FFF'
        },
        itemHiddenStyle: {
          color: '#606063'
        },
        title: {
          style: {
            color: '#C0C0C0'
          }
        }
      },
      credits: {
        style: {
          color: '#666'
        }
      },
      labels: {
        style: {
          color: '#707073'
        }
      },

      drilldown: {
        activeAxisLabelStyle: {
          color: '#F0F0F3'
        },
        activeDataLabelStyle: {
          color: '#F0F0F3'
        }
      },

      navigation: {
        buttonOptions: {
          symbolStroke: '#DDDDDD',
          theme: {
            fill: '#505053'
          }
        }
      },

      // scroll charts
      rangeSelector: {
        buttonTheme: {
          fill: '#505053',
          stroke: '#000000',
          style: {
            color: '#CCC'
          },
          states: {
            hover: {
              fill: '#707073',
              stroke: '#000000',
              style: {
                color: 'white'
              }
            },
            select: {
              fill: '#000003',
              stroke: '#000000',
              style: {
                color: 'white'
              }
            }
          }
        },
        inputBoxBorderColor: '#505053',
        inputStyle: {
          backgroundColor: '#333',
          color: 'silver'
        },
        labelStyle: {
          color: 'silver'
        }
      },

      navigator: {
        handles: {
          backgroundColor: '#666',
          borderColor: '#AAA'
        },
        outlineColor: '#CCC',
        maskFill: 'rgba(255,255,255,0.1)',
        series: {
          color: '#7798BF',
          lineColor: '#A6C7ED'
        },
        xAxis: {
          gridLineColor: '#505053'
        }
      },

      scrollbar: {
        barBackgroundColor: '#808083',
        barBorderColor: '#808083',
        buttonArrowColor: '#CCC',
        buttonBackgroundColor: '#606063',
        buttonBorderColor: '#606063',
        rifleColor: '#FFF',
        trackBackgroundColor: '#404043',
        trackBorderColor: '#404043'
      }
    };

    // Apply the theme
    Highcharts.setOptions(Highcharts.theme);
    // chart = Highcharts.chart('container', {
    //   chart: {
    //     // width:  '',
    //     height:700,
    //   },
    //   yAxis: [{
    //     title: {
    //       text: 'Income $'
    //     }
    //   }, {
    //     opposite: true,
    //     text: 'Customers'
    //   }],

    //   data: {
    //     csv: document.getElementById('csvData').innerHTML
    //   },

    //   series: [{
    //     // INCOME series
    //     type: 'column'
    //   }, {
    //     // CUSTOMERS series
    //     type: 'spline',
    //     yAxis: 1
    //   }]

    // });
//chart
    chart = Highcharts.chart('container', {
        chart: {
            height: '700' // 16:9 ratio
        },

        title: {
            text: null
        },
        subtitle: {
            text: null
        },
        xAxis: [{
            categories: [
            '05.00','05.20','05.40',
            '06.00','06.20','06.40',
            '07.00','07.20','07.40',
            '08.00','08.20','08.40',
            '09.00','09.20','09.40',
            '10.00','10.20','10.40',
            '11.00','11.20','11.40',
            '12.00','12.20','12.40',
            '13.00','13.20','13.40',
            '14.00','14.20','14.40',
            '15.00','15.20','15.40',
            '16.00','16.20','16.40',
            '17.00','17.20','17.40',
            '18.00','18.20','18.40',
            '19.00','19.20','19.40',
            '20.00','20.20','20.40',
            '21.00','21.20','21.40',
            '22.00'],
            crosshair: true
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: 'Total Honor',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            opposite: true

        }, { // Secondary yAxis
            gridLineWidth: 0,
            title: {
                text: 'Honor Gain',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            }

        }],
        tooltip: {
            shared: true
        },
        credits: {
          enabled: false
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 80,
            verticalAlign: 'top',
            y: 55,
            floating: true,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || // theme
                'rgba(255,255,255,0.25)'
        },
        series: chart_series,
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        floating: false,
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom',
                        x: 0,
                        y: 0
                    },
                    yAxis: [{
                        labels: {
                            align: 'right',
                            x: 0,
                            y: -6
                        },
                        showLastLabel: false
                    }, {
                        labels: {
                            align: 'left',
                            x: 0,
                            y: -6
                        },
                        showLastLabel: false
                    }, {
                        visible: false
                    }]
                }
            }]
        }
    });


}
function create_table(container,x,series,textbawah,textinfo){
    Highcharts.chart(container, {
      chart: {
            type: 'bar',
            scrollablePlotArea: {
                minHeight: 500
            },
            marginRight: 50
        },
        title: {
            text: null
        },
        subtitle: {
            text: null
        },

        xAxis: {
            categories: x,
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: textbawah,
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: false,
        credits: {
            enabled: false
        },
        colors: ['#C22026'],
        series: [{
            name: textinfo,
            data: series
        }]
    });
}