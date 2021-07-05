var ProductSale = artifacts.require("ProductSale");
var Product = artifacts.require("Product");
var utils = require("./testutils.js");

contract("ProductSale", function(accounts){
 
  const ORDER_PRICE = 3;
  const ORDER_SAFEPAY = 4;
  const ORDER_SHIPMENT_PRICE = 5;
  const ORDER_SHIPMENT_SAFEPAY = 6;

  const INVOICE_ORDERNO = 1;
  const INVOICE_COURIER = 3;

  const TYPE_ORDER = 1;
  const TYPE_SHIPMENT = 2;

  var seller = null;
  var buyer = null;
  var courier = null;
  var orderno = null;
  var invoiceno = null;
  var orderPrice = null;
  var shipmentPrice = null;
  var price = null;
  var productName = null;
  var quantity = null;

  before(function(){
    seller = accounts[0];
    buyer = accounts[1];
    courier = accounts[2];
    orderno = 1;
    invoiceno = 1;
    orderPrice = 100000;
    shipmentPrice = 50000;
    price = orderPrice + shipmentPrice;
    productName = "Wine";
    quantity = 300;
  });

  it("should the seller account owns the contract", function(){
    var sale;

    return ProductSale.new({from: seller}).then(function(instance){
      sale = instance;

      return sale.getOwner();
    }).then(function(owner){
      //assert.equal(seller, owner, "The seller account did not own the contract");
      assert.equal(seller, owner);
    });
    
  });
  
  it("should the second account is the buyer", function(){
    var sale;

    return ProductSale.new({from: seller}).then(function(instance){
      sale = instance;

      return sale.sendOrder(productName, quantity, {from: buyer});
    }).then(function(transaction){
      //console.log(transaction);
      //console.log(transaction.tx);
      //console.log(transaction.receipt);
      return new Promise(function(resolve, reject){
        return web3.eth.getTransaction(transaction.tx, function(err, tx){
          if(err){
            reject(err);
          }
          resolve(tx);
        });
      });
    }).then(function(tx){
      console.log(tx.gasPrice.toString());
      return tx;
    }).then(function(tx){
      //query getTransactionReceipt
      return web3.eth.getTransactionReceipt(tx.hash);
    }).then(function(txReceipt){
      console.log(txReceipt);
      return sale.queryOrder(orderno);
    }).then(function(order){
      //assert.equal(accounts[1], order.buyer, "The second account is not the buyer");
      assert.equal(accounts[1], order.buyer);
    });

  });

  it("should the first order is number 1", function(){
    var sale;

    return ProductSale.new({from: seller}).then(function(instance){
      sale = instance;

      return sale.sendOrder(productName, quantity, {from: buyer});
    }).then(function(transaction){
      return new Promise(function(resolve, reject){
        return web3.eth.getTransaction(transaction.tx, function(err, tx){
          if(err){
            reject(err);
          }
          resolve(tx);
        });
      });
    }).then(function(tx){
      console.log(tx.gasPrice.toString());
    }).then(function(){
      //query getTransactionReceipt
    }).then(function(){
      return sale.queryOrder(orderno);
    }).then(function(order){
      assert.notEqual(order, null, "The order number 1 does not exists");
    });

  });

  it("should the shipment price is set", function(){
    var sale;

    return ProductSale.new({from: seller}).then(function(instance){
      sale = instance;

      return sale.sendOrder(productName, quantity, {from: buyer});
    }).then(function(){
      return sale.sendPrice(orderno, shipmentPrice, TYPE_SHIPMENT, {from: seller});
    }).then(function(){
      return sale.queryOrder(orderno);
    }).then(function(order){
      assert.equal(order[ORDER_SHIPMENT_PRICE].toString(), shipmentPrice);
    });

  });
  
  it("should the orders price is set", function(){
    var sale;

    return ProductSale.new({from: seller}).then(function(instance){
      sale = instance;

      return sale.sendOrder(productName, quantity, {from: buyer});
    }).then(function(){
      return sale.sendPrice(orderno, orderPrice, TYPE_ORDER, {from: seller});
    }).then(function(){
      return sale.queryOrder(orderno);
    }).then(function(order){
      assert.equal(order[ORDER_PRICE].toString(), orderPrice);
    });
  
  });

  it("should the safe pay is correct", function(){
    var sale;

    return ProductSale.new({from: seller}).then(function(instance){
      sale = instance;
      
      return sale.sendOrder(productName, quantity, {from: buyer});
    }).then(function(){
      return sale.sendPrice(orderno, orderPrice, TYPE_ORDER, {from: seller});
    }).then(function(){
      return sale.sendPrice(orderno, shipmentPrice, TYPE_SHIPMENT, {from: seller});
    }).then(function(){
      return sale.sendSafepay(orderno, {from: buyer, value: price});
    }).then(function(){
      return sale.queryOrder(orderno);
    }).then(function(order){
      assert.equal(order[ORDER_SAFEPAY].toString(), price);
    });
  });

  it("should the contract's balance is correct after the safepay", function(){
    var sale;

    return ProductSale.new({from: seller}).then(function(instance){
      sale = instance;
      
      return sale.sendOrder(productName, quantity, {from: buyer});
    }).then(function(){
      return sale.sendPrice(orderno, orderPrice, TYPE_ORDER, {from: seller});
    }).then(function(){
      return sale.sendPrice(orderno, shipmentPrice, TYPE_SHIPMENT, {from: seller});
    }).then(function(){
      return sale.sendSafepay(orderno, {from: buyer, value: price});
    }).then(function(){
      return new Promise(function(resolve, reject){
        return web3.eth.getBalance(sale.address, function(err, hash){
          if(err){
            reject(err);
          }
          resolve(hash);
        });
      });
    }).then(function(balance){
      assert.equal(balance.toString(), price);
    });
  });

  it("should the first invoice is number 1", function(){
    var sale;

    return ProductSale.new({from: seller}).then(function(instance){
      sale = instance;

      return sale.sendOrder(productName, quantity, {from: buyer});
    }).then(function(){
      return sale.sendPrice(orderno, price, TYPE_ORDER, {from: seller});
    }).then(function(){
      return sale.sendInvoice(orderno, 0, courier, {from: seller});
    }).then(function(){
      return sale.getInvoice(invoiceno);
    }).then(function(invoice){
      assert.notEqual(invoice, null);
    });
  });
  

  it("should the invoice 1 is set for order 1", function(){
    var sale;

    return ProductSale.new({from: seller}).then(function(instance){
      sale = instance;

      return sale.sendOrder(productName, quantity, {from: buyer});
    }).then(function(){
      return sale.sendPrice(orderno, price, TYPE_ORDER, {from: seller});
    }).then(function(){
      return sale.sendInvoice(orderno, 0, courier, {from: seller});
    }).then(function(){
      return sale.getInvoice(invoiceno);
    }).then(function(invoice){
      assert.equal(invoice[INVOICE_ORDERNO].toString(), orderno);
    });
  });

  it("should the courier is correct", function(){
    var sale;

    return ProductSale.new({from: seller}).then(function(instance){
      sale = instance;

      return sale.sendOrder(productName, quantity, {from: buyer});
    }).then(function(){
      return sale.sendPrice(orderno, price, TYPE_ORDER, {from: seller});
    }).then(function(){
      return sale.sendInvoice(orderno, 0, courier, {from: seller});
    }).then(function(){
      return sale.getInvoice(invoiceno);
    }).then(function(invoice){
      assert.equal(invoice[INVOICE_COURIER].toString(), courier);
    });
  });

  it("should the contract's balance is correct after the delivery", function(){
    var sale;

    return ProductSale.new({from: seller}).then(function(instance){
      sale = instance;
      
      return sale.sendOrder(productName, quantity, {from: buyer});
    }).then(function(){
      return sale.sendPrice(orderno, orderPrice, TYPE_ORDER, {from: seller});
    }).then(function(){
      return sale.sendPrice(orderno, shipmentPrice, TYPE_SHIPMENT, {from: seller});
    }).then(function(){
      return sale.sendSafepay(orderno, {from: buyer, value: price});
    }).then(function(){
      return sale.sendInvoice(orderno, 0, courier, {from: seller});
    }).then(function(){
      return sale.delivery(invoiceno, 0, {from: courier});
    }).then(function(){
      return new Promise(function(resolve, reject){
        return web3.eth.getBalance(sale.address, function(err, hash){
          if(err){
            reject(err);
          }
          resolve(hash);
        });
      });
    }).then(function(balance){
      assert.equal(balance.toString(), 0);
    });
  });

  it("should the validation contract address is correctly set", function(){
    var product;
    var sale;

    return Product.new({from: seller}).then(function(instance){
      product = instance;
      return ProductSale.new({from: seller}).then(function(instance){
        sale = instance;
      }).then(function(){
        sale.setProductValidationContractAddress(product.address, {from: seller});
      }).then(function(){
        return sale.getProductValidationContractAddress();
      }).then(function(productContractAddress){
        console.log("product validation contract address: " + product.address);
        //console.log("sale.address: " + sale.address);
        console.log("returned product validation contract address: " + productContractAddress);
        assert.equal(productContractAddress, product.address);
      });
    });
  });

  it("should the sale contract address is correctly set", function(){
    var product;
    var sale;

    return Product.new({from: seller}).then(function(instance){
      product = instance;
      return ProductSale.new({from: seller}).then(function(instance){
        sale = instance;
      }).then(function(){
        sale.setProductValidationContractAddress(product.address, {from: seller});
      }).then(function(){
        product.setProductSaleContractAddress(sale.address, {from: seller});
      }).then(function(){
        return product.getProductSaleContractAddress();
      }).then(function(saleContractAddress){
        console.log("sale contract address: " + sale.address);
        console.log("returned sale contract address: " + saleContractAddress);
        assert.equal(saleContractAddress, sale.address);
      });
    });
  });

  it("should the product is added to the Product contract", function(){
    var product;
    var sale;

    return Product.new({from: seller}).then(function(instance){
      product = instance;
      return ProductSale.new({from: seller}).then(function(instance){
        sale = instance;
      }).then(function(){
        return sale.setProductValidationContractAddress(product.address, {from: seller});
      }).then(function(){
        return sale.getProductValidationContractAddress();
      }).then(function(productContractAddress){
        console.log("product validation contract address: " + product.address);
        console.log("returned product validation contract address: " + productContractAddress);
      }).then(function(){
        return product.setProductSaleContractAddress(sale.address, {from: seller});
      }).then(function(){
        return product.getProductSaleContractAddress();
      }).then(function(saleContractAddress){
        console.log("sale contract address: " + sale.address);
        console.log("returned sale contract address: " + saleContractAddress);
      }).then(function(){
        return sale.sendOrder(productName, quantity, {from: buyer});
      }).then(function(){
        return sale.sendPrice(orderno, orderPrice, TYPE_ORDER, {from: seller});
      }).then(function(){
        return sale.sendPrice(orderno, shipmentPrice, TYPE_SHIPMENT, {from: seller});
      }).then(function(){
        return sale.sendSafepay(orderno, {from: buyer, value: price});
      }).then(function(){
        return sale.sendInvoice(orderno, 0, courier, {from: seller});
      }).then(function(){
        return sale.delivery(invoiceno, 0, {from: courier});
      }).then(function(){
        var productInfoPromise = product.getProductFromProductId(1);
        console.log(productInfoPromise);
        return productInfoPromise.then(function(productInfo){
          console.log(productInfo);
          return productInfo;
        }).then(function(productInfo){
          //assert.equal(productInfo.productName, productName);
          console.log(buyer);
          buyer = buyer.substring(2);
          buyer = buyer.toLowerCase();
          console.log("buyer: " + buyer);
          console.log("product: " + productName);
          /*
          expect({ownerName: productInfo.ownerName, productName: productInfo.productName}).toEqual({
            ownerName: buyer,
            productName: productName,
          });
          */
          //expect(productInfo.ownerName).toBe(buyer);
          //expect(productInfo.productName).toBe(productName);
          //expect(productInfo.ownerName.isPresent()).to.eventually.equal(buyer);
          //expect(productInfo.productName.isPresent()).to.eventually.equal(productName);
          expect(productInfo.ownerName).to.equal(buyer);
          expect(productInfo.productName).to.equal(productName);
        });
      });
    });
  });

});
