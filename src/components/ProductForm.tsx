import React from 'react';
import { Product } from '../models/product';

interface Props {
  product: Product;
  onChangeName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd: (event: React.FormEvent<HTMLFormElement>) => void;
}
  
export const ProductForm: React.FunctionComponent<Props> = ({
  product,
  onChangeName,
  onAdd
  }) => (
    <form onSubmit={onAdd}>
      <p>Name:</p>
      <input onChange={onChangeName} value={"" + product.name} />
      <button type="submit">Save Product</button>
    </form>
);