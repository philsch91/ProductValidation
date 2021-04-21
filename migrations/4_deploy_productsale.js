"use strict";

var ProductSale = artifacts.require("./ProductSale.sol");

module.exports = function(deployer, network, accounts){
    deployer.deploy(ProductSale);
};
