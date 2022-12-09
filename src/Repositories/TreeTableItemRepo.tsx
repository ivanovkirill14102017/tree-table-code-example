import { TreeTableItemVM } from "../ViewModels/TreeTableItemVM";

/** Just store items - simplest Repository-Factory no check pattern. */
export interface ITreeTableItemRepo
{
    get AllItems(): ReadonlyArray<TreeTableItemVM>;
    SetPropertyNames(idProperyName: string, parentIdProperyName: string): void;
    get IdProperyName(): string;
    get ParentIdProperyName(): string
    AddItemAsData(d: any): TreeTableItemVM;
    HasItemByData(d: any): boolean;
    GetItemById(id: any): TreeTableItemVM | null;
    SetParentChild(parent: TreeTableItemVM, child: TreeTableItemVM): void;
};
export class TreeTableItemRepo implements ITreeTableItemRepo
{
    public constructor()
    {
    }
    public get AllItems(): ReadonlyArray<TreeTableItemVM> { return Array.from(this._AllItems, ([k, v]) => v); } private _AllItems: Map<any, TreeTableItemVM> = new Map<any, TreeTableItemVM>();
    protected _SetAllItems(value: Map<any, TreeTableItemVM>) { this._AllItems = value; }
    public SetPropertyNames(idProperyName: string = "Id", parentIdProperyName: string = "ParentId")
    {
        this._IdProperyName = idProperyName;
        this._ParentIdProperyName = parentIdProperyName;
    }
    public get IdProperyName(): string { return this._IdProperyName; } private _IdProperyName: string = "Id";
    public get ParentIdProperyName(): string { return this._ParentIdProperyName; } private _ParentIdProperyName: string = "ParentId";

    public AddItemAsData(d: any): TreeTableItemVM
    {
        if (d instanceof TreeTableItemVM)
            throw `Put some data like "{ ${this.IdProperyName}:123,${this.ParentIdProperyName}:11, ...othersData:{...} }", istead of create TreeTableItemVM directly.`;

        let id = d[this.IdProperyName];
        let parentId = d[this.ParentIdProperyName];
        let tti = new TreeTableItemVM(d, id, parentId);
        this._AllItems.set(id, tti);
        return tti;
    }
    public HasItemByData(d: any): boolean
    {
        let id = d[this.IdProperyName];
        return this._AllItems.has(id);
    }
    public GetItemById(id: any): TreeTableItemVM | null
    {
        return this._AllItems.get(id) ?? null;
    }
    public SetParentChild(parent: TreeTableItemVM, child: TreeTableItemVM)
    {
        parent.InsertChild(child);
    }




};