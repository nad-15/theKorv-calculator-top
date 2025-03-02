// newCalcArray is the main array
// evaluation happends in runCalcOnAllObjects
// operations input happen here function opSymbol(btn)
// function regNum(btn) 


// Body
const calcWrapper = document.querySelector(".calc--wrapper")

// Btns
const btnContainer = document.querySelector(".calc__keyboard")
let allBtns = [...document.querySelectorAll(".calc__btn")];
const btnNumbers = [...document.querySelectorAll(".btn-num")];
const clearAllBtn = document.querySelector(".clear-ac")
const oneClearBtn = document.querySelector(".clear-c")

// Displays
const calcDisplayContainer = document.querySelector(".calc__display")
const calcDisplayWidth = calcDisplayContainer.offsetWidth;
const calculationDisplayContainer = document.querySelector(".calc__display__calculation-container");
const calculationDisplayText = document.querySelector(".calc__display__calculation-text");
const calculationDisplayEqualSign = document.querySelector(".calc__display__calculation-equal-sign");
const resultContainer = document.querySelector(".calc__display__result")
let resultContainerFontSize = window.getComputedStyle(resultContainer).fontSize;
let resultContainerWidth;

// Welcome
const welcomeText = document.querySelector(".calc__welcome-text");

// Mod Displays
let equalSignWidth = calculationDisplayEqualSign.getBoundingClientRect().width;
calculationDisplayContainer.style.paddingLeft = equalSignWidth + "px";

let negNumber = false;

// Display brackets
const brackets = [...document.querySelectorAll(".bracket-line-container")];

// Current Numbers
let newDigit;
let allNewDigits = "";
let liveResult;

// Operators
let btnsFoldedOut = false;

// Calculations
let newCalcArray = [];

// Keyboard
const foldOutBtnContainers = [];

const extraButtons = {
    operatorBtns: {
        parentContainer: document.querySelector(".calc__keyboard__operators"),
        btnTexts: ["/", "x", "-", "+"],
        elClass: ["btn-op"],
        elements: []
    },
    restBtns: {
        parentContainer: document.querySelector(".calc__keyboard__extras"),
        btnTexts: ["±", "%"],
        elClass: ["btn-plus-minus", "btn-op btn-reminder"],
        elements: []
    },
    deleteBtns: {
        parentContainer: document.querySelector(".calc__keyboard__deletes"),
        btnTexts: ["ac", "c"],
        elClass: ["clear clear-ac", "clear clear-c"],
        elements: []
    }
}

/// BUTTON EVENTS

let activeBtn;

btnContainer.addEventListener("touchstart", (e) => {
    e.preventDefault();

    const target = e.target;

    if (target.classList.contains("calc__btn")) {
        if (activeBtn) activeBtn.classList.remove("active");
        activeBtn = target;
        activeBtn.classList.add("active");
    }
});

btnContainer.addEventListener(
    "touchmove",
    (event) => {
        const touch = event.touches[0];
        const targetBtn = document.elementFromPoint(touch.clientX, touch.clientY);

        if (targetBtn && targetBtn !== activeBtn && targetBtn.classList.contains("calc__btn")) {
            if (activeBtn) activeBtn.classList.remove("active");
            activeBtn = targetBtn;
            activeBtn.classList.add("active");
        }
    },
    { passive: false }
);

btnContainer.addEventListener("touchend", (event) => {
    if (activeBtn) {
        pressABtn(activeBtn)
        activeBtn = null;
    }
});

btnContainer.addEventListener("click", (e) => {
    let activeClickBtn = e.target
    activeClickBtn.classList.add("active")
    pressABtn(activeClickBtn)
})

btnContainer.addEventListener("mouseover", (e) => {
    let hoveredBtn = e.target;
    if (hoveredBtn.classList.contains("calc__btn")) {
        hoveredBtn.classList.add("hover")
    }
})

btnContainer.addEventListener("mouseout", (e) => {
    let hoveredBtn = e.target;
    if (hoveredBtn.classList.contains("calc__btn")) {
        hoveredBtn.classList.remove("hover")
    }
})

function pressABtn(activeBtn) {
    activeBtn.style.transitionDuration = "";

    if (activeBtn.matches(".clear-ac")) {
        clearCalc();
    } else if (activeBtn.matches(".clear-c")) {
        clearOneCalc()
    } else {
        if (activeBtn.matches(".btn-num")) regNum(activeBtn);
        if (activeBtn.matches(".btn-plus-minus")) plusMinus();
        if (activeBtn.matches(".btn-op")) opSymbol(activeBtn);
        displayCalcAndSum()
    }
    setTimeout(() => activeBtn.classList.remove("active"), 300);
}

