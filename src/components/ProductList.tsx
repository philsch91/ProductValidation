import React, { FunctionComponent } from "react";

import { Product } from "../models/product";
import { ProductListItem } from "./ProductListItem";

interface Props {
  products: Product[];
  //onDelete: (product: Product) => void;
}

export const ProductList: FunctionComponent<Props> = ({ products /*,onDelete*/ }) => (
  <ul>
    {products.map(product => (
      <ProductListItem product={product} />
    ))}
  </ul>
);