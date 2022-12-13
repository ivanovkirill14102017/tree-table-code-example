import { TreeTableItemVM } from "../ViewModels/TreeTableItemVM";
import { ITreeTableStorageLogic } from "./TreeTableStorageLogic";


export interface IFindAndCreateNewItemsLogic
{
    /** Point of start apply changes. */
    ProcessItems(ds: ReadonlyArray<any>): void;
    /** Add new appeared items into HashTable. Return list of new items.  */
    FindAndCreateNewItems(ds: ReadonlyArray<any>): TreeTableItemVM[]
    /** Maybe root can meet his parent now?  */
    RemoveRootsIfParentAppeared(newItems: TreeTableItemVM[]): void;
    /** Hashing child/parents relations. If item is orphan - move it to roots.  */
    SetupNewItemsParentOrAddAsRoot(newItems: TreeTableItemVM[]): void;
};
export class FindAndCreateNewItemsLogic implements IFindAndCreateNewItemsLogic
{
    private readonly _TreeTableStorageLogic: ITreeTableStorageLogic;
    public constructor(treeTableStorageLogic:ITreeTableStorageLogic)
    {
        this._TreeTableStorageLogic = treeTableStorageLogic;
    }
    public ProcessItems(ds: ReadonlyArray<any>)
    {
        this._TreeTableStorageLogic.ThrowIfContainDublicates(ds);
        const newItems = this.FindAndCreateNewItems(ds);
        this.RemoveRootsIfParentAppeared(newItems);
        this.SetupNewItemsParentOrAddAsRoot(newItems);
    }
    public FindAndCreateNewItems(ds: ReadonlyArray<any>): TreeTableItemVM[]
    {
        let newItems: TreeTableItemVM[] = [];
        ds.forEach(d =>
        {
            if (!this._TreeTableStorageLogic.HasItemByData(d))
            {
                let tti = this._TreeTableStorageLogic.AddItemAsData(d);
                newItems.push(tti);
            }
        });
        return newItems;
    }
    public RemoveRootsIfParentAppeared(newItems: TreeTableItemVM[])
    {
        this._TreeTableStorageLogic.RootItems.map(x => x)
            .forEach(rootItem =>
            {
                let parentId = rootItem.DataParentId;
                if (parentId == null)
                    return;
                let parentItem = newItems.find(x => x.Id == parentId);
                if (parentItem == null)
                    return;

                this._TreeTableStorageLogic.SetParentChild(parentItem, rootItem);
                this._TreeTableStorageLogic.RemoveRootItem(rootItem);
            });
    }
    public SetupNewItemsParentOrAddAsRoot(newItems: TreeTableItemVM[])
    {
        let newItemsSet = new Map<any, TreeTableItemVM | null>();
        newItems.forEach(newItem =>
        {
            let parentIdOfNewItem = newItem.DataParentId;
            if (parentIdOfNewItem == newItem.Id)
                throw "item has parentId to itself " + newItem.Id;

            let parentItemOfNewItem = this._TreeTableStorageLogic.GetItemById(parentIdOfNewItem);
            if (parentItemOfNewItem == null && parentIdOfNewItem != null)
            {
                if (!newItemsSet.has(parentIdOfNewItem))
                    newItemsSet.set(parentIdOfNewItem, newItems.find(x => x.Id == parentIdOfNewItem) ?? null);
                parentItemOfNewItem = newItemsSet.get(parentIdOfNewItem) ?? null;
            }
            if (parentItemOfNewItem == null)
            {
                this._TreeTableStorageLogic.AddRootItem(newItem);
                return;
            }
            this._TreeTableStorageLogic.SetParentChild(parentItemOfNewItem, newItem);
        });
    }


};