btnContainer.addEventListener("mouseover", e => {
    if (e.target.matches(".calc__btn")) {
        e.target.style.transitionDuration = ".25s";
    }
})


function runCalcOnAllObjects(newCalcArray, clgMsg) {
    clgMsg = clgMsg || "original";

    function splitByAdditionAndSubtraction(arr) {
        let result = [];
        let temp = [];

        for (let i = 0; i < arr.length; i++) {
            let item = arr[i];

            if (item === add || item === sub) {
                result.push(temp);
                result.push([item]);
                temp = [];
            } else {
                temp.push(item);
            }
        }
        if (temp.length) {
            result.push(temp);
        }
        // console.log(`result is ` + result);
        return result;
    }

    const numberedNewCalcArr = newCalcArray.map(item =>
        typeof item === "string" ? parseFloat(item) : item
    );

    // split the array s
    let calcArrSplitByAddSub = splitByAdditionAndSubtraction(numberedNewCalcArr);
    let addAndSubLeft = []

    if (calcArrSplitByAddSub.length === 1) {
        calcArrSplitByAddSub[0].forEach(item => {
            addAndSubLeft.push(item);
        });
    } else {
        calcArrSplitByAddSub.forEach(calcItem => {
            if (calcItem.length > 1) {
                const sum = reduceThisItem(calcItem)
                addAndSubLeft.push(sum);
                console.log(`sum is after reduce` +  sum);
            } else {
                addAndSubLeft.push(calcItem[0]);
            }
        });
    }

    let finalResult = reduceThisItem(addAndSubLeft)

    // function reduceThisBlock(arr) {
    //     const sum = arr.reduce((acc, curr, i, arr) => {
    //         if (typeof curr === "function") {
    //             let currFunc = curr;
    //             if (currFunc.name = "reminder" && typeof arr[i + 1] === "function") {
    //                 let result = arr[i + 1](acc / 100, arr[i + 2])
    //                 return result;
    //             } else if (arr[i-1].name === "reminder") {
    //                 return acc;
    //             } else {
    //                 return curr(acc, arr[i + 1]);
    //             }
    //         }
    //         return acc;
    //     }, arr[0]);
    //     return sum;
    // }

    function reduceThisItem(arr) {
        const sum = arr.reduce((acc, curr, i, arr) => {

            if (arr.at(-1)?.name === "reminder" && arr.length > 1) {
                return arr.at(-2) / 100;
            }
            

            if (typeof curr === "function") {
                let currFunc = curr;
                // doing percent here
                if (currFunc.name === "reminder" && typeof arr[i + 1] === "function") {
                    // return acc;
                    let result = arr[i + 1](acc / 100, arr[i + 2])
                    return result;
                //another else if here if the curr is `%` and it is the last element it should be treated as 'percent'
                // } else if (currFunc.name === "reminder" ){
                } else if (arr[i - 1].name === "reminder") {
                    return acc;
                } else {
                    return curr(acc, arr[i + 1]);
                }
            }

            return acc;
        }, arr[0]);
        return sum;
    }

    return finalResult

}

function showCalculation() {
    let displayString = "";

    newCalcArray.forEach(item => {
        if (typeof item === "function") {
            if (item.name === "multiply") displayString += "x ";
            if (item.name === "divide") displayString += "/ ";
            if (item.name === "add") displayString += "+ ";
            if (item.name === "sub") displayString += "- ";
            if (item.name === "reminder") displayString += "% ";
        } else {
            if (item < 0) {
                displayString += `(${item}) `;
            } else {
                displayString += `${item} `;
            }
        }
    })
    console.log(typeof displayString);
    return displayString
}

let lastLiveResult = []

function displayCalcAndSum() {

    if (newCalcArray.length === 0) {
        clearCalc()
    } else if (newCalcArray.length > 2) {
        calculationDisplayEqualSign.classList.add("show")
    } else {
        calculationDisplayEqualSign.classList.remove("show")
    }

    calculationDisplayText.textContent = showCalculation();
    liveResult = runCalcOnAllObjects(newCalcArray);
    console.log(typeof liveResult);

    if (Number.isNaN(liveResult) || liveResult === undefined) {
        console.log("Result is NaN");
        // let slicedResult = runCalcOnAllObjects(newCalcArray.slice(0, -1), "slice");
        // if (slicedResult) {
        //     fadeInLiveResult(slicedResult)            
        // }
    } else if (resultContainer.textContent !== liveResult.toString()) {
        console.log("live result is " + liveResult);
        fadeInLiveResult(liveResult)
    }
    negNumber ? plusMinusBtn.textContent = "(±)" : plusMinusBtn.textContent = "±";
}

