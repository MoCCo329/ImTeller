const Migrations = artifacts.require("Migrations");
const Token = artifacts.require("./Token.sol");
const ClassicNFT = artifacts.require("ClassicNFT");
const DealController = artifacts.require("DealController");
const Deal = artifacts.require("Deal");
const Exchange = artifacts.require("Exchange");

module.exports = function (deployer) {
//  deployer.deploy(Migrations);
  //deployer.deploy(Token, "Token", "SSF", 0);
  //deployer.deploy(ClassicNFT, "0xBf8ABe192908373d06C9A04091408E2BeE4FD024");
  //deployer.deploy(DealController, "0xBf8ABe192908373d06C9A04091408E2BeE4FD024", "0x7604f12D848B5d8438f792A96839F0b7bF856Fd5" );
  deployer.deploy(Exchange, "0xBf8ABe192908373d06C9A04091408E2BeE4FD024", "0x7604f12D848B5d8438f792A96839F0b7bF856Fd5");
};
