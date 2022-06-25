const input = document.getElementById("city");


export function chart(data, e) {
    
    function gethours(element, data){
        new Date(element.dt*1000-(data.timezone_offset*1000)).getDay()
        return new Date(element.dt*1000-(data.timezone_offset*1000)).getHours();
    }

    const labels = [];
    const temp = [];

    for (let [index, element] of data.hourly.entries()) {
        if (index <= 24) {
            labels.push(gethours(element, data));
            temp.push(element.temp);
        }
    }

    const datachart = {
    labels: labels,
    datasets: [{
        label: `Temperatures/24H ${input.value}`,
        backgroundColor: 'rgb(0,121,255)',
        borderColor: 'rgb(0,121,255)',
        data: temp,
        fill: true,
        tension: 0.1,
        radius: 1,
    }]
    };

    const config = {
    type: 'line',
    data: datachart,

    options: {
        scales: {
            x: {
                display: true,
                beginAtZero: true,
            },
            
            y: {
                display: true,
                beginAtZero: true
            }
        },
    }
    };

    const chart = new Chart(
    document.getElementById(`chart-${e.target.id}`),
    config
    );

    console.log (labels);
    console.log (temp);

}