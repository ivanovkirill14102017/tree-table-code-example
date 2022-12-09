import { FindAndCreateNewItemsLogic } from "../../Logics/FindAndCreateNewItemsLogic";
import { TreeTableParentChildSupport } from "../../Logics/TreeTableParentChildSupport";
import { ITreeTableItemRepo, TreeTableItemRepo } from "../../Repositories/TreeTableItemRepo";
import { ITreeTableRootItemsRepo, TreeTableRootItemsRepo } from "../../Repositories/TreeTableRootItemsRepo";

describe("FindAndCreateNewItemsLogic", () =>
{
    let itemsRepo: ITreeTableItemRepo;
    let rootRepo: ITreeTableRootItemsRepo;
    let logic: FindAndCreateNewItemsLogic;
    beforeEach(() =>
    {
        itemsRepo = new TreeTableItemRepo();
        rootRepo = new TreeTableRootItemsRepo();
        logic = new FindAndCreateNewItemsLogic(itemsRepo, rootRepo);
    }),
        test("CorrectBasicScenario", () =>
        {
            //Arrange
            var data0 = { Id: 0, ParentId: -1 };
            var data1 = { Id: 1, ParentId: null };
            var data2 = { Id: 2, ParentId: -1 };
            var data3 = { Id: 3, ParentId: 2 };
            //Action
            logic.ProcessItems([data0, data1, data2, data3]);
            //Assert
            expect(rootRepo.RootItems.map(x => x.Id).sort()).toStrictEqual([0, 1, 2]);
            expect(itemsRepo.GetItemById(3)?.Parent?.Data.Id).toBe(2);
        }),
        test("CorrectBasicScenarioReverse", () =>
        {
            //Arrange
            var data0 = { Id: 0, ParentId: -1 };
            var data1 = { Id: 1, ParentId: null };
            var data2 = { Id: 2, ParentId: -1 };
            var data3 = { Id: 3, ParentId: 2 };
            //Action
            logic.ProcessItems([data3, data2, data1, data0]);
            //Assert
            expect(rootRepo.RootItems.map(x => x.Id).sort()).toStrictEqual([0, 1, 2]);
            expect(itemsRepo.GetItemById(3)?.Parent?.Data.Id).toBe(2);
        }),
        test("CorrectBasicScenarioTwoParts", () =>
        {
            //Arrange
            var data0 = { Id: 0, ParentId: -1 };
            var data1 = { Id: 1, ParentId: null };
            var data2 = { Id: 2, ParentId: -1 };
            var data3 = { Id: 3, ParentId: 2 };
            //Action
            logic.ProcessItems([data0, data1]);
            logic.ProcessItems([data2, data3]);
            //Assert
            expect(rootRepo.RootItems.map(x => x.Id).sort()).toStrictEqual([0, 1, 2]);
            expect(itemsRepo.GetItemById(3)?.Parent?.Data.Id).toBe(2);
        }),
        test("CycleErrorScenario", () =>
        {
            //Arrange
            var data0 = { Id: 0, ParentId: 3 };
            var data1 = { Id: 1, ParentId: 0 };
            var data2 = { Id: 2, ParentId: 1 };
            var data3 = { Id: 3, ParentId: 0 };
            //Action
            let f = () => logic.ProcessItems([data0, data1, data2, data3]);
            //Assert
            expect(f).toThrow();
        }),
        test("CycleErrorScenarioTwoParts", () =>
        {
            //Arrange
            var data0 = { Id: 0, ParentId: 3 };
            var data1 = { Id: 1, ParentId: 0 };
            var data2 = { Id: 2, ParentId: 1 };
            var data3 = { Id: 3, ParentId: 0 };
            //Action
            let f = () =>
            {
                logic.ProcessItems([data0, data1]);
                logic.ProcessItems([data2, data3]);
            };
            //Assert
            expect(f).toThrow();
        })
});