import { IFindAndCreateNewItemsLogic, FindAndCreateNewItemsLogic } from "../Logics/FindAndCreateNewItemsLogic";
import { ITreeTableStorageLogic, TreeTableStorageLogic } from "../Logics/TreeTableStorageLogic";
import { TreeTableItemRepo } from "../Repositories/TreeTableItemRepo";
import { TreeTableRootItemsRepo } from "../Repositories/TreeTableRootItemsRepo";
import { TreeTableItemVM } from "./TreeTableItemVM";
import { TreeTableOptions } from "./TreeTableOptions";
import VM_Base from "./VM_Base";

/** Present simple tree table worked by OOP idioma.
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
export class TreeTableVM extends VM_Base
{
    public constructor()
    {
        super();
        const treeTableItemRepo = new TreeTableItemRepo();
        const treeTableRootItemsRepo = new TreeTableRootItemsRepo();
        this._TreeTableStorageLogic = new TreeTableStorageLogic(treeTableItemRepo, treeTableRootItemsRepo);
        this._FindAndCreateNewItemsLogic = new FindAndCreateNewItemsLogic(this._TreeTableStorageLogic);
    }
    private _FindAndCreateNewItemsLogic: IFindAndCreateNewItemsLogic;
    private _TreeTableStorageLogic: ITreeTableStorageLogic;
    /** Contain other shared properties like indent size, indicate symbols and others.  */
    public readonly Options: TreeTableOptions = new TreeTableOptions();
    /** Indicate UI catched exception. */
    public get RuinedErrorText(): string | null { return this._RuinedErrorText; } private set RuinedErrorText(value: string | null) { this._RuinedErrorText = value; } private _RuinedErrorText: string | null = null;
    public get RootItems(): ReadonlyArray<TreeTableItemVM> { return this._TreeTableStorageLogic.RootItems; }
    /** Models array that present VM. */
    public get DataSource(): ReadonlyArray<any> { return this._DataSource; } private _DataSource: any[] = [];
    public SetDataSource(dataSource: any[], idPropertyName: string = "Id", parentIdPropertyName: string = "ParentId"): TreeTableVM
    {
        this._DataSource = dataSource;
        this._TreeTableStorageLogic.SetPropertyNames(idPropertyName, parentIdPropertyName);
        this.ProcessItems();
        return this;
    }
    /** Mark UI for chack news and rebuild necessary items. */
    public NotifyDataSourceWasChanged()
    {
        this.ProcessItems();
    }
    private ProcessItems()
    {
        this._TreeTableStorageLogic.RenderCallback = this.RenderCallback;
        try
        {
            this._FindAndCreateNewItemsLogic.ProcessItems(this.DataSource);
        }
        catch (exc)
        {
            this._RuinedErrorText = "UI has been ruined. " + (exc as Error).toString();
            this.RenderCallback();
        }
    }

};