var provjeraRacuni;
var Racuni = [];

// ABI ugovora
var contractAbi = [
	{
		"constant": true,
		"inputs": [],
		"name": "getAdresa",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "generateRandomNumber",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "tryYourLuck",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "clearBets",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "a",
				"type": "address"
			}
		],
		"name": "setBet",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getRandomNumber",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	}
];

var contractAddress = "0xfe387a2464bd5caa45c773637d85a923bcc8b1ed";
var mainAcc;

function init() {
    var adresa = $("#msgRPC").val();

    var provider = new Web3.providers.HttpProvider(adresa);
    window.web3 = new Web3(provider);

    var $out = $("#racuni");

	var accounts = web3.eth.accounts;
	Acc = accounts.shift();

	provjeraRacuni = accounts;

    var ispis = "Uspješno spojeno! <br />Racuni koji se mogu kladiti: <br /><br />";
    ispis += accounts.join(",<br />");
    
    $out.html(ispis);
    window.spojeno = true;
}

function isEmpty(str){
	return !str.replace(/\s+/, '').length;
}

// metoda kao parametar metode transaction() - opis transakcije
function callbackFn(err, info) {
    console.log("Prošlo je!");
    console.log("Greška: ", err);
    console.log("Informacije: ", info);

    var $out = $("#out");

    if (!err) {
		console.log("Transakcija poslana. TxID:\n" + info);
    }
    else {
		console.log("Transakcija neuspješna. Razlog:\n" + err);
    }
}

function oklada(){	
	var brojac = 0;

	var adresa = document.getElementById("msgAddress").value; 
	var RPC = document.getElementById("msgRPC").value;
	var okladjeneAdrese = document.getElementById("racuni");
	
	var contr = web3.eth.contract(contractAbi).at(contractAddress);

	if(isEmpty(adresa) && isEmpty(RPC)){
		alert("You need to fill all the fields.");
	}else if(Racuni.length == 3){
		alert("All bets are made.");
	}else if(!provjeraRacuni.includes(adresa.toLowerCase())){
		alert("User account doesn't exist! Use another account.");
	}else{
		Racuni.push(adresa);
		contr.setBet(adresa, {gas:1000000});

		var weiAmount = web3.toWei(1, 'ether');
		var info = {
			from: adresa,
			to: web3.eth.accounts[0],
			value: weiAmount
		}
		web3.eth.sendTransaction(info);

		okladjeneAdrese.innerHTML = "";		
		for (var i = 0; i < Racuni.length; ++i) {
			okladjeneAdrese.innerHTML += i+1 + ". " + Racuni[i] + '<br />';
		}
		if(Racuni.length == 3){
			contr.tryYourLuck({gas:1000000});

			var randomNumber = contr.getRandomNumber();
			var adresaPobjednik = contr.getAdresa();
			
			document.getElementById("pobjednik").innerHTML = "Izvucen je igrač pod brojem " + (parseInt(randomNumber)+1) + ", adresa pobjednika je " + adresaPobjednik +". Čestitke!";

			var weiAmount = web3.toWei(3, 'ether');
			var info = {
				from: mainAcc,
				to: adresaPobjednik,
				value: weiAmount
			}
			web3.eth.sendTransaction(info, callbackFn);

			contr.clearBets();
		}
	}                
}