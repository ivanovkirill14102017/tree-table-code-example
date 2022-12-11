import { ITreeTableItemRepo } from "../Repositories/TreeTableItemRepo";
import { ITreeTableRootItemsRepo } from "../Repositories/TreeTableRootItemsRepo";
import { TreeTableItemVM } from "../ViewModels/TreeTableItemVM";

/** Proxy logicless class wrapped methods of both Repositories. */
export interface ITreeTableStorageLogic
{
    AddRootItem(newItem: TreeTableItemVM): boolean;
    RemoveRootItem(rootItem: TreeTableItemVM): boolean;
    RenderCallback: () => void;
    get RootItems(): ReadonlyArray<TreeTableItemVM>;
    SetPropertyNames(idPropertyName: string, parentIdPropertyName: string): void;
    GetItemById(id: any): TreeTableItemVM | null;
    SetParentChild(parent: TreeTableItemVM, child: TreeTableItemVM): void;    
    ThrowIfContainDublicates(ds: ReadonlyArray<any>): void;
    AddItemAsData(d: any): TreeTableItemVM;
    HasItemByData(d: any): boolean;
};
export class TreeTableStorageLogic implements ITreeTableStorageLogic
{
    public RenderCallback = () => { };
    private readonly _TreeTableItemRepo: ITreeTableItemRepo;
    private readonly _TreeTableRootItemsRepo: ITreeTableRootItemsRepo;
    public constructor(treeTableItemRepo: ITreeTableItemRepo, treeTableRootItemsRepo: ITreeTableRootItemsRepo)
    {
        this._TreeTableItemRepo = treeTableItemRepo;
        this._TreeTableRootItemsRepo = treeTableRootItemsRepo;
    }
    public get RootItems(): ReadonlyArray<TreeTableItemVM> { return this._TreeTableRootItemsRepo.RootItems; }
    public SetPropertyNames(idPropertyName: string, parentIdPropertyName: string): void
    {
        this._TreeTableItemRepo.SetPropertyNames(idPropertyName, parentIdPropertyName);
    }
    public AddRootItem(newItem: TreeTableItemVM): boolean
    {
        if (this._TreeTableRootItemsRepo.AddItem(newItem))
        {
            this.RenderCallback();
            return true;
        }
        return false;
    }
    public RemoveRootItem(rootItem: TreeTableItemVM): boolean
    {
        if (this._TreeTableRootItemsRepo.RemoveItem(rootItem))
        {
            this.RenderCallback();
            return true;
        }
        return false;
    }
    public GetItemById(id: any): TreeTableItemVM | null
    {
        return this._TreeTableItemRepo.GetItemById(id);
    }
    public SetParentChild(parent: TreeTableItemVM, child: TreeTableItemVM)
    {
        parent.InsertChild(child);
    }
    public ThrowIfContainDublicates(ds: ReadonlyArray<any>): void
    {
        if (ds.length != new Set(ds.map(x => x[this._TreeTableItemRepo.IdProperyName])).size)
            throw new RangeError("Contain dublicate PK");
    }
    public AddItemAsData(d: any): TreeTableItemVM
    {
        return this._TreeTableItemRepo.AddItemAsData(d);
    }
    public HasItemByData(d: any):boolean
    {
        return this._TreeTableItemRepo.HasItemByData(d);
    }

};