function fadeInLiveResult(liveResult) {
    let fadeTime = parseFloat(getComputedStyle(resultContainer).transitionDuration) * 1000;
    resultContainer.classList.add("fade")

    setTimeout(() => {
        resultContainer.classList.remove("fade", "mini")
        liveResult = Math.round(liveResult * 100) / 100;
        let formattedNumber = new Intl.NumberFormat('us-US').format(liveResult);
        resultContainer.textContent = formattedNumber;
        resultContainer.addEventListener("transitionend", handleResultTransitionEnd);
    }, fadeTime);
}

function handleResultTransitionEnd() {
    resultContainerWidth = resultContainer.getBoundingClientRect().width;
    resultContainerFontSize = window.getComputedStyle(resultContainer).fontSize;
    let shrinkFont;
    window.innerWidth > 768 ? shrinkFont = 8 : shrinkFont = 4;

    if (resultContainerWidth + 100 > calcDisplayWidth) {
        resultContainerFontSize = parseInt(window.getComputedStyle(resultContainer).fontSize);
        resultContainer.style.fontSize = resultContainerFontSize - shrinkFont + "px";
    }
    resultContainer.removeEventListener("transitionend", handleResultTransitionEnd);
}

function clearCalc() {
    newDigit = "";
    allNewDigits = "";
    newCalcArray = [];
    calculationDisplayEqualSign.style.transitionDuration = ".25s"
    calculationDisplayEqualSign.classList.remove("show")
    calculationDisplayText.classList.add("shrink");
    negNumber = false;
    plusMinusBtn.classList.remove("is-on");
    resultContainer.style.fontSize = "";
    resultContainer.classList.add("mini");
    resultContainer.addEventListener(
        "transitionend",
        (e) => {
            calculationDisplayText.textContent = "";
            calculationDisplayEqualSign.style.transitionDuration = ""

            resultContainer.textContent = "";
            welcomeText.innerHTML = `You stink at maths!<br>Let's try again`
            welcomeText.classList.remove("fly-out")

            negNumber = false;
            flipExtraBtns()
            loopBtnAnim = requestAnimationFrame(blobBtnNumbers)
        },
        { once: true }
    );
    console.log("delete all!");
}

function clearOneCalc() {
    allNewDigits = "";

    console.log(newCalcArray);

    if (typeof newCalcArray.at(-1) === "string") {
        let stringNumber = newCalcArray.at(-1);
        console.log(`Clear one: The stringNumber to delete from is ${stringNumber}`);

        console.log(stringNumber);

        if (stringNumber.length >= 2) {
            console.log("we are slicing");
            let newSlicedNumber = stringNumber.slice(0, -1);
            newCalcArray[newCalcArray.length - 1] = newSlicedNumber === "-" ? "(-)" : newSlicedNumber;
            allNewDigits = newSlicedNumber;
        } else {
            newCalcArray.pop();
            allNewDigits = "";
            negNumber = false;
        }
    } else if (typeof newCalcArray.at(-1) === "number") {
        let number = newCalcArray.at(-1);
        console.log(`The number to cut is ${number}`);
    
        if (Math.abs(number) >= 10) {  // Better check for two-digit numbers
            function removeLastDigit(num) {
                return Math.trunc(num / 10);  // Just remove the last digit
            }
    
            let newTruncNumber = removeLastDigit(number);
            newCalcArray[newCalcArray.length - 1] = newTruncNumber; // Correct assignment
            allNewDigits = newTruncNumber;
        } else {
            newCalcArray.pop(); // Properly remove last item
        }
    } else if (typeof newCalcArray.at(-1) === "function") {
        console.log("Clear one: its a function");
        newCalcArray.pop();

        if (typeof newCalcArray.at(-1) === "function") {
            allNewDigits = "";
        } else {
            allNewDigits = newCalcArray.at(-1) ?? null;
        }

    }
    displayCalcAndSum()
}

