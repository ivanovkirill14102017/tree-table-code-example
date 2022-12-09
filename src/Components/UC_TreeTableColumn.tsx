import React from "react";

export interface IUC_TreeTableColumn
{
    FieldName: string;
    Width?: string;
};
export abstract class UC_TreeTableColumn extends React.Component<IUC_TreeTableColumn>
{
    public abstract render(): any;
};
