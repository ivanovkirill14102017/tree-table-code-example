import { It, Mock, Times } from "moq.ts";
import { TreeTableParentChildSupport } from "../../Logics/TreeTableParentChildSupport";
import { TreeTableItemVM } from "../../ViewModels/TreeTableItemVM";

export function GetTreeTableItemVMMock(data: any)
{
    let ret = new Mock<TreeTableItemVM>();
    ret.setup(x => x.Children).returns([]);
    ret.setup(x => x.Data).returns({});
    ret.setup(x => x.Parent).returns(null);
    ret.setup(x => x.InsertChild).returns(jest.fn());
    ret.setup(x => x.RemoveChild).returns(jest.fn());
    return ret;
};
describe("TreeTableItemVM", () =>
{
    beforeEach(() =>
    {
        TreeTableParentChildSupport.ResetFactory();
    }),
        test("SetParent_NothingBothNull", () =>
        {
            //Arrange
            let m = GetTreeTableItemVMMock({});
            m.setup(x => x.SetParent).mimics(new TreeTableItemVM({}, 0, 0));
            m.setup(x => x.Parent).returns(null);
            //Action
            m.object().SetParent(null);
            //Assert
            m.verify(x => x.InsertChild, Times.Never());
        }),
        test("SetParent_NothingEqual", () =>
        {
            //Arrange
            let someItem = new TreeTableItemVM({}, 0, 0);
            let m = GetTreeTableItemVMMock({});
            m.setup(x => x.SetParent).mimics(new TreeTableItemVM({}, 0, 0));
            m.setup(x => x.Parent).returns(someItem);
            //Action
            m.object().SetParent(someItem);
            //Assert
            m.verify(x => x.InsertChild, Times.Never());
        }),
        test("SetParent_SetNew", () =>
        {
            //Arrange
            let someItem1 = new TreeTableItemVM({}, 0, 0);
            let someItem2 = new TreeTableItemVM({}, 1, 1);
            //Action
            someItem1.SetParent(someItem2);
            //Assert
            expect(someItem1.Parent).toEqual(someItem2);
        }),
        test("GetChildIndex_correctFrom0", () =>
        {
            //Arrange
            let someItem1 = new TreeTableItemVM({}, 0, 0);
            let someItem2 = new TreeTableItemVM({}, 1, 1);
            someItem1.SetParent(someItem2);
            //Action
            let index = someItem2.GetChildIndex(someItem1);
            //Assert
            expect(index).toEqual(0);
        }),
        test("GetChildIndex_DoesntExistIsNull", () =>
        {
            //Arrange
            let someItem1 = new TreeTableItemVM({}, 0, 0);
            let someItem2 = new TreeTableItemVM({}, 1, 1);
            //Action
            let index = someItem2.GetChildIndex(someItem1);
            //Assert
            expect(index).toBeNull();
        }),
        test("SetParent_CycleErrorOneStep", () =>
        {
            //Arrange
            let someItem1 = new TreeTableItemVM({}, 0, 1);
            let someItem2 = new TreeTableItemVM({}, 1, 0);
            //Action
            let f = () =>
            {
                someItem2.SetParent(someItem1);
                someItem1.SetParent(someItem2);
            }
            //Assert
            expect(f).toThrow();
        }),
        test("SetParent_CycleErrorSeveralSteps", () =>
        {
            //Arrange
            let someItem1 = new TreeTableItemVM({}, 1, 4);
            let someItem2 = new TreeTableItemVM({}, 2, 1);
            let someItem3 = new TreeTableItemVM({}, 3, 2);
            let someItem4 = new TreeTableItemVM({}, 4, 3);
            //Action
            let f = () =>
            {
                someItem2.SetParent(someItem1);
                someItem3.SetParent(someItem2);
                someItem4.SetParent(someItem3);
                someItem1.SetParent(someItem4);
            }
            //Assert
            expect(f).toThrow();
        }),
        test("SetParent_CycleSelf", () =>
        {
            //Arrange
            let someItem1 = new TreeTableItemVM({}, 0, 1);
            //Action
            let f = () => someItem1.SetParent(someItem1);
            //Assert
            expect(f).toThrow();
        })
});