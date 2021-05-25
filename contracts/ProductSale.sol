// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.6.1 <=0.7.6;
//pragma solidity ^0.5.11;
//pragma experimental ABIEncoderV2;

interface IProduct {
    function addProduct(string calldata _productOwnerName, string calldata _productName) external;
    //function addProduct(string memory _productOwnerName, string memory _productName) external;
    //function getAllProductIds() public view onlyOwner returns (uint256[] memory);
}

contract ProductSale {
    address private owner;
    address public productValidationContractAddress;
    IProduct productValidationContract;

    struct Buyer {
        address addr;
        string name;
        bool init;
    }

    struct Shipment {
        address courier;
        uint price;
        uint safepay;
        address payer;
        uint date;
        uint real_date;
        bool init;
    }

    struct Order {
        //string productName;
        ProductInformation product;
        uint quantity;
        uint number;
        uint price;
        uint safepay;
        Shipment shipment;
        address buyer;
        bool init;
    }
  
    struct ProductInformation {
        address productOwnerName;
        string productName;
        uint creationDate;
    }

    struct Invoice {
        uint orderno;
        uint number;
        bool init;
    }

    // The mapping to store orders
    mapping (uint => Order) orders;
    // The mapping to store invoices
    mapping (uint => Invoice) invoices;
    // Mapping to store buyers
    mapping(address => Buyer) buyers;
    //address[] buyerList;

    uint orderseq;
    uint invoiceseq;
    //uint256 buyerseq;

    // Event triggered for every registered buyer
    event BuyerRegistered(address buyer, string name);

    // Event triggered for every new order
    event OrderSent(address buyer, string goods, uint quantity, uint orderno);

    // Event triggerd when the order gets valued and wants to know the value of the payment
    event PriceSent(address buyer, uint orderno, uint price, int8 ttype);

    // Event trigger when the buyer performs the safepay
    event SafepaySent(address buyer, uint orderno, uint value, uint now);

    // Event triggered when the seller sends the invoice
    event InvoiceSent(address buyer, uint invoiceno, uint orderno, uint delivery_date, address courier);

    // Event triggered when the courier delivers the order
    event OrderDelivered(address buyer, uint invoiceno, uint orderno, uint real_delivey_date, address courier);

    modifier onlyOwner () {
        require(msg.sender == owner);
        _;
    }

    modifier onlyContract () {
        require(msg.sender == productValidationContractAddress);
        _;
    }

    // The smart contract's constructor
    constructor() public payable {
        // The seller is the contract's owner
        owner = msg.sender;

        // casting from address payable to address
        //address payable _addr = msg.sender;
        //address addr = address(_addr);

        // casting from address to address payable
        //address _addr = msg.sender;
        //address payable addr = address(uint160(_addr));
    }

    function getOwner() public view returns (address) {
        return owner;
    }
  
    function setProductValidationContractAddress(address contractAddress) public onlyOwner {
        productValidationContractAddress = contractAddress;
    }

    function getProductValidationContractAddress() public view onlyOwner returns (address) {
        return productValidationContractAddress;
    }

    function isBuyer(address _address) public view returns (bool res) {
        return buyers[_address].init;
        //return orders[_orderno].buyer.init;
    }

    function addBuyer(address _buyerAddress) private {
        if (isBuyer(_buyerAddress)) {
            revert();
        }
        buyers[_buyerAddress] = Buyer(_buyerAddress, "", true);
        //buyerseq++;
    }

    function addBuyer(address _buyerAddress, string memory _buyerName) private {
        if (isBuyer(_buyerAddress)) {
            revert();
        }
        buyers[_buyerAddress] = Buyer(_buyerAddress, _buyerName, true);
        //buyerseq++;
    }

    function getBuyer(address _buyerAddress) public view onlyOwner returns (
        address buyerAddress,
        string memory buyerName,
        bool init) {

        if (!isBuyer(_buyerAddress)) {
            revert();
        }

        return (buyers[_buyerAddress].addr, buyers[_buyerAddress].name, buyers[_buyerAddress].init);
    }

    // The function to send purchase orders
    // requires fee
    // Payable functions returns just the transaction object, with no custom field.
    // To get field values listen to OrderSent event.
    //function sendOrder(string memory goods, uint quantity) public payable {
    function sendOrder(string memory productName, uint quantity) public payable {
        // Accept orders just from buyer
        //require(msg.sender == buyerAddr);

        // Instantiate product
        ProductInformation memory productInfo = ProductInformation(address(0), productName, block.timestamp);

        Shipment memory shipment = Shipment(address(0), 0, 0, address(0), 0, 0, false);

        // Increment the order sequence
        // start with 1
        orderseq++;

        // Create the order register
        //orders[orderseq] = Order(goods, quantity, orderseq, 0, 0, Shipment(address(0), 0, 0, address(0), 0, 0, false), true);
        orders[orderseq] = Order(productInfo, quantity, orderseq, 0, 0, shipment, msg.sender, true);

        addBuyer(msg.sender);

        // Trigger the event
        emit OrderSent(msg.sender, productName, quantity, orderseq);
    }

    // The function to query orders by number
    // Constant functions returns custom fields
    function queryOrder(uint orderno) public view returns (
        address buyer,
        string memory productName,
        uint quantity,
        uint price,
        uint safepay,
        uint delivery_price,
        uint delivey_safepay) {
        // Validate the order number
        require(orders[orderno].init);

        // CompilerError: Stack too deep, try removing local variables
        //address buyerAddress = orders[orderno].buyer;
        //require(buyers[buyerAddress].init);
        require(buyers[orders[orderno].buyer].init);

        // Return the order data
        return(orders[orderno].buyer,
            orders[orderno].product.productName,
            orders[orderno].quantity,
            orders[orderno].price,
            orders[orderno].safepay,
            orders[orderno].shipment.price,
            orders[orderno].shipment.safepay);
    }

    // The function to send the price to pay for order
    // Just the owner can call this function
    // requires fee
    function sendPrice(uint orderno, uint price, int8 ttype) public payable {
        // Only the owner can use this function
        require(msg.sender == owner);

        // Validate the order number
        require(orders[orderno].init);

        // Validate the type
        // 1=order
        // 2=shipment
        require(ttype == 1 || ttype == 2);

        if (ttype == 1) { // Price for Order
            // Update the order price
            orders[orderno].price = price;
        } else { // Price for Shipment
            // Update the shipment price
            orders[orderno].shipment.price = price;
            orders[orderno].shipment.init = true;
        }

        // Trigger the event
        //emit PriceSent(buyers[orders[orderno].buyer].addr, orderno, price, ttype);
        emit PriceSent(orders[orderno].buyer, orderno, price, ttype);
    }

    // The function to send the value of order's price
    // This value will be blocked until the delivery of order
    // requires fee
    function sendSafepay(uint orderno) public payable {
        // Validate the order number
        require(orders[orderno].init);

        // Just the buyer can make safepay
        //require(buyerAddr == msg.sender);
        require(orders[orderno].buyer == msg.sender);

        // The order's value plus the shipment value must equal to msg.value
        require((orders[orderno].price + orders[orderno].shipment.price) == msg.value);

        orders[orderno].safepay = msg.value;

        emit SafepaySent(msg.sender, orderno, msg.value, block.timestamp);
    }

    // The function to send the invoice data
    // requires fee
    function sendInvoice(uint orderno, uint delivery_date, address courier) public payable {
        // Validate the order number
        require(orders[orderno].init);

        // Just the seller can send the invoice
        require(owner == msg.sender);

        // Buyer must be set
        address buyerAddress = orders[orderno].buyer;
        require(buyers[buyerAddress].init);

        // Increment the invoice sequence
        // start with 1
        invoiceseq++;

        // Create then Invoice instance and store it
        invoices[invoiceseq] = Invoice(orderno, invoiceseq, true);

        // Update the shipment data
        orders[orderno].shipment.date = delivery_date;
        orders[orderno].shipment.courier = courier;

        // Trigger the event
        //emit InvoiceSent(orders[orderno].buyer, invoiceseq, orderno, delivery_date, courier);
        emit InvoiceSent(buyers[buyerAddress].addr, invoiceseq, orderno, delivery_date, courier);
    }

    // The function to get the sent invoice
    // requires no fee
    function getInvoice(uint invoiceno) public view returns (
        address buyer,
        uint orderno,
        uint delivery_date,
        address courier){
        // Validate the invoice number
        require(invoices[invoiceno].init);

        Invoice storage _invoice = invoices[invoiceno];
        Order storage _order = orders[_invoice.orderno];
        Buyer storage _buyer = buyers[_order.buyer];

        return (_buyer.addr, _order.number, _order.shipment.date, _order.shipment.courier);
    }

    // The function to mark an order as delivered
    function delivery(uint invoiceno, uint timestamp) public payable {
        // Validate the invoice number
        require(invoices[invoiceno].init);

        Invoice storage _invoice = invoices[invoiceno];
        Order storage _order = orders[_invoice.orderno];

        // Just the courier can call this function
        require(_order.shipment.courier == msg.sender);

        emit OrderDelivered(_order.buyer, invoiceno, _order.number, timestamp, _order.shipment.courier);

        // Payout the Order to the seller
        //owner.transfer(_order.safepay);
        //Solidity 0.6
        address payable sellerAddress = payable(owner);
        //Solidity 0.5
        //address payable sellerAddress = address(uint160(owner));
        sellerAddress.transfer(_order.safepay);

        // Payout the Shipment to the courier
        //_order.shipment.courier.transfer(_order.shipment.safepay);
        //Solidity 0.6
        address payable courierAddress = payable(_order.shipment.courier);
        //Solidity 0.5
        //address payable courierAddress = address(uint160(_order.shipment.courier));
        courierAddress.transfer(_order.shipment.safepay);

        _order.product.productOwnerName = _order.buyer;
        if (productValidationContractAddress == address(0)) {
            return;
        }

        string memory _productOwnerName = toAsciiString(_order.buyer);
        productValidationContract = IProduct(productValidationContractAddress);
        productValidationContract.addProduct(_productOwnerName, _order.product.productName);
    }

    /*
    function createProductContract() public {
        // Only the contract owner (seller) can deploy a new Product contract
        require(msg.sender == owner);
        return new Product();
    } */

    function health() public pure returns (string memory) {
        return "alive";
    }

    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);
        }
        return string(s);
    }

    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }
}
