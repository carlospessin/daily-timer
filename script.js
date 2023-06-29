// defina o tempo em segundos
const tempoValido = 90;
const tempoLimite = 120;

document.addEventListener('DOMContentLoaded', function () {
    var nomes = [
        "Pessoa1",
        "Pessoa2",
        "Pessoa3",
    ];

    var nomesList = $("#nomes-list");

    nomes.forEach(function (nome) {
        var li = $("<li>").addClass("list-group-item d-flex justify-content-between");

        // Criar a tag de imagem e definir o atributo src com o caminho da imagem correspondente
        var imagem = $("<img>").attr("src", "./images/" + nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") + ".png").addClass("avatar mr-2");

        // Criar a div para o nome
        var divName = $("<div>").append(imagem, $("<span>").addClass("name").text(nome));

        var divButtons = $("<div>").addClass("tal");
        var buttonPlay = $("<button>").addClass("btn btn-info play btn-sm mx-1").html('<i class="fa-solid fa-play"></i>');
        var buttonPause = $("<button>").addClass("btn btn-secondary pause btn-sm mx-1").html('<i class="fa-solid fa-pause"></i>');
        var spanTimer = $("<span>").addClass("timer ml-3").text("00:00:00");

        divButtons.append(buttonPlay, buttonPause, spanTimer);
        li.append(divName, divButtons);
        nomesList.append(li);
    });

    applyTimeColors();
});

function applyTimeColors() {
    var timers = document.querySelectorAll('.timer');
    timers.forEach(function (timer) {
        var interval = setInterval(function () {
            var time = timer.textContent;
            var timeInSeconds = convertToSeconds(time);

            if (timeInSeconds >= 1 && timeInSeconds <= tempoValido) {
                timer.classList.add('green-time');
                timer.classList.remove('orange-time', 'red-time');
            } else if (timeInSeconds >= tempoValido + 1 && timeInSeconds <= tempoLimite - 1) {
                timer.classList.add('orange-time');
                timer.classList.remove('green-time', 'red-time');
            } else if (timeInSeconds >= tempoLimite) {
                timer.classList.add('red-time');
                timer.classList.remove('green-time', 'orange-time');
            }
        }, 1000);
        timer.dataset.interval = interval;
    });
}


// Função para formatar o tempo no formato hh:mm:ss
function formatTime(time) {
    const hours = Math.floor(time / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

// Função para converter em segundos
function convertToSeconds(time) {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}

// função para somar o tempo
function totalTime() {
    const times = document.querySelectorAll('.timer');

    let totalSeconds = 0;
    times.forEach(function (time) {
        const [hours, minutes, seconds] = time.textContent.split(':').map(Number);
        totalSeconds += hours * 3600 + minutes * 60 + seconds;
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
}

function padZero(value) {
    return String(value).padStart(2, '0');
}

function getTotalTime() {
    total = `Time: ${totalTime()}`;
    $("#reportModalLabel").addClass("custom-font").text(total);
}

// Gera o gráfico
function generateChart() {
    anychart.onDocumentReady(function () {
        const names = document.querySelectorAll('.name');
        const times = document.querySelectorAll('.timer');

        // set the data
        var data = [];

        for (let i = 0; i < names.length; i++) {
            const time = times[i].textContent;
            const timeInSeconds = convertToSeconds(time);

            // altera a cor dependendo do tempo
            if (timeInSeconds >= 1 && timeInSeconds <= tempoValido) {
                console.log('verde')
                data.push({
                    x: names[i].textContent + ' - ' + time,
                    value: timeInSeconds,
                    exploded: true,
                    normal: { fill: '#77dd77' }
                });
            } else if (timeInSeconds >= tempoValido + 1 && timeInSeconds <= tempoLimite - 1) {
                console.log('laranja')
                data.push({
                    x: names[i].textContent + ' - ' + time,
                    value: timeInSeconds,
                    exploded: true,
                    normal: { fill: '#ffca99' }
                });
            } else if (timeInSeconds >= tempoLimite) {
                console.log('vermelho')
                data.push({
                    x: names[i].textContent + ' - ' + time,
                    value: timeInSeconds,
                    exploded: true,
                    normal: { fill: '#ff6961' }
                });
            }
        }

        // create the chart
        var chart = anychart.pie();

        // set the chart title
        // chart.title('Population by Race for the United States: 2010 Census');

        // add the data
        chart.data(data);

        // sort elements
        chart.sort('desc');

        // set legend position
        chart.legend().position('left');
        // set items layout
        chart.legend().itemsLayout('vertical');
        // clear the container
        document.getElementById('container').innerHTML = '';

        // display the chart in the container
        chart.container('container');
        chart.draw();
    });

    getTotalTime();
}

document.addEventListener('DOMContentLoaded', function () {
    const playButtons = document.querySelectorAll('.play');
    const pauseButtons = document.querySelectorAll('.pause');
    const timers = document.querySelectorAll('.timer');

    let intervals = [];
    let times = Array.from({ length: timers.length }, () => 0);

    playButtons.forEach((button, index) => {
        button.addEventListener('click', function () {
            if (!intervals[index]) {
                intervals[index] = setInterval(function () {
                    times[index]++;
                    timers[index].textContent = formatTime(times[index]);
                }, 1000);
            }
        });
    });

    pauseButtons.forEach((button, index) => {
        button.addEventListener('click', function () {
            clearInterval(intervals[index]);
            intervals[index] = null;
        });
    });

    // Evento de clique no botão "Gerar Relatório"
    const reportButton = document.querySelector('.btn[data-target="#reportModal"]');
    reportButton.addEventListener('click', generateChart);
});

// função download da imagem
function downloadModalImage() {
    // Obtenha o elemento do contêiner do gráfico
    var container = document.getElementById('imgModal');

    // Capture uma imagem do contêiner do gráfico usando html2canvas
    html2canvas(container).then(function (canvas) {
        // Converta o canvas para a imagem PNG
        var imgData = canvas.toDataURL("image/png");

        // Crie um link de download
        var link = document.createElement('a');
        link.href = imgData;
        link.download = 'modal_image.png';

        // Adicione o link de download ao documento e clique nele para iniciar o download
        document.body.appendChild(link);
        link.click();

        // Remova o link de download do documento
        document.body.removeChild(link);
    });
}

// função para download do xlsx
function downloadModalData() {

    const names = document.querySelectorAll('.name');
    const times = document.querySelectorAll('.timer');

    // Crie um array para armazenar os dados
    var data = [
        ['Nome', 'Tempo'] // Cabeçalho das colunas
    ];

    for (let i = 0; i < names.length; i++) {
        const time = times[i].textContent;

        // Adicione os dados ao array
        data.push([
            names[i].textContent,
            time
        ]);
    }
    // Crie um objeto Workbook
    var wb = XLSX.utils.book_new();

    // Obtenha o elemento do contêiner do gráfico
    var container = document.getElementById('imgModal');

    // Crie uma nova planilha
    var ws = XLSX.utils.aoa_to_sheet(data);

    // Adicione a planilha ao objeto Workbook
    XLSX.utils.book_append_sheet(wb, ws, "Modal Data");

    // Converta o objeto Workbook para um arquivo Excel
    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    // Função auxiliar para converter o binário em um Blob
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    // Crie um Blob a partir do binário
    var blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

    // Crie um link de download
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'modal_data.xlsx';

    // Adicione o link de download ao documento e clique nele para iniciar o download
    document.body.appendChild(link);
    link.click();

    // Remova o link de download do documento
    document.body.removeChild(link);
}
