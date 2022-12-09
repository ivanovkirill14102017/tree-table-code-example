import { Mock, It, Times } from "moq.ts";
import { ITreeTableRootItemsRepo, TreeTableRootItemsRepo } from "../../Repositories/TreeTableRootItemsRepo";
import { TreeTableItemVM } from "../../ViewModels/TreeTableItemVM";

export const Mock_ITreeTableRootItemsRepo = () => new Mock<ITreeTableRootItemsRepo>()
    .setup(x => x.AddItem(It.IsAny())).returns(true)
    .setup(x => x.RemoveItem(It.IsAny())).returns(true)
    .setup(x => x.RootItems).returns([]);

/** Sealed class for mock override closes */
class MockedTreeTableRootItemsRepo extends TreeTableRootItemsRepo
{
    constructor()
    {
        super();
    }
    public SetRootItems(value: TreeTableItemVM[])
    {
        this._SetRootItems(value);
    }
};
describe("TreeTableRootItemsRepo", () =>
{
    beforeEach(() =>
    {
    }),
        test("StartIsEmpty", () =>
        {
            //Arrange
            let repo = new TreeTableRootItemsRepo();
            //Action
            let ret = repo.RootItems;
            //Assert
            expect(ret.length).toBe(0);
        }),
        test("Add_Correct", () =>
        {
            //Arrange
            let repo = new TreeTableRootItemsRepo();
            let item1 = new TreeTableItemVM({}, 0, 1);
            //Action
            let ret = repo.AddItem(item1);
            //Assert
            expect(ret).toBe(true);
        }),
        test("Add_Fail_AlreadyExists", () =>
        {
            //Arrange
            let repo = new MockedTreeTableRootItemsRepo();
            let item1 = new TreeTableItemVM({}, 0, 1);
            repo.SetRootItems([item1]);
            //Action
            let ret = repo.AddItem(item1);
            //Assert
            expect(ret).toBe(false);
        }),
        test("Remove_Correct", () =>
        {
            //Arrange
            let repo = new MockedTreeTableRootItemsRepo();
            let item1 = new TreeTableItemVM({}, 0, 1);
            let item2 = new TreeTableItemVM({}, 1, 2);
            item1.SetParent(item2);
            repo.SetRootItems([item1]);
            //Action
            let ret = repo.RemoveItem(item1);;
            //Assert
            expect(ret).toBe(true);
        }),
        test("Remove_Fail_DoesntExists", () =>
        {
            //Arrange
            let repo = new MockedTreeTableRootItemsRepo();
            let item1 = new TreeTableItemVM({}, 0, 1);
            repo.SetRootItems([]);
            //Action
            let ret = repo.RemoveItem(item1);
            //Assert
            expect(ret).toBe(false);
        }),
        test("Remove_Fail_ParentIsNull", () =>
        {
            //Arrange
            let repo = new MockedTreeTableRootItemsRepo();
            let item1 = new TreeTableItemVM({}, 0, 1);
            repo.SetRootItems([item1]);
            //Action
            let ret = repo.RemoveItem(item1);
            //Assert
            expect(ret).toBe(false);
        }),
        test("Add_SuccessMustCallRenderCallback", () =>
        {
            //Arrange
            let repo = new TreeTableRootItemsRepo();
            let item1 = new TreeTableItemVM({}, 0, 1);
            let f = jest.fn();
            repo.RenderCallback = f;
            //Action
            repo.AddItem(item1);
            //Assert
            expect(f).toBeCalledTimes(1);
        }),
        test("Remove_SuccessMustCallRenderCallback", () =>
        {
            //Arrange
            let repo = new MockedTreeTableRootItemsRepo();
            let item1 = new TreeTableItemVM({}, 0, 1);
            let item2 = new TreeTableItemVM({}, 1, 2);
            item1.SetParent(item2);
            repo.SetRootItems([item1]);
            let f = jest.fn();
            repo.RenderCallback = f;
            //Action
            repo.RemoveItem(item1);
            //Assert
            expect(f).toBeCalledTimes(1);
        })
});