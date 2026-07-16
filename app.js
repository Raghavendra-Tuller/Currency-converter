
const amountInput = document.querySelector(".amount-input");

const fromSelect = document.querySelector("select[name='from']");
const toSelect = document.querySelector("select[name='to']");

const fromImg = document.querySelector(".from img");
const toImg = document.querySelector(".to img");

const swapBtn = document.querySelector(".swap");

const convertBtn = document.querySelector(".convert-btn");

const resultMsg = document.querySelector(".msg");

const copyBtn = document.querySelector(".copy-btn");

const loading = document.querySelector(".loading");

const historyList = document.querySelector(".history-list");


const API_URL = "https://open.er-api.com/v6/latest/";


let latestResult = "";

function loadCurrencies(){


    for(let currency in countryList){


        let option1 = document.createElement("option");

        option1.value = currency;
        option1.textContent = currency;



        let option2 = document.createElement("option");

        option2.value = currency;
        option2.textContent = currency;



        fromSelect.appendChild(option1);

        toSelect.appendChild(option2);


    }

    fromSelect.value = "USD";

    toSelect.value = "INR";


}

function updateFlag(){


    let fromCountry =
    countryList[fromSelect.value];


    let toCountry =
    countryList[toSelect.value];



    fromImg.src =
    `https://flagsapi.com/${fromCountry}/flat/64.png`;



    toImg.src =
    `https://flagsapi.com/${toCountry}/flat/64.png`;


}


function getHistory(){

    return JSON.parse(
        localStorage.getItem("history")
    ) || [];

}



function saveHistory(data){


    let history = getHistory();



    history.unshift(data);



    // Keep last 5 conversions

    history = history.slice(0,5);



    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );



    displayHistory();


}





function displayHistory(){


    historyList.innerHTML = "";



    let history = getHistory();



    history.forEach(item=>{


        let li = document.createElement("li");


        li.innerHTML = `

        ${item.amount} ${item.from}

        <i class="fa-solid fa-arrow-right"></i>

        ${item.result} ${item.to}

        `;



        historyList.appendChild(li);


    });


}


async function convertCurrency(){


    let amount =
    Number(amountInput.value);



    if(amount <=0 || isNaN(amount)){


        resultMsg.textContent =
        "Enter a valid amount";


        return;

    }



    let from =
    fromSelect.value;


    let to =
    toSelect.value;



    loading.style.display="block";


    convertBtn.disabled=true;



    try{


        let response =
        await fetch(
            `${API_URL}${from}`
        );



        let data =
        await response.json();



        let rate =
        data.rates[to];



        if(!rate){

            throw new Error(
                "Rate unavailable"
            );

        }



        let result =
        amount * rate;



        latestResult =
        `${amount} ${from} = ${result.toFixed(2)} ${to}`;



        resultMsg.textContent =
        latestResult;



        saveHistory({

            amount: amount,

            from: from,

            result: result.toFixed(2),

            to: to

        });



    }



    catch(error){


        resultMsg.textContent =
        "Failed to get exchange rate";


        console.error(error);


    }



    finally{


        loading.style.display="none";


        convertBtn.disabled=false;


    }



}



copyBtn.addEventListener(
"click",
()=>{


    if(!latestResult){

        return;

    }



    navigator.clipboard.writeText(
        latestResult
    );



    copyBtn.innerHTML = `

    <i class="fa-solid fa-check"></i>

    Copied

    `;



    setTimeout(()=>{


        copyBtn.innerHTML = `

        <i class="fa-regular fa-copy"></i>

        Copy Result

        `;


    },2000);



});


swapBtn.addEventListener(
"click",
()=>{


    let temp =
    fromSelect.value;



    fromSelect.value =
    toSelect.value;



    toSelect.value =
    temp;



    updateFlag();



    convertCurrency();



});


fromSelect.addEventListener(
"change",
()=>{

    updateFlag();

    convertCurrency();

});



toSelect.addEventListener(
"change",
()=>{

    updateFlag();

    convertCurrency();

});




amountInput.addEventListener(
"input",
()=>{


    if(amountInput.value){

        convertCurrency();

    }


});



loadCurrencies();

updateFlag();

displayHistory();

convertCurrency();