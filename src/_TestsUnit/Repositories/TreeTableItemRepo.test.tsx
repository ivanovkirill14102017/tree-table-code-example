import { Mock, It, Times } from "moq.ts";
import { ITreeTableItemRepo, TreeTableItemRepo } from "../../Repositories/TreeTableItemRepo";
import { TreeTableItemVM } from "../../ViewModels/TreeTableItemVM";

export const Mock_ITreeTableItemRepo = () => new Mock<ITreeTableItemRepo>()
    .setup(x => x.GetItemById(It.IsAny())).returns(null)
    .setup(x => x.HasItemByData(It.IsAny())).returns(false)
    .setup(x => x.SetParentChild(It.IsAny(), It.IsAny())).returns()
    .setup(x => x.AddItemAsData(It.IsAny())).callback(x => new TreeTableItemVM(x.args[0], "", ""));

describe("TreeTableItemRepo", () =>
{
    beforeEach(() =>
    {
    }),
        test("StartFromEmpty", () =>
        {
            //Arrange
            let repo = new TreeTableItemRepo();
            //Action
            //Assert
            expect(repo.AllItems.length).toBe(0);
        }),
        test("Start_Id_ParentId", () =>
        {
            //Arrange
            let repo = new TreeTableItemRepo();
            let data = { Id: 99, ParentId: 555 };
            //Action
            let item = repo.AddItemAsData(data);
            //Assert
            expect(item.Id).toBe(99);
            expect(item.DataParentId).toBe(555);
        }),
        test("Custom_Id_ParentId", () =>
        {
            //Arrange
            let repo = new TreeTableItemRepo();
            let data = { key: 99, prnkEyId: 555 };
            //Action
            repo.SetPropertyNames("key", "prnkEyId");
            let item = repo.AddItemAsData(data);
            //Assert
            expect(item.Id).toBe(99);
            expect(item.DataParentId).toBe(555);
        }),
        test("TryPutDirect_TreeTableItemVM_throw", () =>
        {
            //Arrange
            let repo = new TreeTableItemRepo();
            let someItem1 = new TreeTableItemVM({}, 0, 1);
            //Action
            let f = () => repo.AddItemAsData(someItem1);
            //Assert
            expect(f).toThrow();
        }),
        test("GetItemById_Null", () =>
        {
            //Arrange
            let repo = new TreeTableItemRepo();
            let data1 = { Id: 1, ParentId: 0 };
            let data2 = { Id: 2, ParentId: 1 };
            repo.AddItemAsData(data1);
            repo.AddItemAsData(data2);
            //Action
            let ret = repo.GetItemById(0);
            //Assert
            expect(ret).toBeNull();
        }),
        test("GetItemById_NotNull", () =>
        {
            //Arrange
            let repo = new TreeTableItemRepo();
            let data1 = { Id: 10, ParentId: 0 };
            let data2 = { Id: 20, ParentId: 1 };
          let item1=  repo.AddItemAsData(data1);
            let item2 =    repo.AddItemAsData(data2);
            //Action
            let ret = repo.GetItemById(10);
            //Assert
            expect(ret).toBe(item1);
        }),
        test("HasItemByData_False", () =>
        {
            //Arrange
            let repo = new TreeTableItemRepo();
            let data1 = { Id: 10, ParentId: 0 };
            let data2 = { Id: 20, ParentId: 1 };
            let item1 = repo.AddItemAsData(data1);
            let item2 = repo.AddItemAsData(data2);
            //Action
            let ret = repo.HasItemByData({...data1, Id:1});
            //Assert
            expect(ret).toBe(false);
        }),
        test("HasItemByData_True", () =>
        {
            //Arrange
            let repo = new TreeTableItemRepo();
            let data1 = { Id: 10, ParentId: 0 };
            let data2 = { Id: 20, ParentId: 1 };
            let item1 = repo.AddItemAsData(data1);
            let item2 = repo.AddItemAsData(data2);
            //Action
            let ret = repo.HasItemByData(data1);
            //Assert
            expect(ret).toBe(true);
        })

});