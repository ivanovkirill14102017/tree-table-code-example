import React from "react";
import useRenderCallbackVM from "../Hooks/useRenderCallbackVM";
import { TreeTableItemVM } from "../ViewModels/TreeTableItemVM";
import { TreeTableOptions } from "../ViewModels/TreeTableOptions";

export interface IUC_TreeTableItem
{
    model: TreeTableItemVM;
    options: TreeTableOptions;
}
export const UC_TreeTableItem: React.FC<IUC_TreeTableItem> = ({ ...props }) =>
{
    const { model, options } = props;
    useRenderCallbackVM(model);
    function GetReactTdStyle(index: number = 0): React.CSSProperties | undefined
    {
        return { paddingLeft: options.GetIndentPaddingLeft_px(model.Indent, index), };
    }
    return (
        <React.Fragment>
            <tr>
                <td style={GetReactTdStyle(0)}>
                    {model.HasChildren ?
                        <div onClick={() => { model.IsExpanded = !model.IsExpanded; }}>
                            {options.GetExpandedIndicator(model.IsExpanded)}
                        </div> : null}
                </td>
                {options.HasColumns && options.Columns.map((x, index) => (<td style={GetReactTdStyle(index)}>{model.Data[x.FieldName]}</td>))}
                {!options.HasColumns && <td style={GetReactTdStyle(0)}>Data</td>}
            </tr>
            {(model.IsExpanded && model.HasChildren &&
                <React.Fragment>
                    {model.Children.map(x => <UC_TreeTableItem key={x.Id} model={x} options={options} />)}
                </React.Fragment>
            )}
        </React.Fragment>
    );
};


