import React from 'react';
import { Product } from '../models/product';

interface Props {
  product: Product;
  onChangeBuyer: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd: (event: React.FormEvent<HTMLFormElement>) => void;
}
  
export const ProductForm: React.FunctionComponent<Props> = ({
  product,
  onChangeBuyer,
  onAdd
  }) => (
    <form onSubmit={onAdd}>
      <p>Buyer:</p>
      <input onChange={onChangeBuyer} value={"" + product.buyer} />
      <button type="submit">Safe Deal</button>
    </form>
);