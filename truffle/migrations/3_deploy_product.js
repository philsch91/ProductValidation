"use strict";

var Product = artifacts.require("./Product.sol");

module.exports = function(deployer, network, accounts){
    deployer.deploy(Product);
};
