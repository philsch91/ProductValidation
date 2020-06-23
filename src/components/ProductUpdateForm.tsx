import React from 'react';
import { Product } from '../models/product';

interface Props {
  product: Product;
  onChangeName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: (event: React.FormEvent<HTMLFormElement>) => void;
}
  
export const ProductUpdateForm: React.FunctionComponent<Props> = ({
  product,
  onChangeName,
  onSend
  }) => (
    <form onSubmit={onSend}>
      <p>Name:</p>
      <input onChange={onChangeName} value={"" + product.name} />
      <button type="submit">Update Product</button>
    </form>
);