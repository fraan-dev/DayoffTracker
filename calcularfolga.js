/* 1. INICIALIZAÇÃO DO CALENDÁRIO */
let calendar; 

window.onload = function() {
    const calendarEl = document.getElementById('calendar');
    
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        height: 'auto', 
        aspectRatio: window.innerWidth < 600 ? 0.8 : 1.5, 
        handleWindowResize: true,
        
        windowResize: function(arg) {
            if (window.innerWidth < 600) {
                calendar.setOption('aspectRatio', 0.8);
            } else {
                calendar.setOption('aspectRatio', 1.5);
            }
        },

        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth'
        },
        buttonText: {
            today: 'Hoje',
            month: 'Mês'
        }
    });
    
    calendar.render();

    /* Recupera os dados salvos ao atualizar a página */
    const dataSalva = localStorage.getItem("ultimaFolga");
    if (dataSalva) {
        document.getElementById("dataInicial").value = dataSalva;
        calcularFolgas();
    }
};

/* 2. PERSISTÊNCIA DE DADOS */
function salvarData() {
    const dataInput = document.getElementById("dataInicial").value;
    
    if (!dataInput) {
        alert("Escolha uma data antes de salvar!");
        return;
    }
    
    localStorage.setItem("ultimaFolga", dataInput);
    calcularFolgas();
}

/* 3. LÓGICA DE CÁLCULO DAS FOLGAS */
function calcularFolgas() {
    const dataInput = document.getElementById("dataInicial").value;
    if (!dataInput) return;

    const lista = document.getElementById("resultado");
    
    lista.innerHTML = "";
    calendar.removeAllEvents();

    const partes = dataInput.split('-');
    let data = new Date(Date.UTC(partes[0], partes[1] - 1, partes[2]));

    let hoje = new Date();
    let hojeUTC = new Date(Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()));
    
    let mesAtual = hojeUTC.getUTCMonth();
    let anoAtual = hojeUTC.getUTCFullYear();

    for (let i = 0; i < 40; i++) {
        data.setUTCDate(data.getUTCDate() + 6); 

        let dataFormatada = data.toISOString().split('T')[0];

        calendar.addEvent({
            start: dataFormatada,
            allDay: true,
            display: 'background'
        });

        /* Valida se a folga pertence ao mês atual e se é hoje ou futura */
        if (data.getUTCMonth() === mesAtual && data.getUTCFullYear() === anoAtual && data >= hojeUTC) {
            let item = document.createElement("li");
            let dataLocal = new Date(data.getUTCFullYear(), data.getUTCMonth(), data.getUTCDate());
            
            item.innerHTML = `<span>📅 ${dataLocal.toLocaleDateString("pt-BR")}</span> <strong>Folga</strong>`;
            lista.appendChild(item);
        }
    }
}