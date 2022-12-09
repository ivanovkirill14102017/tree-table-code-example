import { TreeTableOptions } from "../../ViewModels/TreeTableOptions";

describe("TreeTableOptions", () =>
{
    beforeEach(() =>
    {
    }),
        test("ZeroIndex_Indent_MustEnd_px", () =>
        {
            //Arrange
            let opt = new TreeTableOptions();
            //Action
            let ret = opt.GetIndentPaddingLeft_px(1, 0);
            //Assert
            expect(ret!.endsWith("px")).toBe(true);
        }),
        test("NonZeroIndex_IsNull", () =>
        {
            //Arrange
            let opt = new TreeTableOptions();
            //Action
            let ret = opt.GetIndentPaddingLeft_px(1, 1);
            //Assert
            expect(ret).toBeUndefined();
        })
});