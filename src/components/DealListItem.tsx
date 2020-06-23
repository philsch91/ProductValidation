import React, { FunctionComponent } from "react";

import { Deal } from "../models/deal";

interface Props {
  deal: Deal;
  //onDelete: (deal: Deal) => void;
}

export const DealListItem: FunctionComponent<Props> = ({ deal /*, onDelete*/ }) => {
  const onClick = () => {
    //onDelete(deal);
  };

  return (
    <li>
      {deal.name} <button onClick={onClick}>X</button>
    </li>
  );
};