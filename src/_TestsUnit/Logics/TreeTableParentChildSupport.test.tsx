import { Mock, It, Times } from "moq.ts";
import { TreeTableParentChildSupport } from "../../Logics/TreeTableParentChildSupport";
import { TreeTableItemVM } from "../../ViewModels/TreeTableItemVM";

export const Mock_TreeTableParentChildSupport = () => new Mock<TreeTableParentChildSupport>()
    //.setup(x => x.HasCycleCheckError(It.IsAny(), It.IsAny(), It.IsAny())).returns(false)
    .setup(x => x.InsertChild(It.IsAny(), It.IsAny(), It.IsAny(), It.IsAny(), It.IsAny(), It.IsAny())).callback(x => { return { index: 0, item: x.args[1] as TreeTableItemVM } })
    .setup(x => x.RemoveChild(It.IsAny(), It.IsAny(), It.IsAny(), It.IsAny())).callback(x => x.args[1]);

//impossible/useless to unit test directly
test("", () => { expect("").toBe(""); });
