import React, { FunctionComponent } from "react";

import { Deal } from "../models/deal";
import { DealListItem } from "./DealListItem";

interface Props {
  deals: Deal[];
  //onDelete: (deal: Deal) => void;
}

export const DealList: FunctionComponent<Props> = ({ deals /*,onDelete*/ }) => (
  <ul>
    {deals.map(deal => (
      <DealListItem deal={deal} />
    ))}
  </ul>
);