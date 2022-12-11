import { It, Mock } from "moq.ts";
import { TreeTableStorageLogic } from "../../Logics/TreeTableStorageLogic";
import { ITreeTableItemRepo } from "../../Repositories/TreeTableItemRepo";
import { ITreeTableRootItemsRepo } from "../../Repositories/TreeTableRootItemsRepo";
import { TreeTableItemVM } from "../../ViewModels/TreeTableItemVM";

describe("TreeTableStorageLogic", () =>
{
    let treeTableItemRepo: Mock<ITreeTableItemRepo>;
    let treeTableRootItemsRepo: Mock<ITreeTableRootItemsRepo>;
    let logic: TreeTableStorageLogic;
    beforeEach(() =>
    {
        treeTableItemRepo = new Mock<ITreeTableItemRepo>();
        treeTableRootItemsRepo = new Mock<ITreeTableRootItemsRepo>();
        logic = new TreeTableStorageLogic(treeTableItemRepo.object(), treeTableRootItemsRepo.object());
    }),
        test("RootItems_CallRootInside", () =>
        {
            //Arrange
            treeTableRootItemsRepo.setup(x => x.RootItems).returns([]);
            //Action
            let _ = logic.RootItems;
            //Assert
            treeTableRootItemsRepo.verify(x => x.RootItems);
        }),
        test("RootItems_ReturnDirectlyInside", () =>
        {
            //Arrange
            let item0 = new TreeTableItemVM({}, 10, 15);
            treeTableRootItemsRepo.setup(x => x.RootItems).returns([item0]);
            //Action
            let ret = logic.RootItems;
            //Assert
            expect(ret.length).toBe(1);
            expect(ret[0].Id).toBe(10);
        }),
        test("SetPropertyNames_CallInside", () =>
        {
            //Arrange
            treeTableItemRepo.setup(x => x.SetPropertyNames(It.IsAny(), It.IsAny())).returns();
            //Action
            logic.SetPropertyNames("Id", "prnt");
            //Assert
            treeTableItemRepo.verify(x => x.SetPropertyNames);
        }),
        test("AddRootItem_MustCallBackIfSuccess", () =>
        {
            //Arrange
            let item = new TreeTableItemVM({}, 1, 2);
            let f = jest.fn();
            logic.RenderCallback = f;
            treeTableRootItemsRepo.setup(x => x.AddItem(It.IsAny())).returns(false);
            treeTableRootItemsRepo.setup(x => x.AddItem(item)).returns(true);
            //Action
            let _ = logic.AddRootItem(item);
            //Assert
            expect(f).toBeCalled();
        }),
        test("AddRootItem_MustNonCallBackIfFail", () =>
        {
            //Arrange
            let f = jest.fn();
            logic.RenderCallback = f;
            treeTableRootItemsRepo.setup(x => x.AddItem(It.IsAny())).returns(false);
            //Action
            let _ = logic.AddRootItem(new TreeTableItemVM({}, 100, 15));
            //Assert
            expect(f).toBeCalledTimes(0);
        }),
        test("ThrowIfContainDublicates_Success", () =>
        {
            //Arrange
            let ds = [{ Id: 0 }, { Id: 1 }, { Id: 0 },];
            treeTableItemRepo.setup(x => x.IdProperyName).returns("Id");
            //Action
            let f = () =>
            {
                logic.ThrowIfContainDublicates(ds);
            };
            //Assert
            expect(f).toThrow();
        }),
        test("ThrowIfContainDublicates_NoException", () =>
        {
            //Arrange
            let ds = [{ Id: 0 }, { Id: 1 }, { Id: 2 },];
            treeTableItemRepo.setup(x => x.IdProperyName).returns("Id");
            //Action			
            logic.ThrowIfContainDublicates(ds);
            //Assert
            expect("").toBe("");
        })


});