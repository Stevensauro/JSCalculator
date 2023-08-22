const buttonsNum = document.querySelector('#numbers')
const buttonsSign = document.querySelector('#signs')
const displayEquation = document.querySelector('#equation')
const displayResult = document.querySelector('#result')
const calcScreen = document.querySelector('#screen')

const calculatorNumbers = [
    '7', '8', '9', 
    '4', '5', '6', 
    '1', '2', '3', 
    '0', '.', 'AC'
]

const calculatorSigns = [ 
    '(', ')', 
    '+', '-', 
    'X', '/', 
    '%', '='
]

let result = '0'
let currentNumber = '0'
let lastEquation = []
let currentEquation = []

displayResult.innerHTML = result

createButtons()

const buttonsAll = document.querySelectorAll('.btn')

buttonsAll.forEach(button=>{

    button.onclick = e=>{

        const buttonValue = e.currentTarget.innerHTML

        calculator(buttonValue)
    }
})

function createButtons(){
    calculatorNumbers.forEach((number)=>{
        const button = buttonsNum.appendChild(document.createElement('button'))
        button.setAttribute('id', number)
        button.setAttribute('class', 'btn')
        button.innerHTML = number
    })
    
    calculatorSigns.forEach((sign)=>{
        
        const button = buttonsSign.appendChild(document.createElement('button'))
    
        button.setAttribute('id', sign)
        button.setAttribute('class', 'btn')
        button.innerHTML = sign
    })
}

function resetValues(){
    result = '0'
    currentNumber = '0'
    lastEquation = []
    currentEquation = []
    displayResult.innerHTML = result
    displayEquation.innerHTML = ''
}

function errorCheck(){
    if(displayResult.textContent === 'ERROR'){
        return true
    }
    return false
}

function equationCheck(){
    if(currentNumber === '' ){
        return false
    } else if (currentNumber && currentEquation.length === 0){
        if(/\([0-9]\)/.test(currentNumber) || /[0-9]/.test(currentNumber)){
            return true
        } else{
            return false
        }
    } else if(currentEquation.length >= 1){
        if (currentEquation.find(i=>/\([0-9]/.test(i)) && 
            !/[0-9]\)/.test(displayResult.textContent) 
        ){
            return false
        } else {
            return true
        }
    } else{
        return false
    }
}

function displayNumbers(displayCurrent, displayLast, button){
    if(errorCheck()){resetValues()}

    if(button === ')'){
        if(/[\+\-\/\*\%\)]/.test(
            displayCurrent.textContent[displayCurrent.textContent.length-1]) ||
            !displayCurrent.textContent.includes('(')
        ){
            console.log('no number inputed')
        }else{
            currentNumber += button
            displayCurrent.innerHTML += button
            calcScreen.scrollLeft += 100
        }

    } else if(displayCurrent.textContent === '0'){
        currentNumber = button
        displayCurrent.innerHTML = button
    }else if(currentNumber === result){
        currentNumber = button
        displayLast.innerHTML = 'ANS = ' + result
        displayCurrent.innerHTML = button
    } else{
        if(
        button === '(' &&
        displayCurrent.textContent[displayCurrent.textContent.length-1]==='('){ 
            currentNumber = button
        }else{
            currentNumber += button
            displayCurrent.innerHTML += button
            calcScreen.scrollLeft += 100
        }
    }
}

function displaySigns(displayCurrent, displayLast, button){
    if(displayCurrent.textContent === 'ERROR'){
        resetValues()
    }

    if(displayLast.textContent){
        displayLast.innerHTML = 'ANS = ' + result
    }

    if(!/[\+\-]/.test(
        displayCurrent.textContent[displayCurrent.textContent.length-2]
        )){
        if(button === 'X'){
            currentEquation.push(currentNumber, '*')
            displayCurrent.innerHTML += ' ' + '*' + ' '
            currentNumber = ''  
            calcScreen.scrollLeft += 100
        } else{
            currentEquation.push(currentNumber, button)
            displayCurrent.innerHTML += ' ' + button + ' '
            currentNumber = ''
            calcScreen.scrollLeft += 100
        }
    }
}

function calculateEquation(displayCurrent, displayLast, lastNumber){
    
    if(equationCheck()){

        currentEquation.push(lastNumber)
        
        if(lastEquation.length===0){

            lastEquation = currentEquation.map(i=>i)
            
            console.log(currentEquation)
            displayCurrent.innerHTML = eval(lastEquation.join(''))

            result = displayCurrent.innerHTML
            currentNumber = result

            console.log(lastEquation)
            displayLast.innerHTML = lastEquation.join(' ') + ' ='
            currentEquation = []

        } else{
            

            lastEquation.splice(0, lastEquation.length)
            
            lastEquation  = currentEquation.map(i=>i)

            displayCurrent.innerHTML = eval(lastEquation.join(''))

            result = displayCurrent.innerHTML
            currentNumber = displayCurrent.innerHTML

            console.log(lastEquation)
            displayLast.innerHTML = lastEquation.join(' ') + ' ='
            currentEquation = []
        }
    } else{
        displayEquation.innerHTML = currentEquation.join(' ')
        displayCurrent.innerHTML = 'ERROR'
    }
}

function calculator(inputButton){

    if (inputButton === 'AC'){     

        resetValues()
    } else if( /[0-9\.\(\)]/.test(inputButton) ){

        displayNumbers(displayResult, displayEquation, inputButton)

    }else if( /[\+\-\/\%\X]/.test(inputButton)){

        displaySigns(displayResult, displayEquation, inputButton)

    } else if(inputButton === '='){

        calculateEquation(displayResult, displayEquation, currentNumber)

    } else{

        console.log('maybe some bug or something')

    }
}