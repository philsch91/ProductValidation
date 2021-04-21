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
  var order_price = null;
  var shipment_price = null;
  var price = null;
  var goods = null;
  var quantity = null;

  before(function(){
    seller = accounts[0];
    buyer = accounts[1];
    courier = accounts[2];
    orderno = 1;
    invoiceno = 1;
    order_price = 100000;
    shipment_price = 50000;
    price = order_price + shipment_price;
    goods = "Wine";
    quantity = 300;
  });

  it("should the seller account owns the contract", function(){
    
    var sale;

    return ProductSale.new({from: seller}).then(function(instance){
      sale = instance;

      return sale.getOwner();
    }).then(function(owner){
      assert.equal(seller, owner, "The seller account did not own the contract");
    });
    
  });
  
  it("should the second account was the buyer", function(){

    var sale;

    return ProductSale.new({from: seller}).then(function(instance){
      sale = instance;

      return sale.sendOrder(goods, quantity, {from: buyer});
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
      assert.equal(accounts[1], order.buyer, "The second account was not the buyer");
    });

  });

  it("should first order was number 1", function(){

    var sale;

    return ProductSale.new({from: seller}).then(function(instance){
      sale = instance;

      return sale.sendOrder(goods, quantity, {from: buyer});
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
      assert.notEqual(order, null, "The order number 1 did not exists"); 
    });

  });

  it("should the shipment price was set", function(){

    var sale;

    return ProductSale.new({from: seller}).then(function(instance){
      sale = instance;

      return sale.sendOrder(goods, quantity, {from: buyer});
    }).then(function(){
      return sale.sendPrice(orderno, shipment_price, TYPE_SHIPMENT, {from: seller});
    }).then(function(){
      return sale.queryOrder(orderno);
    }).then(function(order){
      assert.equal(order[ORDER_SHIPMENT_PRICE].toString(), shipment_price); 
    });

  });
  
  it("should the order's price was set", function(){

    var sale;

    return ProductSale.new({from: seller}).then(function(instance){
      sale = instance;

      return sale.sendOrder(goods, quantity, {from: buyer});
    }).then(function(){
      return sale.sendPrice(orderno, order_price, TYPE_ORDER, {from: seller});
    }).then(function(){
      return sale.queryOrder(orderno);
    }).then(function(order){
      assert.equal(order[ORDER_PRICE].toString(), order_price);
    });
  
  });

  it("should the safe pay was correct", function(){
    
    var sale;

    return ProductSale.new({from: seller}).then(function(instance){
      sale = instance;
      
      return sale.sendOrder(goods, quantity, {from: buyer});
    }).then(function(){
      return sale.sendPrice(orderno, order_price, TYPE_ORDER, {from: seller});
    }).then(function(){
      return sale.sendPrice(orderno, shipment_price, TYPE_SHIPMENT, {from: seller});
    }).then(function(){
      return sale.sendSafepay(orderno, {from: buyer, value: price});
    }).then(function(){
      return sale.queryOrder(orderno);
    }).then(function(order){
      assert.equal(order[ORDER_SAFEPAY].toString(), price);
    });
  });

  it("should the contract's balance was correct after the safepay", function(){
    
    var sale;

    return ProductSale.new({from: seller}).then(function(instance){
      sale = instance;
      
      return sale.sendOrder(goods, quantity, {from: buyer});
    }).then(function(){
      return sale.sendPrice(orderno, order_price, TYPE_ORDER, {from: seller});
    }).then(function(){
      return sale.sendPrice(orderno, shipment_price, TYPE_SHIPMENT, {from: seller});
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

  it("should the first invoice was number 1", function(){
    
    var sale;

    return ProductSale.new({from: seller}).then(function(instance){
      sale = instance;

      return sale.sendOrder(goods, quantity, {from: buyer});
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
  

  it("should the invoice 1 it is for order 1", function(){
    
    var sale;

    return ProductSale.new({from: seller}).then(function(instance){
      sale = instance;

      return sale.sendOrder(goods, quantity, {from: buyer});
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

  it("should the courier was correct", function(){
    
    var sale;

    return ProductSale.new({from: seller}).then(function(instance){
      sale = instance;

      return sale.sendOrder(goods, quantity, {from: buyer});
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

  it("should the contract's balance was correct after the delivery", function(){
    
    var sale;

    return ProductSale.new({from: seller}).then(function(instance){
      sale = instance;
      
      return sale.sendOrder(goods, quantity, {from: buyer});
    }).then(function(){
      return sale.sendPrice(orderno, order_price, TYPE_ORDER, {from: seller});
    }).then(function(){
      return sale.sendPrice(orderno, shipment_price, TYPE_SHIPMENT, {from: seller});
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

  it("should the validation contract address should be correctly set", function(){
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
      }).then(function(contractAddress){
        console.log("product.address: " + product.address);
        //console.log("sale.address: " + sale.address);
        console.log("contractAddress: " + contractAddress);
        assert.equal(contractAddress, product.address);
      });
    });
  });

});
