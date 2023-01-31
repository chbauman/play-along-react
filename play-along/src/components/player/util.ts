import { ReactElement } from "react";

export type Player = {
  comp: ReactElement;
  getTime: () => Promise<number>;
};
