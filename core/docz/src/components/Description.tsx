import { get, last } from "lodash/fp";
import * as React from 'react';
import { ComponentClass, createElement, FunctionComponent, SFC } from 'react';
import { doczState } from '../state';
import { ComponentWithDocGenInfo } from "./Props";

type Tag = FunctionComponent | ComponentClass | string;

export interface DescriptionProps  {
  of: ComponentWithDocGenInfo;
  as?: Tag;
}

export const Description: SFC<DescriptionProps> = ({ of: component, as: tag }) => {
  const { props: stateProps } = React.useContext(doczState.context);
  const filename = get("__filemeta.filename", component);
  const found =
    stateProps &&
    stateProps.length > 0 &&
    stateProps.find(item => item.key === filename);

  const definition = last(found ? found.value : []);
  const description = get("description", definition) || "";

  if (!description) {
    return null;
  }
  
  return createElement(tag || "span", null, [description]);
};
