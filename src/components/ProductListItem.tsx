import React, { FunctionComponent } from "react";

import { Product } from "../models/product";

interface Props {
  product: Product;
  //onDelete: (product: Product) => void;
}

export const ProductListItem: FunctionComponent<Props> = ({ product /*, onDelete*/ }) => {
  const onClick = () => {
    //onDelete(product);
  };

  return (
    <li>
      {product.productName} <button onClick={onClick}>X</button>
    </li>
  );
};