import React from 'react';
import { Product } from '../models/product';

interface Props {
  product: Product;
  onChangeProductName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeProductCompany: (event: React.ChangeEvent<HTMLInputElement>) => void;
  //onAdd: (event: React.FormEvent<HTMLFormElement>) => void;
  onAdd: () => void;
  onDeploy: () => void;
}

export const ProductForm: React.FunctionComponent<Props> = ({
  product,
  onChangeProductName,
  onChangeProductCompany,
  onAdd,
  onDeploy
  }) => (
    <form /*onSubmit={onAdd}*/>
      <p>Name:</p>
      <input onChange={onChangeProductName} value={"" + product.productName} />
      <p>Owner Name:</p>
      <input onChange={onChangeProductCompany} value={"" + product.ownerName} />
      
      {/*<button type="submit">Save Product</button>*/}
      <button onClick={onAdd} className="btn btn-primary btn-block">Save Product</button>
      <button onClick={onDeploy} className="btn btn-primary btn-block">Deploy</button>
    </form>
);
