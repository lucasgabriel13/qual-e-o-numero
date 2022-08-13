const number = document.getElementById('number');
const buttonSubmit = document.querySelector('.button-submit');
const inputGuessNumber = document.getElementById('input-guess-number');
const statusLabel = document.querySelector('.status');
const numberContainer = document.querySelector('.number-container');
const numberDisplay = document.querySelectorAll('.number');
const numberContent = document.querySelector('.number-content');
const buttonNewGame = document.querySelector('.new-game');
const formContainer = document.querySelector('.form-container');

/**
 * O array displaySegmentConfig contém todos as combinações para gerar um número
 * no display e cada índice é seu respectivo número no display.
 * Ex: o índice 0 equivale ao número 0 no display
 */
const displaySegmentConfig = [
  ['a', 'b', 'c', 'd', 'e', 'f'], //number 0
  ['b', 'c'], //number 1
  ['a', 'b', 'd', 'e', 'g'], //number 2
  ['a', 'b', 'c', 'd', 'g'], //number 3
  ['b', 'c', 'f', 'g'], //number 4
  ['a', 'c', 'd', 'f', 'g'], //number 5
  ['a', 'c', 'd', 'e', 'f', 'g'], //number 6
  ['a', 'b', 'c'], //number 7
  ['a', 'b', 'c', 'd', 'e', 'f', 'g'], //number 8
  ['a', 'b', 'c', 'd', 'f', 'g'], //number 9
];

/**
 * Variável que armazena o número aleatório vindo da API.
 */
let drawerNumber = 0;

/**
 * Função que é inicializada assim que o documento é carregado em tela
 */
function onLoad() {
  getDrawNumber();
  setNumberDisplay(0);
}

/**
 * Esta função realiza o reset de todas as alterações realizadas durante o contato
 * com o usuário. Responsável por voltar ao padrão assim que o jogo é ganho ou ocorra 
 * algum erro
 */
function resetGame() {
  getDrawNumber();
  setNumberDisplay(0);
  buttonNewGame.classList.add('sr-only');
  formContainer.classList.remove('disabled');
  inputGuessNumber.removeAttribute('disabled');
  buttonSubmit.removeAttribute('disabled');
  statusLabel.classList.remove('winner');
  statusLabel.classList.remove('error');
  numberContent.classList.remove('winner');
  numberContent.classList.remove('error');
  statusLabel.innerHTML = "";
}

/**
 * Função responsável por mostrar o botão de nova partida e desabilitar o form 
 * para que o usuário não tente enviar outro número.
 */
function setNewGame() {
  buttonNewGame.classList.remove('sr-only');
  formContainer.classList.add('disabled');
  inputGuessNumber.setAttribute('disabled', 'disabled');
  buttonSubmit.setAttribute('disabled', 'disabled');
}

/**
 * Esta função tem como objetivo mostrar os números no display e a quantidade de
 * displays que irão aparecer para o usuário. Recebe três parâmetros:
 *  -> quantityNumbers: quantidade de display que irão aparecer na tela
 *  -> firstNumber: valor do primeiro número do display
 *  -> numberSecond: valor do segundo número do display
 *  -> numberThird: valor do terceiro número do display
 *  
 *  Está lógica se baseia em uma estrutura de repetição onde irá iterar cada display
 *  necessário para mostrar os números digitados pelo usuário.
 * */
