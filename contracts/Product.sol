pragma solidity >=0.6.1;
//pragma solidity >=0.5.0  <0.6.0;
//pragma experimental ABIEncoderV2;

contract Product {
    address payable private owner;
    uint256 private startTime;
    uint256 private productId;

    event ReturnValue(string productOwnerName, string productName, uint creationDate);

    struct ProductInformation {
        string productOwnerName;
        string productName;
        uint creationDate;
    }

    mapping(uint256 => ProductInformation) productInfos;

    uint256[] productInfoList;

    modifier onlyWhileOpen() {
        require(block.timestamp >= startTime);
        _;
    }

    modifier onlyOwner () {
        require(msg.sender == owner);
        _;
    }

    constructor() public {
        owner = msg.sender;
        startTime = now;
        productId = 0;
    }

    function close() public onlyOwner {//onlyOwner is custom modifier
        selfdestruct(owner);
        // `owner` is the owners address
    }

    function addProduct(string memory _productOwnerName, string memory _productName) public onlyWhileOpen onlyOwner {

        Product.ProductInformation storage productInfo = productInfos[productId + 1];

        productInfo.productOwnerName = _productOwnerName;
        productInfo.productName = _productName;
        productInfo.creationDate = now;

        productInfoList.push(productId + 1);
        productId = productId + 1;
    }


    function getAllProductIds() public view onlyOwner returns (uint256[] memory){
        return productInfoList;
    }

    function getProductFromProductId(uint256 _productId) public view returns (string memory ownerName, string memory productName, uint creationDate){
        return (productInfos[_productId].productOwnerName,
        productInfos[_productId].productName,
        productInfos[_productId].creationDate);
    }

    function getProductCount() public view returns (uint productCount) {
        return productInfoList.length;
    }

    function isProduct(uint256 _productId, string memory _productName) public view returns (bool isIndeed) {
        if (keccak256(abi.encodePacked(productInfos[_productId].productName)) == keccak256(abi.encodePacked(_productName))) {
            return true;
        }
        return false;
    }
}