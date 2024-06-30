const venom = require('venom-bot');
const fs = require('fs');
const path = require('path');

const groupName = 'Atendimentohumano';
const userState = {};
const welcomed = {};
const nomeCompleto = {};
const cpf = {};
const atendimentoConcluido = {}; 
const atendimentoOrcamento = {};

venom.create({
    session: 'W1NNER', 
    multidevice: true
}).then((client) => start(client)).catch((erro) => {
    console.log(erro);
});

function start(client) {
    console.log(`
        \x1b[33m
         ___        ____        ___             ______  
        |   |      /    \\      |   |           /  /   |
        |   |     /  __  \\     |   |          /  /|   |
        |   |    /  /  \\  \\    |   |         /  / |   |
        |   |   /  /    \\  \\   |   |        /__/  |   |
        |   |  /  /      \\  \\  |   |              |   |
        |   | /  /        \\  \\ |   |              |   |
        |   |/  /          \\  \\|   |        ______|   |_______
        |___/__/            \\__\\___|       |______|___|_______|
        
        conectado ao bot W1nner
        __________________________________  
        |        mensagens                 |
        |              |                   |
                       |
                       ↓
        \x1b[0m`);


        
    client.onMessage(async (message) => {
        const { from, body, type } = message;

        if (message.body.toLowerCase() === '/sair') { 
            userState[from] = '';
            welcomed[from] = false;
            nomeCompleto[from] = '';
            atendimentoOrcamento[from] = false;

            await client.sendText(from, 'Atendimento resetado.');
            return;
        }

        if (!welcomed[from]) {
            welcomed[from] = true;
            console.log(`\x1b[33m Usuário: ${message.from}\nMensagem: ${message.body} \x1b[0m`);

            // Enviar uma mensagem de boas-vindas com uma mídia
            const imagePath = './image/w1.png';
            const caption = `👋 Olá, seja bem-vindo à W1nner Engenharia e Topografia!\nEscolha uma das opções abaixo:\n\n1 - ENTREGAR DOCUMENTOS\n2 - LISTA DE SERVIÇOS\n3 - FALAR COM ATENDENTE`;
            await client.sendImage(message.from, imagePath, 'w1.png', caption);
            return;
        }

        // Lógica para o menu principal
        if (!userState[from]) {
            if (body === '1') {
            console.log(`\x1b[33m Usuário: ${message.from}\nMensagem: ${message.body} \x1b[0m`);
                userState[from] = 'menu_entregar_documentos';
                console.log(`\x1b[32m Usuário: ${message.from}\nMensagem: ${message.body} \x1b[0m`);
                await client.sendImage(message.from, './image/w1.png', 'w1.png', 
                    `
*Escolha uma das opções abaixo:*

-----------------------------------

1 - REURB
2 - UNIFICAÇÃO
3 - USUCAPIÃO
4 - CERTIFICAÇÃO NO INCRA
5 - PARCELAMENTO DE SOLO
6 - LEVANTAMENTOS TOPOGRÁFICO
7 - PROJETOS

9 - VOLTAR AO MENU PRINCIPAL`);
                return;
            } else if (body === '2') {
                userState[from] = 'menu_lista_servicos';
                 await client.sendImage(message.from, './image/w1.png', 'w1.png', 
                    `
*Escolha uma das opções abaixo:*

-----------------------------------
1 - UNIFICAÇÃO
2 - REURB
3 - USUCAPIÃO
4 - CERTIFICAÇÃO NO INCRA
5 - PARCELAMENTO DE SOLO
6 - LEVANTAMENTOS TOPOGRÁFICO
7 - PROJETOS`);
                return;
            } else if (body === '3') {
                userState[message.from] = 'atendimento';

                if (atendimentoConcluido[message.from]) {
                    await client.sendText(message.from, 'Você já solicitou atendimento humano. Por favor, aguarde nosso contato.');
                    return;
                }

                const chats = await client.getAllChats();
                const chat = chats.find(chat => chat.name === groupName);

                if (chat) {
                    const userNumber = message.from.split('@')[0];
                    await client.sendText(chat.id._serialized, `Usuário ${userNumber} está solicitando atendimento humano.`);
                    await client.sendText(message.from, 'Seu pedido de atendimento humano foi enviado. Aguarde nosso contato.');
                    atendimentoConcluido[message.from] = true;
                } else {
                    console.log(`Grupo '${groupName}' não encontrado.`);
                    await client.sendText(message.from, 'O grupo de atendimento não foi encontrado. Por favor, tente novamente mais tarde.');
                }
            }
        }
        

        if (userState[from] === 'menu_entregar_documentos') {
            console.log(`\x1b[32m Usuário: ${message.from}\nMensagem: ${message.body} \x1b[0m`);
            
            switch (body) {
                case '1':
                    userState[from] = 'entregar_documentos';
                    await client.sendText(from, 'Por favor, digite seu nome completo:');
                    break;
                case '2':
                    userState[from] = 'unificacao';
                    await client.sendText(from, 'Certo para fazer a *UNIFICAÇÃO* preciso do seu nome completo.');
                    break;
                case '3':
                    userState[from] = 'USUCAPEAO';
                    await client.sendText(from, 'Certo para fazer o *USUCAPEÃO* preciso do seu nome completo.');
                    break;
                case '4':
                    userState[from] = 'incra';
                    await client.sendText(from, 'Certo para fazer a *CERTIFICAÇÃO NO INCRA* preciso do seu nome completo.');
                    break;
                case '5':
                    userState[from] = 'PARCELAMENTO';
                    await client.sendText(from, 'Certo para fazer o *PARCELAMENTO DO SOLO* preciso do seu nome completo.');
                    break;
                case '6':
                    userState[from] = 'levantamentoTopografico';
                    await client.sendText(from, 'Certo para fazer o *LEVANTAMENTO TOPOGRÁFICO* preciso do seu nome completo.');
                    break;
                case '7':
                    userState[from] = 'projetos';
                    await client.sendText(from, 'Certo para fazer o *PROJETO* preciso do seu nome completo.');
                    break;
                case '9':
                    userState[from] = ''; // Reseta o estado do usuário para voltar ao menu principal
                    const imagePath = './image/w1.png';
                    const caption = `👋 Olá, seja bem-vindo à W1nner Engenharia e Topografia!\nEscolha uma das opções abaixo:\n\n1 - ENTREGAR DOCUMENTOS\n2 - LISTA DE SERVIÇOS\n3 - FALAR COM ATENDENTE`;
                    try {
                        await client.sendImage(from, imagePath, 'w1.png', caption);
                    } catch (error) {
                        console.error('Erro ao enviar imagem:', error);
                    }
                    break;
                default:
                    await client.sendText(from, 'Opção inválida. Por favor, escolha uma opção válida.');
                    break;
            }
        }

        // Lógica para o menu de lista de serviços
        if (userState[from] === 'menu_lista_servicos') {
            console.log(`\x1b[32m Usuário: ${message.from}\nMensagem: ${message.body} \x1b[0m`);
            switch (body) {
                case '1':
                    const unificacaoDocumentPath = 'C:/Users/mikae/Desktop/w1n/documentação/unificacao.pdf'; // Caminho para o documento REURB
                    try {
                        if (fs.existsSync(unificacaoDocumentPath)) {
                            // Tenta enviar o documento PDF
                            await client.sendFile(from, unificacaoDocumentPath, 'DOCUMENTOS UNIFICAÇÃO.pdf', 'Aqui estão os documentos necessários para a requisição que você solicitou.');
                        } else {
                            throw new Error('Documento não encontrado');
                        }
                    } catch (error) {
                        console.error("Erro ao enviar o documento:", error);
                        // Se houver um erro ao enviar o documento PDF, envia o texto formatado com as informações necessárias
                        await client.sendText(from, `*Documentação para Unificação*
        
        *Documentos pessoais do proprietário:*
        - RG e CPF ou CNH (pessoas físicas)
        - Contrato Social ou Estatuto Social, CNPJ e documentos pessoais dos representantes legais (pessoas jurídicas)
        
        *Certidão de Casamento (se aplicável):*
        - Com averbações atualizadas, caso o proprietário seja casado.
        - Ou certidão de nascimento
        
        *Certidão de Óbito (se aplicável):*
        - Em caso de falecimento de um dos proprietários.
        
        *Título de propriedade dos imóveis:*
        - Certidão de Matrícula dos imóveis atualizada (expedida pelo Cartório de Registro de Imóveis, com validade máxima de 30 dias).
        - Escritura pública de compra e venda, doação, ou outro título aquisitivo, registrado no Cartório de Registro de Imóveis.
        
        *Certidão Negativa de Débitos Municipais:*
        - Comprovando que não há débitos de IPTU ou outras taxas municipais.`);
                    }
                    
                    break;
                case '2':
                    // Se selecionar REURB, enviar o documento PDF correspondente
                    const reurbDocumentPath = 'C:/Users/mikae/Desktop/w1n/documentação/DOCUMENTOS_REURB.pdf'; // Caminho para o documento REURB
                            
                    // Verificar se o arquivo PDF existe
                    if (fs.existsSync(reurbDocumentPath)) {
                        try {
                            // Tenta enviar o documento PDF
                            await client.sendFile(from, reurbDocumentPath, 'DOCUMENTOS_REURB.pdf', 'Aqui estão os documentos necessários para a requisição que você solicitou.');
                        } catch (error) {
                            console.error("Erro ao enviar o documento:", error);
                            // Se houver um erro ao enviar o documento PDF, envia o texto formatado em vez disso
                            await client.sendText(from, 
`LISTA DE DOCUMENTOS NECESSÁRIOS - REURB
        
**DOCUMENTOS PESSOAIS DE TODOS INTEGRANTES DA CASA (Cópias LEGÍVEIS)**
        
- CPF;
- RG (Carteira de identidade);
- CNH (Carteira Nacional de Habilitação).
        
**ESTADO CIVIL (Cópias LEGÍVEIS)**
        
- Se for solteiro (a): certidão de nascimento preferencialmente atualizada;
- Se conviver em união estável / morar junto: declaração de união estável preferencialmente atualizada;
- Se for casado (a): certidão de casamento preferencialmente atualizada;
- Se for divorciado (a) ou separado (a): certidão de casamento com averbação de divórcio preferencialmente atualizada;
- Se for viúvo (a): certidão de casamento e certidão de óbito.
        
**RENDA DE TODOS OS INTEGRANTES DA CASA (Cópias LEGÍVEIS)**
        
- Se for celetista (empregado): Folha de pagamento preferencialmente atualizados;
- Se for autônomo (a): declaração de renda descrevendo a profissão e o valor que ganha por MÊS;
- Se for aposentado (a): Histórico do benefício;
- Se for do lar: Declaração do lar;
- Se for estudante: Declaração de estudante;
- Se for desempregado: Declaração de desempregado.
        
**RESIDÊNCIA - comprovante de onde mora, preferencialmente atualizado;**
        
- Conta de luz ou conta de água 
- em nome de um dos beneficiários;
- Caso o comprovante de água ou luz esteja em nome de outra pessoa, realizar declaração de residência, a declaração deve ser assinada pelo titular da luz ou água.
        
**POSSE**
        
- Contrato de compra e venda: Contrato de compra e venda do terreno, onde conste como comprador, a pessoa que quer regularizar o terreno;
- Conta de luz ou água: Conta de energia ou água até dezembro de 2016, em nome da pessoa que quer regularizar o terreno;
- IPTU: Carnê de IPTU até dezembro de 2016, em nome da pessoa que quer regularizar o terreno.
- Caso não houver nenhum destes documentos entrar em contato com a empresa responsável.
        
**HISTÓRICO DA POSSE (Se tiver)**
        
- Documentos antigos do terreno, contratos de compra e venda dos antigos vendedores, matrícula, declarações, entre outros.`);
                        }
                    } else {
                        await client.sendText(from, 'Desculpe, o documento REURB não foi encontrado.');
                    }
                    break;
                case '3':
                    const usuDocumentPath = 'C:/Users/mikae/Desktop/w1n/documentação/usucapeao.pdf'; // Caminho para o documento REURB
                    try {
                        if (fs.existsSync(usuDocumentPath)) {
                            // Tenta enviar o documento PDF
                            await client.sendFile(from, usuDocumentPath, 'DOCUMENTOS_USUCAPEÃO.pdf', 'Aqui estão os documentos necessários para a requisição que você solicitou.');
                        } else {
                            throw new Error('Documento não encontrado');
                        }
                    } catch (error) {
                        console.error("Erro ao enviar o documento:", error);
                        // Se houver um erro ao enviar o documento PDF, envia o texto formatado com as informações necessárias
                        await client.sendText(from, `*Entrega de documentos Usucapião*
        
*Documentos de Identificação:*
- RG e CPF do requerente (e do cônjuge, se aplicável)
- Contrato Social ou Estatuto Social, CNPJ e documentos pessoais dos representantes legais (pessoas jurídicas)
- Certidão de casamento (se casado) ou certidão de óbito (se viúvo)
        
*Comprovante de Residência:*
- Conta de água, luz, telefone, etc.
        
*Certidão de Matrícula do Imóvel:*
- Certidão de matrícula atualizada (obtida no Cartório de Registro de Imóveis)
        
*Comprovantes de Posse:*
- Recibos de pagamento de impostos (IPTU, ITR) em nome do possuidor
- Comprovantes de pagamento de contas de água, luz, telefone
- Contratos de compra e venda, cessão de direitos, ou outro documento que comprove a posse

        
*Declarações de Testemunhas:*
- Declarações de, no mínimo, três testemunhas que possam atestar a posse contínua e ininterrupta pelo período exigido
- Essas declarações devem ser feitas com reconhecimento de firma

*Certidão Negativa de Débitos Municipais:*
- Certidão negativa de débitos de IPTU ou outras taxas municipais

*Documentos de Representação:*
- Documentos de representação legal, caso o requerente seja uma pessoa jurídica (ex: contrato social, estatuto, ata de assembleia)

*Declarações de Confrontantes:*
- Declarações dos proprietários dos imóveis vizinhos, reconhecendo a posse e informando que não há litígio quanto aos limites das propriedades

*Prazo de Posse:*
- A posse deve ser contínua e ininterrupta pelo período exigido para o tipo de usucapião (geralmente de 5 a 15 anos)`);
                    }
                    break;
                case '4':
                    const incraDocumentPath = 'C:/Users/mikae/Desktop/w1n/documentação/INCRA.pdf'; // Caminho para o documento REURB
                    try {
                        if (fs.existsSync(incraDocumentPath)) {
                            await client.sendFile(from, incraDocumentPath, 'DOCUMENTAÇÃO INCRA.pdf', 'Aqui estão os documentos necessários para a requisição que você solicitou.');
                        } else {
                            throw new Error('Documento não encontrado');
                        }
                    } catch (error) {
                        console.error("Erro ao enviar o documento:", error);
                        await client.sendText(from, `*Documentação para Unificação*
        
*Documentos Pessoais:*
- RG e CPF do proprietário (pessoas físicas)
- Contrato Social, Estatuto Social e CNPJ (pessoas jurídicas)
- Documentos pessoais dos representantes legais (pessoas jurídicas)
        
*Certidão de Casamento (se aplicável):*
- Certidão de casamento com averbações atualizadas
        
*Procuração (se aplicável):*
- Procuração outorgando poderes ao responsável pelo processo, se não for o proprietário
        
*Título de Propriedade:*
- Certidão de Matrícula do imóvel atualizada (expedida pelo Cartório de Registro de Imóveis)
        
*Certidão Negativa de Débitos:*
- Certidão negativa de débitos do INCRA

*Declaração de Confrontantes:*
- Declaração dos confrontantes reconhecendo os limites do imóvel`);
                    }
                    
                    break;
                case '5':
                    const soloDocumentPath = 'C:/Users/mikae/Desktop/w1n/documentação/parcelamento_solo.pdf'; // Caminho para o documento REURB
                    try {
                        if (fs.existsSync(soloDocumentPath)) {
                            await client.sendFile(from, soloDocumentPath, 'PARCELAMENTO DE SOLO.pdf', 'Aqui estão os documentos necessários para a requisição que você solicitou.');
                        } else {
                            throw new Error('Documento não encontrado');
                        }
                    } catch (error) {
                        console.error("Erro ao enviar o documento:", error);
                        await client.sendText(from, `*Documentação para Unificação*
        
*Documentos Pessoais:*
- RG e CPF do proprietário (pessoas físicas)
- Contrato Social, Estatuto Social e CNPJ (pessoas jurídicas)
- Documentos pessoais dos representantes legais (pessoas jurídicas)
        
*Certidão de Casamento (se aplicável):*
- Certidão de casamento com averbações atualizadas
        
*Procuração (se aplicável):*
- Procuração outorgando poderes ao responsável pelo processo, se não for o proprietário
        
*Título de Propriedade:*
- Certidão de Matrícula do imóvel atualizada (expedida pelo Cartório de Registro de Imóveis)
        
*Certidão Negativa de Débitos:*
- Certidão negativa de débitos do INCRA

*Declaração de Confrontantes:*
- Declaração dos confrontantes reconhecendo os limites do imóvel`);
                    }
                    break;
                    case '6':
                        const topoDocumentPath = 'C:/Users/mikae/Desktop/w1n/documentação/levantamento.pdf';
                        try {
                            if (fs.existsSync(topoDocumentPath)) {
                                await client.sendFile(from, topoDocumentPath, 'LEVANTAMENTO TOPOGRAFICO.pdf', 'Aqui estão os documentos necessários para a requisição que você solicitou.');
                            } else {
                                throw new Error('Documento não encontrado');
                            }
                        } catch (error) {
                            console.error("Erro ao enviar o documento:", error);
                            await client.sendText(from, `*LEVANTAMENTO TOPOGRÁFICOS*

*Documentos Pessoais:*
- RG e CPF do proprietário (pessoas físicas)
- Contrato Social, Estatuto Social e CNPJ (pessoas jurídicas)
- Documentos pessoais dos representantes legais (pessoas jurídicas)

*Título de Propriedade:*
- Certidão de Matrícula do imóvel atualizada (expedida pelo Cartório de Registro de Imóveis)
- Escritura pública ou outro título aquisitivo registrado no Cartório de Registro de Imóveis

*REGISTO IMOBILIARIO:*
- Registro imobilioario
- contrato de compra e vendas
- documento de posse`);}
                        break;
                    case '7':
                        const projetoDocumentPath = 'C:/Users/mikae/Desktop/w1n/documentação/projetos.pdf';
                        try {
                            if (fs.existsSync(projetoDocumentPath)) {
                                await client.sendFile(from, projetoDocumentPath, 'PROJETOS.pdf', 'Aqui estão os documentos necessários para a requisição que você solicitou.');
                            } else {
                                throw new Error('Documento não encontrado');
                            }
                        } catch (error) {
                            console.error("Erro ao enviar o documento:", error);
                            await client.sendText(from, `*PROJETOS*

*Documentos Pessoais:*
- RG e CPF do proprietário (pessoas físicas)
- Contrato Social, Estatuto Social e CNPJ (pessoas jurídicas)
- Documentos pessoais dos representantes legais (pessoas jurídicas)

*Título de Propriedade:*
- Certidão de Matrícula do imóvel atualizada (expedida pelo Cartório de Registro de Imóveis)
- Escritura pública ou outro título aquisitivo registrado no Cartório de Registro de Imóveis

*REGISTO IMOBILIARIO:*
- Registro imobilioario
- contrato de compra e vendas
- documento de posse`);}
                        break;
                default:
                    await client.sendText(from, 'Opção inválida. Por favor, escolha uma opção válida.');
            }
            userState[from] = '';
            welcomed[from] = false;
            nomeCompleto[from] = '';
        }

//LEVANTAMENTOS TOPOGRAFICOS
//armazena o nome completo....
if (userState[from] === 'levantamentoTopografico') {
    if (!nomeCompleto[from]) {
        nomeCompleto[from] = body;
        await client.sendText(from, `Ok, ${nomeCompleto[from]}. Agora, por favor, envie seu CPF com todos os dígitos e pontuação.`);
        userState[from] = 'topoCpf';
        return;
    }
}

//armazena no CPF.....
if (userState[from] === 'topoCpf') {
    const regexCPF = /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/;
    if (regexCPF.test(body.trim())) {
        cpf[from] = body.trim();
        await client.sendText(from, 'Agora, envie seu CPF em formato PDF.');
        userState[from] = 'projetosAguardandoCpf';
    } else {
        await client.sendText(from, 'CPF inválido. Por favor, envie seu CPF com todos os dígitos e em pontuação.');
    }
    return;
}

    //PROJETOS
    //armazena o nome completo....
    if (userState[from] === 'projetos') {
        if (!nomeCompleto[from]) {
            nomeCompleto[from] = body;
            await client.sendText(from, `Ok, ${nomeCompleto[from]}. Agora, por favor, envie seu CPF com todos os dígitos e pontuação.`);
            userState[from] = 'projetosCpf';
            return;
        }
    }

//armazena no CPF.....
    if (userState[from] === 'projetosCpf') {
        const regexCPF = /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/;
        if (regexCPF.test(body.trim())) {
            cpf[from] = body.trim();
            await client.sendText(from, 'Agora, envie seu CPF em formato PDF.');
            userState[from] = 'projetosAguardandoCpf';
        } else {
            await client.sendText(from, 'CPF inválido. Por favor, envie seu CPF com todos os dígitos e em pontuação.');
        }
        return;
    }

//armazena o CPF em pdf, e cira a pasta
    if (userState[from] === 'projetosAguardandoCpf') {
        const docPath = criarPasta(nomeCompleto[from], cpf[from]);
        if (type === 'document') {
            try {
                const media = await client.decryptFile(message);
                const nomeArquivo = `CPF_${nomeCompleto[from]}.pdf`;
                salvarMidia(docPath, nomeArquivo, media);
                console.log(`\x1b[32m ✓ ${nomeCompleto[from]} CPF ENVIADO\x1b[0m`);
                await client.sendText(from, `Por favor, envie um de cada proprietario documento de *comprovate de residencia:*
                
- Agua
- Luz
- internet`);

                userState[from] = 'projetoResidencia';
            } catch (error) {
                console.error('Erro ao processar o documento:', error);
                await client.sendText(from, 'Ocorreu um erro ao processar o documento. Por favor, tente novamente.');
            }
        } else {
            await client.sendText(from, 'Por favor, envie seu comprovante de residencia em formato PDF.');
        }
        return;
    }

    //armazena o TITULO DO PROPRIETARIO em pdf
    if (userState[from] === 'projetoResidencia') {
        const docPath = criarPasta(nomeCompleto[from], cpf[from]);
        if (type === 'document') {
            try {
                const media = await client.decryptFile(message);
                const nomeArquivo = `comprovate de residencia ${nomeCompleto[from]}.pdf`;
                salvarMidia(docPath, nomeArquivo, media);
                console.log(`\x1b[32m ✓ ${nomeCompleto[from]} COMPROVANTE DE RESIDENCIA ENVIADO\x1b[0m`);
                await client.sendText(from, `Por favor, envie um de cada proprietario documento de *Título de Propriedade:*
                
- Certidão de Matrícula do imóvel atualizada (expedida pelo Cartório de Registro de Imóveis)
- Escritura pública ou outro título aquisitivo registrado no Cartório de Registro de Imóveis`);

                userState[from] = 'propriedade';
            } catch (error) {
                console.error('Erro ao processar o documento:', error);
                await client.sendText(from, 'Ocorreu um erro ao processar o documento. Por favor, tente novamente.');
            }
        } else {
            await client.sendText(from, 'Por favor, envie seu comprovante de residencia em formato PDF.');
        }
        return;
    }

    //armazena o REGISTO IMOBILIARIO em pdf
    if (userState[from] === 'propriedade') {
        const docPath = criarPasta(nomeCompleto[from], cpf[from]);
        if (type === 'document') {
            try {
                const media = await client.decryptFile(message);
                const nomeArquivo = `TITULO DO PROPRIETARIO ${nomeCompleto[from]}.pdf`;
                salvarMidia(docPath, nomeArquivo, media);
                console.log(`\x1b[32m ✓ ${nomeCompleto[from]} TITULO DO PROPRIETARIO\x1b[0m`);
                await client.sendText(from, `Por favor, envie um de cada proprietario documento de *REGISTO IMOBILIARIO:*
                
- Registro imobilioario
- contrato de compra e vendas
- documento de posse`);

                userState[from] = 'fimprojeto';
            } catch (error) {
                console.error('Erro ao processar o documento:', error);
                await client.sendText(from, 'Ocorreu um erro ao processar o documento. Por favor, tente novamente.');
            }
        } else {
            await client.sendText(from, 'Por favor, envie seu comprovante de residencia em formato PDF.');
        }
        return;
    }

    //finaliza e garda registro
    if (userState[from] === 'fimprojeto') {
        const docPath = criarPasta(nomeCompleto[from], cpf[from]);
        if (type === 'document') {
            const media = await client.decryptFile(message);
            const nomeArquivo = `REGISTO IMOBILIARIO (${nomeCompleto[from]}).pdf`;
            salvarMidia(docPath, nomeArquivo, media);
            console.log(`\x1b[32m ✓ ${nomeCompleto[from]} REGISTO IMOBILIARIO ENVIADO\x1b[0m`);
            await client.sendText(from, 'A W1nner Engenharia e Topografia agradece seu contato e em breve entraremos em contato.');
            userState[from] = '';
            welcomed[from] = false; 
            nomeCompleto[from] = ''; 
            return;
        } else {
            await client.sendText(from, 'Por favor, envie seu documento de *Certidão Negativa* em formato PDF.');
        }
        return;
    }

    //CERTIFICAÇÃO NO INCRA
    //armazena o nome completo....
    if (userState[from] === 'incra') {
        if (!nomeCompleto[from]) {
            nomeCompleto[from] = body;
            await client.sendText(from, `Ok, ${nomeCompleto[from]}. Agora, por favor, envie seu CPF com todos os dígitos e pontuação.`);
            userState[from] = 'incraCpf';
            return;
        }
    }

//armazena no CPF.....
    if (userState[from] === 'incraCpf') {
        const regexCPF = /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/;
        if (regexCPF.test(body.trim())) {
            cpf[from] = body.trim();
            await client.sendText(from, 'Agora, envie seu CPF em formato PDF.');
            userState[from] = 'incraAguardandoCpf';
        } else {
            await client.sendText(from, 'CPF inválido. Por favor, envie seu CPF com todos os dígitos e em pontuação.');
        }
        return;
    }

//armazena o CPF em pdf, e cira a pasta
    if (userState[from] === 'incraAguardandoCpf') {
        const docPath = criarPasta(nomeCompleto[from], cpf[from]);
        if (type === 'document') {
            try {
                const media = await client.decryptFile(message);
                const nomeArquivo = `CPF_${nomeCompleto[from]}.pdf`;
                salvarMidia(docPath, nomeArquivo, media);
                console.log(`\x1b[32m ✓ ${nomeCompleto[from]} CPF ENVIADO\x1b[0m`);
                await client.sendText(from, `Por favor, envie um de cada proprietario documento de *comprovate de residencia:*
                
- Agua
- Luz
- internet`);

                userState[from] = 'incraResidencia';
            } catch (error) {
                console.error('Erro ao processar o documento:', error);
                await client.sendText(from, 'Ocorreu um erro ao processar o documento. Por favor, tente novamente.');
            }
        } else {
            await client.sendText(from, 'Por favor, envie seu comprovante de residencia em formato PDF.');
        }
        return;
    }

//armazena o comprovante de residencia
if (userState[from] === 'incraResidencia') {
    const docPath = criarPasta(nomeCompleto[from], cpf[from]);
    if (type === 'document') {
        try {
            const media = await client.decryptFile(message);
            const nomeArquivo = `comprovante de residencia ${nomeCompleto[from]}.pdf`;
            salvarMidia(docPath, nomeArquivo, media);
            console.log(`\x1b[32m ✓ ${nomeCompleto[from]} COMPROVANTE DE RESIDENCIA ENVIADO\x1b[0m`);
            await client.sendText(from, `Por favor, envie a *Procuração: em PDF:*
            
- Procuração outorgando poderes ao responsável pelo processo, se não for o proprietário)`);

            userState[from] = 'propriedade';
        } catch (error) {
            console.error('Erro ao processar o documento:', error);
            await client.sendText(from, 'Ocorreu um erro ao processar o documento. Por favor, tente novamente.');
        }
    } else {
        await client.sendText(from, 'Por favor, envie seu CPF em formato PDF.');
    }
    return;
}

//armazena o comprovante de residencia
if (userState[from] === 'propriedade') {
    const docPath = criarPasta(nomeCompleto[from], cpf[from]);
    if (type === 'document') {
        try {
            const media = await client.decryptFile(message);
            const nomeArquivo = `comprovante de residencia ${nomeCompleto[from]}.pdf`;
            salvarMidia(docPath, nomeArquivo, media);
            console.log(`\x1b[32m ✓ ${nomeCompleto[from]} COMPROVANTE DE RESIDENCIA ENVIADO\x1b[0m`);
            await client.sendText(from, `Por favor, envie a *Título de Propriedade: em PDF:*
            
- Certidão de Matrícula do imóvel atualizada (expedida pelo Cartório de Registro de Imóveis)`);

            userState[from] = 'negativaIncra';
        } catch (error) {
            console.error('Erro ao processar o documento:', error);
            await client.sendText(from, 'Ocorreu um erro ao processar o documento. Por favor, tente novamente.');
        }
    } else {
        await client.sendText(from, 'Por favor, envie seu CPF em formato PDF.');
    }
    return;
}

//armazena o comprovante de residencia
if (userState[from] === 'negativaIncra') {
    const docPath = criarPasta(nomeCompleto[from], cpf[from]);
    if (type === 'document') {
        try {
            const media = await client.decryptFile(message);
            const nomeArquivo = `comprovante de residencia ${nomeCompleto[from]}.pdf`;
            salvarMidia(docPath, nomeArquivo, media);
            console.log(`\x1b[32m ✓ ${nomeCompleto[from]} COMPROVANTE DE RESIDENCIA ENVIADO\x1b[0m`);
            await client.sendText(from, `Por favor, envie a *Certidão Negativa de Débitos:*
            
- Certidão negativa de débitos do INCRA`);

            userState[from] = 'imovel';
        } catch (error) {
            console.error('Erro ao processar o documento:', error);
            await client.sendText(from, 'Ocorreu um erro ao processar o documento. Por favor, tente novamente.');
        }
    } else {
        await client.sendText(from, 'Por favor, envie seu CPF em formato PDF.');
    }
    return;
}

//armazena o comprovante de residencia
if (userState[from] === 'imovel') {
    const docPath = criarPasta(nomeCompleto[from], cpf[from]);
    if (type === 'document') {
        try {
            const media = await client.decryptFile(message);
            const nomeArquivo = `comprovante de residencia ${nomeCompleto[from]}.pdf`;
            salvarMidia(docPath, nomeArquivo, media);
            console.log(`\x1b[32m ✓ ${nomeCompleto[from]} COMPROVANTE DE RESIDENCIA ENVIADO\x1b[0m`);
            await client.sendText(from, `Por favor, envie a *Declaração de Confrontantes:*
            
- Declaração dos confrontantes reconhecendo os limites do imóvel`);

            userState[from] = 'fimIncra';
        } catch (error) {
            console.error('Erro ao processar o documento:', error);
            await client.sendText(from, 'Ocorreu um erro ao processar o documento. Por favor, tente novamente.');
        }
    } else {
        await client.sendText(from, 'Por favor, envie seu CPF em formato PDF.');
    }
    return;
}

if (userState[from] === 'fimIncra') {
    const docPath = criarPasta(nomeCompleto[from], cpf[from]);
    if (type === 'document') {
        const media = await client.decryptFile(message);
        const nomeArquivo = `Certidão Negativa (${nomeCompleto[from]}).pdf`;
        salvarMidia(docPath, nomeArquivo, media);
        console.log(`\x1b[33m ✓ ${nomeCompleto[from]} Certidão Negativa ENVIADO\x1b[0m`);
        await client.sendText(from, 'A W1nner Engenharia e Topografia agradece seu contato e em breve entraremos em contato.');
        userState[from] = '';
        welcomed[from] = false; 
        nomeCompleto[from] = ''; 
        return;
    } else {
        await client.sendText(from, 'Por favor, envie seu documento de *Certidão Negativa* em formato PDF.');
    }
    return;
}


//parcelamento
//armazena o nome completo....
    if (userState[from] === 'PARCELAMENTO') {
        if (!nomeCompleto[from]) {
            nomeCompleto[from] = body;
            await client.sendText(from, `Ok, ${nomeCompleto[from]}. Agora, por favor, envie seu CPF com todos os dígitos e pontuação.`);
            userState[from] = 'parCpf';
            return;
        }
    }

//armazena no CPF.....
    if (userState[from] === 'parCpf') {
        const regexCPF = /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/;
        if (regexCPF.test(body.trim())) {
            cpf[from] = body.trim();
            await client.sendText(from, 'Agora, envie seu CPF em formato PDF.');
            userState[from] = 'par_aguardando_cpf';
        } else {
            await client.sendText(from, 'CPF inválido. Por favor, envie seu CPF com todos os dígitos e em pontuação.');
        }
        return;
    }

//armazena o CPF em pdf, e cira a pasta .....
    if (userState[from] === 'par_aguardando_cpf') {
        const docPath = criarPasta(nomeCompleto[from], cpf[from]);
        if (type === 'document') {
            try {
                const media = await client.decryptFile(message);
                const nomeArquivo = `CPF_${nomeCompleto[from]}.pdf`;
                salvarMidia(docPath, nomeArquivo, media);
                console.log(`\x1b[32m ✓ ${nomeCompleto[from]} CPF ENVIADO\x1b[0m`);
                await client.sendText(from, `Por favor, envie um de cada proprietario documento de *comprovate de residencia:*
                
- Agua
- Luz
- internet`);

                userState[from] = 'parResidencia';
            } catch (error) {
                console.error('Erro ao processar o documento:', error);
                await client.sendText(from, 'Ocorreu um erro ao processar o documento. Por favor, tente novamente.');
            }
        } else {
            await client.sendText(from, 'Por favor, envie seu comprovante de residencia em formato PDF.');
        }
        return;
    }

    //armazena o comprovante de agua e luz .....
    if (userState[from] === 'parResidencia') {
        const docPath = criarPasta(nomeCompleto[from], cpf[from]);
        if (type === 'document') {
            try {
                const media = await client.decryptFile(message);
                const nomeArquivo = `comprovante de residencia ${nomeCompleto[from]}.pdf`;
                salvarMidia(docPath, nomeArquivo, media);
                console.log(`\x1b[32m ✓ ${nomeCompleto[from]} CPF ENVIADO\x1b[0m`);
                await client.sendText(from, `Por favor, envie um de cada proprietario documento de *Título de Propriedade:*
                
- Certidão de Matrícula do imóvel atualizada (expedida pelo Cartório de Registro de Imóveis)`);

                userState[from] = 'parNegativa';
            } catch (error) {
                console.error('Erro ao processar o documento:', error);
                await client.sendText(from, 'Ocorreu um erro ao processar o documento. Por favor, tente novamente.');
            }
        } else {
            await client.sendText(from, 'Por favor, envie seu comprovante de residencia em formato PDF.');
        }
        return;
    }

    //armazena armazena certidão de debito negativo .....
    if (userState[from] === 'parNegativa') {
        const docPath = criarPasta(nomeCompleto[from], cpf[from]);
        if (type === 'document') {
            try {
                const media = await client.decryptFile(message);
                const nomeArquivo = `titulo de propriedade ${nomeCompleto[from]}.pdf`;
                salvarMidia(docPath, nomeArquivo, media);
                console.log(`\x1b[32m ✓ ${nomeCompleto[from]} CPF ENVIADO\x1b[0m`);
                await client.sendText(from, `Por favor, envie um de cada proprietario documento de *Certidão Negativa de Débitos Municipais:*
                
- Certidão negativa de débitos do IPTU ou outras taxas municipais`);

                userState[from] = 'parFim';
            } catch (error) {
                console.error('Erro ao processar o documento:', error);
                await client.sendText(from, 'Ocorreu um erro ao processar o documento. Por favor, tente novamente.');
            }
        } else {
            await client.sendText(from, 'Por favor, envie seu comprovante de residencia em formato PDF.');
        }
        return;
    }

//agradece e finaliza a conversa...
    if (userState[from] === 'parFim') {
        const docPath = criarPasta(nomeCompleto[from], cpf[from]);
        if (type === 'document') {
            const media = await client.decryptFile(message);
            const nomeArquivo = `Certidão Negativa (${nomeCompleto[from]}).pdf`;
            salvarMidia(docPath, nomeArquivo, media);
            console.log(`\x1b[33m ✓ ${nomeCompleto[from]} Certidão Negativa ENVIADO\x1b[0m`);
            await client.sendText(from, 'A W1nner Engenharia e Topografia agradece seu contato e em breve entraremos em contato.');
            userState[from] = '';
            welcomed[from] = false; 
            nomeCompleto[from] = ''; 
            return;
        } else {
            await client.sendText(from, 'Por favor, envie seu documento de *Certidão Negativa* em formato PDF.');
        }
        return;
    }

    //USUCAPEÃO
    //armazena o nome completo....
            if (userState[from] === 'USUCAPEAO') {
                if (!nomeCompleto[from]) {
                    nomeCompleto[from] = body;
                    await client.sendText(from, `Ok, ${nomeCompleto[from]}. Agora, por favor, envie seu CPF com todos os dígitos e pontuação.`);
                    userState[from] = 'usuCpf';
                    return;
                }
            }

//armazena no CPF.....
            if (userState[from] === 'usuCpf') {
                const regexCPF = /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/;
                if (regexCPF.test(body.trim())) {
                    cpf[from] = body.trim();
                    await client.sendText(from, 'Agora, envie seu CPF em formato PDF.');
                    userState[from] = 'uso_aguardando_cpf';
                } else {
                    await client.sendText(from, 'CPF inválido. Por favor, envie seu CPF com todos os dígitos e em pontuação.');
                }
                return;
            }

//armazena o CPF em pdf, e cira a pasta .....
            if (userState[from] === 'uso_aguardando_cpf') {
                const docPath = criarPasta(nomeCompleto[from], cpf[from]);
                if (type === 'document') {
                    try {
                        const media = await client.decryptFile(message);
                        const nomeArquivo = `CPF_${nomeCompleto[from]}.pdf`;
                        salvarMidia(docPath, nomeArquivo, media);
                        console.log(`\x1b[32m ✓ ${nomeCompleto[from]} CPF ENVIADO\x1b[0m`);
                        await client.sendText(from, `Por favor, envie um de cada proprietario documento de *comprovate de residencia:*
                        
- Agua
- Luz
- internet`);

                        userState[from] = 'usoResidencia';
                    } catch (error) {
                        console.error('Erro ao processar o documento:', error);
                        await client.sendText(from, 'Ocorreu um erro ao processar o documento. Por favor, tente novamente.');
                    }
                } else {
                    await client.sendText(from, 'Por favor, envie seu comprovante de residencia em formato PDF.');
                }
                return;
            }

//armazena o comprovante de residencia
            if (userState[from] === 'usoResidencia') {
                const docPath = criarPasta(nomeCompleto[from], cpf[from]);
                if (type === 'document') {
                    try {
                        const media = await client.decryptFile(message);
                        const nomeArquivo = `comprovante de residencia ${nomeCompleto[from]}.pdf`;
                        salvarMidia(docPath, nomeArquivo, media);
                        console.log(`\x1b[32m ✓ ${nomeCompleto[from]} COMPROVANTE DE RESIDENCIA ENVIADO\x1b[0m`);
                        await client.sendText(from, `Por favor, envie um de cada proprietario documento de *Certidão de Matrícula do Imóvel: em PDF:*
                        
- Certidão de matrícula atualizada (obtida no Cartório de Registro de Imóveis)`);

                        userState[from] = 'comprovantesDePosse';
                    } catch (error) {
                        console.error('Erro ao processar o documento:', error);
                        await client.sendText(from, 'Ocorreu um erro ao processar o documento. Por favor, tente novamente.');
                    }
                } else {
                    await client.sendText(from, 'Por favor, envie seu CPF em formato PDF.');
                }
                return;
            }

//armazena a Certidão de Matrícula do Imóvel...
            if (userState[from] === 'comprovantesDePosse') {
                const docPath = criarPasta(nomeCompleto[from], cpf[from]);
                if (type === 'document') {
                    // Se o tipo da mensagem é um documento, salva o documento na pasta do usuário
                    const media = await client.decryptFile(message);
                    const nomeArquivo = `Certidão de Matrícula do Imóvel ${nomeCompleto[from]}.pdf`; // Nome do arquivo com CPF formatado
                    salvarMidia(docPath, nomeArquivo, media);
                    console.log(`\x1b[32m ✓ ${nomeCompleto[from]} CERTIDÃO DE MATRICULA ENVIADO\x1b[0m`);
                    // Solicitar próximo documento
                    await client.sendText(from, 
    `*Comprovantes de Posse:*
    
- Recibos de pagamento de impostos (IPTU, ITR) em nome do possuidor.
- Comprovantes de pagamento de contas de água, luz, telefone.
- Contratos de compra e venda, cessão de direitos, ou outro documento que comprove a posse`);

                    userState[from] = 'testemunhas';
                } else {
                    await client.sendText(from, 'Por favor, envie seu documento de estado civil em formato PDF.');
                }
                return;
            }

//armazena o Comprovantes de Posse...
            if (userState[from] === 'testemunhas') {
                const docPath = criarPasta(nomeCompleto[from], cpf[from]);
                if (type === 'document') {
                    // Se o tipo da mensagem é um documento, salva o documento na pasta do usuário
                    const media = await client.decryptFile(message);
                    const nomeArquivo = `Comprovantes de Posse ${nomeCompleto[from]}.pdf`; // Nome do arquivo com CPF formatado
                    salvarMidia(docPath, nomeArquivo, media);
                    console.log(`\x1b[32m ✓ ${nomeCompleto[from]} COMPROVANTE DE POSSE ENVIADO\x1b[0m`);
                    // Solicitar próximo documento
                    await client.sendText(from, 
    `*Declarações de Testemunhas:*
    
- Declarações de, no mínimo, três testemunhas que possam atestar a posse contínua e ininterrupta pelo período exigido
- Essas declarações devem ser feitas com reconhecimento de firma`);

                    userState[from] = 'negativa';
                } else {
                    await client.sendText(from, 'Por favor, envie seu documento de estado civil em formato PDF.');
                }
                return;
            }

//armazena a Declarações de Testemunhas...
            if (userState[from] === 'negativa') {
                const docPath = criarPasta(nomeCompleto[from], cpf[from]);
                if (type === 'document') {
                    // Se o tipo da mensagem é um documento, salva o documento na pasta do usuário
                    const media = await client.decryptFile(message);
                    const nomeArquivo = `Declarações de Testemunhas ${nomeCompleto[from]}.pdf`; // Nome do arquivo com CPF formatado
                    salvarMidia(docPath, nomeArquivo, media);
                    console.log(`\x1b[32m ✓ ${nomeCompleto[from]} DECLARAÇÃO DE TESTEMUNHAS ENVIADO\x1b[0m`);
                    // Solicitar próximo documento
                    await client.sendText(from, 
    `*Certidão Negativa de Débitos Municipais:*
    
- Certidão negativa de débitos de IPTU ou outras taxas municipais`);
                    userState[from] = 'representacao';
                } else {
                    await client.sendText(from, 'Por favor, envie seu documento de estado civil em formato PDF.');
                }
                return;
            }

//armazerna a Certidão Negativa de Débitos Municipais...
            if (userState[from] === 'representacao') {
                const docPath = criarPasta(nomeCompleto[from], cpf[from]);
                if (type === 'document') {
                    // Se o tipo da mensagem é um documento, salva o documento na pasta do usuário
                    const media = await client.decryptFile(message);
                    const nomeArquivo = `Negativa de Débitos Municipais ${nomeCompleto[from]}.pdf`; // Nome do arquivo com CPF formatado
                    salvarMidia(docPath, nomeArquivo, media);
                    console.log(`\x1b[32m ✓ ${nomeCompleto[from]} CERTIDÃO NEGATIVAS DE DÉBITOS ENVIADO\x1b[0m`);
                    // Solicitar próximo documento
                    await client.sendText(from, 
    `*Documentos de Representação:*
    
- Documentos de representação legal, caso o requerente seja uma pessoa jurídica (ex: contrato social, estatuto, ata de assembleia)`);
                    userState[from] = 'confrontantes';
                } else {
                    await client.sendText(from, 'Por favor, envie seu documento de estado civil em formato PDF.');
                }
                return;
            }

//armazena o Documentos de Representação
            if (userState[from] === 'confrontantes') {
                const docPath = criarPasta(nomeCompleto[from], cpf[from]);
                if (type === 'document') {
                    // Se o tipo da mensagem é um documento, salva o documento na pasta do usuário
                    const media = await client.decryptFile(message);
                    const nomeArquivo = `Documentos de Representação ${nomeCompleto[from]}.pdf`; // Nome do arquivo com CPF formatado
                    salvarMidia(docPath, nomeArquivo, media);
                    console.log(`\x1b[32m ✓ ${nomeCompleto[from]}REPRESENTANTES ENVIADO\x1b[0m`);
                    // Solicitar próximo documento
                    await client.sendText(from, 
    `*Declarações de Confrontantes:*
    
- Declarações dos proprietários dos imóveis vizinhos, reconhecendo a posse e informando que não há litígio quanto aos limites das propriedades`);
                    userState[from] = 'prazoPosse';
                } else {
                    await client.sendText(from, 'Por favor, envie seu documento de estado civil em formato PDF.');
                }
                return;
            }

// armazena a Declarações de Confrontantes
            if (userState[from] === 'prazoPosse') {
                const docPath = criarPasta(nomeCompleto[from], cpf[from]);
                if (type === 'document') {
                    const media = await client.decryptFile(message);
                    const nomeArquivo = `Declarações de Confrontantes (${nomeCompleto[from]}).pdf`;
                    salvarMidia(docPath, nomeArquivo, media);
                    console.log(`\x1b[32m ✓ ${nomeCompleto[from]} DECLARAÇÃO DE CONFRONTANTES ENVIADA\x1b[0m`);
                    // Solicitar próximo documento
                    await client.sendText(from, 
    `*Prazo de Posse:* em PDF;
    
- A posse deve ser contínua e ininterrupta pelo período exigido para o tipo de usucapião (geralmente de 5 a 15 anos)
                    `);
                    userState[from] = 'finalizacao';
                } else {
                    await client.sendText(from, 'Por favor, envie seu documento de *Título de propriedade dos imóveis* em formato PDF.');
                }
                return;
            }

// armazena o Prazo de Posse... e finaliza o atendiomento
            if (userState[from] === 'finalizacao') {
                const docPath = criarPasta(nomeCompleto[from], cpf[from]);
                if (type === 'document') {
                    const media = await client.decryptFile(message);
                    const nomeArquivo = `Prazo de Posse (${nomeCompleto[from]}).pdf`;
                    salvarMidia(docPath, nomeArquivo, media);
                    console.log(`\x1b[32m ✓ ${nomeCompleto[from]} PRAZO DE POSSE ENVIADO\x1b[0m`);
                    await client.sendText(from, 'A W1nner Engenharia e Topografia agradece seu contato e em breve entraremos em contato.');
                    userState[from] = '';
                    welcomed[from] = false; 
                    nomeCompleto[from] = ''; 
                    return;
                } else {
                    await client.sendText(from, 'Por favor, envie seu documento de *Certidão Negativa* em formato PDF.');
                }
                console.log(`\x1b[33m ✓ ${nomeCompleto[from]} PRAZO DE POSSE ENVIADO\x1b[0m`);
                return;
            }


            // unificação
            if (userState[from] === 'unificacao') {
                if (!nomeCompleto[from]) {
                    // Usuário está enviando o nome completo
                    nomeCompleto[from] = body;
                    await client.sendText(from, `Ok, ${nomeCompleto[from]}. Agora, por favor, envie seu CPF com todos os dígitos e pontuação.`);
                    userState[from] = 'uni_cpf';
                    return;
                }
            }

            if (userState[from] === 'uni_cpf') {
                // Verifica se a mensagem é um CPF válido antes de prosseguir
                const regexCPF = /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/;
                if (regexCPF.test(body.trim())) {
                    cpf[from] = body.trim(); // Armazena o CPF corretamente na variável cpf[from]
                    await client.sendText(from, 'Agora, envie seu CPF em formato PDF.');
                    userState[from] = 'uni_aguardando_cpf';
                } else {
                    await client.sendText(from, 'CPF inválido. Por favor, envie seu CPF com todos os dígitos e em pontuação.');
                }
                return;
            }

            if (userState[from] === 'uni_aguardando_cpf') {
                const docPath = criarPasta(nomeCompleto[from], cpf[from]);
                if (type === 'document') {
                    try {
                        const media = await client.decryptFile(message);
                        const nomeArquivo = `CPF_${nomeCompleto[from]}.pdf`;
                        salvarMidia(docPath, nomeArquivo, media);
                        
                        await client.sendText(from, `Por favor, envie um de cada proprietario documento de *comprovate de residencia:*
                        
- Agua
- Luz
- internet`);

                        userState[from] = 'agResidencia';
                    } catch (error) {
                        console.error('Erro ao processar o documento:', error);
                        await client.sendText(from, 'Ocorreu um erro ao processar o documento. Por favor, tente novamente.');
                    }
                } else {
                    await client.sendText(from, 'Por favor, envie seu comprovante de residencia em formato PDF.');
                }
                return;
            }

            if (userState[from] === 'agResidencia') {
                const docPath = criarPasta(nomeCompleto[from], cpf[from]);
                if (type === 'document') {
                    try {
                        const media = await client.decryptFile(message);
                        const nomeArquivo = `Residencia_${nomeCompleto[from]}.pdf`;
                        salvarMidia(docPath, nomeArquivo, media);
                        
                        await client.sendText(from, `Por favor, envie um de cada proprietario documento de *estado civil legível em PDF:*
                        
- Solteiro(a): certidão de nascimento preferencialmente atualizada;
- Convivência em união estável: declaração de união estável preferencialmente atualizada;
- Casado(a): certidão de casamento preferencialmente atualizada;
- Divorciado(a) ou separado(a): certidão de casamento com averbação de divórcio preferencialmente atualizada;
- Viúvo(a): certidão de casamento e certidão de óbito.`);

                        userState[from] = 'uni_aguardando_estado_civil';
                    } catch (error) {
                        console.error('Erro ao processar o documento:', error);
                        await client.sendText(from, 'Ocorreu um erro ao processar o documento. Por favor, tente novamente.');
                    }
                } else {
                    await client.sendText(from, 'Por favor, envie seu CPF em formato PDF.');
                }
                return;
            }

            if (userState[from] === 'uni_aguardando_estado_civil') {
                const docPath = criarPasta(nomeCompleto[from], cpf[from]);
                if (type === 'document') {
                    // Se o tipo da mensagem é um documento, salva o documento na pasta do usuário
                    const media = await client.decryptFile(message);
                    const nomeArquivo = `estado civil_${nomeCompleto[from]}.pdf`; // Nome do arquivo com CPF formatado
                    salvarMidia(docPath, nomeArquivo, media);
                    await console.log(`\x1b[32m ✓ ${nomeCompleto[from]} ESTADO CIVIEL ENVIADO\x1b[0m`);
                    // Solicitar próximo documento
                    await client.sendText(from, 
    `*Título de propriedade dos imóveis:*
    
- Certidão de Matrícula dos imóveis atualizada (expedida pelo Cartório de Registro de Imóveis, com validade máxima de 30 dias).
- Escritura pública de compra e venda, doação, ou outro título aquisitivo, registrado no Cartório de Registro de Imóveis. 
                    `);
                    userState[from] = 'negativa';
                } else {
                    await client.sendText(from, 'Por favor, envie seu documento de estado civil em formato PDF.');
                }
                return;
            }

            if (userState[from] === 'negativa') {
                const docPath = criarPasta(nomeCompleto[from], cpf[from]);
                if (type === 'document') {
                    const media = await client.decryptFile(message);
                    const nomeArquivo = `Título de propriedade dos imóveis (${nomeCompleto[from]}).pdf`;
                    salvarMidia(docPath, nomeArquivo, media);
                    await console.log(`\x1b[32m ✓ ${nomeCompleto[from]} propriedade dos imóveis ENVIADA\x1b[0m`);
                    // Solicitar próximo documento
                    await client.sendText(from, 
    `*Certidão Negativa de Débitos Municipais:* em PDF;
    
- Comprovando que não há débitos de IPTU ou outras taxas municipais.
                    `);
                    userState[from] = 'espNegativa';
                } else {
                    await client.sendText(from, 'Por favor, envie seu documento de *Título de propriedade dos imóveis* em formato PDF.');
                }
                return;
            }

            if (userState[from] === 'espNegativa') {
                const docPath = criarPasta(nomeCompleto[from], cpf[from]);
                if (type === 'document') {
                    const media = await client.decryptFile(message);
                    const nomeArquivo = `Certidão Negativa (${nomeCompleto[from]}).pdf`;
                    salvarMidia(docPath, nomeArquivo, media);
                    console.log(`\x1b[33m ✓ ${nomeCompleto[from]} Certidão Negativa ENVIADO\x1b[0m`);
                    await client.sendText(from, 'A W1nner Engenharia e Topografia agradece seu contato e em breve entraremos em contato.');
                    userState[from] = '';
                    welcomed[from] = false; 
                    nomeCompleto[from] = ''; 
                    return;
                } else {
                    await client.sendText(from, 'Por favor, envie seu documento de *Certidão Negativa* em formato PDF.');
                }
                return;
            }


        // reurb
        if (userState[from] === 'entregar_documentos') {
            if (!nomeCompleto[from]) {
                // Usuário está enviando o nome completo
                nomeCompleto[from] = body;
                await client.sendText(from, `Ok, ${nomeCompleto[from]}. Agora, por favor, envie seu CPF com todos os dígitos e em pontuação.`);
                userState[from] = 'entregar_cpf';
                return;
            }
        }
    
        if (userState[from] === 'entregar_cpf') {
            // Verifica se a mensagem é um CPF válido antes de prosseguir
            const regexCPF = /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/;
            if (regexCPF.test(body.trim())) {
                cpf[from] = body.trim(); // Armazena o CPF corretamente na variável cpf[from]
                await client.sendText(from, 'Agora, envie seu CPF em formato PDF.');
                userState[from] = 'aguardando_cpf';
            } else {
                await client.sendText(from, 'CPF inválido. Por favor, envie seu CPF com todos os dígitos e em pontuação.');
            }
            return;
        }
    
        if (userState[from] === 'aguardando_cpf') {
            const docPath = criarPasta(nomeCompleto[from], cpf[from]);
            if (type === 'document') {
                try {
                    const media = await client.decryptFile(message);
                    const nomeArquivo = `CPF_${nomeCompleto[from]}.pdf`;
                    salvarMidia(docPath, nomeArquivo, media);
                    await console.log(`\x1b[32m ✓ ${nomeCompleto[from]} CPF ENVIADO\x1b[0m`);
                    await client.sendText(from, `Por favor, envie um documento de estado civil legível em PDF:*
                    
- Solteiro(a): certidão de nascimento preferencialmente atualizada;
- Convivência em união estável: declaração de união estável preferencialmente atualizada;
- Casado(a): certidão de casamento preferencialmente atualizada;
- Divorciado(a) ou separado(a): certidão de casamento com averbação de divórcio preferencialmente atualizada;
- Viúvo(a): certidão de casamento e certidão de óbito.`);
                    userState[from] = 'aguardando_estado_civil';
                } catch (error) {
                    console.error('Erro ao processar o documento:', error);
                    await client.sendText(from, 'Ocorreu um erro ao processar o documento. Por favor, tente novamente.');
                }
            } else {
                await client.sendText(from, 'Por favor, envie seu CPF em formato PDF.');
            }
            return;
        }
        
        

        if (userState[from] === 'aguardando_estado_civil') {
            const docPath = criarPasta(nomeCompleto[from], cpf[from]);
            if (type === 'document') {
                // Se o tipo da mensagem é um documento, salva o documento na pasta do usuário
                const media = await client.decryptFile(message);
                const nomeArquivo = `estado civil_${nomeCompleto[from]}.pdf`; // Nome do arquivo com CPF formatado
                salvarMidia(docPath, nomeArquivo, media);
                await console.log(`\x1b[32m ✓ ${nomeCompleto[from]} ESTADO CIVIEL ENVIADO\x1b[0m`);
                // Solicitar próximo documento
                await client.sendText(from, 
`*RESIDÊNCIA* em PDF

- comprovante de onde mora, preferencialmente atualizado;
- Conta de luz ou conta de água 
- em nome de um dos beneficiários;
- Caso o comprovante de água ou luz esteja em nome de outra pessoa, realizar declaração de residência, a declaração deve ser assinada pelo titular da luz ou água.
                `);
                userState[from] = 'renda_da_casa';
            } else {
                await client.sendText(from, 'Por favor, envie seu documento de estado civil em formato PDF.');
            }
            return;
        }
        
        if (userState[from] === 'renda_da_casa') {
            const docPath = criarPasta(nomeCompleto[from], cpf[from]);
            if (type === 'document') {
                const media = await client.decryptFile(message);
                const nomeArquivo = `RENDA DE TODOS OS INTEGRANTES DA CASA (${nomeCompleto[from]}).pdf`;
                salvarMidia(docPath, nomeArquivo, media);
                await console.log(`\x1b[32m ✓ ${nomeCompleto[from]} RENDA DA CASA ENVIADA\x1b[0m`);
                // Solicitar próximo documento
                await client.sendText(from, 
`*RENDA DE TODOS OS INTEGRANTES DA CASA (Cópias LEGÍVEIS)* em PDF;

- Se for celetista (empregado): Folha de pagamento preferencialmente atualizados;
- Se for autônomo (a): declaração de renda descrevendo a profissão e o valor que ganha por MÊS;
- Se for aposentado (a): Histórico do benefício;
- Se for do lar: Declaração do lar;
- Se for estudante: Declaração de estudante;
- Se for desempregado: Declaração de desempregado;
                `);
                userState[from] = 'posse';
            } else {
                await client.sendText(from, 'Por favor, envie seu documento de estado civil em formato PDF.');
            }
            return;
        }

        if (userState[from] === 'posse') {
            const docPath = criarPasta(nomeCompleto[from], cpf[from]);
            if (type === 'document') {
                const media = await client.decryptFile(message);
                const nomeArquivo = `POSSE (${nomeCompleto[from]}).pdf`;
                salvarMidia(docPath, nomeArquivo, media);
                await console.log(`\x1b[32m ✓ ${nomeCompleto[from]} COMPROVANTE DE RESIDENCIA ENVIADO\x1b[0m`);
                // Solicitar próximo documento
                await client.sendText(from, 
`*POSSE (Cópias LEGÍVEIS)* em PDF;

- Contrato de compra e venda: Contrato de compra e venda do terreno, onde conste como comprador, a pessoa que quer regularizar o terreno;
- Conta de luz ou água: Conta de energia ou água até dezembro de 2016, em nome da pessoa que quer regularizar o terreno;
- Se for aposentado (a): Histórico do benefício;
- IPTU: Carnê de IPTU até dezembro de 2016, em nome da pessoa que quer regularizar o terreno.
- Caso não houver nenhum destes documentos entrar em contato com a empresa responsável.

                `);
                userState[from] = 'historico_posse';
            } else {
                await client.sendText(from, 'Por favor, envie seu documento de estado civil em formato PDF.');
            }
            return;
        }

// Lógica para o menu de histórico de posse
if (userState[from] === 'historico_posse') {
    // Enviar menu perguntando se o usuário possui o documento de histórico de posse
    await client.sendText(from, `*HISTÓRICO DA POSSE (Se tiver)* em PDF;

- Documentos antigos do terreno, contratos de compra e venda dos antigos vendedores, matrícula, declarações, entre outros.
    
Você possui este documento em mãos?

1 - Tenho o documento em mãos
    
9 - Não tenho o documento em mãos`);
    userState[from] = 'aguardando_resposta_historico_posse';
    return;
}

// Lógica para tratar a resposta sobre o histórico de posse
if (userState[from] === 'aguardando_resposta_historico_posse') {
    if (body === '9') {
        // Usuário não possui o documento
        await client.sendText(from, 'Entendido, você não possui o documento. A W1nner Engenharia e Topografia agradece seu contato e em breve entraremos em contato.');
        // Resetar o estado do usuário
        userState[from] = '';
        welcomed[from] = false; // Resetar o status de boas-vindas
        nomeCompleto[from] = ''; // Limpar o nome completo
    } else if (body === '1') {
        // Usuário possui o documento, solicitar envio do documento
        await client.sendText(from, 'Por favor, envie seu documento de histórico de posse em formato PDF.');
        userState[from] = 'aguardando_documento_historico_posse';
    } else {
        // Opção inválida
        await client.sendText(from, 'Opção inválida. Por favor, escolha uma das opções disponíveis.');
    }
    return;
}


// Lógica para processar o documento de histórico de posse
if (userState[from] === 'aguardando_documento_historico_posse') {
    const docPath = criarPasta(nomeCompleto[from], cpf[from]);
    if (type === 'document') {
        const media = await client.decryptFile(message);
        const nomeArquivo = `HISTÓRICO DA POSSE (${nomeCompleto[from]}).pdf`;
        salvarMidia(docPath, nomeArquivo, media);
        console.log(`\x1b[33m ✓ ${nomeCompleto[from]} POSSE ENVIADO\x1b[0m`);
        // Agradecer pela entrega do documento
        await client.sendText(from, 'Obrigado por enviar o documento de histórico de posse.');
        // Resetar o estado do usuário para encerrar o atendimento
        userState[from] = '';
        welcomed[from] = false; // Resetar o status de boas-vindas
        nomeCompleto[from] = ''; // Limpar o nome completo
        // Encerrar o atendimento
        return;
    } else {
        await client.sendText(from, 'Por favor, envie seu documento de histórico de posse em formato PDF.');
    }
    return;
}


if (userState[from] === 'aguardando_resposta_historico_posse') {
    if (body === '9') {
        await client.sendText(from, 'Entendido, você não possui o documento de histórico de posse. A W1nner Engenharia e Topografia agradece seu contato e em breve entraremos em contato.');
        userState[from] = '';
        welcomed[from] = false; 
        nomeCompleto[from] = ''; 
        return;
    } else if (body === '1') {
        // Usuário possui o documento, solicitar envio do documento
        await client.sendText(from, 'Por favor, envie seu documento de histórico de posse em formato PDF.');
        userState[from] = 'aguardando_documento_historico_posse';
    } else {
        // Opção inválida
        await client.sendText(from, 'Opção inválida. Por favor, escolha uma das opções disponíveis.');
    }
    return;
}

    });

    client.onStateChange((state) => {
        console.log(`\x1b[33m Estado do cliente alterado: ${state} \x1b[0m`);
        if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus();
    });
}

function criarPasta(nomeUsuario, cpfUsuario) {
    // Verificar se cpfUsuario está definido e formatá-lo
    const cpfFormatado = cpfUsuario ? cpfUsuario.replace(/[^\d]/g, '') : '';

    // Concatenar nome do usuário com CPF formatado
        const nomePasta = `${nomeUsuario} ${cpfFormatado}`;
    
    const pastaUsuario = path.join(__dirname, 'usuarios', nomePasta);
    
    if (!fs.existsSync(pastaUsuario)) {
        fs.mkdirSync(pastaUsuario, { recursive: true });
    }
    
    return pastaUsuario;
}

function salvarMidia(pastaUsuario, nomeArquivo, mediaData) {
    const caminhoArquivo = path.join(pastaUsuario, nomeArquivo);
    fs.writeFileSync(caminhoArquivo, mediaData);
}