function createDisplayNumber(quantityNumbers, firstNumber, numberSecond, numberThird) {

  for (let i = 0; i < quantityNumbers; i++) {

    if (numberDisplay[i].getAttribute('data-number') == 'first') {
      numberDisplay[i].classList.remove('display-none');
      numberDisplay[1].classList.add('display-none');
      numberDisplay[2].classList.add('display-none');
    } else if (numberDisplay[i].getAttribute('data-number') == 'second') {
      numberDisplay[i].classList.remove('display-none');
      numberDisplay[2].classList.add('display-none');
    } else {
      numberDisplay[i].classList.remove('display-none');
    }

    for (let j = 0; j < numberDisplay[i].children.length; j++) {

      if (numberDisplay[i].getAttribute('data-number') == 'first') {
        const childrenNumberDisplay = numberDisplay[i].children[j];
        const configDisplayNumber = displaySegmentConfig[firstNumber];
        const dataSegment = childrenNumberDisplay.getAttribute('data-segment');

        if (configDisplayNumber.includes(dataSegment)) {
          childrenNumberDisplay.classList.add('on');
        } else {
          childrenNumberDisplay.classList.remove('on');
        }
      }

      if (numberDisplay[i].getAttribute('data-number') == 'second') {
        const childrenNumberDisplay = numberDisplay[i].children[j];
        const configDisplayNumber = displaySegmentConfig[numberSecond];
        const dataSegment = childrenNumberDisplay.getAttribute('data-segment');

        if (configDisplayNumber.includes(dataSegment)) {
          childrenNumberDisplay.classList.add('on');
        } else {
          childrenNumberDisplay.classList.remove('on');
        }
      }

      if (numberDisplay[i].getAttribute('data-number') == 'third') {
        const childrenNumberDisplay = numberDisplay[i].children[j];
        const configDisplayNumber = displaySegmentConfig[numberThird];
        const dataSegment = childrenNumberDisplay.getAttribute('data-segment');

        if (configDisplayNumber.includes(dataSegment)) {
          childrenNumberDisplay.classList.add('on');
        } else {
          childrenNumberDisplay.classList.remove('on');
        }
      }

    }
  }
}

/**
 * Esta função é responsável por 'setar' erro causado na chamada a API 
 */
function setError(status) {
  statusLabel.innerText = "Erro";
  statusLabel.classList.add('error');
  numberContent.classList.add('error');
  setNumberDisplay(status);
  setNewGame();
}

/**
 * Esta função assíncrona é responsável por fazer uma chamada a API e retornar 
 * uma promisse. Esta promisse poderá conter um Object com um atributo value, caso
 * não ocorra nenhum erro, ou um Object com o statusCode do erro, caso ocorra algum erro.
 * 
 */
async function getDrawNumber() {

  await fetch('https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300')
    .then(response => response.json())
    .then(response => {
      if (response.value > 0) {
        setDrawerNumber(response.value);
        statusLabel.classList.remove('error');
      } else {
        setError(response.StatusCode);
      }
    })
}

/**
 * Função chamada dentro da getDrawNumber() para atribuir o valor a variável 
 * drawerNumber.
 */
function setDrawerNumber(data) {
  drawerNumber = data;
}

/**
 * Esta função recebe com parâmetros um number. Este number é referente ao número 
 * que será mostrado no display. Dado o número é realizado a conversão para String
 * para que se possa realizar uma separação e contagem dos número para serem mostrados
 * no display
 */
function setNumberDisplay(number) {

  const numberSplit = String(number).split('');
  const firstNumber = numberSplit[0];
  const secondNumber = numberSplit[1] ?? numberSplit[1];
  const thirdNumber = numberSplit[2] ?? numberSplit[2];
  const quantityNumbers = numberSplit.length;

  createDisplayNumber(quantityNumbers, firstNumber, secondNumber, thirdNumber);

}


/**
 * Este trecho de código segue em relação ao clique no botão de enviar, onde é coletado o número 
 * que o usuário digitou e conferido se o número digitado é maior, menor ou igual ao número sorteado
 */
buttonSubmit.addEventListener('click', function (e) {
  e.preventDefault();

  const guessNumber = Number(inputGuessNumber.value);

  setNumberDisplay(guessNumber);

  if (guessNumber < drawerNumber) {
    statusLabel.innerText = "É maior";
    inputGuessNumber.value = '';
  } else if (guessNumber > drawerNumber) {
    statusLabel.innerText = "É menor";
    inputGuessNumber.value = '';
  } else if (guessNumber == drawerNumber) {
    setNewGame();
    statusLabel.innerText = "Você acertou!!!";
    statusLabel.classList.add('winner');
    numberContent.classList.add('winner');
    inputGuessNumber.value = '';
  }
});

/**
 * Este código é referente ao clique no botão nova partida, onde é chamada a função
 *  resetGame() para realizar o reset do jogo 
 */ 
buttonNewGame.addEventListener('click', function () {
  resetGame();
})


