import { TreeTableVM } from "../../ViewModels/TreeTableVM";

describe("TreeTableVM", () =>
{
    beforeEach(() =>
    {
    }),
        test("BasicScenario", () =>
        {
            //Arrange
            let array: { Id: number, ParentId: number }[] = [];
            let treeTableVM = new TreeTableVM();
            treeTableVM.SetDataSource(array, "Id", "ParentId");
            let fnCallback = jest.fn();
            treeTableVM.RenderCallback = () => fnCallback();
            //Action -1
            for (let i = 1; i <= 100; i++)
                array.push({ Id: i, ParentId: i - 1 });
            treeTableVM.NotifyDataSourceWasChanged();
            //Assert -1
            expect(treeTableVM.RootItems.length).toBe(1);
            expect(fnCallback).toBeCalled();
            //Action -2
            fnCallback.mockReset();
            let someItemInside = treeTableVM.RootItems[0].Children[0].Children[0].Children[0].Children[0];
            let fnCallbackInside = jest.fn();
            someItemInside.RenderCallback = () => fnCallbackInside();
            for (let i = 1; i < 100; i++)
                array.push({ Id: 20000 + i, ParentId: someItemInside.Id });
            treeTableVM.NotifyDataSourceWasChanged();
            //Assert -2
            expect(treeTableVM.RootItems[0].Children[0].Children[0].Children[0].Children[0].Children.length).toBe(100);
            expect(fnCallback).toBeCalledTimes(0);
            expect(fnCallbackInside).toBeCalled();
        }),
        test("CrashScenario", () =>
        {
            //Arrange
            let array: { Id: number, ParentId: number }[] = [];
            let treeTableVM = new TreeTableVM();
            treeTableVM.SetDataSource(array, "Id", "ParentId");
            //Action -1
            for (let i = 1; i <= 10; i++)
                array.push({ Id: i, ParentId: i - 1 });
            treeTableVM.NotifyDataSourceWasChanged();
            //Assert -1
            expect(treeTableVM.RootItems.length).toBe(1);
            //Action -2            
            array.push({ Id: 0, ParentId: 5 });
            treeTableVM.NotifyDataSourceWasChanged();
            //Assert -2
            expect(treeTableVM.RuinedErrorText?.length).toBeGreaterThan(0);
        })
});