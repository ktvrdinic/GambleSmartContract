pragma solidity ^0.5.1;

contract TripleCoin {

    // Struktura soba 
    struct Soba{
        bool izvucena;
        uint256 counter;
        address adresaZaIsplatu;
        address[] adrese;
    }

    // Preslikavanje sobe s indeksom
    mapping(uint256 => Soba) public soba_adrese;
    
    // Ovdje se sprema random broj
    uint public number;

    // Postavljanje vrijednosti kroz konstruktor
    constructor() public {
        soba_adrese[0].izvucena = soba_adrese[1].izvucena = soba_adrese[2].izvucena = false;
        soba_adrese[0].counter = soba_adrese[1].counter = soba_adrese[2].counter = 0;
    }

    // Metoda koja biljezi sve uplate
    function setBet(uint256 soba, address a) public returns(bool){
        if(soba == 0 && soba_adrese[0].counter < 2){
            soba_adrese[0].adrese.push(a);
            soba_adrese[0].counter++;
            return true;
        }else if(soba == 1 && soba_adrese[1].counter < 3){
            soba_adrese[1].adrese.push(a);
            soba_adrese[1].counter++;
            return true;
        }else if(soba == 2 && soba_adrese[2].counter < 4){
            soba_adrese[2].adrese.push(a);
            soba_adrese[2].counter++;
            return true;
        }else{
            tryYourLuck(soba);
            return false;
        }
    }

    // Brise sve podatke i priprema za novu igru
    function clearBets(uint256 soba) public {
        if(soba == 0 && soba_adrese[0].counter == 2){
            delete soba_adrese[0].adrese;
            delete soba_adrese[0].adresaZaIsplatu;
            soba_adrese[0].counter=0;
            soba_adrese[0].izvucena = false;
        }else if(soba == 1 && soba_adrese[1].counter == 3){
            delete soba_adrese[1].adrese;
            delete soba_adrese[1].adresaZaIsplatu;
            soba_adrese[1].counter=0;
            soba_adrese[1].izvucena = false;
        }else if(soba == 2 && soba_adrese[2].counter == 4){
            delete soba_adrese[2].adrese;
            delete soba_adrese[2].adresaZaIsplatu;
            soba_adrese[2].counter=0;
            soba_adrese[2].izvucena = false;
        }
    }

    // Metoda koja pronalazi pobjednike u određenoj sobi
    function tryYourLuck(uint256 soba) public returns(uint256){
        if(soba == 0 && soba_adrese[0].counter == 2 && soba_adrese[0].izvucena == false){
            generateRandomNumber();
            soba_adrese[0].adresaZaIsplatu = soba_adrese[0].adrese[getRandomNumber()%2];
            soba_adrese[0].izvucena = true;
        }else if(soba == 1 && soba_adrese[1].counter == 3 && soba_adrese[1].izvucena == false){
            generateRandomNumber();
            soba_adrese[1].adresaZaIsplatu = soba_adrese[1].adrese[getRandomNumber()%3];
            soba_adrese[1].izvucena = true;
        }else if(soba == 2 && soba_adrese[2].counter == 4 && soba_adrese[2].izvucena == false){
            generateRandomNumber();
            soba_adrese[2].adresaZaIsplatu = soba_adrese[2].adrese[getRandomNumber()%4];
            soba_adrese[2].izvucena = true;
        }
    }

    // Metoda koja dohvaca trenutni random broj
    function getRandomNumber() public view returns(uint256){
        return number;
    }
    
    // Metoda koja dohvaca trenutni random broj
    function getIzvucenaSoba(uint256 soba) public view returns(bool){
        return soba_adrese[soba].izvucena;
    }

    // Metoda vraća pobjednika
    function returnWinner(uint256 soba) public view returns(address){
        return soba_adrese[soba].adresaZaIsplatu;
    }

    // metoda za generiranje random broja
    function generateRandomNumber() public {
        number = (uint(keccak256(abi.encodePacked(block.number-1)))%10+1)%4;
    }
}