import { FindAndCreateNewItemsLogic, IFindAndCreateNewItemsLogic } from "../../Logics/FindAndCreateNewItemsLogic";
import { ITreeTableItemRepo } from "../../Repositories/TreeTableItemRepo";
import { ITreeTableRootItemsRepo } from "../../Repositories/TreeTableRootItemsRepo";
import { TreeTableItemVM } from "../../ViewModels/TreeTableItemVM";
import { IMock, It, Mock, Times } from "moq.ts";
import { TreeTableParentChildSupport } from "../../Logics/TreeTableParentChildSupport";
import { Mock_TreeTableParentChildSupport } from "./TreeTableParentChildSupport.test";
import { Mock_ITreeTableItemRepo } from "../Repositories/TreeTableItemRepo.test";
import { Mock_ITreeTableRootItemsRepo } from "../Repositories/TreeTableRootItemsRepo.test";

export const Mock_IFindAndCreateNewItemsLogic = () => new Mock<IFindAndCreateNewItemsLogic>()
    .setup(x => x.FindAndCreateNewItems(It.IsAny())).returns([])
    .setup(x => x.ProcessItems(It.IsAny())).returns()
    .setup(x => x.RemoveRootsIfParentAppeared(It.IsAny())).returns()
    .setup(x => x.SetupNewItemsParentOrAddAsRoot(It.IsAny())).returns();

describe("FindAndCreateNewItemsLogic", () =>
{
    let ds: { Id: number, ParentId: number }[];
    let itemsRepo: IMock<ITreeTableItemRepo>;
    let itemsRootRepo: IMock<ITreeTableRootItemsRepo>;
    let logic: FindAndCreateNewItemsLogic;
    beforeEach(() =>
    {
        ds = [];
        itemsRepo = Mock_ITreeTableItemRepo();
        itemsRootRepo = Mock_ITreeTableRootItemsRepo();

        logic = new FindAndCreateNewItemsLogic(itemsRepo.object(), itemsRootRepo.object());
        TreeTableParentChildSupport.FactoryMethod = () => Mock_TreeTableParentChildSupport().object();
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
            itemsRepo.setup(x => x.HasItemByData(el0_m1)).returns(true);
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
            itemsRootRepo.setup(x => x.RootItems).returns([ti0_m1]);
            let removeItemFn = jest.fn();
            itemsRootRepo.setup(x => x.RemoveItem).returns(removeItemFn);
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
            itemsRootRepo.setup(x => x.RootItems).returns([ti1_0]);
            itemsRootRepo.setup(x => x.RemoveItem(It.IsAny())).returns(true);
            //Action
            logic.RemoveRootsIfParentAppeared([ti0_m1]);
            //Assert
            itemsRootRepo.verify(x => x.RemoveItem(ti1_0), Times.Once());
        }),
        //SetupNewItemsParentOrAddAsRoot
        test("SetupNewItemsParentOrAddAsRoot_NothingEmpty", () =>
        {
            //Arrange
            //Action
            logic.SetupNewItemsParentOrAddAsRoot([]);
            //Assert
            itemsRootRepo.verify(x => x.AddItem(It.IsAny()), Times.Never());
            itemsRepo.verify(x => x.SetParentChild(It.IsAny(), It.IsAny()), Times.Never());
        }),
        test("SetupNewItemsParentOrAddAsRoot_AddToRoots", () =>
        {
            //Arrange
            let ti0_m1 = new TreeTableItemVM({}, 0, -1);
            let ti1_2 = new TreeTableItemVM({}, 1, 2);
            itemsRootRepo.setup(x => x.RootItems).returns([ti0_m1]);
            itemsRepo.setup(x => x.GetItemById(ti0_m1.Id)).returns(ti0_m1);
            //Action
            logic.SetupNewItemsParentOrAddAsRoot([ti1_2]);
            //Assert
            itemsRootRepo.verify(x => x.AddItem(It.IsAny()), Times.Once());
            itemsRepo.verify(x => x.SetParentChild(It.IsAny(), It.IsAny()), Times.Never());
        }),
        test("SetupNewItemsParentOrAddAsRoot_AddAsParent", () =>
        {
            //Arrange
            let ti0_m1 = new TreeTableItemVM({}, 0, -1);
            let ti1_0 = new TreeTableItemVM({}, 1, 0);
            itemsRootRepo.setup(x => x.RootItems).returns([]);
            itemsRepo.setup(x => x.GetItemById(ti0_m1.Id)).returns(ti0_m1);
            //Action
            logic.SetupNewItemsParentOrAddAsRoot([ti1_0]);
            //Assert
            itemsRootRepo.verify(x => x.AddItem(It.IsAny()), Times.Never());
            itemsRepo.verify(x => x.SetParentChild(It.IsAny(), It.IsAny()), Times.Once());
        }),
        test("SetupNewItemsParentOrAddAsRoot_SetParentInAlready", () =>
        {
            //Arrange
            let ti0_m1 = new TreeTableItemVM({}, 0, -1);
            let ti1_0 = new TreeTableItemVM({}, 1, 0);
            itemsRootRepo.setup(x => x.RootItems).returns([ti0_m1]);
            itemsRepo.setup(x => x.GetItemById(ti0_m1.Id)).returns(ti0_m1);
            //Action
            logic.SetupNewItemsParentOrAddAsRoot([ti1_0]);
            //Assert
            itemsRepo.verify(x => x.SetParentChild(ti0_m1, ti1_0));
        }),
        test("SetupNewItemsParentOrAddAsRoot_ParentItself", () =>
        {
            //Arrange
            let ti0_0 = new TreeTableItemVM({}, 0, 0);
            itemsRootRepo.setup(x => x.RootItems).returns([]);
            //Action
            let d = () => logic.SetupNewItemsParentOrAddAsRoot([ti0_0]);
            //Assert
            expect(d).toThrow();
        })
});

