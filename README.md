# Bot de Atendimento para WhatsApp

Este é um bot de atendimento para WhatsApp, criado por mim utilizando a biblioteca Venom-bot. Infelizmente, o bot ainda não está pronto, mas futuras atualizações trarão otimizações de código e a separação dos componentes, tornando a aplicação mais rápida e robusta.

## Detalhes do Bot

Este bot está sendo desenvolvido com o objetivo de facilitar a interação com os clientes da W1nner Engenharia e Topografia, permitindo o envio de documentos e informações sobre serviços, como REURB e Unificação. Além disso, o bot será capaz de substituir o setor financeiro, encaminhando boletos gerados pelo banco utilizando o SDK Node.js da Gerencianet.

O projeto, denominado "bot-wts," começou como um desafio pessoal, e todo o desenvolvimento inicial foi feito em um único documento JS. As principais dependências utilizadas são:

- **venom-bot**: Uma biblioteca para interagir com a API do WhatsApp, permitindo enviar e receber mensagens de forma automatizada.
- **gerencianet**: Um SDK para integrar com a API de pagamentos da Gerencianet, usado para gerar e encaminhar boletos.

O código é responsável por várias funcionalidades, como:

1. **Inicialização do Bot**: Configura a conexão com o WhatsApp e inicializa o bot.
2. **Recebimento de Mensagens**: Lida com as mensagens recebidas dos usuários, processando comandos e fornecendo respostas automatizadas.
3. **Envio de Documentos**: Envia documentos e informações sobre serviços da W1nner Engenharia e Topografia, como REURB e Unificação.
4. **Integração com a Gerencianet**: Gera e encaminha boletos bancários utilizando o SDK da Gerencianet.

## Sobre o `npm start`

O comando `npm start` é uma convenção no Node.js usada para iniciar a aplicação. Ele executa o script especificado no campo `"start"` do arquivo `package.json` do projeto. Normalmente, o script `start` é configurado para iniciar o servidor ou a aplicação principal.

### Exemplo do `package.json`:

```json
{
  "name": "bot-wts",
  "version": "1.0.0",
  "description": "Bot de atendimento para WhatsApp",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "venom-bot": "^3.0.0",
    "gerencianet": "^2.0.0"
  }
}
```

# Executando o Bot
 **Para executar o bot, siga os seguintes passos:**
 1. **Instalar Dependências**: Certifique-se de que todas as dependências necessárias estão instaladas.
   - **Você pode fazer isso executando os comandos**:
```sh
 npm install
```
```sh
 npm install venom-bot
```
  2. Iniciar o Bot: Execute o comando npm start para iniciar o bot:
  ```sh
 npm start
```
**Isso inicializará a aplicação** e o bot começará a rodar, pronto para receber e responder mensagens no WhatsApp.
# Futuras Atualizações
- **Otimização de Código**: Pretendo refatorar o código para torná-lo mais eficiente e de fácil manutenção.
- **Modularização**: A separação de funcionalidades em módulos distintos ajudará a melhorar a performance e a escalabilidade da aplicação.
- **Novas Funcionalidades**: Estou explorando novas funcionalidades para melhorar a interação com os usuários e fornecer um suporte mais completo.

**Fique atento para mais atualizações e melhorias neste projeto!**