function regNum(btn) {

    cancelAnimationFrame(loopBtnAnim)
    newDigit = btn.textContent;

    if (calculationDisplayText.classList.contains("shrink")) {
        setTimeout(() => {
            calculationDisplayText.classList.remove("shrink")
        }, 1000);
    }


    if (newDigit === "." && allNewDigits.includes(".")) {
    } else if (allNewDigits === "0" && newDigit !== ".") {
        allNewDigits = newDigit;
    } else {
        allNewDigits += newDigit;
    }
    console.log(allNewDigits);

    // allNewDigits = allNewDigits.charAt(0) === "-" ? allNewDigits.slice(1) : allNewDigits;

    let negOrNotDigits = makeNegNumberOrNot(allNewDigits, negNumber);

    if (newCalcArray.length === 0 || typeof (newCalcArray.at(-1)) === "function") {
        newCalcArray.push(negOrNotDigits)
    } else {
        newCalcArray[newCalcArray.length - 1] = negOrNotDigits
    }

    if (!btnsFoldedOut) {
        flipExtraBtns()
        welcomeText.classList.add("fly-out")
    }
    console.log(newCalcArray);
}

function plusMinus() {
    negNumber = !negNumber;
    // allNewDigits = allNewDigits = "" ? 0 : allNewDigits;
    compiledDigits = makeNegNumberOrNot(allNewDigits, negNumber);

    if (negNumber && allNewDigits === "") {
        newCalcArray.push("( )")
    } else {
        newCalcArray[newCalcArray.length - 1] = compiledDigits
    }

    negNumber ? plusMinusBtn.classList.add("is-on") : plusMinusBtn.classList.remove("is-on")
}

function makeNegNumberOrNot(allNewDigits, negNumber) {
    return allNewDigits = negNumber ? (allNewDigits * -1).toString() : allNewDigits;
}


function opSymbol(btn) {
    let opSym = btn.textContent;

    negNumber = false;
    negNumber ? plusMinusBtn.classList.add("is-on") : plusMinusBtn.classList.remove("is-on")

    allNewDigits = "";
    let operator
    if (opSym === "-") { operator = sub; }
    else if (opSym === "x" || opSym === "*") { operator = multiply; }
    else if (opSym === "%") { operator = reminder; }
    else if (opSym === "/") { operator = divide; }
    else { operator = add; }

    if (typeof (newCalcArray.at(-1)) === "function") {
        let prevOperator = newCalcArray.at(-1)
        if (prevOperator.name !== "reminder" && typeof newCalcArray.at(-2) !== "function") {
            newCalcArray[newCalcArray.length - 1] = operator

            //logic should be changed... if fun

        } else if (prevOperator.name === "reminder" && typeof newCalcArray.at(-2) !== "function") {
                     // example 2 + (inserting)
            newCalcArray.push(operator)
        } else if (newCalcArray.at(-2).name === "reminder" && operator.name !== "reminder") {
            newCalcArray[newCalcArray.length - 1] = operator
        } else if (newCalcArray.at(-2).name === "reminder" && operator.name === "reminder") {
        }
    } else {
        newCalcArray.push(operator)
    }
}

function add(a, b) { return a + b; }
function sub(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) { return a / b; }

function reminder(a, b) {
    let result = a % b;
    return result < 0 ? Math.abs(result) : result;
}

let allOpButtons = []
const decimalBtn = document.querySelector(".btn-decimal")

function createKeyboardOperators() {

    for (let key in extraButtons) {
        let container = extraButtons[key].parentContainer;
        foldOutBtnContainers.push(container)
        let allSymbols = extraButtons[key].btnTexts;
        let elClasses = extraButtons[key].elClass;

        allSymbols.forEach((symbol, i) => {
            let wrapper = document.createElement("div");
            wrapper.className = "calc__btn-wrapper";
            let element = document.createElement("div");
            element.textContent = symbol;
            let uniqueClassName = elClasses[i] ? elClasses[i] : elClasses[0];
            element.className = `calc__btn ${uniqueClassName} btn-fold-out`
            wrapper.append(element)
            container.append(wrapper)
        })
    }
}
createKeyboardOperators()

const plusMinusBtn = document.querySelector(".btn-plus-minus")
let isRunning = false;

