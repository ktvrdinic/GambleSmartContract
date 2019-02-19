pragma solidity ^0.5.1;

contract TripleCoin{

    // adrese igraca koji su uplatitli
    address[3] adresa;
    
    // random broj
    uint number;
    
    // adrese igraca koji su pobjedili
    address adresaZaIsplatu;
    
    // brojac za index igraca koji su igrali
    uint counter;

    constructor() public {
        counter = 0;
    }

    // metoda koja biljezi sve uplate
    function setBet(address a) public{
        if(counter < 3){
            adresa[counter] = a;    
            counter++;
        }
    }

    // brise sve podatke nakon sto krug zavrsi
    function clearBets() public {
        counter = 0;
        delete adresaZaIsplatu;
        for(uint i=0; i<3; i++){
            delete adresa[i];
        }
    }

    // metoda koja dohvaca sve adrese igraca koji su pobjedili
    function getAdresa()public view returns(address){
        return adresaZaIsplatu;
    }

    // metoda koja pronalazi pobjednike
    function tryYourLuck() public {
        generateRandomNumber();
        adresaZaIsplatu = adresa[getRandomNumber()];
    }

    // metoda koja dohvaca trenutni random broj
    function getRandomNumber() public view returns(uint){
        return number;
    }

    // metoda za generiranje random broja
    function generateRandomNumber() public {
        number = (uint(keccak256(abi.encodePacked(block.number-1)))%10+1)%3;
    }
}