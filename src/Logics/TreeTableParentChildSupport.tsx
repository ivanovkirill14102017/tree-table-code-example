import { TreeTableItemVM } from "../ViewModels/TreeTableItemVM";

//namespace/tests/diagram/rus

/** Support class for remove logic from TreeItemVM.
 *  Work by Functional Programming(FP) idioma becouse TreeTableVM trustedly open needed closes.
 *  Класс поддержки, чтобы убрать логику из TreeItemVM.
 *  Работает по принципу ФП, так как работает с закрытыми данными, предосталвяемыми TreeTableVM. */
export class TreeTableParentChildSupport
{
    public static FactoryGet() { return this._FactoryMethod(); }
    public static ResetFactory() { this.FactoryMethod = () => new TreeTableParentChildSupport(); }
    private static _FactoryMethod: () => TreeTableParentChildSupport = () => { return new TreeTableParentChildSupport(); };
    public static set FactoryMethod(value: () => TreeTableParentChildSupport) { this._FactoryMethod = value; }

    private constructor()
    {
    }

    private HasCycleCheckError(itemToCheck: TreeTableItemVM, possibleParent: TreeTableItemVM, step: number = 0): boolean
    {
        if (possibleParent == null)
            return false;
        if (itemToCheck == possibleParent || step > 1024)
            return true;
        if (possibleParent.Parent == null)
            return false;
        return this.HasCycleCheckError(itemToCheck, possibleParent.Parent, step++);
    }

    public InsertChild(
        item: TreeTableItemVM,
        insertingItem: TreeTableItemVM,
        indexToInsert: number | null,
        itemChildren: TreeTableItemVM[],
        insertingItemParentChildren: TreeTableItemVM[] | null,
        insertingItemSetParentDelegate: (newParent: TreeTableItemVM | null) => void
    ): { index: number; item: TreeTableItemVM; }
    {
        const alreadyInsideIndex = item.GetChildIndex(insertingItem);
        if (alreadyInsideIndex != null)
            return { index: alreadyInsideIndex, item: insertingItem };

        if (this.HasCycleCheckError(insertingItem, item))
            throw new RangeError(`cycle error when set (4 steps showed)${item.Id}/${(item?.Parent?.Id ?? "null")}/${(item?.Parent?.Parent?.Id ?? "null")}/${(item?.Parent?.Parent?.Parent?.Id ?? "null")} as parent of ${insertingItem.Id} or reached max includes`);

        if (insertingItem.Parent != null)
            this.RemoveChild(insertingItem.Parent, insertingItem, insertingItemParentChildren!, insertingItemSetParentDelegate);
        let index: number;
        if (indexToInsert != null)
        {
            index = indexToInsert;
            itemChildren.splice(indexToInsert, 0, insertingItem);
        }
        else
            index = itemChildren.push(insertingItem);
        insertingItemSetParentDelegate(item);
        item.RenderCallback();
        return { index, item: insertingItem };
    }

    public RemoveChild(item: TreeTableItemVM, removingItem: TreeTableItemVM, itemChildren: TreeTableItemVM[], removingItemSetParentDelegate: (newParent: TreeTableItemVM | null) => void): TreeTableItemVM | null
    {
        const index = item.GetChildIndex(removingItem);
        if (index == null)
            return null;
        removingItemSetParentDelegate(null);
        itemChildren.splice(index, 1);
        item.RenderCallback();
        return item;
    }


}