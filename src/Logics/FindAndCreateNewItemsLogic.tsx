import { ITreeTableItemRepo } from "../Repositories/TreeTableItemRepo";
import { ITreeTableRootItemsRepo } from "../Repositories/TreeTableRootItemsRepo";
import { TreeTableItemVM } from "../ViewModels/TreeTableItemVM";


export interface IFindAndCreateNewItemsLogic
{
    /** Point of start apply changes. */
    ProcessItems(ds: ReadonlyArray<any>): void;
    /** Add new appeared items into HashTable. Return list of new items. 
        Находит новые элементы и помещает в HashTable. Вовращает список новых элементов. */
    FindAndCreateNewItems(ds: ReadonlyArray<any>): TreeTableItemVM[]
    /** Maybe root can meet his parent now? 
        Убирает корневые элементы если появлись родители. */
    RemoveRootsIfParentAppeared(newItems: TreeTableItemVM[]): void;
    /** Hashing child/parents relations. If item is orphan - move it to roots. 
        Проставляет родителей и если их нет - помещает в корень. */
    SetupNewItemsParentOrAddAsRoot(newItems: TreeTableItemVM[]): void;
};
export class FindAndCreateNewItemsLogic
{
    private readonly TreeTableItemRepo: ITreeTableItemRepo;
    private readonly TreeTableRootItemsRepo: ITreeTableRootItemsRepo;
    public constructor(treeTableItemRepo: ITreeTableItemRepo, treeTableRootItemsRepo: ITreeTableRootItemsRepo)
    {
        this.TreeTableItemRepo = treeTableItemRepo;
        this.TreeTableRootItemsRepo = treeTableRootItemsRepo;
    }
    public ProcessItems(ds: ReadonlyArray<any>)
    {
        if (ds.length != new Set(ds.map(x => x[this.TreeTableItemRepo.IdProperyName])).size)
            throw new RangeError("Contain dublicate PK");
        const newItems = this.FindAndCreateNewItems(ds);
        this.RemoveRootsIfParentAppeared(newItems);
        this.SetupNewItemsParentOrAddAsRoot(newItems);
    }
    public FindAndCreateNewItems(ds: ReadonlyArray<any>): TreeTableItemVM[]
    {
        let newItems: TreeTableItemVM[] = [];
        ds.forEach(d =>
        {
            if (!this.TreeTableItemRepo.HasItemByData(d))
            {
                let tti = this.TreeTableItemRepo.AddItemAsData(d);
                newItems.push(tti);
            }
        });
        return newItems;
    }
    public RemoveRootsIfParentAppeared(newItems: TreeTableItemVM[])
    {
        this.TreeTableRootItemsRepo.RootItems.map(x => x)
            .forEach(rootItem =>
            {
                let parentId = rootItem.DataParentId;
                if (parentId == null)
                    return;
                let parentItem = newItems.find(x => x.Id == parentId);
                if (parentItem == null)
                    return;

                this.TreeTableItemRepo.SetParentChild(parentItem, rootItem);
                this.TreeTableRootItemsRepo.RemoveItem(rootItem);
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

            let parentItemOfNewItem = parentIdOfNewItem != null ? this.TreeTableItemRepo.GetItemById(parentIdOfNewItem) : null;
            if (parentItemOfNewItem == null && parentIdOfNewItem != null)
            {
                if (!newItemsSet.has(parentIdOfNewItem))
                    newItemsSet.set(parentIdOfNewItem, newItems.find(x => x.Id == parentIdOfNewItem) ?? null);
                parentItemOfNewItem = newItemsSet.get(parentIdOfNewItem) ?? null;
            }
            if (parentItemOfNewItem == null)
            {
                this.TreeTableRootItemsRepo.AddItem(newItem);
                return;
            }
            this.TreeTableItemRepo.SetParentChild(parentItemOfNewItem, newItem);
        });
    }

};
