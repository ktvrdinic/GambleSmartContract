var provjeraRacuni;
var Racuni = new Array();

// ABI ugovora
var contractAbi = [
	{
		"constant": true,
		"inputs": [
			{
				"name": "soba",
				"type": "uint256"
			}
		],
		"name": "getIzvucenaSoba",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "soba",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "soba",
				"type": "uint256"
			}
		],
		"name": "returnWinner",
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
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "soba_adrese",
		"outputs": [
			{
				"name": "izvucena",
				"type": "bool"
			},
			{
				"name": "counter",
				"type": "uint256"
			},
			{
				"name": "balances",
				"type": "uint256"
			},
			{
				"name": "adresaZaIsplatu",
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
		"constant": true,
		"inputs": [],
		"name": "number",
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
		"constant": false,
		"inputs": [
			{
				"name": "soba",
				"type": "uint256"
			}
		],
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
				"name": "soba",
				"type": "uint256"
			}
		],
		"name": "setBet",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "soba",
				"type": "uint256"
			}
		],
		"name": "tryYourLuck",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	}
];

var contractAddress = "0xe8cc5edf8412a9a842ede7a763e02f63366bbfda";

var accounts;
var mainAcc;

function init() {
	for(var i=0;i<3;i++){
		Racuni[i] = new Array();
	}

	var provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
	window.web3 = new Web3(provider);

	accounts = web3.eth.accounts;	

	window.spojeno = true;
}

function isEmpty(str){
	return !str.replace(/\s+/, '').length;
}

function changeSelect(){
	var okladjeneAdrese = document.getElementById("okladjeniRacuni");
	var soba = document.getElementById("msgRoom").value;

	okladjeneAdrese.innerHTML = "<p>ROOM "+ (+soba+1) +" - Addresses that are in the bets:</p>";

	for (var i = 0; i < Racuni[+soba].length; ++i) {
		okladjeneAdrese.innerHTML += (i+1) + ". Player: <i>" + Racuni[+soba][i] + "</i><br />";
	}
}

function oklada(){
	var soba = document.getElementById("msgRoom").value;
	var okladjeneAdrese = document.getElementById("okladjeniRacuni");
	var pobjednikText = document.getElementById("pobjednik");

	var contr = web3.eth.contract(contractAbi).at(contractAddress);

	if(Racuni[+soba].length == (+soba + 2)){
		alert("All bets are made.");
	}else{
		Racuni[+soba].push(web3.eth.defaultAccount);
		contr.setBet(+soba, { from: web3.eth.defaultAccount, value: web3.toWei(1,'ether'), gas: 1000000}, function (err, result) {console.log(err);});
	}

	okladjeneAdrese.innerHTML = "<p>ROOM "+ (+soba+1) +" - Addresses that are in the bets:</p>";

	for (var i = 0; i < Racuni[+soba].length; ++i) {
		okladjeneAdrese.innerHTML += (i+1) + ". Player: <i>" + Racuni[+soba][i] + "</i><br />";
	}
	
	if((Racuni[+soba].length == +soba + 2)){
		var randomNumber = contr.tryYourLuck(+soba, {gas: 1000000});	
		if(contr.getIzvucenaSoba(+soba)){
			var adresaPobjednik = contr.returnWinner(+soba); 
			
			pobjednikText.innerHTML += "<p id='soba"+ soba +"'>Room number " + (+soba+1) + ": The winner is the player with the address <b>" + adresaPobjednik +"</b>. Congratulations, the player won " + (+soba+2) +" ETH!</p>";

			contr.transfer(+soba, {to: adresaPobjednik, value: web3.toWei(+soba+2,'ether')}, {gas: 1000000});

			contr.clearBets(+soba, {gas:1000000});
		}
	}
}

function clearRoom(){
	var soba = document.getElementById("msgRoom").value;
	var contr = web3.eth.contract(contractAbi).at(contractAddress);
	var okladjeneAdrese = document.getElementById("okladjeniRacuni");
	var pobjednikText = document.getElementById("soba"+soba);

	Racuni[+soba].length = 0;
	contr.clearBets(+soba, {gas:100000});
	okladjeneAdrese.innerHTML = "<p>ROOM "+ (+soba+1) +" - Addresses that are in the bets:</p>";	
	if(typeof(pobjednikText) != 'undefined' && pobjednikText != null)
	{
		pobjednikText.remove();
	}
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