function flipExtraBtns() {
    // console.log('flippin extra buttons');
    if (isRunning) return;
    isRunning = true;

    brackets.forEach(bracket => {
        bracket.classList.toggle("grow")
    })
    decimalBtn.style.pointerEvents = decimalBtn.style.pointerEvents === "none" ? "" : "none";

    let animTime = 200;
    allOpButtons = [...document.querySelectorAll(".btn-fold-out")];

    if (btnsFoldedOut) {
        animTime = animTime / 2;
        for (let i = allOpButtons.length - 1; i >= 0; i--) {
            allOpButtons[i].style.animationDuration = animTime + "ms";
            allOpButtons[i].style.animationDelay = animTime * (allOpButtons.length - i) + "ms"
            allOpButtons[i].classList.remove("fold-out")
            allOpButtons[i].classList.add("fold-in")
        }
    } else {
        for (let i = 0; i < allOpButtons.length; i++) {
            allOpButtons[i].style.animationDuration = animTime + "ms";
            allOpButtons[i].style.animationDelay = animTime * i + "ms"
            allOpButtons[i].classList.remove("fold-in")
            allOpButtons[i].classList.add("fold-out")
        }
    }
    decimalBtn.classList.toggle("hidden")
    btnsFoldedOut = !btnsFoldedOut;
    isRunning = false;
}

function elementsToStopTransition(...elements) {
    elements.forEach(element => {
        if (Array.isArray(element)) {
            element.forEach(el => {
                el.style.transition = el.style.transition === "none" ? "" : "none";
            })
        } else {
            element.style.transition = element.style.transition === "none" ? "" : "none";
        }
    })
}

allBtns = [...document.querySelectorAll(".calc__btn")];
const stopTransElements = [allBtns, welcomeText, brackets]

window.addEventListener('load', () => {
    elementsToStopTransition(...stopTransElements)

    if (welcomeText) {
        welcomeText.style.transitionDuration = "1s"
        welcomeText.classList.remove("fade-in")
        welcomeText.addEventListener("transitionend", () => {
            welcomeText.style.transitionDuration = "";
        }, { once: true })
    }
});

elementsToStopTransition(...stopTransElements)
welcomeText.classList.add("fade-in")
decimalBtn.style.pointerEvents = "none"

const btnOperators = [...document.querySelectorAll(".btn-op")]

let key1Pressed = false;
let key2Pressed = false;

const key1 = "Shift"
const key2 = "Backspace"
let keyDown = false;

document.addEventListener("keydown", (event) => {

    if (event.key === key1) {
        key1Pressed = true;
    } else if (event.key === key2) {
        key2Pressed = true;
    }

    if (key1Pressed && key2Pressed) {
        clearCalc()
    } else if (!keyDown && event.key >= "0" && event.key <= "9" || event.key === ".") {
        const matchedElement = btnNumbers.find(element => element.textContent.trim() === event.key)
        // console.log(matchedElement);
        regNum(matchedElement)
        displayCalcAndSum()
        keyDown = true;
    } else if (event.key === "Backspace") {
        if (btnsFoldedOut) {
            if (newCalcArray.length === 0) {
                clearCalc()
            } else {
                clearOneCalc()
            }
        }
        event.preventDefault()
    } else if (["+", "-", "*", "x", "/", "%"].includes(event.key)) {
        let operatorSymbol = event.key;
        operatorSymbol = operatorSymbol === "*" ? "x" : operatorSymbol;
        const matchedElement = btnOperators.find(element => element.textContent.trim() === operatorSymbol)
        if (btnsFoldedOut) {
            opSymbol(matchedElement)
            displayCalcAndSum()
        }
    }
});

document.addEventListener("keyup", event => {
    if (event.key === key1) {
        key1Pressed = false;
    } else if (event.key === key2) {
        key2Pressed = false;
    }
    keyDown = false;
})

let lastTime = 0;
let delay = 500;

let loopBtnAnim;
function blobBtnNumbers(currentTime) {

    if (!lastTime) lastTime = currentTime;
    const elapsedTime = currentTime - lastTime;

    if (elapsedTime >= delay) {
        let onlyShowingNumbers = btnNumbers.filter(
            (el) => el.textContent >= "0" && el.textContent <= "9"
        )
        let randomBtn = Math.floor(Math.random() * 9) + 1
        let currentBtn = onlyShowingNumbers[randomBtn];
        currentBtn.style.transitionDuration = "2s"

        if (currentBtn.classList.contains("blob")) {
            currentBtn.classList.remove("blob")
        } else {
            currentBtn.classList.add("blob")
            setTimeout(() => {
                currentBtn.classList.remove("blob")
                currentBtn.style.transitionDuration = ""
            }, 2000);
        }
        lastTime = currentTime;
    }
    loopBtnAnim = requestAnimationFrame(blobBtnNumbers)
}

loopBtnAnim = requestAnimationFrame(blobBtnNumbers)