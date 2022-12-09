import { TreeTableParentChildSupport } from "../Logics/TreeTableParentChildSupport";
import VM_Base from "./VM_Base";

export class TreeTableItemVM extends VM_Base
{
    public constructor(data: any, id: any, dataParentId: any)
    {
        super();
        this.Id = id;
        this.DataParentId = dataParentId;
        this._Data = data;
    }
    public readonly Id: any;
    public readonly DataParentId: any;
    /** Present Model Data of VM. */
    public get Data(): any { return this._Data; } private _Data: any;
    public get IsExpanded(): boolean { return this._IsExpanded; }
    /** Side effect: RenderCallback(). */
    public set IsExpanded(value: boolean)
    {
        if (this._IsExpanded == value)
            return;
        this._IsExpanded = value;
        this.RenderCallback();
    }
    private _IsExpanded: boolean = false;
    /** Indicate tree deep level. */
    public get Indent(): number { return this._Indent; } private set Indent(value: number) { this._Indent = value; } private _Indent: number = 0;

    private _Parent: TreeTableItemVM | null = null;
    public get Parent(): TreeTableItemVM | null { return this._Parent; }
    private _SetParentDirectly(value: TreeTableItemVM | null)
    {
        this._Parent = value;
        this.Indent = this._Parent == null ? 0 : this._Parent.Indent + 1;
    }
    /** Side effect: RenderCallback(). */
    public SetParent(value: TreeTableItemVM | null)
    {
        if (this._Parent == value)
            return;
        if (value == null)
            this._Parent?.RemoveChild(this);
        else
            value.InsertChild(this);
    }
    private _Children: TreeTableItemVM[] = [];
    public get Children(): ReadonlyArray<TreeTableItemVM> { return this._Children; }
    public get HasChildren(): boolean | undefined { return this._Children != undefined && this._Children?.length > 0; }
    public GetChildIndex(input: TreeTableItemVM): number | null
    {
        const ret = this._Children.indexOf(input);
        if (ret == -1)
            return null;
        return ret;
    }
    /** Side effect: RenderCallback(). */
    public InsertChild(insertingItem: TreeTableItemVM, indexToInsert: number | null = null): { index: number; item: TreeTableItemVM; }
    {
        return TreeTableParentChildSupport.FactoryGet().InsertChild(this, insertingItem, indexToInsert, this._Children, insertingItem._Children, (value: TreeTableItemVM | null) => insertingItem._SetParentDirectly(value));
    }
    /** Side effect: RenderCallback(). */
    public RemoveChild(input: TreeTableItemVM): TreeTableItemVM | null
    {
        return TreeTableParentChildSupport.FactoryGet().RemoveChild(this, input, this._Children, (value: TreeTableItemVM | null) => input._SetParentDirectly(value));
    }
};