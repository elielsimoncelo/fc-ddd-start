# ddd-start

## Elementos táticos

- Precisamos ser capazes de modelarmos de forma mais assertiva os principais componentes, comportamentos individuais, bem como suas relações dos mesmos dentro de um contexto delimitado.

## Entidades

- Entidade é algo único que é capz de ser alterado de forma contínua durante um longo período de tempo. Vernon, Vaughn
- Uma entidade é algo que possui uma continuidade em seu ciclo de vida e pode ser distinguida independente dos atributos que são importantes para a aplicação do usuário. Pode ser uma pessoa, cidade, carro, um ticket de loteria ou uma transação bancária. Evans, Eric
- Entidade = IDENTIDADE

## Objetos de Valor

- Trate os Objetos de Valor como imutáveis
- Quando você se preocupa apenas com os atributos de um elemento de um model, classifique isso como um Objeto de Valor

## Agregados

- É um conjunto de objetos associados que tratamos como uma unidade para propósito de mudança de dados.
- O nome do agragado é a raiz da agregação (root). Exemplo: OrderAggregate, CustomerAggregate e etc.
- O agregado é composto por entidades e objetos de valores

## Servicos de Dominios

- Um serviço de domínio é uma operação sem estado que compre uma tarefa específicad o dominio. Muitas vezes, a melhor indicação de que você deve craiar um serviço no modelo de domínio é quando a operação que você precisa executar parece não se encaixar como um método de um Agregado (10) ou um Objeto de Valor (6).
- Quando um processo ou transformação significativa no domínio não for uma responsabilitade natural de uma ENTIDADE ou OBJETO DE VALOR, adicione uma operação ao modelo como uma interface autônoma declarada como um SERVIÇO. Defina a interface com base na linguagem do modelo de domínio e certifique-se de que o nome da operação faça parte da linguagem UBIQUA. Torne o SERVIÇO sem estado.
- Quando houver muitos Servicos de Dominio no seu projeto, TALVEZ, isso pode indicar que seus agregados PODEM estar anêmicos.
- Serviços de Dominio não guardam estado (STATELESS). Eles não podem armazenar dados.

## Domain Events

### Componentes

- Event
- Handler: Executa o processamento quando um evento é chamado
- Event Dispatcher: Responsável por armazenar e executar os handlers de um evento quando ele for chamado

### Dinâmica

- Criar um "Event Dispatcher"
- Criar um "Event"
- Criar um "Handler" para o "Event"
- Registrar o "Event", juntamente com o "Handler" no "Event Dispatcher"

> Agora para disparar um evento, basta executar o método "notify" do "Event Dispatcher". Nesse momento todos os "Handlers" registrados no evento serão executados.

