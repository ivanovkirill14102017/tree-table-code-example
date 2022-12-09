import { TreeTableItemVM } from "../ViewModels/TreeTableItemVM";

/** Just store roots - simplest Repository pattern. */
export interface ITreeTableRootItemsRepo
{
    RenderCallback:()=>void;
    get RootItems(): ReadonlyArray<TreeTableItemVM>;
    AddItem(item: TreeTableItemVM): boolean;
    RemoveItem(item: TreeTableItemVM): boolean;
}
export class TreeTableRootItemsRepo implements ITreeTableRootItemsRepo
{
    public RenderCallback = () => { };
    public constructor()
    {
    }
    public get RootItems(): ReadonlyArray<TreeTableItemVM> { return this._RootItems; } private _RootItems: TreeTableItemVM[] = [];
    protected _SetRootItems(value: TreeTableItemVM[]) { this._RootItems = value; }
    public AddItem(item: TreeTableItemVM): boolean
    {
        if (this._RootItems.indexOf(item) != -1)
            return false;
        this._RootItems.push(item);
        this.RenderCallback();
        return true;
    }
    public RemoveItem(item: TreeTableItemVM): boolean
    {
        let index = this._RootItems.indexOf(item);
        if (index == -1)
            return false;
        if (item.Parent == null)
            return false;
        this._RootItems.splice(index, 1);
        this.RenderCallback();
        return true;
    }
};