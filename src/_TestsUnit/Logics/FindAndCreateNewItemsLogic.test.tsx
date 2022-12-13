import { FindAndCreateNewItemsLogic } from "../../Logics/FindAndCreateNewItemsLogic";
import { TreeTableItemVM } from "../../ViewModels/TreeTableItemVM";
import { IMock, It, Mock, Times } from "moq.ts";
import { TreeTableParentChildSupport } from "../../Logics/TreeTableParentChildSupport";
import { Mock_TreeTableParentChildSupport } from "./TreeTableParentChildSupport.test";
import { ITreeTableStorageLogic } from "../../Logics/TreeTableStorageLogic";

describe("FindAndCreateNewItemsLogic", () =>
{
    let ds: { Id: number, ParentId: number }[];
    let storageLogic: IMock<ITreeTableStorageLogic>;
    let logic: FindAndCreateNewItemsLogic;
    beforeEach(() =>
    {
        ds = [];
        storageLogic = new Mock<ITreeTableStorageLogic>();

        logic = new FindAndCreateNewItemsLogic(storageLogic.object());
        TreeTableParentChildSupport.FactoryMethod = () => Mock_TreeTableParentChildSupport().object();
        storageLogic.setup(x => x.SetParentChild(It.IsAny(), It.IsAny())).returns();
        storageLogic.setup(x => x.AddItemAsData(It.IsAny())).returns(new TreeTableItemVM({}, 1, -1));
        storageLogic.setup(x => x.AddRootItem(It.IsAny())).returns(true);
    }),
        afterEach(() =>
        {
            TreeTableParentChildSupport.ResetFactory();
        }),
        //FindAndCreateNewItems
        test("FindAndCreateNewItems_NoChanges", () =>
        {
            //Arrange
            ds = [];
            storageLogic.setup(x => x.HasItemByData(It.IsAny())).returns(false);
            //Action
            let newItems = logic.FindAndCreateNewItems(ds);
            //Assert
            expect(newItems.length).toBe(0);
        }),
        test("FindAndCreateNewItems_ReturnNew", () =>
        {
            //Arrange
            let el0_m1 = { Id: 0, ParentId: -1 };
            ds.push(el0_m1);
            storageLogic.setup(x => x.HasItemByData(It.IsAny())).returns(false);
            storageLogic.setup(x => x.AddItemAsData(It.IsAny())).returns(new TreeTableItemVM(el0_m1, 0, -1));
            //Action
            let newItems = logic.FindAndCreateNewItems(ds);
            //Assert
            expect(newItems.length).toBe(1);
            expect(newItems[0].Data).toBe(el0_m1);
        }),
        test("FindAndCreateNewItems_NothingBecouseAlreadyExists", () =>
        {
            //Arrange
            let el0_m1 = { Id: 0, ParentId: -1 };
            storageLogic.setup(x => x.HasItemByData(It.IsAny())).returns(false);
            storageLogic.setup(x => x.HasItemByData(el0_m1)).returns(true);
            ds.push(el0_m1);
            //Action
            let newItems = logic.FindAndCreateNewItems(ds);
            //Assert
            expect(newItems.length).toBe(0);
        }),
        //RemoveRootsIfParentAppeared
        test("RemoveRootsIfParentAppeared_Nothing", () =>
        {
            //Arrange
            let ti0_m1 = new TreeTableItemVM({}, 0, -1);
            let ti1_0 = new TreeTableItemVM({}, 1, 0);
            storageLogic.setup(x => x.RootItems).returns([ti0_m1]);
            let removeItemFn = jest.fn();
            storageLogic.setup(x => x.RemoveRootItem).returns(removeItemFn);
            //Action
            logic.RemoveRootsIfParentAppeared([ti1_0]);
            //Assert
            expect(removeItemFn.length).toBe(0);
        }),
        test("RemoveRootsIfParentAppeared_CallRemove", () =>
        {
            //Arrange
            let ti0_m1 = new TreeTableItemVM({}, 0, -1);
            let ti1_0 = new TreeTableItemVM({}, 1, 0);
            storageLogic.setup(x => x.RootItems).returns([ti1_0]);
            storageLogic.setup(x => x.RemoveRootItem(It.IsAny())).returns(true);
            //Action
            logic.RemoveRootsIfParentAppeared([ti0_m1]);
            //Assert
            storageLogic.verify(x => x.RemoveRootItem(ti1_0), Times.Once());
        }),
        //SetupNewItemsParentOrAddAsRoot
        test("SetupNewItemsParentOrAddAsRoot_NothingEmpty", () =>
        {
            //Arrange
            //Action
            logic.SetupNewItemsParentOrAddAsRoot([]);
            //Assert
            storageLogic.verify(x => x.AddRootItem(It.IsAny()), Times.Never());
            storageLogic.verify(x => x.SetParentChild(It.IsAny(), It.IsAny()), Times.Never());
        }),
        test("SetupNewItemsParentOrAddAsRoot_AddToRoots", () =>
        {
            //Arrange
            let ti0_m1 = new TreeTableItemVM({}, 0, -1);
            let ti1_2 = new TreeTableItemVM({}, 1, 2);
            storageLogic.setup(x => x.RootItems).returns([ti0_m1]);
            storageLogic.setup(x => x.GetItemById(ti0_m1.Id)).returns(ti0_m1);
            //Action
            logic.SetupNewItemsParentOrAddAsRoot([ti1_2]);
            //Assert
            storageLogic.verify(x => x.AddRootItem(It.IsAny()), Times.Once());
            storageLogic.verify(x => x.SetParentChild(It.IsAny(), It.IsAny()), Times.Never());
        }),
        test("SetupNewItemsParentOrAddAsRoot_AddAsParent", () =>
        {
            //Arrange
            let ti0_m1 = new TreeTableItemVM({}, 0, -1);
            let ti1_0 = new TreeTableItemVM({}, 1, 0);
            storageLogic.setup(x => x.RootItems).returns([]);
            storageLogic.setup(x => x.GetItemById(ti0_m1.Id)).returns(ti0_m1);
            //Action
            logic.SetupNewItemsParentOrAddAsRoot([ti1_0]);
            //Assert
            storageLogic.verify(x => x.AddRootItem(It.IsAny()), Times.Never());
            storageLogic.verify(x => x.SetParentChild(It.IsAny(), It.IsAny()), Times.Once());
        }),
        test("SetupNewItemsParentOrAddAsRoot_SetParentInAlready", () =>
        {
            //Arrange
            let ti0_m1 = new TreeTableItemVM({}, 0, -1);
            let ti1_0 = new TreeTableItemVM({}, 1, 0);
            storageLogic.setup(x => x.RootItems).returns([ti0_m1]);
            storageLogic.setup(x => x.GetItemById(ti0_m1.Id)).returns(ti0_m1);
            //Action
            logic.SetupNewItemsParentOrAddAsRoot([ti1_0]);
            //Assert
            storageLogic.verify(x => x.SetParentChild(ti0_m1, ti1_0));
        }),
        test("SetupNewItemsParentOrAddAsRoot_ParentItself", () =>
        {
            //Arrange
            let ti0_0 = new TreeTableItemVM({}, 0, 0);
            storageLogic.setup(x => x.RootItems).returns([]);
            //Action
            let d = () => logic.SetupNewItemsParentOrAddAsRoot([ti0_0]);
            //Assert
            expect(d).toThrow();
        })
});

