pragma solidity >=0.6.1;
//pragma solidity >=0.5.0  <0.6.0;
//pragma experimental ABIEncoderV2;

contract Product {
    address public owner;
    uint256 startTime;
    uint256 productId;

    event ReturnValue(address productOwnerAddress, string productOwnerName, string productName, uint creationDate);

    struct ProductInformation{
        address productOwnerAddress;
        string productOwnerName;
        string productName;
        uint creationDate;
    }

    mapping (uint256 => ProductInformation) productInfos;

    uint256[] productInfoList;

    modifier onlyWhileOpen() {
        require(block.timestamp >= startTime);
        _;
    }

    constructor() public {
        owner = msg.sender;
        startTime = 1579399089;
        productId = 0;
    }

    function addProduct(string memory _productOwnerName, string memory _productName) onlyWhileOpen public{
        Product.ProductInformation storage productInfo = productInfos[productId + 1];


        productInfo.productOwnerAddress = msg.sender;
        productInfo.productOwnerName = _productOwnerName;
        productInfo.productName = _productName;
        productInfo.creationDate = block.timestamp;


        productInfoList.push(productId + 1);
        productId = productId + 1;
    }


    function getAllProductIds() public view returns(uint256[] memory){
        return productInfoList;
    }

    function getProductFromProductId(uint256  _productId) public view returns(address , string memory, string memory, uint ){
        return (productInfos[_productId].productOwnerAddress,
            productInfos[_productId].productOwnerName,
            productInfos[_productId].productName,
            productInfos[_productId].creationDate);
    }

    function getProductCount() public view returns(uint productCount) {
        return productInfoList.length;
    }

    function isProduct(uint256 _productId, address _productOwnerAddress, string memory _productName) view public returns(bool isIndeed) {

        if(keccak256(abi.encodePacked(productInfos[_productId].productOwnerAddress)) == keccak256(abi.encodePacked(_productOwnerAddress)) ){
            if(keccak256(abi.encodePacked(productInfos[_productId].productName)) == keccak256(abi.encodePacked(_productName)) ){
                return true;
            }
        }
        return false;
    }
}
