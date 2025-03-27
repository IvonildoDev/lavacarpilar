document.addEventListener('DOMContentLoaded', function () {
    // ---------- INICIALIZAÇÃO DE ELEMENTOS ----------
    const form = document.getElementById('cadastroForm');
    const clientesList = document.getElementById('clientesList');
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const tipoCarroRadio = document.getElementById('tipoCarro');
    const tipoMotoRadio = document.getElementById('tipoMoto');
    const marcaSelect = document.getElementById('marca');

    // Atualizar o ano no footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // ---------- SISTEMA DE ABAS ----------
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');

    // Função para alternar entre as abas
    function switchTab(targetId) {
        // Remover classe 'active' de todas as abas
        tabContents.forEach(tab => {
            tab.classList.remove('active');
        });

        // Remover classe 'active' de todos os links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Adicionar classe 'active' à aba selecionada
        document.getElementById(targetId).classList.add('active');

        // Adicionar classe 'active' ao link selecionado
        document.querySelector(`[data-section="${targetId}"]`).classList.add('active');

        // Se a aba de relatórios for ativada, gerar o relatório
        if (targetId === 'relatorios') {
            gerarRelatorio();
        }

        // Se a aba de serviços for ativada, atualizar a lista
        if (targetId === 'clientes') {
            loadClientes();
        }
    }

    // Adicionar eventos aos links do menu
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-section');
            switchTab(targetId);

            // Fechar o menu móvel após a seleção
            navMenu.classList.remove('active');
        });
    });

    // Ativar a primeira aba por padrão (cadastro)
    switchTab('cadastro');

    // Definição das listas de marcas
    const marcasCarros = [
        { value: "Volkswagen", text: "Volkswagen" },
        { value: "Chevrolet", text: "Chevrolet" },
        { value: "Fiat", text: "Fiat" },
        { value: "Jeep", text: "Jeep" },
        { value: "Toyota", text: "Toyota" },
        { value: "Hyundai", text: "Hyundai" },
        { value: "Renault", text: "Renault" },
        { value: "Honda", text: "Honda" },
        { value: "Nissan", text: "Nissan" },
        { value: "Peugeot", text: "Peugeot" },
        { value: "Citroën", text: "Citroën" },
        { value: "BYD", text: "BYD" },
        { value: "CAOA Chery", text: "CAOA Chery" },
        { value: "Ford", text: "Ford" },
        { value: "BMW", text: "BMW" },
        { value: "Mercedes-Benz", text: "Mercedes-Benz" },
        { value: "Mitsubishi", text: "Mitsubishi" },
        { value: "Suzuki", text: "Suzuki" },
        { value: "Jaguar Land Rover", text: "Jaguar Land Rover" },
        { value: "Kia", text: "Kia" },
        { value: "Volvo", text: "Volvo" },
        { value: "GWM", text: "GWM" },
        { value: "Outros Carros", text: "Outros" }
    ];

    const marcasMotos = [
        { value: "Honda", text: "Honda" },
        { value: "Yamaha", text: "Yamaha" },
        { value: "Suzuki", text: "Suzuki" },
        { value: "Kawasaki", text: "Kawasaki" },
        { value: "Harley-Davidson", text: "Harley-Davidson" },
        { value: "BMW", text: "BMW" },
        { value: "Ducati", text: "Ducati" },
        { value: "Triumph", text: "Triumph" },
        { value: "Royal Enfield", text: "Royal Enfield" },
        { value: "Bajaj", text: "Bajaj" },
        { value: "Shineray", text: "Shineray" },
        { value: "Haojue", text: "Haojue" },
        { value: "Dafra", text: "Dafra" },
        { value: "Kymco", text: "Kymco" },
        { value: "Outras Motos", text: "Outras" }
    ];

    // ---------- FUNCIONALIDADE DO MENU RESPONSIVO ----------
    // Alternar menu ao clicar no botão hamburger
    mobileMenu.addEventListener('click', function () {
        navMenu.classList.toggle('active');
    });

    // ---------- FUNCIONALIDADE DE ALTERNÂNCIA DE TIPO DE VEÍCULO ----------
    function atualizarMarcas() {
        // Limpar todas as opções atuais
        marcaSelect.innerHTML = '';

        // Adicionar opção padrão
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = 'Selecione a marca';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        marcaSelect.appendChild(defaultOption);

        // Adicionar as marcas do tipo de veículo selecionado
        const marcas = tipoCarroRadio.checked ? marcasCarros : marcasMotos;
        const grupoLabel = tipoCarroRadio.checked ? 'Carros' : 'Motos';

        // Criar o grupo de opções
        const optgroup = document.createElement('optgroup');
        optgroup.label = grupoLabel;

        // Adicionar cada marca ao grupo
        marcas.forEach(marca => {
            const option = document.createElement('option');
            option.value = marca.value;
            option.text = marca.text;
            optgroup.appendChild(option);
        });

        marcaSelect.appendChild(optgroup);
    }

    tipoCarroRadio.addEventListener('change', atualizarMarcas);
    tipoMotoRadio.addEventListener('change', atualizarMarcas);

    // Inicializar corretamente o estado das marcas
    atualizarMarcas();

    // ---------- GERENCIAMENTO DE DADOS E FORMULÁRIO ----------
    // Carregar clientes do localStorage ao iniciar a página
    loadClientes();

    // Adicionar evento de submit ao formulário
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Capturar todos os dados do formulário
        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const tipoVeiculo = document.querySelector('input[name="tipoVeiculo"]:checked').value;
        const placa = document.getElementById('placa').value;
        const marca = document.getElementById('marca').value;
        const modelo = document.getElementById('modelo').value;

        // Determinar tipo de lavagem e valor
        const tipoLavagem = document.querySelector('input[name="tipoLavagem"]:checked').value;
        const valor = tipoLavagem === 'simples' ? 30.00 : 50.00;

        // Capturar a forma de pagamento selecionada
        const formaPagamento = document.querySelector('input[name="formaPagamento"]:checked').value;

        // Criar objeto cliente
        const cliente = {
            nome,
            telefone: formataTelefone(telefone),
            tipoVeiculo: tipoVeiculo === 'carro' ? 'Carro' : 'Moto',
            placa,
            marca,
            modelo,
            tipo: tipoLavagem === 'simples' ? 'Simples' : 'Completa',
            valor: `R$ ${valor.toFixed(2)}`,
            formaPagamento: formatarFormaPagamento(formaPagamento),
            data: new Date().toISOString() // Adicionar timestamp
        };

        // Salvar cliente
        saveCliente(cliente);

        // Atualizar a lista na tabela
        addClienteToTable(cliente);

        // Resetar o formulário
        form.reset();

        // Reinicializar estado do dropdown de marcas
        document.getElementById('tipoCarro').checked = true;
        atualizarMarcas();

        // Atualizar relatório apenas se a aba estiver visível
        if (document.querySelector('#relatorios').classList.contains('active')) {
            gerarRelatorio();
        }

        // Se estiver na aba de cadastro, mudar para a aba de serviços para mostrar o registro
        if (document.querySelector('#cadastro').classList.contains('active')) {
            switchTab('clientes');
        }

        // Atualizar relatório após cadastrar novo serviço
        setTimeout(gerarRelatorio, 100);
    });

    // ---------- FILTROS E RELATÓRIOS ----------
    // Adicionar listeners para os botões de filtro
    document.getElementById('btnListarHoje').addEventListener('click', listarServicosDoDia);
    document.getElementById('btnListarPeriodo').addEventListener('click', function () {
        const dataInicio = new Date(document.getElementById('dataInicio').value);
        const dataFim = new Date(document.getElementById('dataFim').value);
        dataFim.setHours(23, 59, 59, 999); // Definir para fim do dia

        if (dataInicio && dataFim) {
            filtrarPorPeriodo(dataInicio, dataFim);
        } else {
            alert("Selecione as datas de início e fim do período");
        }
    });

    document.getElementById('btnListarTodos').addEventListener('click', loadClientes);

    // ---------- FUNCIONALIDADE DE RELATÓRIOS ----------
    document.getElementById('atualizarRelatorio').addEventListener('click', gerarRelatorio);

    // Função para gerar relatório
    function gerarRelatorio() {
        const clientes = JSON.parse(localStorage.getItem('lavajatoClientes')) || [];

        // Inicializar contadores
        let totalCarros = 0;
        let totalMotos = 0;
        let totalSimples = 0;
        let totalCompleta = 0;
        let valorSimples = 0;
        let valorCompleta = 0;
        let totalDinheiro = 0;
        let totalCartao = 0;
        let totalPix = 0;
        let valorDinheiro = 0;
        let valorCartao = 0;
        let valorPix = 0;

        // Processar cada cliente
        clientes.forEach(cliente => {
            // Extrair o valor numérico da string (ex: "R$ 30.00" -> 30)
            const valor = parseFloat(cliente.valor.replace('R$ ', '').replace(',', '.')) || 0;

            // Contar tipos de veículos
            if (cliente.tipoVeiculo === 'Carro') {
                totalCarros++;
            } else if (cliente.tipoVeiculo === 'Moto') {
                totalMotos++;
            }

            // Contar tipos de lavagem e calcular valores
            if (cliente.tipo === 'Simples') {
                totalSimples++;
                valorSimples += 30; // R$ 30 por lavagem simples
            } else if (cliente.tipo === 'Completa') {
                totalCompleta++;
                valorCompleta += 50; // R$ 50 por lavagem completa
            }

            // Contar formas de pagamento e somar valores
            if (cliente.formaPagamento === 'Dinheiro') {
                totalDinheiro++;
                valorDinheiro += valor;
            } else if (cliente.formaPagamento === 'Cartão') {
                totalCartao++;
                valorCartao += valor;
            } else if (cliente.formaPagamento === 'PIX') {
                totalPix++;
                valorPix += valor;
            }
        });

        // Calcular totais
        const totalVeiculos = totalCarros + totalMotos;
        const totalServicos = totalSimples + totalCompleta;
        const valorTotal = valorSimples + valorCompleta;
        const totalPagamentos = totalDinheiro + totalCartao + totalPix;
        const valorTotalPagamentos = valorDinheiro + valorCartao + valorPix;

        // Atualizar elementos do DOM
        document.getElementById('totalCarros').textContent = totalCarros;
        document.getElementById('totalMotos').textContent = totalMotos;
        document.getElementById('totalVeiculos').textContent = totalVeiculos;

        document.getElementById('totalSimples').textContent = totalSimples;
        document.getElementById('totalCompleta').textContent = totalCompleta;
        document.getElementById('totalServicos').textContent = totalServicos;

        document.getElementById('valorSimples').textContent = `R$ ${valorSimples.toFixed(2)}`;
        document.getElementById('valorCompleta').textContent = `R$ ${valorCompleta.toFixed(2)}`;
        document.getElementById('valorTotal').textContent = `R$ ${valorTotal.toFixed(2)}`;

        document.getElementById('totalDinheiro').textContent = totalDinheiro;
        document.getElementById('totalCartao').textContent = totalCartao;
        document.getElementById('totalPix').textContent = totalPix;
        document.getElementById('totalPagamentos').textContent = totalPagamentos;

        document.getElementById('valorDinheiro').textContent = `R$ ${valorDinheiro.toFixed(2)}`;
        document.getElementById('valorCartao').textContent = `R$ ${valorCartao.toFixed(2)}`;
        document.getElementById('valorPix').textContent = `R$ ${valorPix.toFixed(2)}`;
        document.getElementById('valorTotalPagamentos').textContent = `R$ ${valorTotalPagamentos.toFixed(2)}`;
    }

    // ---------- FUNÇÕES UTILITÁRIAS ----------
    // Função para formatar o telefone (XX) XXXXX-XXXX
    function formataTelefone(telefone) {
        if (telefone.length === 11) {
            return `(${telefone.substring(0, 2)}) ${telefone.substring(2, 7)}-${telefone.substring(7)}`;
        }
        return telefone;
    }

    // Função para adicionar cliente à tabela
    function addClienteToTable(cliente) {
        const row = document.createElement('tr');

        // Formatar data para exibição, se existir
        const dataFormatada = cliente.data ?
            new Date(cliente.data).toLocaleDateString('pt-BR') :
            'N/A';

        row.innerHTML = `
            <td>${cliente.nome}</td>
            <td>${cliente.telefone}</td>
            <td>${cliente.tipoVeiculo}</td>
            <td>${cliente.placa}</td>
            <td>${cliente.marca}</td>
            <td>${cliente.modelo}</td>
            <td>${cliente.tipo}</td>
            <td>${cliente.valor}</td>
            <td>${cliente.formaPagamento || 'N/A'}</td>
            <td>${dataFormatada}</td>
        `;

        clientesList.appendChild(row);
    }

    // Função para filtrar serviços do dia atual
    function listarServicosDoDia() {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); // Início do dia atual

        const amanha = new Date(hoje);
        amanha.setDate(amanha.getDate() + 1); // Início do próximo dia

        filtrarPorPeriodo(hoje, amanha);
    }

    // Função para filtrar serviços por período
    function filtrarPorPeriodo(dataInicio, dataFim) {
        const clientes = JSON.parse(localStorage.getItem('lavajatoClientes')) || [];
        clientesList.innerHTML = '';

        const clientesFiltrados = clientes.filter(cliente => {
            if (!cliente.data) return false;
            const dataServico = new Date(cliente.data);
            return dataServico >= dataInicio && dataServico < dataFim;
        });

        if (clientesFiltrados.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="9">Nenhum serviço encontrado no período selecionado</td>';
            clientesList.appendChild(row);
        } else {
            clientesFiltrados.forEach(cliente => {
                addClienteToTable(cliente);
            });
        }
    }

    // Função para salvar cliente no localStorage
    function saveCliente(cliente) {
        let clientes = JSON.parse(localStorage.getItem('lavajatoClientes')) || [];
        clientes.push(cliente);
        localStorage.setItem('lavajatoClientes', JSON.stringify(clientes));
    }

    // Função para carregar clientes do localStorage
    function loadClientes() {
        const clientes = JSON.parse(localStorage.getItem('lavajatoClientes')) || [];
        clientesList.innerHTML = '';

        if (clientes.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="9">Nenhum serviço cadastrado</td>';
            clientesList.appendChild(row);
        } else {
            clientes.forEach(cliente => {
                addClienteToTable(cliente);
            });
        }
    }

    // Adicionar função para formatar a forma de pagamento
    function formatarFormaPagamento(forma) {
        switch (forma) {
            case 'dinheiro': return 'Dinheiro';
            case 'cartao': return 'Cartão';
            case 'pix': return 'PIX';
            default: return forma;
        }
    }
});