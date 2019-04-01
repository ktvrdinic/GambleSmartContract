pragma solidity ^0.5.1;

contract TripleCoin {

    struct Soba{
        bool izvucena;
        // Broj izvucenih osoba
        uint256 counter;
        // Stanje racuna po pojedinim sobama
        uint256 balances;
        address payable adresaZaIsplatu;
        address payable []adrese;
    }

    // Tri sobe za kladenje
    mapping(uint256 => Soba) public soba_adrese;
    
    // random broj
    uint public number;

    constructor() public {
        soba_adrese[0].izvucena = soba_adrese[1].izvucena = soba_adrese[2].izvucena = false;
        soba_adrese[0].counter = soba_adrese[1].counter = soba_adrese[2].counter = 0;
    }

    // metoda koja biljezi sve uplate, te vrsi uplatu na ugovor
    function setBet(uint256 soba) payable public returns(bool){
        require((soba_adrese[soba].balances < ((soba*1 ether)+2 ether)) && (soba_adrese[soba].counter < (soba+2)) && (soba < 3));
        if(soba == 0 && soba_adrese[0].counter < 2){
            soba_adrese[0].adrese.push(msg.sender);
            soba_adrese[0].counter++;
            soba_adrese[soba].balances += msg.value;
            return true;
        }else if(soba == 1 && soba_adrese[1].counter < 3){
            soba_adrese[1].adrese.push(msg.sender);
            soba_adrese[1].counter++;
            soba_adrese[soba].balances += msg.value;
            return true;
        }else if(soba == 2 && soba_adrese[2].counter < 4){
            soba_adrese[2].adrese.push(msg.sender);
            soba_adrese[2].counter++;
            soba_adrese[soba].balances += msg.value;
            return true;
        }else{
            tryYourLuck(soba);
            return false;
        }
    }

    // brise sve podatke nakon sto krug zavrsi
    function clearBets(uint256 soba) public {
        require(soba < 3);
        if(soba == 0 && soba_adrese[0].counter == 2){
            delete soba_adrese[0].adrese;
            delete soba_adrese[0].adresaZaIsplatu;
            soba_adrese[0].counter=0;
            soba_adrese[0].izvucena = false;
            soba_adrese[0].balances -= soba_adrese[0].balances;
        }else if(soba == 1 && soba_adrese[1].counter == 3){
            delete soba_adrese[1].adrese;
            delete soba_adrese[1].adresaZaIsplatu;
            soba_adrese[1].counter=0;
            soba_adrese[1].izvucena = false;
            soba_adrese[1].balances -= soba_adrese[1].balances;
        }else if(soba == 2 && soba_adrese[2].counter == 4){
            delete soba_adrese[2].adrese;
            delete soba_adrese[2].adresaZaIsplatu;
            soba_adrese[2].counter=0;
            soba_adrese[2].izvucena = false;
            soba_adrese[2].balances -= soba_adrese[2].balances;
        }
    }

    // metoda koja pronalazi pobjednike
    function tryYourLuck(uint256 soba) public returns(uint256){
        if(soba == 0 && soba_adrese[0].counter == 2 && soba_adrese[0].izvucena == false){
            generateRandomNumber();
            soba_adrese[0].adresaZaIsplatu = soba_adrese[0].adrese[getRandomNumber()%2];
            soba_adrese[0].izvucena = true;
            return getRandomNumber()%2;
        }else if(soba == 1 && soba_adrese[1].counter == 3 && soba_adrese[1].izvucena == false){
            generateRandomNumber();
            soba_adrese[1].adresaZaIsplatu = soba_adrese[1].adrese[getRandomNumber()%3];
            soba_adrese[1].izvucena = true;
            return getRandomNumber()%3;
        }else if(soba == 2 && soba_adrese[2].counter == 4 && soba_adrese[2].izvucena == false){
            generateRandomNumber();
            soba_adrese[2].adresaZaIsplatu = soba_adrese[2].adrese[getRandomNumber()%4];
            soba_adrese[2].izvucena = true;
            return getRandomNumber()%4;
        }
        return 10;
    }

    // metoda koja dohvaca trenutni random broj
    function getRandomNumber() public view returns(uint256){
        return number;
    }
    
    // metoda koja dohvaca trenutni random broj
    function getIzvucenaSoba(uint256 soba) public view returns(bool){
        return soba_adrese[soba].izvucena;
    }

    // Izbrisati
    function returnWinner(uint256 soba) public view returns(address){
        return soba_adrese[soba].adresaZaIsplatu;
    }

    // metoda za generiranje random broja
    function generateRandomNumber() public {
        number = (uint(keccak256(abi.encodePacked(block.number-1)))%10+1)%4;
    }
    
    // Prebacivanje novaca na drugi racun
    function transfer(uint256 soba) public {
        require(soba_adrese[soba].balances == ((soba*1 ether)+2 ether));
        if(soba_adrese[0].counter == 2 && soba == 0 && soba_adrese[0].izvucena == true){
            soba_adrese[0].adresaZaIsplatu.transfer(2 ether);
            soba_adrese[soba].balances -= 2 ether;
        }else if(soba_adrese[1].counter == 3 && soba == 1 && soba_adrese[1].izvucena == true){
            soba_adrese[1].adresaZaIsplatu.transfer(3 ether);
            soba_adrese[soba].balances -= 3 ether;
        }else if(soba_adrese[2].counter == 4 && soba == 2 && soba_adrese[2].izvucena == true){
            soba_adrese[2].adresaZaIsplatu.transfer(4 ether);
            soba_adrese[soba].balances -= 4 ether;
        }
    }
}