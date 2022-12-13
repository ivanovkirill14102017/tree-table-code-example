import React, { useEffect, useRef, useState } from "react";
import { TreeTableVM } from "../ViewModels/TreeTableVM";
import { UC_TreeTableItem } from "./UC_TreeTableItem";
import useRenderCallbackVM from "../Hooks/useRenderCallbackVM";

export interface IUC_TreeTable
{
    model: TreeTableVM;
    children?: any[] | null;
}
/** Present simple tree table work by OOP idioma.
 * Usage example:
    // Declare or store or redux or contexting somewhere VM and 'array' data with decalre properties for Id and ParentId:
    const treeModel = useMemo(() => new TreeTableVM().SetDataSource(treeModelArray, "Id", "ParentId"), []);
 
    // Change your array and after changes complete just call 'NotifyDataSourceWasChanged' for apply it to UI:
    treeModel.NotifyDataSourceWasChanged();
 
    // Then ReactNode return:
    <UC_TreeTable model={treeModel} >
        <UC_TreeTableColumn Width="auto" FieldName="Id" />
        <UC_TreeTableColumn Width="250px" FieldName="ParentId" />
    </UC_TreeTable>
 * */
export const UC_TreeTable: React.FC<IUC_TreeTable> = ({ model, children }) =>
{
    useRenderCallbackVM(model);
    model.Options.SetColumns(children);
    return <React.Fragment>
        {(model.RuinedErrorText != null ? (<div className="RuinedErrorText">{model.RuinedErrorText}<p /></div>) : "")}
        <table className="UC_TreeTable">
            <thead>
                <tr>
                    <th className="ExpandIndicator"></th>
                    {(model.Options.HasColumns && model.Options.Columns.map(x => (<th style={{ width: x.Width }}>{x.FieldName}</th>)))}
                    {(!model.Options.HasColumns && <th >Data</th>)}
                </tr>
            </thead>
            <tbody>
                {model.RootItems.map(x => <UC_TreeTableItem key={x.Id} model={x} options={model.Options} />)}
            </tbody>
        </table>
    </React.Fragment>;
};