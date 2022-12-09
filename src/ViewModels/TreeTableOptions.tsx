import { IUC_TreeTableColumn } from "../Components/UC_TreeTableColumn";

export class TreeTableOptions
{
    public IndentSize: number = 10;
    /** Something for 'Open' state. Maybe anything 'string' or 'React.ReactNode'. */
    public IsExpandedIndicator_True: any = "→";
    /** Something for 'Close' state. Maybe anything 'string' or 'React.ReactNode'. */
    public IsExpandedIndicator_False: any = "↓";
    private _Columns: IUC_TreeTableColumn[] | null = null;
    public get Columns(): ReadonlyArray<IUC_TreeTableColumn> { return this._Columns!; }
    public get HasColumns() { return this.Columns != null && this.Columns?.length > 0; }
    public SetColumns(children: any[] | null | undefined | never)
    {
        const columns = children?.map(x => x?.props as IUC_TreeTableColumn) ?? null;
        this._Columns = columns;
    }
    public GetIndentPaddingLeft_px(indent: number, index: number = 0): string | undefined
    {
        if (index > 0)
            return undefined;
        return indent <= 0 ? undefined : indent * this.IndentSize + "px";
    }
    public GetExpandedIndicator(isExpanded: boolean)
    {
        return isExpanded ? this.IsExpandedIndicator_True : this.IsExpandedIndicator_False;
    }

};